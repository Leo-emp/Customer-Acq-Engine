// ── Pre-cached demo responses for live hackathon demo ──
// # Set DEMO_MODE=true in env to use these instead of real API calls

export const DEMO_MODE = process.env.DEMO_MODE === "true";

// # Brand Brain extraction result for dotsstudio.io
export const DEMO_BRAND_PROFILE = {
  companyName: "Dots Studio",
  productDescription: "A full-service digital product studio specializing in UI/UX design, web development, and brand identity. They build custom websites, mobile apps, and SaaS platforms for startups and growing businesses.",
  valueProposition: "Transform ideas into polished digital products with end-to-end design and development — from concept to launch, with ongoing support.",
  targetMarket: "Startups, SMBs, and growing tech companies looking for outsourced product design and development teams",
  industry: "Digital Agency / Software Development",
  keyFeatures: ["UI/UX Design", "Full-Stack Development", "Brand Identity", "SaaS Product Build", "Mobile App Development", "Ongoing Maintenance"],
  pricing: "Custom project-based pricing, starting from $5,000",
  tone: "Modern, creative, and approachable — professional but not corporate",
};

// # Apollo lead search results
export const DEMO_PROSPECTS = [
  {
    id: "p1", companyName: "Flowstate Labs", contactName: "Sarah Chen", title: "CTO",
    email: "sarah.chen@flowstatelabs.com", emailVerified: true, website: "https://flowstatelabs.com",
    industry: "SaaS", location: "San Francisco, CA", employeeCount: 45, linkedinUrl: "https://linkedin.com/in/sarahchen",
    fitReason: "Growing SaaS startup actively hiring developers — likely needs external product design support to scale faster", score: 92, status: "new" as const,
  },
  {
    id: "p2", companyName: "NovaBridge AI", contactName: "Marcus Johnson", title: "CEO & Co-Founder",
    email: "marcus@novabridge.ai", emailVerified: true, website: "https://novabridge.ai",
    industry: "Artificial Intelligence", location: "Austin, TX", employeeCount: 22, linkedinUrl: "https://linkedin.com/in/marcusjohnson",
    fitReason: "Early-stage AI startup with funding — needs a design partner to build their customer-facing platform", score: 88, status: "new" as const,
  },
  {
    id: "p3", companyName: "GreenPath Fintech", contactName: "Aisha Patel", title: "VP of Product",
    email: "aisha@greenpath.finance", emailVerified: true, website: "https://greenpath.finance",
    industry: "Financial Technology", location: "London, UK", employeeCount: 85, linkedinUrl: "https://linkedin.com/in/aishapatel",
    fitReason: "Fintech company expanding product suite — VP of Product is the ideal buyer for design & dev services", score: 85, status: "new" as const,
  },
  {
    id: "p4", companyName: "HealthSync", contactName: "David Park", title: "Head of Engineering",
    email: "dpark@healthsync.io", emailVerified: true, website: "https://healthsync.io",
    industry: "HealthTech", location: "New York, NY", employeeCount: 120, linkedinUrl: "https://linkedin.com/in/davidpark",
    fitReason: "HealthTech platform rebuilding their patient portal — strong need for UX expertise and frontend development", score: 82, status: "new" as const,
  },
  {
    id: "p5", companyName: "Trellis Commerce", contactName: "Emma Rodriguez", title: "Founder",
    email: "emma@trelliscommerce.com", emailVerified: false, website: "https://trelliscommerce.com",
    industry: "E-Commerce", location: "Miami, FL", employeeCount: 12, linkedinUrl: "https://linkedin.com/in/emmarodriguez",
    fitReason: "Solo founder building an e-commerce platform — needs full-stack development partner", score: 78, status: "new" as const,
  },
  {
    id: "p6", companyName: "Orbital Education", contactName: "James Liu", title: "CPO",
    email: "james.liu@orbital.edu", emailVerified: true, website: "https://orbital.edu",
    industry: "EdTech", location: "Toronto, Canada", employeeCount: 65, linkedinUrl: "https://linkedin.com/in/jamesliu",
    fitReason: "EdTech company with dated UI — CPO recently posted about needing a redesign of their learning platform", score: 75, status: "new" as const,
  },
  {
    id: "p7", companyName: "PulseMetrics", contactName: "Nina Volkov", title: "Director of Product",
    email: "nina@pulsemetrics.io", emailVerified: true, website: "https://pulsemetrics.io",
    industry: "Analytics / Data", location: "Berlin, Germany", employeeCount: 38, linkedinUrl: "https://linkedin.com/in/ninavolkov",
    fitReason: "Analytics startup building dashboard product — needs data visualization and UX design expertise", score: 71, status: "new" as const,
  },
];

