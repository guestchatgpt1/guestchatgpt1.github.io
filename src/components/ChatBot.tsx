import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { MessageCircle, Send, X, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";
import { chatMessageSchema } from "@/lib/validation";
...
const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Backend AI endpoint (edge function streaming from Lovable AI). */
const CHAT_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

const getRecognitionCtor = (): (new () => SpeechRecognitionLike) | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => SpeechRecognitionLike) | null;
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechSupported = typeof window !== "undefined" && !!getRecognitionCtor();
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, sending]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Stop any in-flight speech when the panel closes or the widget unmounts.
  useEffect(() => {
    if (!open && ttsSupported) window.speechSynthesis.cancel();
  }, [open, ttsSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!ttsSupported) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      } catch {
        /* speech is best-effort */
      }
    },
    [ttsSupported],
  );

  const send = useCallback(
    async (raw: string, spoken: boolean) => {
      const parsed = chatMessageSchema.safeParse(raw);
      if (!parsed.success) {
        toast({ title: "Invalid message", description: parsed.error.issues[0].message, variant: "destructive" });
        return;
      }

      const userMessage: ChatMessage = { id: newId(), role: "user", content: parsed.data };
      let history: ChatMessage[] = [];
      setMessages((prev) => {
        history = [...prev, userMessage];
        return history;
      });
      setInput("");
      setSending(true);

      const assistantId = newId();
      let reply = "";
      const pushDelta = (text: string) => {
        reply += text;
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === assistantId);
          if (idx === -1) return [...prev, { id: assistantId, role: "assistant", content: reply }];
          const next = [...prev];
          next[idx] = { ...next[idx], content: reply };
          return next;
        });
      };

      try {
        const res = await fetch(CHAT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) {
          let message = "I couldn't reach the assistant right now. Please try again in a moment, or email info@quantumailab.in.";
          try {
            const data = await res.json();
            if (typeof data?.error === "string") message = data.error;
          } catch { /* non-JSON error body */ }
          setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: message }]);
        } else {
          // Stream the reply (SSE, chat-completions deltas) into the bubble.
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const delta = json?.choices?.[0]?.delta?.content;
                if (typeof delta === "string") pushDelta(delta);
              } catch { /* keep-alive / partial frame */ }
            }
          }
          if (!reply.trim()) {
            reply = "Sorry, I didn't get a response. Please try again.";
            pushDelta("");
          }
          if (voiceReplies || spoken) speak(reply);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "I couldn't reach the assistant right now. Please check your connection and try again, or email info@quantumailab.in.",
          },
        ]);
      }
      setSending(false);
    },
    [speak, voiceReplies],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    await send(input, false);
  };

  const toggleListening = () => {
    if (!speechSupported) {
      toast({
        title: "Voice input unavailable",
        description: "Your browser doesn't support speech recognition. Please type your message instead.",
        variant: "destructive",
      });
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) void send(transcript, true);
    };
    recognition.onerror = () => {
      setListening(false);
      toast({ title: "Couldn't hear you", description: "Please try again or type your message.", variant: "destructive" });
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="hero"
        size="icon"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        aria-controls="chatbot-panel"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl"
      >
        {open ? <X className="!size-6" /> : <MessageCircle className="!size-6" />}
      </Button>

      {open && (
        <div
          id="chatbot-panel"
          role="dialog"
          aria-label="QuantumAI Lab chat assistant"
          aria-modal="false"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[32rem] max-h-[calc(100vh-8rem)] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border/60"
        >
          <header className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-card/40">
            <img src={logo} alt="" aria-hidden="true" className="w-8 h-8 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-foreground leading-tight">QuantumAI Assistant</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {listening ? "Listening…" : sending ? "Thinking…" : "Typically replies in seconds"}
              </p>
            </div>
            {ttsSupported && (
              <button
                type="button"
                onClick={() => {
                  setVoiceReplies((v) => {
                    if (v) window.speechSynthesis.cancel();
                    return !v;
                  });
                }}
                aria-pressed={voiceReplies}
                aria-label={voiceReplies ? "Turn off spoken replies" : "Turn on spoken replies"}
                title={voiceReplies ? "Spoken replies on" : "Spoken replies off"}
                className={`p-1 rounded-md transition-colors hover:bg-muted ${
                  voiceReplies ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {voiceReplies ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            role="log"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start" aria-label="Assistant is typing">
                <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border/40 bg-card/40 p-3 flex items-end gap-2">
            <label htmlFor="chatbot-input" className="sr-only">
              Type your message
            </label>
            <textarea
              id="chatbot-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={listening ? "Listening…" : "Ask about quantum-AI…"}
              rows={1}
              maxLength={1000}
              disabled={sending}
              className="flex-1 resize-none max-h-32 min-h-[2.5rem] rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
            />
            {speechSupported && (
              <Button
                type="button"
                size="icon"
                variant={listening ? "default" : "outline"}
                onClick={toggleListening}
                disabled={sending}
                aria-pressed={listening}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                className={`shrink-0 ${listening ? "animate-pulse" : ""}`}
              >
                {listening ? <MicOff /> : <Mic />}
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              variant="hero"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="shrink-0"
            >
              {sending ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
