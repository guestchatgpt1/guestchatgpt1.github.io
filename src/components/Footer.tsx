import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-display text-xs font-bold text-foreground">Q</span>
              </div>
              <span className="font-display text-lg font-bold gradient-text">QuantumNest</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where Intelligence Meets Infinity. Pioneering quantum computing and AI solutions for the world's most complex challenges.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {["About", "Services", "Technology", "Case Studies", "Blog", "Contact"].map((l) => (
                <Link key={l} to={`/${l.toLowerCase().replace(" ", "-")}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground tracking-wider">Services</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Quantum Computing</p>
              <p>AI & Machine Learning</p>
              <p>Hybrid Systems</p>
              <p>Research & Consulting</p>
              <p>Enterprise Solutions</p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground tracking-wider">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary" />
                <span>hello@quantumnest.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span>+1 (555) quantum-1</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 QuantumNest AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-display tracking-widest">
            Where Intelligence Meets Infinity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
