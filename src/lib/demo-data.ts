// ── Pre-cached demo responses for Salesforce live hackathon demo ──
// # DEMO_MODE hardcoded to true for hackathon — uses cached responses
// # Every response is comprehensive, structured, and realistic

import type { CallRecord, Invoice } from "@/lib/types";

export const DEMO_MODE = true;

// ══════════════════════════════════════════════════════════
// BRAND BRAIN — Salesforce company profile
// ══════════════════════════════════════════════════════════

export const DEMO_BRAND_PROFILE = {
  // # core identity
  companyName: "Salesforce",
  productDescription: "The world's #1 AI-powered CRM platform. Salesforce unifies sales, service, marketing, commerce, and IT on a single platform powered by Einstein AI and Agentforce — giving every company a complete view of their customers and the tools to grow revenue, reduce costs, and increase productivity. Founded in 1999 by Marc Benioff, Salesforce pioneered cloud-based CRM and now serves 150,000+ businesses globally with $34.9B annual revenue (FY2024).",
  valueProposition: "Replace disconnected tools and manual processes with one AI-powered platform that gives your entire team a 360-degree view of every customer — increasing sales productivity by 29%, revenue by 37%, and customer satisfaction by 45% on average, while cutting IT costs by 25% through platform consolidation.",
  targetMarket: "Enterprise and mid-market B2B companies (200-10,000+ employees) across financial services, healthcare, manufacturing, retail, technology, government, and education sectors — plus growing SMB segment via Starter Suite. Primary buyers: CROs, CMOs, CIOs, and VP-level leaders evaluating CRM modernization, digital transformation, or AI adoption.",
  industry: "Enterprise SaaS / Cloud Computing / CRM / AI Platform",
  tone: "Confident, innovative, enterprise-grade but approachable — data-driven claims backed by customer success stories, ROI metrics, and Trailblazer community proof. Heavy use of aspirational language ('pioneer', 'transform', 'revolutionize') paired with hard numbers.",

  // # products & features — comprehensive
  keyFeatures: [
    "Sales Cloud — AI-powered pipeline management, forecasting, CPQ, territory planning, and revenue intelligence",
    "Service Cloud — Omnichannel support (phone, email, chat, social, self-service) with Einstein AI case routing",
    "Marketing Cloud — Personalized customer journeys, email automation, social studio, advertising, and CDP",
    "Commerce Cloud — B2B and B2C storefronts, order management, headless commerce APIs",
    "Data Cloud — Real-time customer data unification, identity resolution, and activation across all touchpoints",
    "Einstein AI — Predictive analytics, generative AI, conversational intelligence, and AI copilot across all clouds",
    "Agentforce — Autonomous AI agents that handle sales, service, marketing, and commerce tasks 24/7",
    "Platform (Lightning) — Low-code app builder, Flow automation, Apex development, Heroku runtime",
    "Slack — Team collaboration, workflows, and Huddles integrated into every Salesforce workflow",
    "MuleSoft — API integration platform connecting any system, app, or data source to Salesforce",
    "Tableau — Visual analytics, business intelligence dashboards, and AI-powered data stories",
    "AppExchange — 7,000+ pre-built integrations and apps from ISV partners",
    "Industry Clouds — Pre-built solutions for 15+ verticals (Health Cloud, Financial Services Cloud, Manufacturing Cloud, etc.)",
    "Shield — Enterprise-grade security, encryption, event monitoring, and compliance (HIPAA, GDPR, SOC2)",
    "Success Plans — Premier, Signature, and Professional Services for implementation and ongoing optimization",
  ],
  pricing: "Starter Suite: $25/user/mo | Professional: $80/user/mo | Enterprise: $165/user/mo | Unlimited: $330/user/mo | Einstein 1: $500/user/mo — All billed annually. Add-ons: Sales Engagement ($50/user), Einstein Activity Capture ($50/user), Revenue Intelligence ($75/user), CPQ ($75/user). Volume discounts at 100+ seats.",

  // # extended brand intelligence
  founded: "1999",
  headquarters: "San Francisco, CA (Salesforce Tower)",
  ceo: "Marc Benioff (Chairman & CEO)",
  employees: "~72,000 globally",
  revenue: "$34.9B (FY2024), 11% YoY growth",
  customers: "150,000+ businesses worldwide including 90% of Fortune 500",
  marketCap: "~$280B (as of 2024)",
  stockTicker: "NYSE: CRM (Dow Jones Industrial Average component)",
  competitors: "Microsoft Dynamics 365, HubSpot, Oracle CX, SAP CX, Zoho CRM, Freshworks, Pipedrive",
  marketPosition: "Undisputed global CRM market leader with ~23% market share — more than the next 4 competitors combined. #1 in Gartner Magic Quadrant for SFA, CRM Customer Engagement, and B2B Marketing Automation.",
  differentiators: [
    "Largest CRM ecosystem — AppExchange, Trailblazer community (15M+ members), and 2,000+ ISV partners",
    "Agentforce — first-to-market autonomous AI agents for enterprise CRM",
    "Multi-cloud platform — only vendor offering sales, service, marketing, commerce, and analytics unified",
    "Trust & compliance — most enterprise certifications (FedRAMP, HIPAA, SOC2, ISO 27001, PCI DSS)",
    "Hyperforce — public cloud infrastructure on AWS, Azure, and GCP for data residency requirements",
  ],
  idealCustomer: "Companies with 200-10,000+ employees ($50M-$50B+ revenue), mid-to-high tech maturity, buying triggers include CRM contract renewal, digital transformation initiative, AI/automation mandate, or new CRO/CIO hire.",
  painPoints: [
    "Disconnected sales, service, and marketing data across multiple tools",
    "No single source of truth for customer interactions and pipeline",
    "Manual processes slowing down deal cycles and response times",
    "Inability to leverage AI/ML on customer data for predictions",
    "Compliance and data sovereignty concerns with current stack",
    "Scaling customer operations without proportionally scaling headcount",
  ],
  website: "salesforce.com",
  annualEvents: "Dreamforce (180,000+ attendees), TrailblazerDX (developer conference), World Tour (20+ global cities)",
};

