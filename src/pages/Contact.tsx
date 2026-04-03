import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>({ name: "", email: "", company: "", message: "" });
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
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);

    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", company: "", message: "" });
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
                    {[
                      { icon: Mail, label: "Email", value: "hello@quantumnest.ai" },
                      { icon: Phone, label: "Phone", value: "+1 (555) 0-QUANTUM" },
                      { icon: MapPin, label: "Headquarters", value: "123 Innovation Drive\nSan Francisco, CA 94105" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-8">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Office Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday – Friday</span>
                      <span className="text-foreground">9:00 – 18:00 PST</span>
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
