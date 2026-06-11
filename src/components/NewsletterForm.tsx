import { useState } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { newsletterSchema } from "@/lib/validation";
import { callWebhook, getCaptchaToken, HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/webhook";

const NEWSLETTER_WEBHOOK = "https://yahesaf.app.n8n.cloud/webhook/QuantumAILabNewsletter";

interface NewsletterFormProps {
  className?: string;
  compact?: boolean;
}

type Status = "idle" | "submitting" | "success" | "error";

const NewsletterForm = ({ className = "", compact = false }: NewsletterFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const submitting = status === "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot: silently treat as success to discourage retries.
    if (isHoneypotTripped(honeypot)) {
      setStatus("success");
      setEmail("");
      return;
    }

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setStatus("submitting");
    const captchaToken = await getCaptchaToken();
    const result = await callWebhook({
      name: "newsletter.subscribe",
      url: NEWSLETTER_WEBHOOK,
      method: "GET",
      query: {
        email: parsed.data.email,
        action: "subscribe",
        source: "quantumailab.website",
        submittedAt: new Date().toISOString(),
        ...(captchaToken ? { captchaToken } : {}),
      },
    });

    if (result.ok) {
      toast({ title: "Subscribed!", description: "You're on the list. Thanks for joining us." });
      setEmail("");
      setStatus("success");
    } else {
      setStatus("error");
      toast({
        title: "Subscription failed",
        description: "We couldn't add you right now. Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate aria-label="Newsletter subscription">
      <div className={`flex ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"} gap-2`}>
        <div className="relative flex-1">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(null); if (status !== "idle") setStatus("idle"); }}
            maxLength={255}
            autoComplete="email"
            aria-invalid={!!error}
            aria-describedby={error ? "newsletter-error" : status === "success" ? "newsletter-success" : undefined}
            disabled={submitting}
            className={`w-full h-10 pl-9 pr-3 rounded-lg bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60 ${
              error ? "border-destructive" : "border-border"
            }`}
          />
        </div>

        {/* Honeypot — hidden from real users + screen readers. Bots fill it; humans don't. */}
        <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
          <label htmlFor={`nl-${HONEYPOT_FIELD}`}>Leave this field empty</label>
          <input
            id={`nl-${HONEYPOT_FIELD}`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <Button type="submit" variant="default" size="default" disabled={submitting} className="shrink-0">
          {submitting ? <><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Joining</> : "Subscribe"}
        </Button>
      </div>

      <div aria-live="polite" aria-atomic="true" className="min-h-[1.25rem]">
        {error && <p id="newsletter-error" className="text-destructive text-xs mt-2" role="alert">{error}</p>}
        {status === "success" && (
          <p id="newsletter-success" className="text-primary text-xs mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} aria-hidden="true" /> Subscribed — check your inbox for confirmation.
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">No spam. Unsubscribe anytime.</p>
    </form>
  );
};

export default NewsletterForm;
