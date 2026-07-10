/**
 * SINGLE SOURCE OF TRUTH — all site content lives here.
 * Components are content-agnostic; never hard-code copy in components.
 */

export interface LanguageSpoken {
  name: string;
  level: string;
  /** 0–100, drives the proficiency bar width */
  pct: number;
}

export interface ExperienceTrack {
  domain: string;
  bullets: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  current: boolean;
  tracks: ExperienceTrack[];
  tags: string[];
}

export interface Internship {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface Award {
  title: string;
  year: string;
  detail: string;
  /** Back-of-card facts (flip cards) */
  back: string[];
  link: string;
  org: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  /** When set, CountUp animates to this number and appends countSuffix */
  count?: number;
  countSuffix?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  approach: string;
  impact: string;
  stack: string[];
  metrics: ProjectMetric[];
  accent: string;
  github: string;
  cover: string;
  year: string;
  role: string;
}

export const owner = {
  name: "Sayan Chakraborty",
  role: "Product Analyst (ISG) @ Cognizant",
  headline: "Mainframe Developer · AI Explorer",
  tagline: "Bridging legacy mainframes with modern AI.",
  location: "Bengaluru, India (IST)",
  phone: "+91 6291171034",
  email: "iamsayan13201518@gmail.com",
  linkedin: "https://www.linkedin.com/in/sayan-chakraborty-b804a624b/",
  github: "https://github.com/Sayan1320",
  githubUser: "Sayan1320",
  resumePdf: "/resume.pdf",
  availability: "Open to opportunities",
  summary:
    "Mainframe Developer skilled in COBOL, CICS, SQL, JCL, DB2 and C++. Experienced in developing and maintaining mainframe software that meets business needs, with excellent problem-solving skills and a passion for staying up to date — bringing innovation and efficiency to mainframe development.",
  languagesSpoken: [
    { name: "English", level: "Proficient", pct: 92 },
    { name: "Bengali", level: "Fluent", pct: 100 },
    { name: "Hindi", level: "Conversational", pct: 70 },
  ] satisfies LanguageSpoken[],
};

export const skills: Record<string, string[]> = {
  "Mainframe Core": [
    "COBOL", "JCL", "CICS", "DB2", "VSAM", "IMS DB", "Z/OS", "TSO", "ISPF",
    "QMF", "SPUFI", "Endevor", "ChangeMan", "IBM Utilities",
  ],
  "Modern Stack": [
    "Python", "Java", "C++", "JavaScript", "HTML", "CSS", "REST APIs",
    "MySQL", "Docker", "Git", "GitHub", "Azure",
  ],
  "AI & Data": [
    "IBM watsonx.ai", "IBM Cloudant", "MCP", "Granite Code", "Pandas",
    "NumPy", "Matplotlib", "WMA",
  ],
  "Tools & Practice": [
    "VS Code", "Cursor (AI)", "Claude Code", "BOB IDE", "APPLENS", "ITIL4", "Jupyter",
  ],
};

/** Hover-tooltip context per skill (falls back to group name) */
export const skillContext: Record<string, string> = {
  COBOL: "Daily driver at Cognizant",
  JCL: "Orchestrates every batch job I ship",
  CICS: "Online transaction processing",
  DB2: "Relational backbone of the estate",
  VSAM: "Dataset-level data wrangling",
  Endevor: "Zero-defect migrations in banking",
  ChangeMan: "Release management for insurance",
  "IBM watsonx.ai": "Powering Helios modernization",
  MCP: "Wiring AI into real toolchains",
  "Granite Code": "IBM's code model, on z/OS problems",
  Python: "Glue language for AI experiments",
  "Claude Code": "Pair programmer of choice",
};

export const experience: ExperienceEntry[] = [
  {
    company: "Cognizant",
    role: "Product Analyst (ISG)",
    period: "Dec 2023 — Present",
    current: true,
    tags: ["Insurance", "Cards & Payments", "Banking"],
    tracks: [
      {
        domain: "Insurance (current)",
        bullets: [
          "Handling the release management lifecycle using ChangeMan.",
          "Managing complex package deployments under strict audit & compliance requirements.",
          "Actively involved in incident resolution and production support.",
        ],
      },
      {
        domain: "Cards & Payments",
        bullets: [
          "Managed end-to-end code migration using Endevor in a high-volume banking environment.",
          "Executed multiple production releases with zero critical defects.",
          "Automated and optimized migration steps, reducing manual effort.",
        ],
      },
    ],
  },
];

export const internships: Internship[] = [
  {
    company: "Cognizant",
    role: "Intern — Mainframe Development",
    period: "Jun 2023 — Dec 2023",
    bullets: [
      "Built an automated report-generating system driven by client demand using COBOL, JCL, DB2, VSAM and IBM Utilities, with data validated through multiple validation layers.",
    ],
  },
  {
    company: "HighRadius",
    role: "Intern — Fintech Engineering",
    period: "Jan 2022 — Apr 2022",
    bullets: [
      "Built and deployed an AI-enabled Fintech B2B cloud application using Python, Pandas, NumPy, Matplotlib and Jupyter.",
    ],
  },
];

export const education = {
  school: "Narula Institute of Technology, Kolkata",
  degree: "B.Tech in Mechanical Engineering",
  period: "Nov 2020 — Jun 2023",
  cgpa: "8.30 CGPA",
};

export const awards: Award[] = [
  {
    title: "Smart India Hackathon (SIH)",
    year: "2022",
    detail: "National-level hackathon participant.",
    back: [
      "India's largest national hackathon",
      "Selected to compete at national level",
      "Problem-solving under a 36-hour clock",
    ],
    link: "",
    org: "Govt. of India",
  },
  {
    title: "World Record — Vibe Coding AI Event",
    year: "—",
    detail:
      "Recognized as part of a World Record for Cognizant at the Vibe Coding AI event.",
    back: [
      "Part of a record-setting cohort at Cognizant",
      "AI-assisted development at unprecedented scale",
      "Proof that mainframe folks vibe too",
    ],
    link: "[ADD LINK]",
    org: "Cognizant",
  },
  {
    title: "Helios — IBM TechXchange Hackathon",
    year: "2026",
    detail:
      "Built a FastAPI backend, hash-chained audit log, and real-time WebSocket review queue for an AI-assisted z/OS mainframe modernization platform on IBM watsonx.ai and Cloudant.",
    back: [
      "FastAPI backend",
      "Hash-chained audit log",
      "WebSocket review queue",
      "IBM watsonx.ai",
      "IBM Cloudant",
    ],
    link: "[ADD LINK]",
    org: "IBM",
  },
];

export const projects: Project[] = [
  {
    slug: "helios-mainframe-modernization",
    title: "Helios — AI Mainframe Modernization",
    subtitle: "AI-assisted z/OS modernization platform (IBM TechXchange Hackathon 2026)",
    description:
      "An AI-assisted platform that helps modernize z/OS mainframe estates: FastAPI backend, hash-chained audit log for tamper-evident compliance, and a real-time WebSocket review queue for human-in-the-loop code review — powered by IBM watsonx.ai with Cloudant persistence.",
    problem:
      "Enterprises sit on decades of COBOL that nobody dares touch. Modernization tools either rewrite blindly — with no audit trail — or move so cautiously they change nothing. Compliance teams need to prove exactly what the AI changed, when, and who approved it.",
    approach:
      "Helios pairs IBM watsonx.ai code transformation with a hash-chained audit log, so every suggested change is tamper-evident. A real-time WebSocket review queue keeps a human in the loop: engineers approve, reject, or annotate AI proposals live, and every verdict lands in Cloudant with cryptographic lineage.",
    impact:
      "A modernization pipeline compliance teams can actually sign off on — full audit integrity, real-time review latency, and AI throughput without giving up human judgment. Built end-to-end during IBM TechXchange Hackathon 2026.",
    stack: ["FastAPI", "IBM watsonx.ai", "IBM Cloudant", "WebSockets", "Python", "z/OS"],
    metrics: [
      { label: "Audit trail integrity", value: "100%", count: 100, countSuffix: "%" },
      { label: "Review latency", value: "Real-time" },
    ],
    accent: "#22D3EE",
    github: "[ADD LINK]",
    cover: "/media/proj-helios.jpg",
    year: "2026",
    role: "Backend & AI Engineering",
  },
  {
    slug: "automated-report-engine",
    title: "Automated Report Engine",
    subtitle: "Client-driven mainframe reporting system (Cognizant)",
    description:
      "An automated report-generating system built to client demand on the mainframe — COBOL programs orchestrated by JCL against DB2 and VSAM with IBM Utilities, where every dataset passes through multiple validation layers before output.",
    problem:
      "Client reporting was manual, slow, and error-prone: analysts pulled data by hand from DB2 and VSAM sources, and a single bad dataset could poison a whole reporting cycle.",
    approach:
      "COBOL programs orchestrated end-to-end by JCL, reading DB2 and VSAM through IBM Utilities. Every dataset flows through multiple validation layers — structural, referential, and business-rule checks — before a single line of report output is written.",
    impact:
      "Reporting went from manual effort to an automated pipeline the client drives themselves. Multi-stage validation means bad data gets caught at the gate, not in the boardroom.",
    stack: ["COBOL", "JCL", "DB2", "VSAM", "IBM Utilities"],
    metrics: [
      { label: "Validation layers", value: "Multi-stage" },
      { label: "Manual effort", value: "↓ Automated" },
    ],
    accent: "#7C5CFF",
    github: "[ADD LINK]",
    cover: "/media/proj-reports.jpg",
    year: "2023",
    role: "Mainframe Developer",
  },
  {
    slug: "fintech-b2b-cloud-app",
    title: "AI Fintech B2B Cloud App",
    subtitle: "AI-enabled receivables intelligence (HighRadius)",
    description:
      "An AI-enabled Fintech B2B cloud application — Python data pipeline with Pandas/NumPy feature engineering, Matplotlib analytics, built and shipped end-to-end in Jupyter-driven iterations.",
    problem:
      "B2B receivables teams make credit and collection calls on stale spreadsheets. The data to predict payment behavior exists — it just never reaches the people making decisions in usable form.",
    approach:
      "A Python pipeline end-to-end: Pandas and NumPy for cleaning and feature engineering over receivables data, Matplotlib for the analytics layer, iterated rapidly in Jupyter and shipped as a cloud B2B application.",
    impact:
      "Shipped a working AI-enabled fintech app end-to-end as an intern — from raw data to deployed cloud application, with the full pipeline built and owned solo.",
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
    metrics: [
      { label: "Pipeline", value: "End-to-end" },
      { label: "Deployed", value: "Cloud" },
    ],
    accent: "#F472B6",
    github: "[ADD LINK]",
    cover: "/media/proj-fintech.jpg",
    year: "2022",
    role: "Fintech Engineering Intern",
  },
  {
    slug: "endevor-migration-automation",
    title: "Zero-Defect Release Pipeline",
    subtitle: "Endevor migration automation in high-volume banking (Cognizant)",
    description:
      "End-to-end code migration across environments using Endevor in a high-volume banking estate — multiple production releases shipped with zero critical defects, with migration steps automated and optimized to cut manual effort.",
    problem:
      "High-volume banking releases are where careers go to die: dozens of components moving across environments, strict audit trails, and zero tolerance for production defects.",
    approach:
      "End-to-end migration management in Endevor with automated, optimized promotion steps. Each release choreographed across environments with verification gates, cutting the manual toil that causes human error in the first place.",
    impact:
      "Multiple production releases shipped with zero critical defects. Migration steps that used to be manual checklists became automated pipeline stages.",
    stack: ["Endevor", "ChangeMan", "z/OS", "ITIL4"],
    metrics: [
      { label: "Critical defects", value: "0", count: 0 },
      { label: "Production releases", value: "Multiple" },
    ],
    accent: "#34D399",
    github: "[ADD LINK]",
    cover: "/media/proj-endevor.jpg",
    year: "2024",
    role: "Product Analyst (ISG)",
  },
];

export const beyondCode = {
  videoEditing: {
    title: "Video Editing & Design",
    detail: "Creative editing and design with Adobe Premiere Pro and Illustrator.",
    tools: ["Premiere Pro", "Illustrator"],
    image: "/media/beyond-edit.jpg",
  },
  trekking: {
    title: "Trekking",
    detail: "Trekking enthusiast — happiest above the treeline.",
    image: "/media/beyond-trek.jpg",
  },
  motto: "Cutting film taught me pacing — I animate the same way.",
  mottos: [
    "Cutting film taught me pacing — I animate the same way.",
    "Every trek is a lesson in release management: pack light, plan the route, respect the mountain.",
    "Good edits and good deploys share a rule: nobody should notice the cut.",
  ],
};

export const heroStats = [
  { value: 2, suffix: "+", label: "Years in production mainframes" },
  { value: 3, suffix: "", label: "Domains: Insurance · Cards & Payments · Fintech" },
  { value: 0, suffix: "", label: "Critical defects across releases", countFrom: 9 },
  { value: 25, suffix: "+", label: "Technologies in the toolbox" },
];

/* ————— Site chrome & copy ————— */

export const site = {
  url: "https://sayan-portfolio.vercel.app", // update after deploy
  title: "Sayan Chakraborty",
  titleTemplate: "%s — Sayan Chakraborty",
  description:
    "Mainframe Developer & Product Analyst in Bengaluru — COBOL, CICS, DB2 and release management, bridging z/OS with modern AI like IBM watsonx.ai.",
  version: "1.0.0",
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Awards", href: "#awards" },
  { label: "Beyond", href: "#beyond" },
  { label: "Contact", href: "#contact" },
];

export const heroCopy = {
  eyebrow: "PRODUCT ANALYST (ISG) · COGNIZANT",
  intro:
    "I keep 60-year-old mainframes running flawlessly — and teach them new tricks with AI.",
  roles: [
    "Mainframe Developer",
    "Product Analyst (ISG)",
    "AI Explorer",
    "Creative Technologist",
  ],
  chips: ["COBOL", "DB2", "Python", "watsonx.ai"],
  trustLine: "Cognizant · IBM watsonx.ai · HighRadius",
  ctaWork: "View Work",
  ctaResume: "Download Resume",
};

export const aboutCopy = {
  eyebrow: "00 / ABOUT",
  heading: "About me",
  narrative:
    "By day I steer release management for insurance systems that can't afford a bad Friday deploy. Before that: cards & payments migrations with zero critical defects. Lately I'm building the bridge between z/OS and modern AI — watsonx.ai, MCP, Granite — because legacy doesn't have to mean stuck. I got here via a B.Tech in Mechanical Engineering (CGPA 8.30) and an unreasonable amount of curiosity.",
  highlights: ["COBOL", "CICS", "AI", "zero critical defects", "watsonx.ai"],
  whatIDo: [
    {
      title: "Mainframe Development",
      detail: "COBOL, JCL, DB2 and CICS systems that quietly move the world's money.",
      icon: "terminal",
    },
    {
      title: "Release Management",
      detail: "Endevor and ChangeMan deployments under audit — shipped with zero critical defects.",
      icon: "git-branch",
    },
    {
      title: "AI-Assisted Modernization",
      detail: "watsonx.ai, MCP and Granite Code pointed at 60 years of legacy.",
      icon: "sparkles",
    },
  ],
  funFacts: [
    "Part of a World Record 🏆",
    "Trekking enthusiast ⛰️",
    "Cuts video in Premiere Pro 🎬",
  ],
};

export const sectionCopy = {
  skills: { eyebrow: "01 / ARSENAL", heading: "Tools of two eras." },
  experience: { eyebrow: "02 / TRAJECTORY", heading: "Where I've shipped." },
  work: { eyebrow: "03 / SELECTED WORK", heading: "Proof, not promises." },
  awards: { eyebrow: "04 / RECOGNITION", heading: "Moments that stuck." },
  beyond: { eyebrow: "05 / BEYOND THE TERMINAL", heading: "Also me." },
  contact: {
    eyebrow: "06 / CONTACT",
    heading: "Let's build something.",
    sub: "Mainframe modernization, AI experiments, or just good engineering conversation — my inbox is open.",
    availability: "Open to opportunities — replies within 24h.",
  },
};

export const exploringNow = ["IBM watsonx.ai", "MCP", "Granite Code"];

export const preloader = {
  words: ["COBOL", "JCL", "DB2", "PYTHON", "WATSONX.AI", "PORTFOLIO"],
  microcopy: [
    "Compiling COBOL humour…",
    "Allocating datasets…",
    "Polishing glass…",
    "Submitting JCL…",
    "Waking the aurora…",
  ],
};

export const usesPage = {
  title: "Uses",
  intro: "The hardware, software and mainframe tooling behind the work.",
  groups: [
    {
      name: "Editors & AI",
      items: ["VS Code", "Cursor (AI)", "Claude Code", "BOB IDE", "Jupyter"],
    },
    {
      name: "Mainframe",
      items: ["TSO / ISPF", "Endevor", "ChangeMan", "QMF", "SPUFI", "APPLENS", "IBM Utilities"],
    },
    {
      name: "Creative",
      items: ["Adobe Premiere Pro", "Adobe Illustrator"],
    },
    {
      name: "Practice",
      items: ["ITIL4", "Git + GitHub", "Docker", "Azure"],
    },
  ],
};

export const media = {
  heroVideoMp4: "/media/hero-loop.mp4",
  heroVideoWebm: "/media/hero-loop.webm",
  heroPoster: "/media/hero-poster.jpg",
  aboutPortrait: "/media/about-portrait.png",
  aboutAmbient: "/media/about-ambient.mp4",
  ogImage: "/media/og-image.jpg",
};
