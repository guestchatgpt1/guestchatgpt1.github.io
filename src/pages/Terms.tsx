import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { usePageTitle } from "@/hooks/usePageTitle";

const Terms = () => {
  usePageTitle("Terms of Service");

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading label="Legal" title="Terms of Service" />
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass rounded-xl p-8 md:p-12 max-w-3xl mx-auto space-y-6 text-sm text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">Last updated: April 6, 2026</p>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
                <p>By accessing and using the QuantumNest AI website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">2. Services</h3>
                <p>QuantumNest AI provides quantum computing and artificial intelligence solutions. Specific service terms, deliverables, and pricing are defined in individual service agreements.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">3. Intellectual Property</h3>
                <p>All content, code, algorithms, and materials on this website are the intellectual property of QuantumNest AI unless otherwise stated. Unauthorized reproduction is prohibited.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">4. Limitation of Liability</h3>
                <p>QuantumNest AI shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or website.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">5. Modifications</h3>
                <p>We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">6. Contact</h3>
                <p>For questions about these terms, please contact us at hello@quantumnest.ai.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Terms;
