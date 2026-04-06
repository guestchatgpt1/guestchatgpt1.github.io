import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Technology", path: "/technology" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm rounded-md transition-all duration-300 ${
      isActive
        ? "text-primary bg-primary/10"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-sm transition-colors ${
      isActive
        ? "text-primary bg-primary/10"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" aria-label="QuantumNest AI Home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-display text-xs font-bold text-primary-foreground">Q</span>
            </div>
            <span className="font-display text-sm font-bold tracking-wider text-foreground">
              QuantumNest<span className="text-primary">.ai</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass} end={link.path === "/"}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden xl:block">
            <Button variant="hero" size="sm" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>

          <button
            className="xl:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden glass border-t border-border/50 max-h-[calc(100vh-4rem)] overflow-y-auto" role="menu">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={mobileLinkClass} role="menuitem" end={link.path === "/"}>
                {link.label}
              </NavLink>
            ))}
            <Button variant="hero" size="sm" className="w-full mt-3" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
