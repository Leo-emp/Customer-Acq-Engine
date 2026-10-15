// ── Pre-cached demo responses for Salesforce live hackathon demo ──
// # Set DEMO_MODE=true in env to use these instead of real API calls
// # Every response is comprehensive, structured, and realistic

export const DEMO_MODE = process.env.DEMO_MODE === "true";

// ══════════════════════════════════════════════════════════
// BRAND BRAIN — Salesforce company profile
// ══════════════════════════════════════════════════════════

export const DEMO_BRAND_PROFILE = {
  companyName: "Salesforce",
  productDescription: "The world's #1 AI-powered CRM platform. Salesforce unifies sales, service, marketing, commerce, and IT on a single platform powered by Einstein AI — giving every company a complete view of their customers and the tools to grow revenue, reduce costs, and increase productivity.",
  valueProposition: "Replace disconnected tools and manual processes with one AI-powered platform that gives your entire team a 360-degree view of every customer — increasing sales productivity by 29% and revenue by 37% on average.",
  targetMarket: "Enterprise and mid-market B2B companies (200-10,000+ employees) across financial services, healthcare, manufacturing, retail, and technology sectors looking to modernize their CRM and customer engagement stack",
  industry: "Enterprise SaaS / Cloud Computing / CRM",
  keyFeatures: [
    "Sales Cloud — AI-powered pipeline management and forecasting",
    "Service Cloud — Omnichannel customer support with Einstein AI",
    "Marketing Cloud — Personalized customer journeys at scale",
    "Data Cloud — Real-time customer data unification",
    "Einstein AI — Predictive analytics, generative AI, and copilot across all clouds",
    "AppExchange — 7,000+ pre-built integrations and apps",
    "Slack Integration — Team collaboration embedded in CRM workflows",
    "Industry Clouds — Pre-built solutions for 15+ verticals",
  ],
  pricing: "Starter Suite: $25/user/mo | Professional: $80/user/mo | Enterprise: $165/user/mo | Unlimited: $330/user/mo | Einstein 1: $500/user/mo",
  tone: "Confident, innovative, enterprise-grade but approachable — data-driven claims backed by customer success stories and ROI metrics",
};

// ══════════════════════════════════════════════════════════
// SCOUT — Search for Leads (Apollo results)
// ══════════════════════════════════════════════════════════

export const DEMO_PROSPECTS = [
  {
    id: "p1", companyName: "MedVista Health Systems", contactName: "Dr. Rachel Torres", title: "Chief Information Officer",
    email: "r.torres@medvista.com", emailVerified: true, website: "https://medvista.com",
    industry: "Healthcare", location: "Boston, MA", employeeCount: 2800, linkedinUrl: "https://linkedin.com/in/racheltorres",
    fitReason: "Large healthcare system still running Siebel CRM from 2012. Recently posted RFP for CRM modernization. $4.2B annual revenue — strong budget for enterprise CRM transformation.", score: 95, status: "new" as const,
  },
  {
    id: "p2", companyName: "Pinnacle Financial Group", contactName: "James Whitfield", title: "SVP of Sales Operations",
    email: "jwhitfield@pinnaclefg.com", emailVerified: true, website: "https://pinnaclefg.com",
    industry: "Financial Services", location: "Charlotte, NC", employeeCount: 1200, linkedinUrl: "https://linkedin.com/in/jameswhitfield",
    fitReason: "Financial services firm using HubSpot — outgrowing it as they scale their wealth management division. SVP of Sales Ops is the classic Salesforce buyer persona with budget authority.", score: 91, status: "new" as const,
  },
  {
    id: "p3", companyName: "Atlas Manufacturing Co.", contactName: "Linda Nakamura", title: "VP of Digital Transformation",
    email: "l.nakamura@atlasmfg.com", emailVerified: true, website: "https://atlasmfg.com",
    industry: "Manufacturing", location: "Detroit, MI", employeeCount: 4500, linkedinUrl: "https://linkedin.com/in/lindanakamura",
    fitReason: "Traditional manufacturer undergoing digital transformation. VP role was created 6 months ago — signals executive commitment and budget. Currently using spreadsheets and SAP for customer management.", score: 88, status: "new" as const,
  },
  {
    id: "p4", companyName: "Velocity Retail Group", contactName: "Carlos Mendez", title: "Chief Revenue Officer",
    email: "carlos.mendez@velocityretail.com", emailVerified: true, website: "https://velocityretail.com",
    industry: "Retail / E-Commerce", location: "Miami, FL", employeeCount: 850, linkedinUrl: "https://linkedin.com/in/carlosmendez",
    fitReason: "Omnichannel retailer with 120+ stores and growing DTC business. CRO recently spoke at NRF about unifying online and in-store customer data — exact use case for Commerce Cloud + Data Cloud.", score: 86, status: "new" as const,
  },
  {
    id: "p5", companyName: "Stratos Cloud Solutions", contactName: "Priya Sharma", title: "CEO & Founder",
    email: "priya@stratoscloud.io", emailVerified: true, website: "https://stratoscloud.io",
    industry: "Technology / SaaS", location: "San Francisco, CA", employeeCount: 180, linkedinUrl: "https://linkedin.com/in/priyasharma",
    fitReason: "Fast-growing SaaS company that just raised Series B ($45M). Scaling sales team from 12 to 40 reps this year — urgent need for enterprise CRM. Currently using a patchwork of Pipedrive + spreadsheets.", score: 83, status: "new" as const,
  },
  {
    id: "p6", companyName: "GreenEdge Energy", contactName: "Tom Blackwell", title: "Director of Sales",
    email: "t.blackwell@greenedge-energy.com", emailVerified: true, website: "https://greenedge-energy.com",
    industry: "Energy / Cleantech", location: "Denver, CO", employeeCount: 320, linkedinUrl: "https://linkedin.com/in/tomblackwell",
    fitReason: "Renewable energy company with complex B2B sales cycles (6-18 months). Current CRM can't handle multi-stakeholder deal tracking. Director of Sales has decision authority and is actively evaluating solutions.", score: 79, status: "new" as const,
  },
  {
    id: "p7", companyName: "Meridian Insurance Partners", contactName: "Sarah O'Brien", title: "Head of Client Experience",
    email: "sobrien@meridianins.com", emailVerified: false, website: "https://meridianins.com",
    industry: "Insurance", location: "Chicago, IL", employeeCount: 680, linkedinUrl: "https://linkedin.com/in/sarahobrien",
    fitReason: "Insurance brokerage losing clients to digital-first competitors. Head of Client Experience is focused on improving renewal rates and cross-sell — perfect Service Cloud + Marketing Cloud use case.", score: 74, status: "new" as const,
  },
];