export const DEMO_LEAD_SUMMARY = {
  totalLeads: 7,
  verifiedEmails: 6,
  avgScore: 82,
  topIndustries: ["SaaS", "Artificial Intelligence", "Financial Technology", "HealthTech", "EdTech"],
  topLocations: ["San Francisco, CA", "Austin, TX", "London, UK", "New York, NY", "Toronto, Canada"],
  scoreBreakdown: { excellent: 4, good: 3, fair: 0 },
};

// # Competitor analysis
export const DEMO_COMPETITORS = {
  competitors: [
    {
      name: "Toptal", website: "toptal.com", description: "Premium freelance marketplace connecting companies with top 3% of developers, designers, and project managers. Known for rigorous vetting process.",
      strengths: ["Massive talent pool with 10,000+ vetted freelancers", "Strong brand recognition and trust", "Flexible engagement models (hourly, part-time, full-time)", "Global reach across 100+ countries"],
      weaknesses: ["Premium pricing ($60-200+/hr) prices out startups", "Freelancer model means less team cohesion than a studio", "No ongoing product ownership — just talent placement"],
      pricing: "$60-200+/hr depending on role", marketPosition: "market leader", threatLevel: "medium" as const,
    },
    {
      name: "Ueno (now part of Twitter/X)", website: "ueno.co", description: "Award-winning design agency known for bold, beautiful digital products. Acquired by Twitter in 2021 but their case studies remain a benchmark.",
      strengths: ["World-class design portfolio", "Strong brand storytelling", "Premium positioning attracts premium clients"],
      weaknesses: ["Acquired — no longer independent", "Very expensive, enterprise-only pricing", "Long lead times for projects"],
      pricing: "$150K+ per project", marketPosition: "niche player", threatLevel: "low" as const,
    },
    {
      name: "Designli", website: "designli.co", description: "US-based app design and development studio focused on startups and entrepreneurs. Offers fixed-price packages for MVPs.",
      strengths: ["Clear MVP packages with fixed pricing", "Fast turnaround for startup MVPs", "Strong startup ecosystem connections"],
      weaknesses: ["Smaller team limits capacity", "Less enterprise experience", "Primarily US-focused"],
      pricing: "$25K-100K per project", marketPosition: "strong challenger", threatLevel: "high" as const,
    },
    {
      name: "Fueled", website: "fueled.com", description: "NYC-based mobile app development agency working with Fortune 500 companies and funded startups. Known for consumer-facing mobile apps.",
      strengths: ["Strong mobile-first expertise", "Impressive client list (Warby Parker, MGM, QuizUp)", "End-to-end product development"],
      weaknesses: ["Primarily mobile-focused, less web expertise", "High minimum project budgets", "Slower delivery for complex projects"],
      pricing: "$50K-500K+ per project", marketPosition: "strong challenger", threatLevel: "medium" as const,
    },
    {
      name: "Recraft Design", website: "recraft.design", description: "Boutique design studio offering UI/UX and brand identity services. Smaller team but highly personalized service.",
      strengths: ["Personalized, founder-level attention", "Competitive pricing for quality", "Fast iteration cycles"],
      weaknesses: ["Limited capacity — small team", "Less development capability", "No mobile app expertise"],
      pricing: "$10K-50K per project", marketPosition: "emerging", threatLevel: "high" as const,
    },
  ],
  ourAdvantages: [
    "End-to-end service: design + development + branding in one studio — competitors typically specialize in one area",
    "Startup-friendly pricing with project-based models, not enterprise-only",
    "Ongoing maintenance and support creates long-term relationships, not one-off projects",
    "Modern tech stack (Next.js, React, Tailwind) attracts tech-forward clients",
    "Faster delivery than traditional agencies — lean team with less overhead",
  ],
  ourVulnerabilities: [
    "Smaller portfolio compared to established agencies — need more case studies",
    "Limited brand recognition — need thought leadership and content marketing",
    "Capacity constraints — can only take 3-4 major projects simultaneously",
    "No dedicated mobile app development team yet",
  ],
  strategicRecommendations: [
    "Target the 'Designli gap' — startups that need more than an MVP but can't afford Fueled/Toptal rates. Position as the premium-quality, startup-price option.",
    "Build 3-5 showcase case studies with measurable results (conversion lift, user growth) to compete with agency portfolios",
    "Launch a productized service (e.g., 'SaaS UI Audit' for $2,500) as a low-commitment entry point that converts to full projects",
    "Partner with startup accelerators (YC, Techstars) to get early access to funded startups needing product development",
    "Publish weekly design/dev content to build authority — competitor studios rarely invest in content",
  ],
  marketGaps: [
    "AI-powered product studios — no agency is specializing in building AI-native products yet",
    "Design-as-a-subscription for startups — Designjoy proved the model, but no studio offers dev + design subscriptions",
    "Vertical SaaS design expertise — healthcare, fintech, edtech specific product studios are rare",
  ],
};

