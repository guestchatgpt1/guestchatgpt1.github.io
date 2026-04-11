import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Zap, Building2, Rocket } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const plans = [
  {
    icon: Zap,
    name: "Starter",
    price: "$5,000",
    period: "/month",
    description: "For teams exploring quantum-AI capabilities with focused proof-of-concept projects.",
    features: [
      "Quantum algorithm consultation",
      "Single-model AI development",
      "Monthly strategy sessions",
      "Email support (48h response)",
      "Access to research reports",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    icon: Rocket,
    name: "Professional",
    price: "$15,000",
    period: "/month",
    description: "For organizations deploying quantum-AI systems in production environments.",
    features: [
      "Everything in Starter",
      "Hybrid quantum-AI pipelines",
      "Custom model training & tuning",
      "Dedicated technical lead",
      "Priority support (4h response)",
      "Quarterly performance reviews",
      "API access & integrations",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    icon: Building2,
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale deployments requiring dedicated infrastructure and white-glove service.",
    features: [
      "Everything in Professional",
      "Dedicated quantum hardware access",
      "On-premise deployment options",
      "Custom SLA & compliance",
      "24/7 premium support",
      "Executive briefings",
      "Talent training programs",
      "Co-research partnerships",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];


const Pricing = () => {
  usePageTitle("Pricing");
  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading
              label="Pricing"
              title="Plans Built for Every Stage"
              description="From early exploration to enterprise-scale deployment, choose the plan that fits your quantum-AI journey."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-xl p-8 h-full flex flex-col ${
                    plan.highlighted
                      ? "glass border-primary/40 shadow-[0_0_30px_hsl(var(--glow-primary)/0.15)]"
                      : "glass-hover"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full font-display tracking-wider uppercase">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <plan.icon size={20} className="text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">{plan.name}</h3>
                  </div>

                  <div className="mb-4">
                    <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8 flex-1" role="list">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlighted ? "hero" : "outline"}
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link to="/contact">
                      {plan.cta} <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="section-padding bg-card/30" aria-labelledby="faq-link-heading">
        <div className="text-center">
          <AnimatedSection>
            <h2 id="faq-link-heading" className="font-display text-2xl font-bold gradient-text mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-6">Check out our comprehensive FAQ for answers.</p>
            <Button variant="outline" asChild>
              <Link to="/faq">View FAQ <ArrowRight size={16} /></Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <AnimatedSection>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold gradient-text mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book a free consultation to discuss how quantum-AI can transform your business.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Schedule a Call <ArrowRight size={18} /></Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Pricing;