export const DEMO_LEAD_SUMMARY = {
  totalLeads: 7,
  verifiedEmails: 6,
  avgScore: 85,
  topIndustries: ["Healthcare", "Financial Services", "Manufacturing", "Retail / E-Commerce", "Technology / SaaS"],
  topLocations: ["Boston, MA", "Charlotte, NC", "Detroit, MI", "San Francisco, CA", "Denver, CO"],
  scoreBreakdown: { excellent: 4, good: 3, fair: 0 },
};

// ══════════════════════════════════════════════════════════
// SCOUT — Competitor Analysis
// ══════════════════════════════════════════════════════════

export const DEMO_COMPETITORS = {
  competitors: [
    {
      name: "Microsoft Dynamics 365", website: "dynamics.microsoft.com",
      description: "Microsoft's enterprise CRM and ERP suite, deeply integrated with the Microsoft 365 ecosystem (Teams, Outlook, Excel, Azure). Strongest in companies already committed to the Microsoft stack.",
      strengths: ["Deep Microsoft 365 integration — Outlook, Teams, Excel, Power BI all native", "Bundled pricing for existing Microsoft EA customers saves 20-40%", "Strong ERP capabilities (Finance, Supply Chain) that Salesforce lacks", "Azure AI and Copilot integration accelerating rapidly"],
      weaknesses: ["User experience is clunky compared to Salesforce — steeper learning curve", "Smaller AppExchange equivalent (fewer third-party integrations)", "Slower innovation cycle — features lag Salesforce by 12-18 months", "Sales-specific features less mature than Sales Cloud"],
      pricing: "Sales Professional: $65/user/mo | Sales Enterprise: $95/user/mo | Sales Premium: $135/user/mo",
      marketPosition: "strong challenger", threatLevel: "high" as const,
    },
    {
      name: "HubSpot", website: "hubspot.com",
      description: "Inbound-focused CRM platform popular with SMBs and mid-market companies. Known for ease of use, free tier, and strong marketing automation. Increasingly moving upmarket with Enterprise Hub.",
      strengths: ["Best-in-class onboarding — teams productive in days, not months", "Free CRM tier creates massive top-of-funnel", "Superior content marketing and inbound tooling", "Significantly lower TCO for companies under 200 employees"],
      weaknesses: ["Enterprise features still immature — complex deal structures, CPQ, territory management", "Hits scalability walls at 500+ users", "Limited industry-specific solutions", "Weaker AI/analytics compared to Einstein"],
      pricing: "Free CRM | Starter: $20/user/mo | Professional: $100/user/mo | Enterprise: $150/user/mo",
      marketPosition: "strong challenger", threatLevel: "high" as const,
    },
    {
      name: "Zoho CRM", website: "zoho.com/crm",
      description: "Price-competitive CRM part of the broader Zoho suite (50+ apps). Popular in Asia, Middle East, and price-sensitive segments. Offers surprisingly deep functionality at a fraction of Salesforce pricing.",
      strengths: ["Aggressive pricing — 60-70% cheaper than Salesforce for equivalent features", "Complete suite (email, project mgmt, HR, finance) reduces vendor sprawl", "Strong in emerging markets with localized support", "Good AI assistant (Zia) at lower price tiers"],
      weaknesses: ["Brand perception as 'budget option' — hard sell to enterprise buyers", "Ecosystem and partner network is 1/10th of Salesforce's", "Complex customization requires specialized Zoho developers", "Limited presence in North American enterprise market"],
      pricing: "Standard: $14/user/mo | Professional: $23/user/mo | Enterprise: $40/user/mo | Ultimate: $52/user/mo",
      marketPosition: "niche player", threatLevel: "medium" as const,
    },
    {
      name: "Oracle CX Cloud", website: "oracle.com/cx",
      description: "Oracle's customer experience suite targeting large enterprises, especially those already on Oracle ERP/Database. Strong in data-heavy industries like telecom, utilities, and financial services.",
      strengths: ["Unmatched database and data management capabilities", "Strong in regulated industries (banking, telecom, government)", "Powerful B2B marketing automation (Eloqua)", "Deep ERP integration for quote-to-cash workflows"],
      weaknesses: ["Notoriously complex implementation — 12-24 month deployments common", "User interface feels dated compared to modern CRM platforms", "Aggressive licensing and audit practices create customer friction", "Losing mindshare among younger IT leaders"],
      pricing: "Custom enterprise pricing — typically $150-300/user/mo depending on modules",
      marketPosition: "market leader", threatLevel: "medium" as const,
    },
    {
      name: "Freshsales (Freshworks)", website: "freshworks.com/crm",
      description: "Modern, AI-powered CRM from Freshworks targeting mid-market companies. Clean interface, built-in phone and email, and Freddy AI. Growing fast in the 50-500 employee segment.",
      strengths: ["Modern UI/UX — fastest time-to-value in the market", "Built-in phone system and email tracking (no integrations needed)", "AI lead scoring (Freddy) available at lower price tiers", "Strong customer support reputation"],
      weaknesses: ["Limited enterprise features — no CPQ, weak territory management", "Smaller partner ecosystem means fewer implementation options", "Revenue and company size limit credibility with Fortune 500", "Customization options more limited than Salesforce"],
      pricing: "Growth: $9/user/mo | Pro: $39/user/mo | Enterprise: $59/user/mo",
      marketPosition: "emerging", threatLevel: "low" as const,
    },
  ],
  ourAdvantages: [
    "Market leadership and brand trust — 150,000+ customers including 90% of Fortune 500 creates unmatched social proof and reduces buyer risk",
    "Einstein AI is 2+ years ahead of competitors — predictive forecasting, generative emails, Einstein Copilot are production-ready, not beta",
    "AppExchange ecosystem with 7,000+ integrations means customers can connect virtually any tool — no competitor comes close",
    "Industry Clouds provide pre-built, compliant solutions for healthcare, financial services, manufacturing — competitors require custom builds",
    "Trailhead learning platform and massive admin/developer community (4M+ Trailblazers) reduces customer dependency on expensive consultants",
  ],
  ourVulnerabilities: [
    "Total cost of ownership is highest in the market — implementation, customization, and admin costs can 3-5x the license fee",
    "Complexity is a real barrier — median deployment takes 3-6 months vs. weeks for HubSpot/Freshsales",
    "HubSpot is winning the 'land' game with free CRM — by the time companies evaluate Salesforce, they're already on HubSpot",
    "Microsoft bundling Dynamics 365 into existing EA agreements at steep discounts is our biggest revenue threat in enterprise",
  ],
  strategicRecommendations: [
    "Launch a 'Salesforce Starter' 30-day rapid deployment package targeting HubSpot customers hitting scalability walls — intercept at the growth inflection point before they consider Dynamics",
    "Create an ROI calculator tool that quantifies the cost of staying on legacy CRM vs. migrating — make the switching cost argument before competitors do",
    "Double down on Industry Cloud positioning — every competitor is horizontal. Being the only CRM that speaks healthcare/banking/manufacturing language is a defensible moat",
    "Build co-sell partnerships with major SI firms (Accenture, Deloitte, PwC) in each target vertical — they influence 60%+ of enterprise CRM decisions",
    "Counter Microsoft's bundling strategy by publishing head-to-head comparison data on sales productivity outcomes — win on results, not price",
  ],
  marketGaps: [
    "Mid-market 'Goldilocks' segment (200-1000 employees) — too big for HubSpot, can't afford full Salesforce enterprise. A purpose-built mid-market package would dominate",
    "Vertical AI agents — no CRM offers industry-specific AI agents (e.g., an AI that understands insurance renewal workflows or manufacturing RFQ processes)",
    "Unified revenue operations — the RevOps category (aligning sales, marketing, CS data and processes) is underserved by all CRM vendors",
  ],
};

