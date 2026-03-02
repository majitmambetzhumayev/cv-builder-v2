export type Profession = {
    label: string
    suffix: string
    industry: string
  }

export const PROFESSIONS: Profession[] = [
    // Technology
    { label: "Frontend Developer", suffix: "dev", industry: "Technology" },
    { label: "Backend Developer", suffix: "dev", industry: "Technology" },
    { label: "Full Stack Developer", suffix: "dev", industry: "Technology" },
    { label: "Mobile Developer", suffix: "dev", industry: "Technology" },
    { label: "Software Engineer", suffix: "dev", industry: "Technology" },
    { label: "DevOps Engineer", suffix: "devops", industry: "Technology" },
    { label: "Cloud Architect", suffix: "cloud", industry: "Technology" },
    { label: "Data Scientist", suffix: "data", industry: "Technology" },
    { label: "Data Engineer", suffix: "data", industry: "Technology" },
    { label: "Machine Learning Engineer", suffix: "ml", industry: "Technology" },
    { label: "AI Researcher", suffix: "ai", industry: "Technology" },
    { label: "Cybersecurity Engineer", suffix: "sec", industry: "Technology" },
    { label: "QA Engineer", suffix: "qa", industry: "Technology" },
    { label: "Blockchain Developer", suffix: "web3", industry: "Technology" },
    { label: "Game Developer", suffix: "gamedev", industry: "Technology" },
    { label: "Embedded Systems Engineer", suffix: "embedded", industry: "Technology" },
    { label: "Solutions Architect", suffix: "arch", industry: "Technology" },
    { label: "Technical Writer", suffix: "techwrite", industry: "Technology" },
    { label: "Scrum Master", suffix: "agile", industry: "Technology" },
    { label: "Product Manager", suffix: "pm", industry: "Technology" },

    // Design & Creative
    { label: "UX Designer", suffix: "ux", industry: "Design & Creative" },
    { label: "UI Designer", suffix: "ui", industry: "Design & Creative" },
    { label: "Product Designer", suffix: "design", industry: "Design & Creative" },
    { label: "Graphic Designer", suffix: "design", industry: "Design & Creative" },
    { label: "Brand Designer", suffix: "brand", industry: "Design & Creative" },
    { label: "Motion Designer", suffix: "motion", industry: "Design & Creative" },
    { label: "Web Designer", suffix: "webdesign", industry: "Design & Creative" },
    { label: "Art Director", suffix: "creative", industry: "Design & Creative" },
    { label: "Creative Director", suffix: "creative", industry: "Design & Creative" },
    { label: "Illustrator", suffix: "art", industry: "Design & Creative" },
    { label: "3D Artist", suffix: "3d", industry: "Design & Creative" },
    { label: "Animator", suffix: "motion", industry: "Design & Creative" },
    { label: "Fashion Designer", suffix: "fashion", industry: "Design & Creative" },
    { label: "Industrial Designer", suffix: "industrial", industry: "Design & Creative" },
    { label: "Interior Designer", suffix: "interior", industry: "Design & Creative" },

    // Marketing
    { label: "Marketing Manager", suffix: "marketing", industry: "Marketing" },
    { label: "Digital Marketing Specialist", suffix: "digital", industry: "Marketing" },
    { label: "SEO Specialist", suffix: "seo", industry: "Marketing" },
    { label: "Content Marketing Manager", suffix: "content", industry: "Marketing" },
    { label: "Social Media Manager", suffix: "social", industry: "Marketing" },
    { label: "Brand Strategist", suffix: "brand", industry: "Marketing" },
    { label: "Growth Hacker", suffix: "growth", industry: "Marketing" },
    { label: "Email Marketing Specialist", suffix: "email", industry: "Marketing" },
    { label: "PPC Specialist", suffix: "ppc", industry: "Marketing" },
    { label: "Influencer Marketing Manager", suffix: "influence", industry: "Marketing" },

    // Finance
    { label: "Financial Analyst", suffix: "finance", industry: "Finance" },
    { label: "Investment Banker", suffix: "banking", industry: "Finance" },
    { label: "Accountant", suffix: "accounting", industry: "Finance" },
    { label: "Tax Consultant", suffix: "tax", industry: "Finance" },
    { label: "Financial Advisor", suffix: "advisor", industry: "Finance" },
    { label: "Risk Analyst", suffix: "risk", industry: "Finance" },
    { label: "Auditor", suffix: "audit", industry: "Finance" },
    { label: "Venture Capitalist", suffix: "vc", industry: "Finance" },
    { label: "Trader", suffix: "trading", industry: "Finance" },
    { label: "CFO", suffix: "cfo", industry: "Finance" },

    // Sales
    { label: "Sales Manager", suffix: "sales", industry: "Sales" },
    { label: "Account Executive", suffix: "sales", industry: "Sales" },
    { label: "Business Development Manager", suffix: "biz", industry: "Sales" },
    { label: "Sales Engineer", suffix: "sales", industry: "Sales" },
    { label: "Customer Success Manager", suffix: "cs", industry: "Sales" },

    // HR & People
    { label: "HR Manager", suffix: "hr", industry: "HR & People" },
    { label: "Talent Acquisition Specialist", suffix: "recruit", industry: "HR & People" },
    { label: "People Operations Manager", suffix: "people", industry: "HR & People" },
    { label: "Learning & Development Specialist", suffix: "ld", industry: "HR & People" },
    { label: "HR Business Partner", suffix: "hr", industry: "HR & People" },

    // Legal
    { label: "Lawyer", suffix: "law", industry: "Legal" },
    { label: "Legal Counsel", suffix: "legal", industry: "Legal" },
    { label: "Paralegal", suffix: "legal", industry: "Legal" },
    { label: "Compliance Officer", suffix: "compliance", industry: "Legal" },
    { label: "Patent Attorney", suffix: "patent", industry: "Legal" },

    // Healthcare
    { label: "Doctor", suffix: "md", industry: "Healthcare" },
    { label: "Nurse", suffix: "nurse", industry: "Healthcare" },
    { label: "Pharmacist", suffix: "pharma", industry: "Healthcare" },
    { label: "Medical Researcher", suffix: "research", industry: "Healthcare" },
    { label: "Psychologist", suffix: "psych", industry: "Healthcare" },
    { label: "Dentist", suffix: "dental", industry: "Healthcare" },
    { label: "Physiotherapist", suffix: "physio", industry: "Healthcare" },
    { label: "Healthcare Administrator", suffix: "health", industry: "Healthcare" },

    // Education
    { label: "Teacher", suffix: "edu", industry: "Education" },
    { label: "Professor", suffix: "prof", industry: "Education" },
    { label: "Academic Researcher", suffix: "research", industry: "Education" },
    { label: "Educational Consultant", suffix: "edu", industry: "Education" },
    { label: "Corporate Trainer", suffix: "trainer", industry: "Education" },
    { label: "E-learning Developer", suffix: "elearn", industry: "Education" },

    // Media & Journalism
    { label: "Journalist", suffix: "press", industry: "Media & Journalism" },
    { label: "Content Writer", suffix: "write", industry: "Media & Journalism" },
    { label: "Copywriter", suffix: "copy", industry: "Media & Journalism" },
    { label: "Editor", suffix: "editor", industry: "Media & Journalism" },
    { label: "Photographer", suffix: "photo", industry: "Media & Journalism" },
    { label: "Videographer", suffix: "video", industry: "Media & Journalism" },
    { label: "Podcast Producer", suffix: "podcast", industry: "Media & Journalism" },
    { label: "Filmmaker", suffix: "film", industry: "Media & Journalism" },
    { label: "Music Producer", suffix: "music", industry: "Media & Journalism" },

    // Engineering
    { label: "Mechanical Engineer", suffix: "meng", industry: "Engineering" },
    { label: "Civil Engineer", suffix: "civil", industry: "Engineering" },
    { label: "Electrical Engineer", suffix: "eeng", industry: "Engineering" },
    { label: "Chemical Engineer", suffix: "chem", industry: "Engineering" },
    { label: "Aerospace Engineer", suffix: "aero", industry: "Engineering" },
    { label: "Biomedical Engineer", suffix: "bioeng", industry: "Engineering" },

    // Consulting
    { label: "Management Consultant", suffix: "consult", industry: "Consulting" },
    { label: "Strategy Consultant", suffix: "strategy", industry: "Consulting" },
    { label: "IT Consultant", suffix: "itconsult", industry: "Consulting" },
    { label: "Business Analyst", suffix: "analyst", industry: "Consulting" },

    // Architecture
    { label: "Architect", suffix: "arch", industry: "Architecture" },
    { label: "Urban Planner", suffix: "urban", industry: "Architecture" },
    { label: "Construction Manager", suffix: "construct", industry: "Architecture" },
    { label: "Interior Architect", suffix: "interior", industry: "Architecture" },

    // Science & Research
    { label: "Research Scientist", suffix: "science", industry: "Science & Research" },
    { label: "Biologist", suffix: "bio", industry: "Science & Research" },
    { label: "Chemist", suffix: "chem", industry: "Science & Research" },
    { label: "Physicist", suffix: "physics", industry: "Science & Research" },
    { label: "Environmental Scientist", suffix: "env", industry: "Science & Research" },

    // Operations
    { label: "Operations Manager", suffix: "ops", industry: "Operations" },
    { label: "Supply Chain Manager", suffix: "supply", industry: "Operations" },
    { label: "Project Manager", suffix: "pm", industry: "Operations" },
    { label: "Program Manager", suffix: "program", industry: "Operations" },
    { label: "COO", suffix: "coo", industry: "Operations" },
  ]

export const INDUSTRIES = [...new Set(PROFESSIONS.map(p => p.industry))]