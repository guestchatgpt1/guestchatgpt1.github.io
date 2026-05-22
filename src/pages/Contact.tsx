import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { usePageTitle } from "@/hooks/usePageTitle";

const DEPARTMENTS = {
  general: { label: "General Information", email: "info@quantumailab.in" },
  sales: { label: "Sales / Business Enquiry", email: "sales@quantumailab.in" },
  support: { label: "Customer Support", email: "support@quantumailab.in" },
  partnerships: { label: "Partnerships / Alliances", email: "partnerships@quantumailab.in" },
  marketing: { label: "Marketing / Media", email: "marketing@quantumailab.in" },
  careers: { label: "Careers / HR", email: "hr@quantumailab.in" },
  leadership: { label: "Founder / Leadership", email: "sateesh.singh@quantumailab.in" },
} as const;

type Department = keyof typeof DEPARTMENTS;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(100).optional(),
  department: z.enum(["general", "sales", "support", "partnerships", "marketing", "careers", "leadership"]),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const Contact = () => {
  usePageTitle("Contact");
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>({ name: "", email: "", company: "", department: "general", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://woveh.app.n8n.cloud/webhook/QuantumAILab-contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          departmentLabel: DEPARTMENTS[result.data.department].label,
          routeTo: DEPARTMENTS[result.data.department].email,
          source: "quantumailab.website",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      toast({
        title: "Message sent!",
        description: `Your enquiry has been routed to ${DEPARTMENTS[result.data.department].email}. We'll reply within 24 hours.`,
      });
      setForm({ name: "", email: "", company: "", department: "general", message: "" });
    } catch (err) {
      toast({
        title: "Could not send message",
        description: `Please try again or email ${DEPARTMENTS[form.department].email} directly.`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field: keyof FormData) =>
    `w-full h-12 px-4 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
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
                <Button variant="hero" size="lg" type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Send Message <Send size={16} /></>}
                </Button>
              </form>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-2" delay={0.15}>
              <div className="space-y-6">
                <div className="glass rounded-xl p-8">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Get in Touch</h3>
                  <div className="space-y-5">
                    <a href="mailto:support@quantumailab.in" className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">support@quantumailab.in</p>
                      </div>
                    </a>
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