// ══════════════════════════════════════════════════════════
// SCOUT — Industry Research
// ══════════════════════════════════════════════════════════

export const DEMO_INDUSTRY = {
  overview: {
    industryName: "Customer Relationship Management (CRM)",
    marketSize: "$89.4B globally (2025)",
    growthRate: "13.9% CAGR (2025-2030)",
    maturityStage: "growth",
    summary: "The CRM market continues to be one of the largest and fastest-growing enterprise software categories, driven by AI integration, digital transformation acceleration, and the shift to unified customer data platforms. Cloud CRM now represents 87% of all CRM spending, up from 75% in 2020. The market is experiencing a structural shift from 'system of record' to 'system of intelligence' as AI capabilities become the primary differentiator. Despite market maturity in North America and Europe, emerging markets in Asia-Pacific and Latin America are driving 20%+ growth.",
  },
  trends: [
    { trend: "AI-Native CRM", impact: "Generative AI is transforming every CRM function — auto-drafting emails, predicting deal outcomes, summarizing calls, and providing real-time coaching. By 2027, 80% of CRM interactions will involve AI assistance. Vendors without production-grade AI will lose enterprise deals. This is the #1 competitive battleground.", timeframe: "short-term", relevance: "high" as const },
    { trend: "Customer Data Platforms (CDPs) Merging with CRM", impact: "The boundary between CRM and CDP is dissolving. Buyers want unified first-party data (web, mobile, in-store, support) inside their CRM, not a separate tool. Salesforce Data Cloud, Adobe CDP, and Twilio Segment are converging. CRM vendors that can't unify data will lose to those that can.", timeframe: "short-term", relevance: "high" as const },
    { trend: "Vertical / Industry-Specific CRM", impact: "Horizontal CRM is commoditizing. Growth is moving to vertical solutions (Veeva for life sciences, nCino for banking, Salesforce Industry Clouds). IDC estimates vertical CRM will grow 2.3x faster than horizontal through 2028. Companies paying for custom configurations will switch to pre-built vertical solutions.", timeframe: "medium-term", relevance: "high" as const },
    { trend: "Revenue Operations (RevOps) Consolidation", impact: "Companies are unifying sales, marketing, and customer success under a single RevOps leader and tech stack. CRM is the natural center of this consolidation. Platforms that span the full revenue cycle (lead-to-cash) will win over point solutions. Clari, Gong, and 6sense are being absorbed into CRM suites.", timeframe: "medium-term", relevance: "medium" as const },
    { trend: "Composable CRM Architecture", impact: "Large enterprises are moving from monolithic CRM to composable architectures — headless CRM with APIs, microservices, and best-of-breed integrations. This threatens traditional 'all-in-one' vendors but benefits platforms with strong API ecosystems and marketplace integrations.", timeframe: "long-term", relevance: "medium" as const },
    { trend: "Privacy-First CRM", impact: "GDPR, CCPA, and the death of third-party cookies are forcing CRM to become the central hub for first-party data and consent management. CRM platforms that handle compliance natively (consent tracking, data residency, right-to-delete) are winning regulated industry deals.", timeframe: "medium-term", relevance: "medium" as const },
  ],
  keyPlayers: [
    { name: "Salesforce", role: "Global market leader across all segments", marketShare: "~23%" },
    { name: "Microsoft Dynamics 365", role: "Strongest challenger, dominant in Microsoft-stack enterprises", marketShare: "~5.8%" },
    { name: "Oracle CX", role: "Legacy leader in telecom, utilities, financial services", marketShare: "~4.2%" },
    { name: "SAP CRM", role: "Strong in manufacturing and supply chain-heavy industries", marketShare: "~3.8%" },
    { name: "HubSpot", role: "Fastest-growing in SMB and mid-market", marketShare: "~3.1%" },
    { name: "Adobe Experience Cloud", role: "Leader in B2C marketing and commerce", marketShare: "~2.9%" },
    { name: "Zoho CRM", role: "Price leader, strong in emerging markets", marketShare: "~1.5%" },
    { name: "Freshworks", role: "Fastest-growing in mid-market, modern UI", marketShare: "~0.8%" },
  ],
  opportunities: [
    { opportunity: "AI Agent-Powered CRM", description: "Autonomous AI agents that handle entire sales workflows (research, outreach, follow-up, scheduling) are the next frontier. No vendor has production-grade autonomous sales agents yet. First mover captures the 'AI SDR' budget that's currently going to point solutions like AiSDR, Artisan, and Regie.ai.", difficulty: "hard", potentialRevenue: "$2B-8B TAM by 2028" },
    { opportunity: "Mid-Market CRM Displacement", description: "4.2M companies globally in the 200-1000 employee range are stuck between SMB tools (HubSpot, Pipedrive) and enterprise platforms (Salesforce, Dynamics). A purpose-built mid-market CRM with enterprise features at mid-market pricing would capture massive share.", difficulty: "moderate", potentialRevenue: "$12B-18B addressable market" },
    { opportunity: "Emerging Market Expansion", description: "CRM penetration in Southeast Asia, Africa, and Latin America is under 15% vs. 65%+ in North America. Local competitors are weak. First movers establishing local data centers, support teams, and partner networks will own these markets for a decade.", difficulty: "moderate", potentialRevenue: "$5B-10B by 2030" },
    { opportunity: "Unified Commerce + CRM", description: "Retailers and DTC brands want one platform for e-commerce, POS, customer data, and marketing. The Commerce Cloud + CRM integration is a unique Salesforce advantage that no pure-play CRM competitor can match.", difficulty: "easy", potentialRevenue: "$3B-5B addressable market" },
  ],
  threats: [
    { threat: "Microsoft bundling Dynamics 365 at steep discounts", severity: "high" as const, mitigation: "Compete on outcomes (pipeline velocity, win rates, forecast accuracy) not price. Publish third-party ROI studies. Target accounts where Microsoft stack is NOT dominant." },
    { threat: "HubSpot moving upmarket with Enterprise tier", severity: "high" as const, mitigation: "Launch competitive displacement programs with migration tools and guaranteed ROI. Intercept HubSpot customers at the scalability wall (500+ users, complex workflows)." },
    { threat: "AI point solutions fragmenting the CRM stack", severity: "medium" as const, mitigation: "Acquire or build native equivalents of Gong (call intelligence), Outreach (sequencing), and Clari (forecasting) — make the all-in-one value prop undeniable." },
  ],
  regulations: [
    { regulation: "EU AI Act — High-Risk AI Systems", impact: "CRM AI features used in hiring, lending, or insurance decisions may be classified as high-risk, requiring transparency, human oversight, and documentation. Compliance-ready AI features become a selling point in regulated industries.", status: "active" },
    { regulation: "GDPR / CCPA / Global Privacy Laws", impact: "CRM platforms must provide data residency, consent management, right-to-delete, and audit trails. Privacy-native CRM wins regulated industry deals. Non-compliant vendors are excluded from RFPs.", status: "active" },
    { regulation: "SEC Climate Disclosure Rules", impact: "Large companies must track and report sustainability metrics. CRM platforms that integrate ESG data (Net Zero Cloud) gain advantage in enterprise evaluations where sustainability is a procurement criterion.", status: "upcoming" },
  ],
  outlook: "The CRM market will exceed $140B by 2030, with AI-powered features accounting for 40%+ of new revenue growth. The market is bifurcating: enterprise CRM will consolidate around Salesforce, Microsoft, and Oracle, while the mid-market fragments further. The biggest disruption risk comes not from CRM competitors but from AI agent platforms that could automate the sales workflows CRM currently manages. Vendors that embed autonomous AI agents directly into CRM will define the next decade of the category. Salesforce's Einstein platform and Data Cloud position it well, but execution speed against Microsoft Copilot will determine the outcome.",
};