// ══════════════════════════════════════════════════════════
// SCOUT — Search for Leads (Apollo results)
// ══════════════════════════════════════════════════════════

export const DEMO_PROSPECTS = [
  // ── Tier 1: Excellent fit (score 90-98) ──
  { id: "p1", companyName: "MedVista Health Systems", contactName: "Dr. Rachel Torres", title: "Chief Information Officer", email: "r.torres@medvista.com", emailVerified: true, website: "https://medvista.com", industry: "Healthcare", location: "Boston, MA", employeeCount: 2800, linkedinUrl: "https://linkedin.com/in/racheltorres", fitReason: "Large healthcare system still running Siebel CRM from 2012. Recently posted RFP for CRM modernization. $4.2B annual revenue.", score: 98, status: "new" as const },
  { id: "p2", companyName: "Pinnacle Financial Group", contactName: "James Whitfield", title: "SVP of Sales Operations", email: "jwhitfield@pinnaclefg.com", emailVerified: true, website: "https://pinnaclefg.com", industry: "Financial Services", location: "Charlotte, NC", employeeCount: 1200, linkedinUrl: "https://linkedin.com/in/jameswhitfield", fitReason: "Outgrowing HubSpot as they scale wealth management division. SVP has budget authority and is actively evaluating.", score: 95, status: "new" as const },
  { id: "p3", companyName: "Atlas Manufacturing Co.", contactName: "Linda Nakamura", title: "VP of Digital Transformation", email: "l.nakamura@atlasmfg.com", emailVerified: true, website: "https://atlasmfg.com", industry: "Manufacturing", location: "Detroit, MI", employeeCount: 4500, linkedinUrl: "https://linkedin.com/in/lindanakamura", fitReason: "VP of Digital Transformation role created 6 months ago — executive commitment + budget. Using spreadsheets and SAP.", score: 93, status: "new" as const },
  { id: "p4", companyName: "Velocity Retail Group", contactName: "Carlos Mendez", title: "Chief Revenue Officer", email: "carlos.mendez@velocityretail.com", emailVerified: true, website: "https://velocityretail.com", industry: "Retail / E-Commerce", location: "Miami, FL", employeeCount: 850, linkedinUrl: "https://linkedin.com/in/carlosmendez", fitReason: "120+ stores, growing DTC. CRO spoke at NRF about unifying customer data — exact Commerce Cloud + Data Cloud use case.", score: 92, status: "new" as const },
  { id: "p5", companyName: "NovaCare Pharmaceuticals", contactName: "Dr. Henrik Larsen", title: "Head of Commercial Operations", email: "h.larsen@novacarepharma.com", emailVerified: true, website: "https://novacarepharma.com", industry: "Pharmaceuticals", location: "Philadelphia, PA", employeeCount: 3200, linkedinUrl: "https://linkedin.com/in/henriklarsen", fitReason: "Pharma company managing 400+ HCP relationships on legacy Oracle CX. Compliance team flagged CRM for audit gaps. $1.8B revenue.", score: 91, status: "new" as const },
  { id: "p6", companyName: "Apex Logistics International", contactName: "Maria Santos", title: "CTO", email: "m.santos@apexlogistics.com", emailVerified: true, website: "https://apexlogistics.com", industry: "Logistics / Supply Chain", location: "Dallas, TX", employeeCount: 5200, linkedinUrl: "https://linkedin.com/in/mariasantos", fitReason: "Global logistics firm with 12 regional offices. Customer data fragmented across 6 different systems. CTO mandated single platform.", score: 90, status: "new" as const },
  // ── Tier 2: Strong fit (score 80-89) ──
  { id: "p7", companyName: "Stratos Cloud Solutions", contactName: "Priya Sharma", title: "CEO & Founder", email: "priya@stratoscloud.io", emailVerified: true, website: "https://stratoscloud.io", industry: "Technology / SaaS", location: "San Francisco, CA", employeeCount: 180, linkedinUrl: "https://linkedin.com/in/priyasharma", fitReason: "Series B ($45M). Scaling sales from 12 to 40 reps. Using Pipedrive + spreadsheets — urgent CRM need.", score: 89, status: "new" as const },
  { id: "p8", companyName: "Citadel Property Management", contactName: "Robert Chen", title: "VP of Operations", email: "r.chen@citadelproperty.com", emailVerified: true, website: "https://citadelproperty.com", industry: "Real Estate", location: "Los Angeles, CA", employeeCount: 920, linkedinUrl: "https://linkedin.com/in/robertchen", fitReason: "Managing 15,000+ units across 8 states. Tenant relationships tracked in Excel. Recently hired VP Ops to professionalize.", score: 88, status: "new" as const },
  { id: "p9", companyName: "BlueWave Telecommunications", contactName: "Karen Mitchell", title: "Director of Enterprise Sales", email: "k.mitchell@bluewavetelecom.com", emailVerified: true, website: "https://bluewavetelecom.com", industry: "Telecommunications", location: "Atlanta, GA", employeeCount: 2100, linkedinUrl: "https://linkedin.com/in/karenmitchell", fitReason: "Telecom provider with complex B2B contracts. Current CRM can't handle multi-year deal structures or usage-based billing.", score: 87, status: "new" as const },
  { id: "p10", companyName: "GreenEdge Energy", contactName: "Tom Blackwell", title: "Director of Sales", email: "t.blackwell@greenedge-energy.com", emailVerified: true, website: "https://greenedge-energy.com", industry: "Energy / Cleantech", location: "Denver, CO", employeeCount: 320, linkedinUrl: "https://linkedin.com/in/tomblackwell", fitReason: "Renewable energy with 6-18 month B2B sales cycles. CRM can't handle multi-stakeholder deal tracking.", score: 86, status: "new" as const },
  { id: "p11", companyName: "Summit Education Group", contactName: "Dr. Amanda Foster", title: "Chief Academic Officer", email: "a.foster@summitedu.org", emailVerified: true, website: "https://summitedu.org", industry: "Education", location: "Nashville, TN", employeeCount: 1500, linkedinUrl: "https://linkedin.com/in/amandafoster", fitReason: "University group with 45,000 students. Enrollment management spread across 4 systems. Looking at Education Cloud.", score: 85, status: "new" as const },
  { id: "p12", companyName: "Ironclad Defense Systems", contactName: "Col. Mark Davidson (Ret.)", title: "VP of Business Development", email: "m.davidson@ironcladdefense.com", emailVerified: true, website: "https://ironcladdefense.com", industry: "Defense / Government", location: "Arlington, VA", employeeCount: 780, linkedinUrl: "https://linkedin.com/in/markdavidson", fitReason: "Defense contractor needing FedRAMP-compliant CRM. Currently using custom Access databases. Government Cloud is the play.", score: 84, status: "new" as const },
  { id: "p13", companyName: "Meridian Insurance Partners", contactName: "Sarah O'Brien", title: "Head of Client Experience", email: "sobrien@meridianins.com", emailVerified: true, website: "https://meridianins.com", industry: "Insurance", location: "Chicago, IL", employeeCount: 680, linkedinUrl: "https://linkedin.com/in/sarahobrien", fitReason: "Insurance brokerage losing clients to digital-first competitors. Focused on renewal rates and cross-sell.", score: 83, status: "new" as const },
  { id: "p14", companyName: "Pacific Rim Trading Co.", contactName: "David Tanaka", title: "COO", email: "d.tanaka@pacificrimtrading.com", emailVerified: true, website: "https://pacificrimtrading.com", industry: "Import / Export", location: "Seattle, WA", employeeCount: 420, linkedinUrl: "https://linkedin.com/in/davidtanaka", fitReason: "International trading firm managing 200+ supplier and buyer relationships across 14 countries. Need multi-currency CRM.", score: 82, status: "new" as const },
  { id: "p15", companyName: "Beacon Hospitality Group", contactName: "Sophia Laurent", title: "VP of Revenue Management", email: "s.laurent@beaconhospitality.com", emailVerified: true, website: "https://beaconhospitality.com", industry: "Hospitality", location: "Las Vegas, NV", employeeCount: 3800, linkedinUrl: "https://linkedin.com/in/sophialaurent", fitReason: "Hotel chain with 28 properties. Guest data siloed per property. VP Revenue wants unified guest profiles + loyalty tracking.", score: 81, status: "new" as const },
  { id: "p16", companyName: "ClearPath Biotech", contactName: "Dr. Yuki Taniguchi", title: "VP of Partnerships", email: "y.taniguchi@clearpathbio.com", emailVerified: true, website: "https://clearpathbio.com", industry: "Biotechnology", location: "Cambridge, MA", employeeCount: 290, linkedinUrl: "https://linkedin.com/in/yukitaniguchi", fitReason: "Biotech managing complex pharma partnership pipeline. Using Notion + spreadsheets. Need Life Sciences Cloud.", score: 80, status: "new" as const },
  // ── Tier 3: Good fit (score 70-79) ──
  { id: "p17", companyName: "TrueNorth Financial Advisors", contactName: "Michael Brennan", title: "Managing Director", email: "m.brennan@truenorthfa.com", emailVerified: true, website: "https://truenorthfa.com", industry: "Financial Services", location: "New York, NY", employeeCount: 150, linkedinUrl: "https://linkedin.com/in/michaelbrennan", fitReason: "Wealth advisory managing $2.3B AUM. Client relationships tracked in Wealthbox — scaling beyond it.", score: 79, status: "new" as const },
  { id: "p18", companyName: "Orion Construction Group", contactName: "Steve Petrov", title: "Director of Client Services", email: "s.petrov@orionconstruction.com", emailVerified: true, website: "https://orionconstruction.com", industry: "Construction", location: "Phoenix, AZ", employeeCount: 640, linkedinUrl: "https://linkedin.com/in/stevepetrov", fitReason: "Commercial construction firm tracking $340M in active projects. Client and subcontractor management is manual.", score: 78, status: "new" as const },
  { id: "p19", companyName: "Harmony Health Plans", contactName: "Lisa Washington", title: "SVP of Member Experience", email: "l.washington@harmonyhp.com", emailVerified: false, website: "https://harmonyhp.com", industry: "Health Insurance", location: "Minneapolis, MN", employeeCount: 1800, linkedinUrl: "https://linkedin.com/in/lisawashington", fitReason: "Health plan serving 400K members. Member experience team using 3 disconnected tools for engagement tracking.", score: 77, status: "new" as const },
  { id: "p20", companyName: "Quantum Automotive Parts", contactName: "Jake Morrison", title: "Head of B2B Sales", email: "j.morrison@quantumauto.com", emailVerified: true, website: "https://quantumauto.com", industry: "Automotive", location: "Cleveland, OH", employeeCount: 510, linkedinUrl: "https://linkedin.com/in/jakemorrison", fitReason: "Auto parts distributor with 2,000+ dealer relationships. Order management and dealer portal both need CRM backbone.", score: 76, status: "new" as const },
  { id: "p21", companyName: "Sterling Media Group", contactName: "Emma Richardson", title: "Chief Commercial Officer", email: "e.richardson@sterlingmedia.com", emailVerified: true, website: "https://sterlingmedia.com", industry: "Media / Advertising", location: "New York, NY", employeeCount: 340, linkedinUrl: "https://linkedin.com/in/emmarichardson", fitReason: "Media company managing 150+ advertiser accounts. Using Salesforce competitor (Monday CRM) — open to switching.", score: 75, status: "new" as const },
  { id: "p22", companyName: "Evergreen Senior Living", contactName: "Patricia Flores", title: "VP of Community Relations", email: "p.flores@evergreenliving.com", emailVerified: true, website: "https://evergreenliving.com", industry: "Senior Care", location: "Tampa, FL", employeeCount: 2200, linkedinUrl: "https://linkedin.com/in/patriciaflores", fitReason: "Senior living operator with 35 communities. Resident and family engagement scattered across tools.", score: 74, status: "new" as const },
  { id: "p23", companyName: "Nexus Cybersecurity", contactName: "Alex Volkov", title: "VP of Sales", email: "a.volkov@nexuscyber.com", emailVerified: true, website: "https://nexuscyber.com", industry: "Cybersecurity", location: "Austin, TX", employeeCount: 260, linkedinUrl: "https://linkedin.com/in/alexvolkov", fitReason: "Cybersecurity firm selling to enterprise. Complex deal cycles with multiple stakeholders. Outgrowing Zoho.", score: 73, status: "new" as const },
  { id: "p24", companyName: "Continental Freight Services", contactName: "Dan Murphy", title: "Director of Commercial", email: "d.murphy@continentalfreight.com", emailVerified: true, website: "https://continentalfreight.com", industry: "Transportation", location: "Memphis, TN", employeeCount: 1100, linkedinUrl: "https://linkedin.com/in/danmurphy", fitReason: "Freight company with 800+ shipper accounts. Pricing and contract management done manually in spreadsheets.", score: 72, status: "new" as const },
  { id: "p25", companyName: "Solaris Wealth Management", contactName: "Catherine Park", title: "COO", email: "c.park@solariswm.com", emailVerified: true, website: "https://solariswm.com", industry: "Financial Services", location: "San Diego, CA", employeeCount: 85, linkedinUrl: "https://linkedin.com/in/catherinepark", fitReason: "RIA managing $890M AUM. Growing fast, needs compliant CRM for SEC reporting and client lifecycle.", score: 71, status: "new" as const },
  // ── Tier 4: Moderate fit (score 60-69) ──
  { id: "p26", companyName: "Pioneer Agriculture Tech", contactName: "Bill Henderson", title: "Sales Manager", email: "b.henderson@pioneeragtech.com", emailVerified: false, website: "https://pioneeragtech.com", industry: "Agriculture", location: "Des Moines, IA", employeeCount: 190, linkedinUrl: "https://linkedin.com/in/billhenderson", fitReason: "AgTech startup selling to farms and co-ops. Basic CRM needs but growing quickly. Budget conscious.", score: 68, status: "new" as const },
  { id: "p27", companyName: "Cascade Environmental", contactName: "Julia Chen", title: "Business Development Lead", email: "j.chen@cascadeenv.com", emailVerified: true, website: "https://cascadeenv.com", industry: "Environmental Services", location: "Portland, OR", employeeCount: 145, linkedinUrl: "https://linkedin.com/in/juliachen", fitReason: "Environmental consulting firm with long project-based sales. Currently on Freshsales but needs more customization.", score: 66, status: "new" as const },
  { id: "p28", companyName: "Vanguard Legal Associates", contactName: "Richard Osei", title: "Managing Partner", email: "r.osei@vanguardlegal.com", emailVerified: true, website: "https://vanguardlegal.com", industry: "Legal Services", location: "Washington, DC", employeeCount: 95, linkedinUrl: "https://linkedin.com/in/richardosei", fitReason: "Law firm managing 300+ client relationships across 5 practice areas. Using Clio but want better business development tracking.", score: 64, status: "new" as const },
  { id: "p29", companyName: "Alpine Sports Retail", contactName: "Natasha Kramer", title: "Head of E-Commerce", email: "n.kramer@alpinesports.com", emailVerified: true, website: "https://alpinesports.com", industry: "Retail / Sports", location: "Boulder, CO", employeeCount: 220, linkedinUrl: "https://linkedin.com/in/natashakramer", fitReason: "Outdoor sports retailer with 18 stores and fast-growing online. Need unified customer view across channels.", score: 62, status: "new" as const },
  { id: "p30", companyName: "Redwood Analytics Corp", contactName: "Kevin Patel", title: "VP of Growth", email: "k.patel@redwoodanalytics.com", emailVerified: false, website: "https://redwoodanalytics.com", industry: "Data Analytics", location: "Raleigh, NC", employeeCount: 110, linkedinUrl: "https://linkedin.com/in/kevinpatel", fitReason: "Data analytics startup selling to mid-market. Using free HubSpot tier. Need to professionalize sales ops before Series A.", score: 60, status: "new" as const },
];