// # Industry research
export const DEMO_INDUSTRY = {
  overview: {
    industryName: "Digital Product Studio / Agency",
    marketSize: "$85B globally (2025)",
    growthRate: "11.2% CAGR",
    maturityStage: "growth",
    summary: "The digital product studio market is experiencing strong growth driven by startup proliferation, digital transformation of traditional businesses, and the rising cost of in-house engineering teams. The market is fragmenting — large agencies are losing share to specialized boutique studios that offer faster delivery and more personalized service. AI tools are beginning to reshape production workflows, creating both threats and opportunities.",
  },
  trends: [
    { trend: "AI-Augmented Design & Development", impact: "Studios using AI tools (Cursor, v0, Figma AI) are delivering 2-3x faster. Clients increasingly expect AI-powered workflows. Studios that don't adopt will lose on speed and pricing.", timeframe: "short-term", relevance: "high" as const },
    { trend: "Productized Services", impact: "Fixed-scope, fixed-price offerings (UI audits, MVP sprints, design subscriptions) are growing 25% YoY. Clients prefer predictable costs over hourly billing. Designjoy, MangoChango pioneering this model.", timeframe: "short-term", relevance: "high" as const },
    { trend: "Vertical Specialization", impact: "Generalist agencies are losing to vertically specialized studios. Healthcare, fintech, and climate-tech focused studios command 30-50% higher rates and close faster.", timeframe: "medium-term", relevance: "high" as const },
    { trend: "Remote-First Global Teams", impact: "Geographic boundaries dissolving. Studios in Eastern Europe, Southeast Asia, and Latin America competing directly with US/UK studios at 40-60% lower rates while matching quality.", timeframe: "medium-term", relevance: "medium" as const },
    { trend: "No-Code / Low-Code Disruption", impact: "Tools like Webflow, Framer, and Bubble are enabling non-technical founders to build MVPs without agencies. Threatens the low-end of the market but pushes studios toward higher-value, complex work.", timeframe: "long-term", relevance: "medium" as const },
  ],
  keyPlayers: [
    { name: "Accenture Song", role: "Enterprise leader in digital transformation", marketShare: "~8%" },
    { name: "Thoughtbot", role: "Leading product studio for startups", marketShare: "~2%" },
    { name: "Toptal", role: "Dominant freelance talent marketplace", marketShare: "~4%" },
    { name: "IDEO", role: "Premium design innovation consultancy", marketShare: "~1%" },
    { name: "Fueled", role: "Top mobile app development agency", marketShare: "~1%" },
    { name: "Designli", role: "Startup MVP specialist", marketShare: "<1%" },
  ],
  opportunities: [
    { opportunity: "AI Product Studios", description: "No agency has fully positioned as the go-to studio for building AI-native products. First mover could own this positioning. Growing demand from funded AI startups needing product teams.", difficulty: "moderate", potentialRevenue: "$500K-2M ARR" },
    { opportunity: "Design-as-a-Subscription", description: "Monthly subscription model for ongoing design + dev work. Designjoy proved single-designer subscriptions work at $5K/mo. A studio offering full-team subscriptions at $8-15K/mo is underserved.", difficulty: "easy", potentialRevenue: "$300K-1M ARR" },
    { opportunity: "Startup Accelerator Partnerships", description: "YC, Techstars, and 500 Global collectively fund 1,000+ startups/year. Most need product development. Official partnerships would provide steady deal flow.", difficulty: "moderate", potentialRevenue: "$200K-800K ARR" },
    { opportunity: "Emerging Market Expansion", description: "Digital transformation accelerating in Southeast Asia, Africa, and Latin America. Local businesses need product studios but few high-quality options exist.", difficulty: "hard", potentialRevenue: "$1M-5M ARR" },
  ],
  threats: [
    { threat: "AI replacing manual design/dev work", severity: "high" as const, mitigation: "Adopt AI tools early to reduce costs and speed up delivery. Position as 'AI-augmented studio' — the human + AI advantage." },
    { threat: "Race to the bottom on pricing", severity: "medium" as const, mitigation: "Differentiate on quality, specialization, and outcomes (not hours). Build case studies showing ROI, not just deliverables." },
    { threat: "In-house teams growing", severity: "medium" as const, mitigation: "Target companies in the 10-100 employee range — too small for full in-house teams but big enough to invest in product quality." },
  ],
  regulations: [
    { regulation: "GDPR & Data Privacy", impact: "Studios handling client data and building user-facing products must ensure compliance. Creates consulting opportunity for privacy-focused design.", status: "active" },
    { regulation: "AI Transparency Requirements (EU AI Act)", impact: "Products using AI will need transparency disclosures. Studios building AI features need compliance expertise.", status: "upcoming" },
  ],
  outlook: "The digital product studio market will grow 11%+ annually through 2028, driven by AI adoption and startup proliferation. The biggest winners will be studios that combine AI-augmented workflows with vertical specialization, offering faster delivery at competitive rates. Generalist agencies face margin pressure from both AI tools and global competition. The sweet spot is mid-market: startups and SMBs that need studio-quality work but can't afford enterprise agency rates.",
};