// ══════════════════════════════════════════════════════════
// SCOUT — Market Mapping
// ══════════════════════════════════════════════════════════

export const DEMO_MARKET = {
  totalAddressableMarket: { size: "$89.4B", description: "Global CRM software market including all deployment models (cloud, on-premise, hybrid), all segments (enterprise, mid-market, SMB), and all functional areas (sales, service, marketing, commerce)." },
  serviceableMarket: { size: "$34.2B", description: "Enterprise and upper mid-market cloud CRM (companies with 200+ employees) in North America, Europe, and Asia-Pacific — Salesforce's core addressable market excluding SMB and legacy on-premise." },
  segments: [
    { name: "Enterprise (5,000+ employees)", size: "$22.1B", growth: "11% YoY", competition: "competitive" as const, ourFit: "strong" as const, description: "Fortune 2000 companies with complex, multi-division CRM needs. Long sales cycles (6-18 months) but $500K-5M+ deal sizes. Dominated by Salesforce, Microsoft, and Oracle. Decisions driven by IT, procurement, and C-suite committees.", entryStrategy: "Lead with Industry Cloud solutions, executive sponsorship programs, and C-suite events. Leverage existing customer references in each vertical." },
    { name: "Upper Mid-Market (1,000-5,000 employees)", size: "$8.4B", growth: "16% YoY", competition: "moderate" as const, ourFit: "strong" as const, description: "Fast-growing companies that have outgrown SMB tools but aren't ready for full enterprise complexity. 3-6 month sales cycles, $100K-500K deal sizes. Most underserved segment — HubSpot too small, full Salesforce too complex.", entryStrategy: "Launch a 'Salesforce Business Edition' with pre-configured workflows, 60-day implementation guarantee, and mid-market pricing. Partner with regional SIs." },
    { name: "Lower Mid-Market (200-1,000 employees)", size: "$5.8B", growth: "19% YoY", competition: "competitive" as const, ourFit: "moderate" as const, description: "Growth-stage companies actively professionalizing their sales operations. Often first-time CRM buyers or migrating from spreadsheets/Pipedrive. Price-sensitive but willing to invest for the right ROI case. HubSpot is strongest here.", entryStrategy: "Compete on scalability narrative — 'start with what you need, grow without migrating.' Free Salesforce Starter trials with self-serve onboarding." },
    { name: "SMB (<200 employees)", size: "$12.3B", growth: "22% YoY", competition: "saturated" as const, ourFit: "weak" as const, description: "Small businesses with simple sales processes. Dominated by HubSpot (free tier), Zoho, Pipedrive, and Freshsales. Extremely price-sensitive, self-serve buying. High volume but low ARPU ($2K-15K/year).", entryStrategy: "Do not compete directly. Use Salesforce Starter as a low-touch entry point that creates a migration path as companies grow into mid-market." },
    { name: "Vertical CRM (Industry-Specific)", size: "$11.2B", growth: "24% YoY", competition: "underserved" as const, ourFit: "strong" as const, description: "Healthcare, financial services, manufacturing, government, and education sectors needing compliance-ready, industry-specific CRM. Veeva (life sciences) and nCino (banking) prove the model. Most verticals still lack purpose-built solutions.", entryStrategy: "Expand Industry Cloud portfolio. Acquire vertical CRM leaders (like Vlocity acquisition). Build ISV partnerships for niche verticals." },
    { name: "AI-Native CRM / Autonomous Sales", size: "$1.8B", growth: "68% YoY", competition: "blue ocean" as const, ourFit: "strong" as const, description: "Emerging category of AI-first platforms that automate prospecting, outreach, meeting scheduling, and pipeline management. Currently served by point solutions (AiSDR, Artisan, 11x.ai) but no major CRM has productized autonomous agents yet.", entryStrategy: "First-mover advantage. Launch Einstein AI Agents that handle end-to-end sales workflows. Acquire or partner with leading AI SDR startups to accelerate." },
  ],
  buyerPersonas: [
    { title: "Chief Revenue Officer (CRO) at Enterprise", companySize: "2,000-10,000+ employees", painPoints: ["Sales productivity flat despite headcount growth", "Forecast accuracy under 70% — board losing confidence", "5+ disconnected tools in the revenue stack", "Can't get a single view of the customer across divisions"], decisionFactors: ["Proven enterprise deployments in their industry", "AI-powered forecasting and pipeline intelligence", "Integration with existing ERP and finance systems", "Global support and professional services availability"], budget: "$500K-5M+ annually" },
    { title: "VP of Sales at Mid-Market Company", companySize: "200-2,000 employees", painPoints: ["Current CRM (HubSpot/Pipedrive) can't handle complex deal structures", "No visibility into rep activity or pipeline health", "Manual data entry killing sales productivity", "Can't enforce sales methodology across the team"], decisionFactors: ["Speed of implementation (under 90 days)", "Ease of use — reps must actually adopt it", "Mobile experience for field sales", "Total cost including implementation, not just license"], budget: "$50K-500K annually" },
    { title: "CIO / IT Director at Regulated Industry", companySize: "500-5,000 employees", painPoints: ["Current CRM doesn't meet compliance requirements (HIPAA, SOX, PCI)", "Data silos between sales, service, and marketing", "Security audit findings on customer data handling", "Integration gaps with core business systems"], decisionFactors: ["Compliance certifications (SOC 2, HIPAA, FedRAMP)", "Data residency and encryption capabilities", "API-first architecture for custom integrations", "Vendor financial stability and long-term viability"], budget: "$200K-2M annually" },
    { title: "Founder / CEO at Growth-Stage Startup", companySize: "50-200 employees", painPoints: ["No sales process — each rep does their own thing", "Lost deals because follow-ups fell through the cracks", "Board asking for pipeline metrics I can't produce", "Need a CRM before the next fundraise"], decisionFactors: ["Can be set up this week, not next quarter", "Free or low-cost to start", "Scales without requiring a dedicated admin", "Integrates with the tools we already use (Slack, Gmail, Notion)"], budget: "$5K-50K annually" },
  ],
  positioningMap: {
    axes: { x: "Price Point (Low → High)", y: "Platform Depth (Point Solution → Full Suite)" },
    players: [
      { name: "HubSpot", x: "medium" as const, y: "medium" as const },
      { name: "Microsoft Dynamics", x: "medium" as const, y: "high" as const },
      { name: "Zoho", x: "low" as const, y: "medium" as const },
      { name: "Pipedrive", x: "low" as const, y: "low" as const },
      { name: "Oracle CX", x: "high" as const, y: "high" as const },
      { name: "Freshsales", x: "low" as const, y: "low" as const },
    ],
    ourPosition: { x: "high" as const, y: "high" as const },
  },
  entryRecommendation: "Focus on 'Upper Mid-Market' and 'Vertical CRM' segments — they offer the best combination of growth rate, deal size, and competitive advantage. The upper mid-market is where HubSpot customers hit scalability walls, creating a natural migration path. Vertical CRM leverages Industry Clouds, which no competitor can match. Avoid direct SMB competition with HubSpot/Zoho on price — instead, invest in the 'grow into Salesforce' motion through Starter Suite and self-serve onboarding.",
  prioritySegments: ["Upper Mid-Market (1,000-5,000 employees)", "Vertical CRM (Industry-Specific)", "AI-Native CRM / Autonomous Sales"],
};

