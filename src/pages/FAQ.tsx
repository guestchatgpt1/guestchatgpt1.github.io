import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const faqs = [
  {
    category: "General",
    items: [
      { q: "What is QuantumAI Lab?", a: "QuantumAI Lab is a technology company specializing in quantum computing and artificial intelligence solutions. We build hybrid quantum-AI systems that solve complex problems across industries including healthcare, finance, and logistics." },
      { q: "Where is QuantumAI Lab located?", a: "Our headquarters are in Mumbai, India. We serve clients globally across multiple time zones." },
      { q: "How can I get in touch?", a: "You can reach us via email at support@quantumailab.in, by phone at +91-8652074439, or through our contact form on the Contact page." },
    ],
  },
  {
    category: "Services",
    items: [
      { q: "What services do you offer?", a: "We offer quantum computing solutions, AI & machine learning development, hybrid quantum-AI systems, research & consulting, and enterprise solutions. Each service is tailored to your specific needs and scale." },
      { q: "Do you work with startups or only enterprises?", a: "We work with organizations of all sizes. Our Starter plan is designed for teams exploring quantum-AI capabilities, while our Enterprise plan caters to large-scale deployments." },
      { q: "Can you build custom solutions?", a: "Absolutely. Every engagement begins with understanding your unique challenges. We design and deliver bespoke quantum-AI solutions aligned with your business objectives." },
    ],
  },
  {
    category: "Pricing & Plans",
    items: [
      { q: "What's included in the free trial?", a: "The Professional plan includes a 14-day free trial with full access to hybrid quantum-AI pipelines. No credit card required to start." },
      { q: "Can I switch plans later?", a: "Yes. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle." },
      { q: "Do you offer academic or nonprofit pricing?", a: "We offer special pricing for academic institutions and nonprofit organizations. Contact our sales team for details." },
    ],
  },
  {
    category: "Technology",
    items: [
      { q: "What quantum hardware do you use?", a: "We work with leading quantum hardware providers including superconducting qubit and trapped-ion systems. Our hybrid architecture is hardware-agnostic, allowing us to leverage the best platform for each use case." },
      { q: "Is my data secure?", a: "Absolutely. We implement industry-standard encryption, strict access controls, and comply with relevant data protection regulations. Enterprise clients can opt for on-premise deployments." },
      { q: "What kind of support is included?", a: "All plans include email support. Professional plans get priority response times (4-hour SLA), and Enterprise clients receive 24/7 dedicated support with a named technical lead." },
    ],
  },
];

const FAQ = () => {
  usePageTitle("FAQ");
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              label="FAQ"
              title="Frequently Asked Questions"
              description="Find answers to common questions about our services, technology, and pricing."
            />
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-10">
            {faqs.map((group, gi) => (
              <AnimatedSection key={group.category} delay={gi * 0.08}>
                <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                  {group.category}
                </h3>
                <div className="space-y-3">
                  {group.items.map((faq, i) => (
                    <details key={i} className="glass rounded-xl group" name={`faq-${group.category}`}>
                      <summary className="p-5 cursor-pointer font-display text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex justify-between items-center gap-4">
                        {faq.q}
                        <span className="text-primary shrink-0 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                      </summary>
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Contact Us <ArrowRight size={18} /></Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