export const DEMO_LEAD_SUMMARY = {
  totalLeads: 30,
  verifiedEmails: 27,
  avgScore: 79,
  topIndustries: ["Healthcare", "Financial Services", "Manufacturing", "Technology / SaaS", "Retail / E-Commerce", "Telecommunications", "Energy / Cleantech", "Pharmaceuticals"],
  topLocations: ["New York, NY", "Boston, MA", "San Francisco, CA", "Dallas, TX", "Chicago, IL", "Los Angeles, CA", "Atlanta, GA", "Philadelphia, PA"],
  scoreBreakdown: { excellent: 6, good: 10, fair: 14 },
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

// # Only top 3 leads get cached cold emails (user selects top 3 in demo)
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
// REACH — Email QA Agent Results (cached)
// # Scans top 3 drafted emails → approves, flags, or requests rewrite
// ══════════════════════════════════════════════════════════

export type EmailQAVerdict = "approved" | "rewrite_copy" | "needs_personalization" | "flagged_confidential";

export interface EmailQAResult {
  emailIndex: number;          // # index in DEMO_EMAILS array
  to: string;                  // # recipient email
  companyName: string;         // # company being emailed
  verdict: EmailQAVerdict;     // # what the QA agent decided
  confidence: number;          // # 0-100 confidence score
  reason: string;              // # why this verdict
  suggestions?: string[];      // # specific fixes if not approved
  autoSent?: boolean;          // # true if approved and auto-sent
}

// # QA results for top 3 cold emails only
export const DEMO_EMAIL_QA: EmailQAResult[] = [
  {
    emailIndex: 0, to: "r.torres@medvista.com", companyName: "MedVista Health Systems",
    verdict: "approved", confidence: 96,
    reason: "Strong personalization with specific pain points (Siebel, compliance gaps). Healthcare-appropriate tone. Case study relevant to prospect's scale. Clear, low-pressure CTA.",
    autoSent: true,
  },
  {
    emailIndex: 1, to: "jwhitfield@pinnaclefg.com", companyName: "Pinnacle Financial Group",
    verdict: "approved", confidence: 93,
    reason: "Good identification of HubSpot scaling pain. Financial services compliance angle is relevant. Concise and action-oriented CTA. Appropriate formality for SVP.",
    autoSent: true,
  },
  {
    emailIndex: 2, to: "l.nakamura@atlasmfg.com", companyName: "Atlas Manufacturing Co.",
    verdict: "needs_personalization", confidence: 74,
    reason: "Excellent opening that addresses adoption risk head-on. Manufacturing Cloud positioning is sharp. However, the email doesn't reference Atlas's specific SAP modules or their recently announced digital transformation budget. Needs 1-2 more company-specific data points.",
    suggestions: [
      "Reference Atlas's specific SAP ERP version for integration credibility",
      "Mention their Q2 digital transformation budget allocation ($12M, publicly reported)",
      "Add a specific Atlas product line to make the quoting example concrete",
    ],
  },
];

// ══════════════════════════════════════════════════════════
// REACH — 4 Sent Emails (for follow-up tab — cached as "already sent")
// ══════════════════════════════════════════════════════════

export const DEMO_SENT_EMAILS = [
  { to: "r.torres@medvista.com", subject: "Replacing legacy CRM without disrupting patient care", body: "Dr. Torres,\n\nMigrating off a 10-year-old CRM in healthcare is daunting — I won't pretend otherwise. The risk of disrupting clinical workflows during a transition is real, and it's the reason most health systems delay modernization longer than they should.\n\nThat said, MedVista's current Siebel setup is costing you in ways that compound over time: manual data entry pulling staff away from patients, siloed patient records across departments, and compliance gaps that get harder to fix with each passing audit.\n\nWe recently helped a 3,200-bed health system make this exact transition. They went live in 14 weeks without a single day of clinical downtime, and their care coordination teams are now 40% more efficient at managing patient referrals.\n\nI'd welcome a 20-minute conversation about what a phased migration could look like for MedVista — no pressure, just an honest assessment of whether it makes sense right now.\n\nBest regards,\nAlex Chen", prospectId: "p1", sentAt: "2026-10-14T09:15:00Z" },
  { to: "jwhitfield@pinnaclefg.com", subject: "When HubSpot stops scaling with your sales team", body: "James,\n\nThere's a specific moment when growing financial services firms realize their CRM has become the bottleneck: territory assignments get messy, forecast roll-ups require manual spreadsheet work, and compliance can't audit who accessed what.\n\nIf Pinnacle's wealth management expansion is creating any of those pressure points, it might be worth a conversation.\n\nWe work with several financial services firms that made the HubSpot-to-Salesforce transition. The typical result: forecast accuracy improves from ~65% to 90%+, and compliance teams get automated audit trails instead of quarterly fire drills.\n\nWhat does your calendar look like for a 15-minute call this week?\n\nAlex Chen", prospectId: "p2", sentAt: "2026-10-14T09:22:00Z" },
  { to: "l.nakamura@atlasmfg.com", subject: "Digital transformation that the factory floor actually uses", body: "Linda,\n\nMost digital transformation initiatives in manufacturing fail not because of the technology, but because the people closest to the customer — sales engineers, field reps, account managers — won't use tools that don't fit their workflow.\n\nI saw that Atlas recently created your VP of Digital Transformation role. That tells me the executive commitment is there, which is half the battle.\n\nThe other half is choosing tools that manufacturing teams will actually adopt. We built our Manufacturing Cloud specifically for this — it handles complex quoting, multi-stakeholder accounts, and forecast visibility across product lines without requiring reps to change how they work.\n\nA 4,500-person manufacturer in your space recently unified their customer data from SAP + spreadsheets into a single view. Their sales team's quote-to-close time dropped from 23 days to 8.\n\nWould it be useful to see how that architecture maps to Atlas's current setup?\n\nAlex Chen", prospectId: "p3", sentAt: "2026-10-14T09:30:00Z" },
  { to: "carlos.mendez@velocityretail.com", subject: "Unifying 120 stores into one customer view", body: "Carlos,\n\nI caught your NRF panel on bridging the gap between in-store and online customer data — it's the exact challenge we help retailers solve.\n\nWith 120+ locations and a growing DTC channel, Velocity is generating customer signals from everywhere: POS, e-commerce, loyalty programs, social. The problem isn't the data — it's that it lives in silos that make personalization nearly impossible.\n\nCommerce Cloud + Data Cloud gives you a single customer profile that updates in real time, whether someone browses online, buys in-store, or calls your support team. One of our retail clients with 95 locations saw a 28% lift in cross-channel revenue within 6 months of unifying their data.\n\nWorth a 20-minute call to see if the architecture fits your omnichannel roadmap?\n\nAlex Chen", prospectId: "p4", sentAt: "2026-10-14T09:38:00Z" },
];

// ══════════════════════════════════════════════════════════
// REACH — Follow-Up Emails (cached for the 4 sent emails)
// ══════════════════════════════════════════════════════════

export const DEMO_FOLLOWUP_EMAILS = [
  { to: "r.torres@medvista.com", subject: "Re: Replacing legacy CRM without disrupting patient care", body: "Dr. Torres,\n\nI wanted to follow up on my note from earlier this week. I understand how busy things get managing patient care workflows alongside technology decisions.\n\nSince we last connected, we published a new case study from a health system similar to MedVista — they consolidated 4 disconnected patient data systems into Health Cloud and saw a 34% increase in care coordination efficiency within the first quarter, while maintaining full HIPAA compliance throughout the migration.\n\nI also pulled together a brief comparison of Siebel vs. Health Cloud specifically for multi-facility health systems — happy to send it over if it would be useful context for your evaluation.\n\nWould 15 minutes this week work to discuss whether a phased approach makes sense for MedVista's timeline?\n\nBest regards,\nAlex Chen", prospectId: "p1" },
  { to: "jwhitfield@pinnaclefg.com", subject: "Re: When HubSpot stops scaling with your sales team", body: "James,\n\nQuick follow-up — I came across Pinnacle's recent announcement about expanding your wealth management division to 3 new markets. Congratulations on the growth.\n\nThat kind of expansion is exactly when CRM scaling issues become visible. I put together a one-page comparison of HubSpot vs. Salesforce Financial Services Cloud specifically for wealth management firms in growth mode — covers territory management, compliance automation, and client portfolio analytics.\n\nHappy to share it over a 15-minute call, or I can just email it directly if you prefer async.\n\nBest,\nAlex Chen", prospectId: "p2" },
  { to: "l.nakamura@atlasmfg.com", subject: "Re: Digital transformation that the factory floor actually uses", body: "Linda,\n\nFollowing up on my earlier note about Manufacturing Cloud for Atlas. I know evaluating new platforms while rolling out a digital transformation strategy is a lot of concurrent workstreams.\n\nOne thing I wanted to highlight: we recently released a new integration accelerator for SAP ERP ↔ Salesforce that cuts implementation time by ~40%. Given Atlas's current SAP footprint, this could significantly reduce the complexity of bringing customer data into one view.\n\nI can walk through the integration architecture in 20 minutes — practical, not theoretical. Would that be worth your time this week?\n\nBest,\nAlex Chen", prospectId: "p3" },
  { to: "carlos.mendez@velocityretail.com", subject: "Re: Unifying 120 stores into one customer view", body: "Carlos,\n\nFollowing up from last week. I saw Velocity just announced the launch of your mobile app loyalty integration — exciting move for omnichannel.\n\nThat new loyalty data stream is actually a perfect use case for Data Cloud. Instead of that data living in yet another silo, it can feed into a unified customer profile that your in-store associates, e-commerce team, and marketing team all share.\n\nWe helped a retailer with a similar loyalty launch capture 3x more customer profiles in the first month by connecting their app data to their POS and email platforms in real time.\n\nWould a quick demo focused on the loyalty + omnichannel use case be interesting? Happy to tailor it to Velocity's stack.\n\nBest,\nAlex Chen", prospectId: "p4" },
];

// ══════════════════════════════════════════════════════════
// QA — Follow-Up Email QA Results (cached scan results for follow-ups)
// ══════════════════════════════════════════════════════════

export const DEMO_FOLLOWUP_QA: EmailQAResult[] = [
  { emailIndex: 0, to: "r.torres@medvista.com", companyName: "MedVista Health Systems", verdict: "approved", confidence: 94, reason: "Strong follow-up with new case study. Maintains healthcare-appropriate tone. Offers both a call and a document — gives prospect options. Good timing reference.", autoSent: true },
  { emailIndex: 1, to: "jwhitfield@pinnaclefg.com", companyName: "Pinnacle Financial Group", verdict: "approved", confidence: 91, reason: "Smart use of recent company news (expansion announcement). One-page comparison offer shows preparation. Async option respects executive time.", autoSent: true },
  { emailIndex: 2, to: "l.nakamura@atlasmfg.com", companyName: "Atlas Manufacturing Co.", verdict: "approved", confidence: 89, reason: "Integration accelerator angle is highly relevant. SAP-specific detail shows research. Practical focus ('not theoretical') is good for technical buyer.", autoSent: true },
  { emailIndex: 3, to: "carlos.mendez@velocityretail.com", companyName: "Velocity Retail Group", verdict: "needs_personalization", confidence: 68, reason: "References loyalty launch but doesn't mention Velocity's specific app name or download numbers. The '3x more profiles' stat needs attribution. Needs more company-specific data points to avoid sounding like a template.", suggestions: ["Reference Velocity's app by name", "Add Velocity's current loyalty program enrollment numbers", "Specify which POS system they use for integration credibility"] },
];

// ══════════════════════════════════════════════════════════
// CLOSER — Demo Call Transcript (simulated voice call with MedVista CIO)
// ══════════════════════════════════════════════════════════

export const DEMO_CALL_TRANSCRIPT = `[00:00] Alex Chen: Good morning, Dr. Torres. This is Alex Chen from Salesforce. I sent you an email earlier this week about how Health Cloud could help MedVista modernize your CRM infrastructure. Do you have a few minutes?

[00:12] Dr. Torres: Hi Alex, yes I saw your email. Actually, your timing is good — we're actively evaluating CRM options right now. Our Siebel system is becoming a real liability.

[00:24] Alex Chen: I appreciate you taking the time. Can you tell me more about what's driving the urgency? Your email mentioned compliance concerns.

[00:32] Dr. Torres: Absolutely. We have a compliance audit coming up in Q2 2027, and our current system has significant gaps in audit trails for patient data access. We're running Siebel from 2012 — it doesn't have modern access logging, and our compliance team is flagging it as a risk. Beyond that, our care coordination across 12 facilities is completely manual. Referrals get lost, follow-ups slip through the cracks.

[01:05] Alex Chen: That's a common challenge we see in health systems your size. The compliance piece is critical — with Health Cloud, every data access event is logged automatically, and you get role-based access controls that map to your clinical hierarchy. For care coordination, we can unify patient records across all 12 facilities into a single view. One of our clients, a 3,200-bed system, reduced their referral processing time by 60% after implementing Health Cloud.

[01:38] Dr. Torres: That's compelling. What does a realistic timeline look like? My biggest fear is disrupting clinical workflows during migration. We can't afford even an hour of downtime.

[01:50] Alex Chen: Completely understand — zero clinical downtime is non-negotiable. We do phased migrations where both systems run in parallel. Typically for a system your size, we're looking at 14-16 weeks. Phase 1 is core setup and data migration running alongside Siebel. Phase 2 is department-by-department cutover. Phase 3 is training and optimization. At no point does Siebel go offline until every department has been validated on Health Cloud.

[02:22] Dr. Torres: That's reassuring. What about budget? We have preliminary approval from our CFO for CRM modernization, somewhere in the $250K to $400K range for the first year.

[02:35] Alex Chen: That range is very workable. For 50 Sales Cloud Enterprise licenses and 20 Service Cloud licenses, plus Einstein AI, implementation, data migration, and training, you'd be looking at roughly $233,000 in year one. That's well within your approved budget, and it includes everything — no hidden costs.

[02:58] Dr. Torres: That's lower than I expected, honestly. We're also looking at Microsoft Dynamics 365. Their bundling with our existing Microsoft licenses makes the pricing attractive, but I'm not convinced their healthcare capabilities are mature enough.

[03:14] Alex Chen: That's a fair comparison. Dynamics is strong in the Microsoft ecosystem, but for healthcare specifically, Health Cloud was purpose-built — HIPAA compliance out of the box, clinical data models, care plan management, and patient timeline views that Dynamics requires extensive customization to replicate. We also have FedRAMP authorization and SOC 2 Type II, which matters for your compliance audit.

[03:42] Dr. Torres: You're making a strong case. Here's what I'd like as next steps: can you send me a detailed phased migration proposal? And I'd like to arrange a technical deep-dive with my IT architecture team — probably 4-5 people. Also, if you have reference customers in healthcare, specifically health systems with 2,000 to 5,000 beds, that would go a long way with my CFO.

[04:08] Alex Chen: Absolutely. I'll have the phased migration proposal to you within 48 hours. I'll also include the Baptist Health case study — they're a 2,800-bed system that did this exact migration. For the technical deep-dive, how does next Tuesday or Wednesday work for your team?

[04:25] Dr. Torres: Wednesday afternoon would be ideal. Let's say 2 PM Eastern.

[04:30] Alex Chen: Perfect, I'll send the calendar invite today. Thank you for your time, Dr. Torres. I'm confident we can make this transition smooth for MedVista.

[04:38] Dr. Torres: Thank you, Alex. Looking forward to the proposal. Goodbye.

[04:42] Alex Chen: Goodbye.`;

// ══════════════════════════════════════════════════════════
// OPS — Invoice (pre-cached for demo)
// ══════════════════════════════════════════════════════════

// # line items for MedVista deal based on call discussion
const DEMO_INVOICE_ITEMS = [
  { description: "Salesforce Sales Cloud Enterprise — 50 user licenses (Annual)", quantity: 50, unitPrice: 1980.00 },
  { description: "Salesforce Service Cloud Professional — 20 user licenses (Annual)", quantity: 20, unitPrice: 960.00 },
  { description: "Einstein AI Add-on — 50 seats (Annual)", quantity: 50, unitPrice: 600.00 },
  { description: "Implementation & Configuration Services", quantity: 1, unitPrice: 45000.00 },
  { description: "Data Migration & Integration (SAP, Legacy CRM)", quantity: 1, unitPrice: 28000.00 },
  { description: "Training Program — Admin + End User (40 hours)", quantity: 1, unitPrice: 12000.00 },
];

// # full invoice object with ID, prospect info, and computed total
export const DEMO_INVOICE_FULL: Invoice = {
  id: "INV-2026-0001",
  prospectId: "p1",
  companyName: "MedVista Health Systems",
  contactName: "Dr. Rachel Torres",
  items: DEMO_INVOICE_ITEMS,
  total: DEMO_INVOICE_ITEMS.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
  createdAt: new Date().toISOString(),
};

// # keep old export for backwards compat
export const DEMO_INVOICE = { items: DEMO_INVOICE_ITEMS };

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
// CLOSER — Call Record (structured result from transcript analysis)
// # defined after DEMO_SALES_ANALYSIS so we can reference it
// ══════════════════════════════════════════════════════════

export const DEMO_CALL_RECORD: CallRecord = {
  prospectId: "p1",
  transcript: DEMO_CALL_TRANSCRIPT,
  duration: 282,
  outcome: "interested",
  summary: DEMO_SALES_ANALYSIS.summary,
  nextAction: DEMO_SALES_ANALYSIS.nextAction,
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