// ══════════════════════════════════════════════════════════
// REACH — Email Drafts (cold outreach selling Salesforce)
// ══════════════════════════════════════════════════════════

export const DEMO_EMAILS = [
  {
    to: "r.torres@medvista.com", subject: "Replacing legacy CRM without disrupting patient care",
    body: "Dr. Torres,\n\nMigrating off a 10-year-old CRM in healthcare is daunting — I won't pretend otherwise. The risk of disrupting clinical workflows during a transition is real, and it's the reason most health systems delay modernization longer than they should.\n\nThat said, MedVista's current Siebel setup is costing you in ways that compound over time: manual data entry pulling staff away from patients, siloed patient records across departments, and compliance gaps that get harder to fix with each passing audit.\n\nWe recently helped a 3,200-bed health system make this exact transition. They went live in 14 weeks without a single day of clinical downtime, and their care coordination teams are now 40% more efficient at managing patient referrals.\n\nI'd welcome a 20-minute conversation about what a phased migration could look like for MedVista — no pressure, just an honest assessment of whether it makes sense right now.\n\nBest regards,\n{senderName}",
    prospectId: "p1",
  },
  {
    to: "jwhitfield@pinnaclefg.com", subject: "When HubSpot stops scaling with your sales team",
    body: "James,\n\nThere's a specific moment when growing financial services firms realize their CRM has become the bottleneck: territory assignments get messy, forecast roll-ups require manual spreadsheet work, and compliance can't audit who accessed what.\n\nIf Pinnacle's wealth management expansion is creating any of those pressure points, it might be worth a conversation.\n\nWe work with several financial services firms that made the HubSpot-to-Salesforce transition. The typical result: forecast accuracy improves from ~65% to 90%+, and compliance teams get automated audit trails instead of quarterly fire drills.\n\nWhat does your calendar look like for a 15-minute call this week? I'm happy to share a few patterns we've seen work well for firms at your stage.\n\n{senderName}",
    prospectId: "p2",
  },
  {
    to: "l.nakamura@atlasmfg.com", subject: "Digital transformation that the factory floor actually uses",
    body: "Linda,\n\nMost digital transformation initiatives in manufacturing fail not because of the technology, but because the people closest to the customer — sales engineers, field reps, account managers — won't use tools that don't fit their workflow.\n\nI saw that Atlas recently created your VP of Digital Transformation role. That tells me the executive commitment is there, which is half the battle.\n\nThe other half is choosing tools that manufacturing teams will actually adopt. We built our Manufacturing Cloud specifically for this — it handles complex quoting, multi-stakeholder accounts, and forecast visibility across product lines without requiring reps to change how they work.\n\nA 4,500-person manufacturer in your space recently unified their customer data from SAP + spreadsheets into a single view. Their sales team's quote-to-close time dropped from 23 days to 8.\n\nWould it be useful to see how that architecture maps to Atlas's current setup?\n\n{senderName}",
    prospectId: "p3",
  },
];

