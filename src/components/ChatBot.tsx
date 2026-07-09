import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";
import { chatMessageSchema } from "@/lib/validation";
import { callWebhook } from "@/lib/webhook";


/**
 * Floating AI chat assistant.
 *
 * The widget POSTs each user turn (with full message history) to an n8n
 * webhook and renders the assistant's reply. Because the site is deployed
 * to GitHub Pages (static hosting), all "backend" work happens inside the
 * configured n8n workflow — no server code is required from the app.
 *
 * Override the endpoint at build time via `VITE_CHAT_WEBHOOK_URL`.
 */
const CHAT_WEBHOOK =
  (import.meta.env.VITE_CHAT_WEBHOOK_URL as string | undefined) ??
  "https://daliwat7.app.n8n.cloud/webhook/chat-assistant";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; content: string };

const messageSchema = chatMessageSchema;


const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the QuantumAI Lab assistant. Ask me about our services, technology, pricing, or how quantum-AI can help your team.",
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const extractReply = (data: unknown): string | null => {
  if (typeof data === "string") return data.trim() || null;
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const candidates = [obj.reply, obj.message, obj.response, obj.text, obj.output, obj.answer];
  for (const c of candidates) if (typeof c === "string" && c.trim()) return c.trim();
  return null;
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const parsed = messageSchema.safeParse(input);
    if (!parsed.success) {
      toast({ title: "Invalid message", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    const userMessage: ChatMessage = { id: newId(), role: "user", content: parsed.data };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setSending(true);

    const payload = {
      message: userMessage.content,
      history: history.map((m) => ({ role: m.role, content: m.content })),
      source: "quantumailab.website",
      submittedAt: new Date().toISOString(),
    };

    const response = await callWebhook({
      name: "chat.message",
      url: CHAT_WEBHOOK,
      method: "POST",
      timeoutMs: 30_000,
      body: payload,
    });

    if (response.ok) {
      const reply =
        extractReply(response.data) ??
        "Thanks! I've passed that along — our team will follow up shortly. In the meantime, feel free to explore our Services page.";
      setMessages((prev) => [...prev, { id: newId(), role: "assistant", content: reply }]);
    } else {
      const timedOut = response.error === "Request timed out";
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content: timedOut
            ? "That took longer than expected. Please try again, or email support@quantumailab.in."
            : "I couldn't reach the assistant right now. Please try again in a moment, or email support@quantumailab.in.",
        },
      ]);
    }
    setSending(false);
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
              <p className="text-xs text-muted-foreground leading-tight">Typically replies in seconds</p>
            </div>
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
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
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

          <form
            onSubmit={handleSubmit}
            className="border-t border-border/40 bg-card/40 p-3 flex items-end gap-2"
          >
            <label htmlFor="chatbot-input" className="sr-only">
              Type your message
            </label>
            <textarea
              id="chatbot-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about quantum-AI…"
              rows={1}
              maxLength={1000}
              disabled={sending}
              className="flex-1 resize-none max-h-32 min-h-[2.5rem] rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
            />
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