// # Market mapping
export const DEMO_MARKET = {
  totalAddressableMarket: { size: "$85B", description: "Global digital agency and product development services market, including all design, development, and consulting services." },
  serviceableMarket: { size: "$4.2B", description: "Startup and SMB-focused product studios offering end-to-end design and development, excluding enterprise consultancies and pure freelance platforms." },
  segments: [
    { name: "Funded Startups (Seed-Series B)", size: "$1.8B", growth: "18% YoY", competition: "competitive" as const, ourFit: "strong" as const, description: "VC-backed startups with $500K-20M in funding, building their first or second product. Need fast, high-quality development partners. Budget-conscious but willing to pay for quality.", entryStrategy: "Partner with accelerators, build startup-focused case studies, offer MVP sprint packages." },
    { name: "SMB Digital Transformation", size: "$2.1B", growth: "14% YoY", competition: "moderate" as const, ourFit: "strong" as const, description: "Established businesses (50-500 employees) modernizing their digital presence. Need website rebuilds, customer portals, and internal tools. Longer sales cycles but higher contract values.", entryStrategy: "Build industry-specific landing pages, offer free UI audits as lead magnets." },
    { name: "Enterprise Innovation Labs", size: "$8.5B", growth: "8% YoY", competition: "saturated" as const, ourFit: "weak" as const, description: "Fortune 500 companies running innovation initiatives. Dominated by Accenture, Deloitte, McKinsey. Very long sales cycles, heavy compliance requirements.", entryStrategy: "Avoid direct competition. Target as subcontractor for enterprise projects needing specialized skills." },
    { name: "Solo Founders & Bootstrappers", size: "$600M", growth: "22% YoY", competition: "underserved" as const, ourFit: "moderate" as const, description: "Pre-funding founders building MVPs with personal savings. Very price-sensitive but fastest-growing segment. No-code alternatives are primary competition.", entryStrategy: "Offer productized MVP packages at fixed prices ($5-15K). Compete on quality vs no-code limitations." },
    { name: "AI-Native Product Development", size: "$450M", growth: "45% YoY", competition: "blue ocean" as const, ourFit: "strong" as const, description: "Companies building products with AI at the core — chatbots, recommendation engines, automation tools. Need studios that understand AI/ML integration with product design.", entryStrategy: "First-mover advantage. Build 2-3 AI product case studies, publish thought leadership on AI product design." },
  ],
  buyerPersonas: [
    { title: "CTO at Seed-Stage Startup", companySize: "5-20 employees", painPoints: ["Moving too slow with contractors", "Design quality inconsistent", "Can't hire full-time yet", "Burning runway on iterations"], decisionFactors: ["Speed of delivery", "Portfolio quality", "Price within runway constraints", "Technical competence"], budget: "$15K-50K per project" },
    { title: "VP of Product at Growth-Stage SaaS", companySize: "50-200 employees", painPoints: ["Internal team at capacity", "Need specialized UX expertise", "Competitor launched a better UI", "Technical debt slowing feature releases"], decisionFactors: ["Proven SaaS experience", "Ability to integrate with existing team", "Design system expertise", "Long-term partnership potential"], budget: "$50K-200K per year" },
    { title: "Founder of a Non-Tech Business", companySize: "10-100 employees", painPoints: ["No technical co-founder", "Current website is outdated", "Losing customers to digitally-savvy competitors", "Don't know where to start"], decisionFactors: ["Trust and communication", "Clear process and timeline", "Fixed pricing (no surprises)", "Portfolio of similar businesses"], budget: "$10K-80K per project" },
  ],
  positioningMap: {
    axes: { x: "Price Point (Low → High)", y: "Service Depth (Narrow → Full-Stack)" },
    players: [
      { name: "Toptal", x: "high" as const, y: "low" as const },
      { name: "Designli", x: "medium" as const, y: "medium" as const },
      { name: "Fueled", x: "high" as const, y: "high" as const },
      { name: "Fiverr Pro", x: "low" as const, y: "low" as const },
      { name: "IDEO", x: "high" as const, y: "medium" as const },
    ],
    ourPosition: { x: "medium" as const, y: "high" as const },
  },
  entryRecommendation: "Focus on the 'Funded Startups' and 'AI-Native Product Development' segments first. These have the highest growth, strongest fit, and least competition. Build 3-5 case studies in these verticals within 6 months, then expand to SMB Digital Transformation. Avoid enterprise — the sales cycle and compliance burden don't match a studio's operating model.",
  prioritySegments: ["Funded Startups (Seed-Series B)", "AI-Native Product Development", "SMB Digital Transformation"],
};