// ══════════════════════════════════════════════════════════
// OPS — Invoice (pre-cached for demo)
// ══════════════════════════════════════════════════════════

export const DEMO_INVOICE = {
  items: [
    { description: "Salesforce Sales Cloud Enterprise — 50 user licenses (Annual)", quantity: 50, unitPrice: 1980.00 },
    { description: "Salesforce Service Cloud Professional — 20 user licenses (Annual)", quantity: 20, unitPrice: 960.00 },
    { description: "Einstein AI Add-on — 50 seats (Annual)", quantity: 50, unitPrice: 600.00 },
    { description: "Implementation & Configuration Services", quantity: 1, unitPrice: 45000.00 },
    { description: "Data Migration & Integration (SAP, Legacy CRM)", quantity: 1, unitPrice: 28000.00 },
    { description: "Training Program — Admin + End User (40 hours)", quantity: 1, unitPrice: 12000.00 },
  ],
};

// ══════════════════════════════════════════════════════════
// CLOSER — Sales Analysis (pre-cached)
// ══════════════════════════════════════════════════════════

export const DEMO_SALES_ANALYSIS = {
  outcome: "interested" as const,
  summary: "The prospect (Dr. Rachel Torres, CIO at MedVista Health Systems) expressed strong interest in replacing their legacy Siebel CRM with Salesforce Health Cloud. She confirmed their current system is creating compliance risks and slowing down care coordination across 12 facilities. Budget of $250-400K has been preliminarily approved by the CFO for FY2027 CRM modernization. Main concern is migration risk — she needs a detailed phased implementation plan showing zero clinical downtime. She mentioned they're also evaluating Microsoft Dynamics but are concerned about its healthcare-specific capabilities.",
  nextAction: "Send a customized phased migration proposal within 48 hours. Include the Baptist Health case study (similar size, zero-downtime migration). Schedule a technical deep-dive with her IT architecture team for next week. Prepare a Health Cloud demo environment with MedVista's actual workflows pre-configured.",
  keyInsights: [
    "Budget is pre-approved ($250-400K range) — this is a funded initiative, not exploratory",
    "Microsoft Dynamics 365 is the primary competitor — Torres is skeptical of their healthcare capabilities but likes the Microsoft integration story",
    "Clinical downtime is the #1 dealbreaker — a single hour of system downtime during migration would end the evaluation immediately",
    "The CFO is the final sign-off, not Torres — need an ROI deck specifically for the CFO within 2 weeks",
    "Compliance audit in Q2 2027 is creating urgency — they need the new system live before the audit or they face regulatory findings",
    "Torres personally prefers Salesforce but needs 'air cover' — wants customer references from health systems of similar size (2,000-5,000 beds)",
  ],
};

