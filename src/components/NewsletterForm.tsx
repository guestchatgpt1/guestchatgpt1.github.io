import { useState } from "react";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const NEWSLETTER_WEBHOOK = "https://lenoyi.app.n8n.cloud/webhook/QuantumAILabNewsletter";
const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

interface NewsletterFormProps {
  className?: string;
  compact?: boolean;
}

const NewsletterForm = ({ className = "", compact = false }: NewsletterFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(NEWSLETTER_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data,
          action: "subscribe",
          source: "quantumailab.website",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      toast({ title: "Subscribed!", description: "You're on the list. Thanks for joining us." });
      setEmail("");
    } catch {
      toast({
        title: "Subscription failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
            onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
            maxLength={255}
            autoComplete="email"
            aria-invalid={!!error}
            aria-describedby={error ? "newsletter-error" : undefined}
            className={`w-full h-10 pl-9 pr-3 rounded-lg bg-muted border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
              error ? "border-destructive" : "border-border"
            }`}
          />
        </div>
        <Button type="submit" variant="default" size="default" disabled={submitting} className="shrink-0">
          {submitting ? <><Loader2 size={14} className="animate-spin" /> Joining</> : "Subscribe"}
        </Button>
      </div>
      {error && <p id="newsletter-error" className="text-destructive text-xs mt-2" role="alert">{error}</p>}
      <p className="text-xs text-muted-foreground mt-2">No spam. Unsubscribe anytime.</p>
    </form>
  );
};

export default NewsletterForm;