// # Demo email drafts
export const DEMO_EMAILS = [
  {
    to: "sarah.chen@flowstatelabs.com", subject: "Quick thought on scaling Flowstate's product team",
    body: "Hi Sarah,\n\nI noticed Flowstate Labs has been growing quickly — congrats on the recent traction. Scaling a product while keeping quality high is one of the hardest challenges at your stage.\n\nWe're a product studio that works as an extension of startup engineering teams. We recently helped a Series A SaaS company redesign their core platform, which led to a 40% increase in user activation.\n\nWould it make sense to have a 15-minute chat this week? I'd love to learn more about what you're building and see if there's a fit.\n\nBest,\n{senderName}",
    prospectId: "p1",
  },
  {
    to: "marcus@novabridge.ai", subject: "Building AI products that users actually love",
    body: "Hi Marcus,\n\nBuilding an AI product that's technically impressive is hard enough — making it intuitive for end users is a whole other challenge. Most AI startups I talk to struggle with this gap.\n\nWe specialize in designing and building customer-facing AI platforms. We focus on making complex AI capabilities feel simple — clear data visualizations, intuitive workflows, and interfaces that build user trust.\n\nI'd be happy to share a few specific ideas for NovaBridge's platform. Would a short call work sometime this week?\n\nBest,\n{senderName}",
    prospectId: "p2",
  },
  {
    to: "aisha@greenpath.finance", subject: "Fintech UX that builds trust",
    body: "Hi Aisha,\n\nIn fintech, the UI isn't just a surface — it's where users decide whether to trust you with their money. Every interaction either builds confidence or creates doubt.\n\nWe've worked with fintech teams on compliance-friendly interfaces that actually convert. Our approach focuses on reducing friction at high-stakes moments: onboarding, first transaction, and account verification.\n\nI saw GreenPath is expanding its product suite. If you're thinking about the UX of those new features, I'd love to share some patterns we've seen work well.\n\nWould a quick 15-minute call make sense?\n\nBest,\n{senderName}",
    prospectId: "p3",
  },
];
