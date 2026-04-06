import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { usePageTitle } from "@/hooks/usePageTitle";

const Privacy = () => {
  usePageTitle("Privacy Policy");

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-max">
          <AnimatedSection>
            <SectionHeading label="Legal" title="Privacy Policy" />
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass rounded-xl p-8 md:p-12 max-w-3xl mx-auto space-y-6 text-sm text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">Last updated: April 6, 2026</p>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">1. Information We Collect</h3>
                <p>We collect information you provide directly, such as your name, email address, company name, and message content when you use our contact form or subscribe to our newsletter. We also collect usage data through standard web analytics.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">2. How We Use Your Information</h3>
                <p>We use collected information to respond to inquiries, deliver our services, send newsletter updates you've opted into, and improve our website and offerings.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">3. Data Security</h3>
                <p>We implement industry-standard security measures to protect your personal information. However, no method of electronic transmission or storage is 100% secure.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">4. Data Sharing</h3>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to protect our rights.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">5. Your Rights</h3>
                <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@quantumnest.ai.</p>
              </div>

              <div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-2">6. Contact</h3>
                <p>For questions about this privacy policy, please contact us at hello@quantumnest.ai.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
