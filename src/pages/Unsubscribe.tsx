import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageTitle } from "@/hooks/usePageTitle";

const NEWSLETTER_WEBHOOK = "https://lenoyi.app.n8n.cloud/webhook/QuantumAILabNewsletter";
const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

type Status = "idle" | "submitting" | "success" | "error";

const Unsubscribe = () => {
  usePageTitle("Unsubscribe");
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fromUrl = params.get("email") ?? "";
    if (fromUrl) setEmail(fromUrl);
  }, [params]);

  const handleConfirm = async () => {
    setEmailError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0].message);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(NEWSLETTER_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data,
          action: "unsubscribe",
          source: "quantumailab.website",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max max-w-2xl">
          <AnimatedSection>
            <SectionHeading
              label="Newsletter"
              title="Unsubscribe"
              description="We're sorry to see you go. Confirm your email below to stop receiving QuantumAI Lab newsletters."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="glass rounded-xl p-8">
              {status === "success" ? (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 size={48} className="text-primary mx-auto" aria-hidden="true" />
                  <h2 className="font-display text-xl font-semibold text-foreground">You've been unsubscribed</h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">{email}</span> will no longer receive newsletter emails from us.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Changed your mind? You can re-subscribe anytime from our footer.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/">Back to Home</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                    <Mail size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-sm text-muted-foreground">
                      You're about to unsubscribe from QuantumAI Lab newsletters. You can re-subscribe at any time.
                    </div>
                  </div>

                  <div>
                    <label htmlFor="unsub-email" className="block text-sm font-medium text-foreground mb-2">
                      Email address
                    </label>
                    <input
                      id="unsub-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                      placeholder="you@company.com"
                      maxLength={255}
                      autoComplete="email"
                      aria-invalid={!!emailError}
                      className={`w-full h-12 px-4 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all ${
                        emailError ? "border-destructive" : "border-border"
                      }`}
                      disabled={status === "submitting"}
                    />
                    {emailError && <p className="text-destructive text-xs mt-1" role="alert">{emailError}</p>}
                  </div>

                  {status === "error" && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30" role="alert">
                      <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="text-sm text-destructive">
                        Could not process unsubscribe. {errorMessage} Please try again or email support@quantumailab.in.
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleConfirm}
                      variant="hero"
                      size="lg"
                      disabled={status === "submitting"}
                      className="flex-1"
                    >
                      {status === "submitting" ? (
                        <><Loader2 size={16} className="animate-spin" /> Unsubscribing...</>
                      ) : (
                        "Confirm Unsubscribe"
                      )}
                    </Button>
                    <Button asChild variant="outline" size="lg" className="flex-1">
                      <Link to="/">Cancel</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Unsubscribe;
