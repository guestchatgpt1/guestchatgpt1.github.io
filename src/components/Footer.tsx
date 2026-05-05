import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";
import NewsletterForm from "@/components/NewsletterForm";

const quickLinks = [
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Technology", path: "/technology" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="QuantumAI Lab Home">
              <img src={logo} alt="QuantumAI Lab" className="w-8 h-8 rounded-lg object-cover" width={32} height={32} />
              <span className="font-display text-sm font-bold text-foreground">
                Quantum<span className="text-primary">AI Lab</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where Intelligence Meets Infinity. Pioneering quantum computing and AI solutions for the world's most complex challenges.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h4 className="font-display text-xs font-semibold mb-4 text-foreground tracking-wider uppercase">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((l) => (
                <Link key={l.path} to={l.path} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <div>
            <h4 className="font-display text-xs font-semibold mb-4 text-foreground tracking-wider uppercase">Services</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/services" className="block hover:text-primary transition-colors">Quantum Computing</Link>
              <Link to="/services" className="block hover:text-primary transition-colors">AI & Machine Learning</Link>
              <Link to="/services" className="block hover:text-primary transition-colors">Hybrid Systems</Link>
              <Link to="/services" className="block hover:text-primary transition-colors">Research & Consulting</Link>
              <Link to="/services" className="block hover:text-primary transition-colors">Enterprise Solutions</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs font-semibold mb-4 text-foreground tracking-wider uppercase">Contact</h4>
            <address className="space-y-3 text-sm text-muted-foreground not-italic">
              <a href="mailto:support@quantumailab.in" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} className="text-primary shrink-0" aria-hidden="true" />
                <span>support@quantumailab.in</span>
              </a>
              <a href="tel:+918652074439" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={14} className="text-primary shrink-0" aria-hidden="true" />
                <span>+91-8652074439</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
                <span>Mumbai, India-421204</span>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} QuantumAI Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-xs text-muted-foreground font-display tracking-widest">
            Where Intelligence Meets Infinity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
