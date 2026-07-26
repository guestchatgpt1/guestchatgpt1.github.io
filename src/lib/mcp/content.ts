// Public marketing content exposed through the MCP server.
// Pure data only — no env reads, no I/O, safe to import at build time.

export const SITE_URL = "https://quantumailab.lovable.app";

export const company = {
  name: "QuantumAI Lab",
  tagline: "Quantum computing and AI solutions for real-world problems",
  description:
    "QuantumAI Lab is a technology company specializing in quantum computing and artificial intelligence. We build hybrid quantum-AI systems for healthcare, finance, logistics and other industries.",
  headquarters: "Mumbai, India",
  email: "support@quantumailab.in",
  phone: "+91-8652074439",
  leadership: "Mr. Sateesh Singh (M.Sc., MCA)",
  website: SITE_URL,
  pages: [
    { path: "/", title: "Home" },
    { path: "/about", title: "About" },
    { path: "/services", title: "Services" },
    { path: "/technology", title: "Technology" },
    { path: "/case-studies", title: "Case Studies" },
    { path: "/pricing", title: "Pricing" },
    { path: "/blog", title: "Blog" },
    { path: "/faq", title: "FAQ" },
    { path: "/contact", title: "Contact" },
  ],
};

export const services = [
  {
    title: "Quantum Computing Solutions",
    description:
      "Custom quantum algorithms designed for optimization, simulation, and cryptography. We leverage superconducting qubits and trapped-ion systems to deliver solutions classical computers can't match.",
    features: [
      "Quantum circuit design",
      "Error correction",
      "Quantum annealing",
      "Custom qubit architectures",
    ],
  },
  {
    title: "AI & Machine Learning Development",
    description:
      "End-to-end AI solutions from data strategy to production deployment. Our models are built for accuracy, interpretability, and scale.",
    features: [
      "Deep learning models",
      "NLP & computer vision",
      "Reinforcement learning",
      "MLOps & deployment",
    ],
  },
  {
    title: "Hybrid Quantum-AI Systems",
    description:
      "The best of both worlds—combining quantum speedups with classical AI for unprecedented performance on complex tasks.",
    features: [
      "Variational quantum circuits",
      "Quantum-enhanced optimization",
      "Hybrid training pipelines",
      "Performance benchmarking",
    ],
  },
  {
    title: "Research & Consulting",
    description:
      "Deep technical expertise to guide your quantum and AI strategy. From feasibility studies to roadmap development.",
    features: [
      "Technology assessment",
      "Proof of concept",
      "Research partnerships",
      "Talent development",
    ],
  },
  {
    title: "Enterprise Solutions",
    description:
      "Production-grade quantum-AI platforms tailored for enterprise scale, security, and compliance requirements.",
    features: [
      "Cloud integration",
      "Enterprise security",
      "Regulatory compliance",
      "24/7 support",
    ],
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$5,000",
    period: "/month",
    description:
      "For teams exploring quantum-AI capabilities with focused proof-of-concept projects.",
    features: [
      "Quantum algorithm consultation",
      "Single-model AI development",
      "Monthly strategy sessions",
      "Email support (48h response)",
      "Access to research reports",
    ],
  },
  {
    name: "Professional",
    price: "$15,000",
    period: "/month",
    description:
      "For organizations deploying quantum-AI systems in production environments.",
    features: [
      "Everything in Starter",
      "Hybrid quantum-AI pipelines",
      "Custom model training & tuning",
      "Dedicated technical lead",
      "Priority support (4h response)",
      "Quarterly performance reviews",
      "API access & integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For large-scale deployments requiring dedicated infrastructure and white-glove service.",
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
  },
];

export const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is QuantumAI Lab?",
        a: "QuantumAI Lab is a technology company specializing in quantum computing and artificial intelligence solutions. We build hybrid quantum-AI systems that solve complex problems across industries including healthcare, finance, and logistics.",
      },
      {
        q: "Where is QuantumAI Lab located?",
        a: "Our headquarters are in Mumbai, India. We serve clients globally across multiple time zones.",
      },
      {
        q: "How can I get in touch?",
        a: "You can reach us via email at support@quantumailab.in, by phone at +91-8652074439, or through our contact form on the Contact page.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        q: "What services do you offer?",
        a: "We offer quantum computing solutions, AI & machine learning development, hybrid quantum-AI systems, research & consulting, and enterprise solutions. Each service is tailored to your specific needs and scale.",
      },
      {
        q: "Do you work with startups or only enterprises?",
        a: "We work with organizations of all sizes. Our Starter plan is designed for teams exploring quantum-AI capabilities, while our Enterprise plan caters to large-scale deployments.",
      },
      {
        q: "Can you build custom solutions?",
        a: "Absolutely. Every engagement begins with understanding your unique challenges. We design and deliver bespoke quantum-AI solutions aligned with your business objectives.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "What's included in the free trial?",
        a: "The Professional plan includes a 14-day free trial with full access to hybrid quantum-AI pipelines. No credit card required to start.",
      },
      {
        q: "Can I switch plans later?",
        a: "Yes. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
      },
      {
        q: "Do you offer academic or nonprofit pricing?",
        a: "We offer special pricing for academic institutions and nonprofit organizations. Contact our sales team for details.",
      },
    ],
  },
  {
    category: "Technology",
    items: [
      {
        q: "What quantum hardware do you use?",
        a: "We work with leading quantum hardware providers including superconducting qubit and trapped-ion systems. Our hybrid architecture is hardware-agnostic, allowing us to leverage the best platform for each use case.",
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We implement industry-standard encryption, strict access controls, and comply with relevant data protection regulations. Enterprise clients can opt for on-premise deployments.",
      },
      {
        q: "What kind of support is included?",
        a: "All plans include email support. Professional plans get priority response times (4-hour SLA), and Enterprise clients receive 24/7 dedicated support with a named technical lead.",
      },
    ],
  },
];
