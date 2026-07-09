import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Seo from "@/components/Seo";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { callWebhook, getCaptchaToken, HONEYPOT_FIELD, isHoneypotTripped } from "@/lib/webhook";

const CONTACT_WEBHOOK = "https://wiloka.app.n8n.cloud/webhook/QuantumAILab-contact-us";

const DEPARTMENTS = {
  general: { label: "General Information", email: "info@quantumailab.in" },
  sales: { label: "Sales / Business Enquiry", email: "sales@quantumailab.in" },
  support: { label: "Customer Support", email: "support@quantumailab.in" },
  partnerships: { label: "Partnerships / Alliances", email: "partnerships@quantumailab.in" },
  marketing: { label: "Marketing / Media", email: "marketing@quantumailab.in" },
  careers: { label: "Careers / HR", email: "hr@quantumailab.in" },
} as const;

type Department = keyof typeof DEPARTMENTS;
type FormData = ContactInput;
type FormErrors = Partial<Record<keyof FormData, string>>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>({ name: "", email: "", company: "", department: "general", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const submitting = status === "submitting";

  const sendRequest = async (data: FormData) => {
    const captchaToken = await getCaptchaToken();
    return callWebhook({
      name: "contact.submit",
      url: CONTACT_WEBHOOK,
      method: "POST",
      body: {
        ...data,
        departmentLabel: DEPARTMENTS[data.department].label,
        routeTo: DEPARTMENTS[data.department].email,
        source: "quantumailab.website",
        submittedAt: new Date().toISOString(),
        ...(captchaToken ? { captchaToken } : {}),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLastError(null);

    if (isHoneypotTripped(honeypot)) {
      // Bot caught — silently "succeed".
      setStatus("success");
      setForm({ name: "", email: "", company: "", department: "general", message: "" });
      return;
    }

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      toast({
        title: "Please fix the highlighted fields",
        description: "A few entries need attention before we can send your message.",
        variant: "destructive",
      });
      return;
    }

    setStatus("submitting");
    const response = await sendRequest(result.data);
    if (response.ok) {
      setStatus("success");
      toast({
        title: "Message sent!",
        description: `Your enquiry has been routed to ${DEPARTMENTS[result.data.department].email}. We'll reply within 24 hours.`,
      });
      setForm({ name: "", email: "", company: "", department: "general", message: "" });
    } else {
      setStatus("error");
      setLastError(response.error ?? "Network error");
      toast({
        title: "Could not send message",
        description: `Please try again or email ${DEPARTMENTS[form.department].email} directly.`,
        variant: "destructive",
      });
    }
  };

  const handleRetry = async () => {
    const result = contactSchema.safeParse(form);
    if (!result.success) return;
    setStatus("submitting");
    setLastError(null);
    const response = await sendRequest(result.data);
    if (response.ok) {
      setStatus("success");
      toast({ title: "Message sent!", description: "Thanks — we'll be in touch shortly." });
      setForm({ name: "", email: "", company: "", department: "general", message: "" });
    } else {
      setStatus("error");
      setLastError(response.error ?? "Network error");
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error" || status === "success") setStatus("idle");
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };


  const inputClass = (field: keyof FormData) =>
    `w-full h-12 px-4 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="pt-16">
      <Seo
        title="Contact QuantumAI Lab"
        description="Get in touch with QuantumAI Lab for sales, support, partnerships, and careers. Reach our Mumbai office or message us by department."
      />
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              as="h1"
              label="Contact"
              title="Let's Build the Future Together"
              description="Ready to explore how quantum computing and AI can transform your organization? We'd love to hear from you."
            />
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-12">
            <AnimatedSection className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="glass rounded-xl p-8 space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass("name")}
                      maxLength={100}
                      autoComplete="name"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1" role="alert">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sr-only">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass("email")}
                      maxLength={255}
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1" role="alert">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-company" className="sr-only">Company</label>
                  <input
                    id="contact-company"
                    type="text"
                    placeholder="Company (optional)"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className={inputClass("company")}
                    maxLength={100}
                    autoComplete="organization"
                  />
                </div>
                <div>
                  <label htmlFor="contact-department" className="sr-only">Department</label>
                  <select
                    id="contact-department"
                    value={form.department}
                    onChange={(e) => update("department", e.target.value)}
                    className={inputClass("department")}
                  >
                    {(Object.keys(DEPARTMENTS) as Department[]).map((k) => (
                      <option key={k} value={k}>
                        {DEPARTMENTS[k].label} — {DEPARTMENTS[k].email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Message</label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell us about your project..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={5}
                    maxLength={2000}
                    className={`w-full px-4 py-3 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none transition-all ${
                      errors.message ? "border-destructive" : "border-border"
                    }`}
                  />
                  {errors.message && <p className="text-destructive text-xs mt-1" role="alert">{errors.message}</p>}
                </div>

                {/* Honeypot — hidden from real users + screen readers */}
                <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
                  <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Leave this field empty</label>
                  <input
                    id={`contact-${HONEYPOT_FIELD}`}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div aria-live="polite" aria-atomic="true">
                  {status === "error" && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30" role="alert">
                      <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 text-sm text-destructive">
                        <p className="font-medium">We couldn't send your message.</p>
                        <p className="text-destructive/80">{lastError ?? "Network error"} — please try again, or email {DEPARTMENTS[form.department].email}.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleRetry} disabled={submitting}>
                        Retry
                      </Button>
                    </div>
                  )}
                </div>

                <Button variant="hero" size="lg" type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...</> : <>Send Message <Send size={16} aria-hidden="true" /></>}
                </Button>
              </form>
            </AnimatedSection>


            <AnimatedSection className="lg:col-span-2" delay={0.15}>
              <div className="space-y-6">
                <div className="glass rounded-xl p-8">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Direct Contacts</h3>
                  <ul className="space-y-3">
                    {(Object.keys(DEPARTMENTS) as Department[]).map((k) => (
                      <li key={k}>
                        <a
                          href={`mailto:${DEPARTMENTS[k].email}`}
                          className="flex items-start gap-3 group rounded-lg p-2 -mx-2 hover:bg-muted/40 transition-colors"
                        >
                          <Mail size={14} className="text-primary mt-1 shrink-0" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground">{DEPARTMENTS[k].label}</p>
                            <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors truncate">
                              {DEPARTMENTS[k].email}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass rounded-xl p-8">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Phone & Location</h3>
                  <div className="space-y-5">
                    <a href="tel:+918652074439" className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">+91-8652074439</p>
                      </div>
                    </a>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Headquarters</p>
                        <p className="text-sm text-muted-foreground">Mumbai, India-421204</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-8">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Office Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday – Friday</span>
                      <span className="text-foreground">9:00 – 18:00 IST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday – Sunday</span>
                      <span className="text-foreground">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
