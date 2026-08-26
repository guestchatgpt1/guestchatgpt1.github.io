import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { feedbackSchema, type FeedbackInput } from "@/lib/validation";
import { callWebhook, getCaptchaToken, HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/webhook";
import { FEEDBACK_FALLBACK_FORM_URL, WEBHOOKS } from "@/lib/webhooks";

const FEEDBACK_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feedback`;

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: FeedbackInput = { name: "", phone: "", email: "", feedback: "" };

const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<FeedbackInput>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackInput, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const submitting = status === "submitting";

  // Reset the form shortly after the modal closes so re-opening is clean.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setForm(EMPTY);
      setErrors({});
      setStatus("idle");
      setLastError(null);
      setHoneypot("");
    }, 250);
    return () => clearTimeout(t);
  }, [open]);

  // Auto-close after a successful submission.
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => onOpenChange(false), 1800);
    return () => clearTimeout(t);
  }, [status, onOpenChange]);

  const update = (field: keyof FeedbackInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLastError(null);

    if (isHoneypotTripped(honeypot)) {
      setStatus("success");
      return;
    }

    const parsed = feedbackSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FeedbackInput, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FeedbackInput;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    const captchaToken = await getCaptchaToken();
    const payload = {
      ...parsed.data,
      source: "quantumailab.website",
      submittedAt: new Date().toISOString(),
      ...(captchaToken ? { captchaToken } : {}),
    };

    // Submit through our backend proxy: it validates the payload and performs
    // the required GET request server-side, avoiding browser CORS failures.
    const result = await callWebhook({
      name: "feedback.submit",
      url: FEEDBACK_API_URL,
      method: "POST",
      timeoutMs: 20_000,
      body: payload,
    });

    if (result.ok) {
      setStatus("success");
      toast({ title: "Feedback submitted", description: "Thank you — we really appreciate it!" });
    } else {
      setStatus("error");
      setLastError(result.error ?? "Network error");
      toast({
        title: "Could not send feedback",
        description: "Please try again, or use the backup feedback form.",
        variant: "destructive",
      });
    }
  };

  const inputClass = (field: keyof FeedbackInput) =>
    `w-full h-11 px-4 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all disabled:opacity-60 ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <MessageSquareHeart size={18} className="text-primary" aria-hidden="true" />
            Share your feedback
          </DialogTitle>
          <DialogDescription>
            Tell us what's working and what isn't — it takes less than a minute.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="text-center space-y-3 py-8" role="status" aria-live="polite">
            <CheckCircle2 size={44} className="text-primary mx-auto" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-foreground">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your feedback has been submitted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="fb-name" className="block text-sm font-medium text-foreground mb-1.5">
                Your full name
              </label>
              <input
                id="fb-name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Doe"
                maxLength={100}
                autoComplete="name"
                aria-invalid={!!errors.name}
                disabled={submitting}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-destructive text-xs mt-1" role="alert">{errors.name}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fb-phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Phone / mobile no.
                </label>
                <input
                  id="fb-phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  maxLength={20}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  disabled={submitting}
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="text-destructive text-xs mt-1" role="alert">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="fb-email" className="block text-sm font-medium text-foreground mb-1.5">
                  Your email
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  maxLength={255}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  disabled={submitting}
                  className={inputClass("email")}
                />
                {errors.email && <p className="text-destructive text-xs mt-1" role="alert">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="fb-message" className="block text-sm font-medium text-foreground mb-1.5">
                What's your feedback?
              </label>
              <textarea
                id="fb-message"
                value={form.feedback}
                onChange={(e) => update("feedback", e.target.value)}
                placeholder="Share your thoughts, ideas, or issues..."
                rows={4}
                maxLength={2000}
                aria-invalid={!!errors.feedback}
                disabled={submitting}
                className={`w-full px-4 py-3 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none transition-all disabled:opacity-60 ${
                  errors.feedback ? "border-destructive" : "border-border"
                }`}
              />
              {errors.feedback && <p className="text-destructive text-xs mt-1" role="alert">{errors.feedback}</p>}
            </div>

            {/* Honeypot — hidden from humans + screen readers */}
            <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
              <label htmlFor={`fb-${HONEYPOT_FIELD}`}>Leave this field empty</label>
              <input
                id={`fb-${HONEYPOT_FIELD}`}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div aria-live="polite" aria-atomic="true">
              {status === "error" && (
                <p className="text-sm text-destructive" role="alert">
                  We couldn't submit your feedback ({lastError}). Please try again, or{" "}
                  <a
                    href={FEEDBACK_FALLBACK_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    use our backup feedback form
                  </a>
                  .
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={submitting}>
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Submitting…</>
                ) : (
                  "Submit feedback"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