// ══════════════════════════════════════════════════════════
// ASSIST — Support chat responses
// ══════════════════════════════════════════════════════════

export const DEMO_SUPPORT_RESPONSES: Record<string, string> = {
  pricing: "Salesforce offers tiered pricing based on your needs:\n\n• **Starter Suite**: $25/user/month — basic CRM for small teams\n• **Professional**: $80/user/month — complete CRM for any size team\n• **Enterprise**: $165/user/month — deeply customizable CRM with advanced automation\n• **Unlimited**: $330/user/month — unlimited CRM power and support\n• **Einstein 1**: $500/user/month — best of Salesforce with embedded AI\n\nFor MedVista's scale (2,800 employees, ~70 CRM users), I'd recommend **Enterprise edition** with **Einstein AI add-on**. That puts the annual license at approximately $138,600 before implementation costs. Volume discounts of 15-25% are available for multi-year commitments.\n\nWould you like me to prepare a detailed cost breakdown comparing 3-year vs. 5-year options?",
  timeline: "Typical Salesforce implementation timelines by complexity:\n\n• **Starter/Professional** (simple setup): 2-4 weeks\n• **Enterprise** (standard configuration): 8-12 weeks\n• **Enterprise + Data Migration** (from legacy CRM): 12-16 weeks\n• **Multi-Cloud + Integration** (Sales + Service + custom): 16-24 weeks\n• **Full Digital Transformation** (org-wide rollout): 6-12 months\n\nFor MedVista's situation — migrating from Siebel, integrating with existing EHR systems, and training 70+ users — I'd estimate **14-18 weeks** for a phased rollout. Phase 1 (core Sales Cloud, 4 weeks) → Phase 2 (Health Cloud + integrations, 6 weeks) → Phase 3 (training + go-live, 4 weeks).\n\nThe key to our zero-downtime approach is running both systems in parallel during Phase 2.",
  deal: "Based on the pipeline data, here's the current status of the MedVista deal:\n\n• **Stage**: Interested — active evaluation\n• **Deal Size**: $250K-400K (budget range confirmed by CIO)\n• **Competitor**: Microsoft Dynamics 365\n• **Next Step**: Send phased migration proposal within 48 hours\n• **Key Risk**: Clinical downtime concerns\n• **Timeline**: Must be live before Q2 2027 compliance audit\n• **Decision Maker**: CFO (final sign-off), CIO (technical recommendation)\n\nRecommended actions:\n1. Prepare ROI deck for CFO review\n2. Schedule technical deep-dive with IT architecture team\n3. Arrange reference calls with similar healthcare customers",
  invoice: "No invoice has been generated yet for this prospect. Based on the deal parameters discussed, here's a preliminary estimate:\n\n• Sales Cloud Enterprise (50 users): $99,000/year\n• Service Cloud Professional (20 users): $19,200/year\n• Einstein AI (50 seats): $30,000/year\n• Implementation services: $45,000 (one-time)\n• Data migration: $28,000 (one-time)\n• Training: $12,000 (one-time)\n\n**Year 1 Total**: ~$233,200\n**Annual Recurring**: ~$148,200\n\nWould you like me to generate a formal invoice or proposal document?",
};
