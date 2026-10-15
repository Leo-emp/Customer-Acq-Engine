// ── Pipeline-specific demo data: 30 emails + 30 QA results ──
// # This is ONLY used by /api/orchestrate (the pipeline route)
// # Independent agent buttons use demo-data.ts instead

import type { EmailQAResult } from "@/lib/demo-data";

// ══════════════════════════════════════════════════════════
// PIPELINE EMAILS — one personalized cold email per lead (all 30)
// ══════════════════════════════════════════════════════════

export const DEMO_PIPELINE_EMAILS = [
  // ── p1: MedVista Health Systems ──
  {
    to: "r.torres@medvista.com", subject: "Replacing legacy CRM without disrupting patient care",
    body: "Dr. Torres,\n\nMigrating off a 10-year-old CRM in healthcare is daunting — I won't pretend otherwise. The risk of disrupting clinical workflows during a transition is real, and it's the reason most health systems delay modernization longer than they should.\n\nThat said, MedVista's current Siebel setup is costing you in ways that compound over time: manual data entry pulling staff away from patients, siloed patient records across departments, and compliance gaps that get harder to fix with each passing audit.\n\nWe recently helped a 3,200-bed health system make this exact transition. They went live in 14 weeks without a single day of clinical downtime, and their care coordination teams are now 40% more efficient at managing patient referrals.\n\nI'd welcome a 20-minute conversation about what a phased migration could look like for MedVista — no pressure, just an honest assessment of whether it makes sense right now.\n\nBest regards,\n{senderName}",
    prospectId: "p1",
  },
  // ── p2: Pinnacle Financial Group ──
  {
    to: "jwhitfield@pinnaclefg.com", subject: "When HubSpot stops scaling with your sales team",
    body: "James,\n\nThere's a specific moment when growing financial services firms realize their CRM has become the bottleneck: territory assignments get messy, forecast roll-ups require manual spreadsheet work, and compliance can't audit who accessed what.\n\nIf Pinnacle's wealth management expansion is creating any of those pressure points, it might be worth a conversation.\n\nWe work with several financial services firms that made the HubSpot-to-Salesforce transition. The typical result: forecast accuracy improves from ~65% to 90%+, and compliance teams get automated audit trails instead of quarterly fire drills.\n\nWhat does your calendar look like for a 15-minute call this week? I'm happy to share a few patterns we've seen work well for firms at your stage.\n\n{senderName}",
    prospectId: "p2",
  },
  // ── p3: Atlas Manufacturing Co. ──
  {
    to: "l.nakamura@atlasmfg.com", subject: "Digital transformation that the factory floor actually uses",
    body: "Linda,\n\nMost digital transformation initiatives in manufacturing fail not because of the technology, but because the people closest to the customer — sales engineers, field reps, account managers — won't use tools that don't fit their workflow.\n\nI saw that Atlas recently created your VP of Digital Transformation role. That tells me the executive commitment is there, which is half the battle.\n\nThe other half is choosing tools that manufacturing teams will actually adopt. We built Manufacturing Cloud specifically for this — it handles complex quoting, multi-stakeholder accounts, and forecast visibility across product lines without requiring reps to change how they work.\n\nA 4,500-person manufacturer in your space recently unified their customer data from SAP + spreadsheets into a single view. Their sales team's quote-to-close time dropped from 23 days to 8.\n\nWould it be useful to see how that architecture maps to Atlas's current setup?\n\n{senderName}",
    prospectId: "p3",
  },
  // ── p4: Velocity Retail Group ──
  {
    to: "carlos.mendez@velocityretail.com", subject: "Unifying 120 stores into one customer view",
    body: "Carlos,\n\nI caught your NRF panel on bridging the gap between in-store and online customer data — it's the exact challenge we help retailers solve.\n\nWith 120+ locations and a growing DTC channel, Velocity is generating customer signals from everywhere: POS, e-commerce, loyalty programs, social. The problem isn't the data — it's that it lives in silos that make personalization nearly impossible.\n\nCommerce Cloud + Data Cloud gives you a single customer profile that updates in real time, whether someone browses online, buys in-store, or calls your support team. One of our retail clients with 95 locations saw a 28% lift in cross-channel revenue within 6 months of unifying their data.\n\nWorth a 20-minute call to see if the architecture fits your omnichannel roadmap?\n\n{senderName}",
    prospectId: "p4",
  },
  // ── p5: NovaCare Pharmaceuticals ──
  {
    to: "h.larsen@novacarepharma.com", subject: "Managing 400+ HCP relationships without compliance gaps",
    body: "Dr. Larsen,\n\nManaging healthcare professional relationships at scale is one of the hardest CRM challenges in pharma — every interaction has compliance implications, and legacy systems like Oracle CX weren't built for the level of audit granularity regulators now expect.\n\nWith NovaCare managing 400+ HCP relationships across multiple therapeutic areas, the stakes of a compliance gap are significant. We built Life Sciences Cloud specifically for this — pre-configured HCP engagement tracking, sample management, and automatic compliance documentation that satisfies FDA and EMA audit requirements.\n\nA pharma company with a similar portfolio size cut their audit preparation time from 6 weeks to 3 days after migrating. Happy to share that case study if useful.\n\nWould a 20-minute call work to discuss how this maps to NovaCare's compliance requirements?\n\n{senderName}",
    prospectId: "p5",
  },
  // ── p6: Apex Logistics International ──
  {
    to: "m.santos@apexlogistics.com", subject: "One platform for 12 offices and 6 data systems",
    body: "Maria,\n\nWhen a CTO mandates a single platform for customer data, the hardest part isn't the technology — it's getting 12 regional offices to align on one way of working.\n\nApex's situation — customer data fragmented across 6 systems — is a problem we've solved for logistics companies before. The key is a platform flexible enough to accommodate regional differences while giving headquarters a unified view.\n\nWe recently helped a global logistics firm consolidate 8 systems into one CRM. Their customer response time dropped 45% because reps stopped toggling between tools, and leadership finally got accurate pipeline visibility across regions.\n\nWould it be worth 20 minutes to discuss how the integration architecture could work for Apex's tech stack?\n\n{senderName}",
    prospectId: "p6",
  },
  // ── p7: Stratos Cloud Solutions ──
  {
    to: "priya@stratoscloud.io", subject: "Scaling from 12 to 40 reps without losing deals",
    body: "Priya,\n\nCongratulations on the Series B. Scaling a sales team from 12 to 40 reps is exciting — but it's also the exact moment where process gaps become deal killers. Territories overlap, follow-ups get missed, and forecasting becomes guesswork.\n\nPipedrive + spreadsheets won't survive this transition. You need a CRM that scales with you — one that handles territory management, automated lead routing, and pipeline analytics without a dedicated admin.\n\nWe've helped dozens of post-Series B SaaS companies make this transition. The average result: 35% faster ramp time for new reps and 28% more accurate forecasting within the first quarter.\n\nWould a quick call be useful to discuss what the migration from Pipedrive looks like?\n\n{senderName}",
    prospectId: "p7",
  },
  // ── p8: Citadel Property Management ──
  {
    to: "r.chen@citadelproperty.com", subject: "15,000 units deserve better than Excel",
    body: "Robert,\n\nManaging 15,000 units across 8 states is a scale where Excel becomes a liability — one missed renewal, one overlooked maintenance request, one misrouted tenant complaint can cascade into lost revenue and reputation damage.\n\nYour recent hire as VP of Operations signals a commitment to professionalizing these workflows. We help property management firms centralize tenant relationships, automate lease renewals, and give regional managers real-time portfolio visibility.\n\nA property management company with 12,000 units reduced their tenant churn by 18% after moving to a unified CRM — simply because nothing fell through the cracks anymore.\n\nWould 15 minutes be useful to discuss what this looks like for Citadel?\n\n{senderName}",
    prospectId: "p8",
  },
  // ── p9: BlueWave Telecommunications ──
  {
    to: "k.mitchell@bluewavetelecom.com", subject: "CRM built for multi-year telecom contracts",
    body: "Karen,\n\nTelecom sales are uniquely complex — multi-year contracts, usage-based billing, bundled services, and enterprise accounts with dozens of stakeholders. Most CRMs weren't designed for this.\n\nBlueWave's current system can't handle these deal structures natively, which means your team is working around the tool instead of with it. That's wasted time on every deal.\n\nWe built Communications Cloud specifically for telcos — contract lifecycle management, usage-based pricing models, and account hierarchies that mirror how telecom customers actually buy. One telco reduced their deal cycle by 30% just by eliminating manual workarounds.\n\nWould it be helpful to see how Communications Cloud handles your specific deal structures?\n\n{senderName}",
    prospectId: "p9",
  },
  // ── p10: GreenEdge Energy ──
  {
    to: "t.blackwell@greenedge-energy.com", subject: "Tracking 18-month deals across multiple stakeholders",
    body: "Tom,\n\nRenewable energy sales are a marathon, not a sprint. When deal cycles run 6-18 months and involve municipal boards, utility companies, and environmental agencies, you need a CRM that tracks every stakeholder interaction without things getting lost.\n\nMost CRMs treat deals as single-thread conversations. Energy deals aren't — they're multi-stakeholder, multi-phase projects. We help energy companies map every decision-maker, automate follow-up cadences, and give leadership real visibility into where each deal actually stands.\n\nA cleantech company with similar sales cycles increased their win rate by 22% simply by having better stakeholder tracking. Worth a conversation?\n\n{senderName}",
    prospectId: "p10",
  },
  // ── p11: Summit Education Group ──
  {
    to: "a.foster@summitedu.org", subject: "Unifying enrollment across 4 systems for 45,000 students",
    body: "Dr. Foster,\n\nManaging enrollment for 45,000 students across 4 disconnected systems means your team spends more time reconciling data than engaging with prospective students and families.\n\nEducation Cloud was built for exactly this — unified student lifecycle management from prospect inquiry through enrollment, retention, and alumni engagement. When every interaction lives in one system, your team can focus on student outcomes instead of data entry.\n\nA university group with 30,000 students consolidated 3 enrollment systems into Education Cloud and saw a 25% increase in enrollment conversion rates within two semesters — simply because follow-ups were automated and nothing fell through the cracks.\n\nWould a 20-minute walkthrough of Education Cloud be useful for your evaluation?\n\n{senderName}",
    prospectId: "p11",
  },
  // ── p12: Ironclad Defense Systems ──
  {
    to: "m.davidson@ironcladdefense.com", subject: "FedRAMP-authorized CRM for defense contractors",
    body: "Col. Davidson,\n\nDefense contractors face a unique CRM challenge: the system must meet FedRAMP, ITAR, and DFARS compliance requirements before you can even discuss features. Custom Access databases get the job done today, but they won't survive your next DCMA audit.\n\nSalesforce Government Cloud is FedRAMP High authorized, built on dedicated infrastructure, and used by defense contractors managing programs from $10M to $10B. It replaces your Access databases with proper opportunity tracking, contract management, and audit-ready compliance logs.\n\nA defense firm your size migrated from a legacy database to Government Cloud in 10 weeks and passed their DCMA audit on the first attempt.\n\nWould it be worth discussing how Government Cloud maps to Ironclad's compliance requirements?\n\n{senderName}",
    prospectId: "p12",
  },
  // ── p13: Meridian Insurance Partners ──
  {
    to: "sobrien@meridianins.com", subject: "Stopping client churn before it starts",
    body: "Sarah,\n\nInsurance brokerages lose clients for two reasons: someone else offered a better price, or the relationship wasn't managed well enough to justify the premium. The second one is preventable.\n\nMeridian's focus on renewal rates and cross-sell tells me you know this. The challenge is doing it at scale — tracking 680+ client relationships, identifying cross-sell opportunities before competitors do, and catching at-risk accounts early enough to intervene.\n\nWe help insurance firms build automated renewal workflows, cross-sell scoring, and early warning systems for at-risk clients. One brokerage improved their renewal rate from 82% to 91% in the first year. Happy to share their playbook.\n\nWould a 15-minute call be useful?\n\n{senderName}",
    prospectId: "p13",
  },
  // ── p14: Pacific Rim Trading Co. ──
  {
    to: "d.tanaka@pacificrimtrading.com", subject: "Managing 200+ relationships across 14 countries",
    body: "David,\n\nInternational trade adds layers of complexity that domestic CRMs can't handle — multi-currency pricing, time zone coordination, regulatory differences across 14 countries, and relationships that span both supplier and buyer sides.\n\nPacific Rim needs a CRM that supports multi-currency deal tracking, multilingual communication templates, and relationship hierarchies that map your actual partner network. We help trading companies centralize all of this into one view.\n\nA trading firm operating across 11 countries reduced their deal processing time by 35% after consolidating from 3 regional tools into one global CRM. Worth a conversation about how this maps to Pacific Rim's setup?\n\n{senderName}",
    prospectId: "p14",
  },
  // ── p15: Beacon Hospitality Group ──
  {
    to: "s.laurent@beaconhospitality.com", subject: "Unified guest profiles across 28 properties",
    body: "Sophia,\n\nWhen guest data is siloed per property, a loyal guest who stayed at 5 of your 28 locations looks like 5 different first-time visitors. That means missed upsell opportunities, duplicated marketing, and a loyalty experience that doesn't feel personal.\n\nData Cloud unifies guest profiles across every property, channel, and touchpoint — giving your revenue team a single view of each guest's entire relationship with Beacon. One hotel chain with 22 properties saw a 31% increase in loyalty program engagement after unifying their guest data.\n\nWould a 20-minute demo focused on hospitality guest profiles be interesting?\n\n{senderName}",
    prospectId: "p15",
  },
  // ── p16: ClearPath Biotech ──
  {
    to: "y.taniguchi@clearpathbio.com", subject: "From Notion to a partnership pipeline you can scale",
    body: "Dr. Taniguchi,\n\nManaging pharma partnership pipelines in Notion works until it doesn't — and the breaking point usually comes when deal complexity outgrows what a flexible doc tool can handle. Stage gates, milestone tracking, IP considerations, and multi-party agreements need purpose-built structure.\n\nLife Sciences Cloud was designed for exactly this — partnership lifecycle management with compliance built in, milestone-based deal tracking, and automated reporting that keeps both your BD team and legal on the same page.\n\nA biotech managing 35 active partnership conversations migrated from spreadsheets to Life Sciences Cloud and closed 2 additional deals in Q1 that had been stalled due to missed follow-ups. Worth a quick call?\n\n{senderName}",
    prospectId: "p16",
  },
  // ── p17: TrueNorth Financial Advisors ──
  {
    to: "m.brennan@truenorthfa.com", subject: "Scaling $2.3B AUM without scaling headcount",
    body: "Michael,\n\nWealth advisory firms at your AUM level face a common inflection point: client service quality starts slipping because your advisors are spending more time on administrative tasks than on client relationships.\n\nFinancial Services Cloud automates the operational overhead — client onboarding workflows, compliance documentation, portfolio review scheduling, and household-level relationship tracking. Your advisors get time back to focus on what grows AUM.\n\nAn RIA managing $1.8B AUM reduced their client onboarding time from 3 weeks to 4 days. Happy to share how they did it.\n\n{senderName}",
    prospectId: "p17",
  },
  // ── p18: Orion Construction Group ──
  {
    to: "s.petrov@orionconstruction.com", subject: "Tracking $340M in projects without spreadsheets",
    body: "Steve,\n\nAt $340M in active projects, manual client and subcontractor management isn't just inefficient — it's a risk. One missed change order, one overlooked subcontractor issue, and the margin on a $20M project evaporates.\n\nWe help construction firms centralize project pipelines, subcontractor relationships, and client communications in one system. Automated alerts for contract milestones, change orders, and billing triggers mean nothing falls through the cracks.\n\nA commercial builder with $280M in active projects reduced their billing disputes by 40% after moving off spreadsheets. Would 15 minutes be worth your time to explore this?\n\n{senderName}",
    prospectId: "p18",
  },
  // ── p19: Harmony Health Plans ──
  {
    to: "l.washington@harmonyhp.com", subject: "One member view across 3 engagement tools",
    body: "Lisa,\n\n400K members generating interactions across 3 disconnected tools means your team is making decisions with incomplete information. A member calling about a claim might have also just engaged with a wellness program and submitted a complaint — but if those live in different systems, nobody sees the full picture.\n\nHealth Cloud unifies member touchpoints into a single timeline. Your service reps see everything. Your engagement team targets with precision. And your analytics team finally has clean data.\n\nA health plan with 350K members consolidated from 4 tools and improved their member satisfaction scores by 19 points in the first year. Worth discussing?\n\n{senderName}",
    prospectId: "p19",
  },
  // ── p20: Quantum Automotive Parts ──
  {
    to: "j.morrison@quantumauto.com", subject: "A CRM backbone for 2,000+ dealer relationships",
    body: "Jake,\n\nManaging 2,000+ dealer relationships requires more than a contact list — it requires order history visibility, territory management, pricing tier tracking, and a dealer portal that actually reduces support calls instead of generating them.\n\nWe help automotive distributors build CRM-powered dealer portals with self-service ordering, real-time inventory visibility, and automated territory assignments. One auto parts distributor with 1,800 dealers reduced their support ticket volume by 55% after launching their portal.\n\nWould a demo focused on dealer management be useful for Quantum?\n\n{senderName}",
    prospectId: "p20",
  },
  // ── p21: Sterling Media Group ──
  {
    to: "e.richardson@sterlingmedia.com", subject: "Moving from Monday CRM to a platform built for media sales",
    body: "Emma,\n\nManaging 150+ advertiser accounts on Monday CRM is workable until you need complex rate cards, multi-insertion orders, and cross-platform campaign tracking. Monday is a great project tool, but it wasn't built for media sales workflows.\n\nMedia Cloud handles the complexity your team deals with daily — campaign-level billing, multi-platform ad packages, renewal forecasting, and advertiser ROI reporting. One media company with 120 accounts increased their ad revenue 23% after switching, largely from better renewal tracking.\n\nWould it be worth a 15-minute conversation about what a migration from Monday looks like?\n\n{senderName}",
    prospectId: "p21",
  },
  // ── p22: Evergreen Senior Living ──
  {
    to: "p.flores@evergreenliving.com", subject: "Resident engagement across 35 communities in one view",
    body: "Patricia,\n\nSenior living is a relationship business — families choose communities based on trust, and that trust is built through consistent, personalized engagement. When resident and family data is scattered across tools in 35 communities, consistency becomes impossible.\n\nWe help senior living operators centralize resident profiles, family communications, referral tracking, and satisfaction surveys into one platform. Your community directors get a complete picture, and corporate gets the visibility to identify trends across all locations.\n\nA senior living operator with 28 communities improved their occupancy rate by 8% after unifying their resident engagement data. Worth a conversation?\n\n{senderName}",
    prospectId: "p22",
  },
  // ── p23: Nexus Cybersecurity ──
  {
    to: "a.volkov@nexuscyber.com", subject: "Enterprise deal cycles need more than Zoho can offer",
    body: "Alex,\n\nSelling cybersecurity to enterprise means long deal cycles, multiple stakeholders (CISO, CTO, procurement, legal), and complex evaluation processes. Zoho handles simple sales fine, but when you need multi-stakeholder opportunity tracking, competitive intelligence per deal, and forecast modeling — it hits its ceiling.\n\nWe help cybersecurity companies manage enterprise-grade sales processes with deal rooms, stakeholder mapping, and AI-powered win probability scoring. One cybersecurity firm increased their enterprise win rate by 18% after migrating from Zoho.\n\nWould it be useful to compare what you'd gain from the switch?\n\n{senderName}",
    prospectId: "p23",
  },
  // ── p24: Continental Freight Services ──
  {
    to: "d.murphy@continentalfreight.com", subject: "Automating pricing and contracts for 800+ shippers",
    body: "Dan,\n\nManaging pricing and contracts for 800+ shipper accounts in spreadsheets means your team is one formula error away from margin erosion. At Continental's scale, you need automated rate management, contract lifecycle tracking, and lane-based pricing that updates dynamically.\n\nWe help freight companies replace manual spreadsheet workflows with CRM-powered contract management. One freight company with 650 accounts automated their rate updates and reduced pricing errors by 90%.\n\nWould a 15-minute call about freight-specific CRM workflows be useful?\n\n{senderName}",
    prospectId: "p24",
  },
  // ── p25: Solaris Wealth Management ──
  {
    to: "c.park@solariswm.com", subject: "SEC-compliant CRM for fast-growing RIAs",
    body: "Catherine,\n\nGrowing fast is exciting until your next SEC audit reveals that client communications, trade rationale documentation, and suitability records are scattered across email, notes apps, and spreadsheets.\n\nFinancial Services Cloud gives your team SEC-ready compliance documentation from day one — automated record-keeping, communication archiving, and audit-ready reports. As Solaris scales past $1B AUM, the compliance infrastructure needs to scale with you.\n\nAn RIA that crossed the $1B threshold used Financial Services Cloud to pass their first full SEC audit with zero findings. Worth a quick conversation?\n\n{senderName}",
    prospectId: "p25",
  },
  // ── p26: Pioneer Agriculture Tech ──
  {
    to: "b.henderson@pioneeragtech.com", subject: "CRM that grows with your AgTech sales team",
    body: "Bill,\n\nSelling to farms and co-ops means long relationship cycles, seasonal buying patterns, and price-sensitive customers who need hands-on support. As Pioneer grows, you need a CRM that handles these nuances without breaking the budget.\n\nSalesforce Starter Suite gives you the essentials — lead tracking, automated follow-ups, and pipeline visibility — at $25/user/month. It's designed to grow with you, so when you're ready for more, the upgrade path is seamless.\n\nWould a quick demo of Starter Suite make sense for where Pioneer is right now?\n\n{senderName}",
    prospectId: "p26",
  },
  // ── p27: Cascade Environmental ──
  {
    to: "j.chen@cascadeenv.com", subject: "Project-based sales need a CRM built for long cycles",
    body: "Julia,\n\nEnvironmental consulting deals aren't transactional — they're relationship-driven, project-based, and often span months of proposal development. Freshsales handles basic pipeline tracking, but when you need proposal management, project-linked opportunities, and multi-phase deal tracking, you've outgrown it.\n\nWe help consulting firms manage the full business development lifecycle — from RFP response through project delivery and repeat business. One environmental firm increased their proposal win rate by 15% after upgrading their CRM.\n\nWould a 15-minute conversation about the migration from Freshsales be useful?\n\n{senderName}",
    prospectId: "p27",
  },
  // ── p28: Vanguard Legal Associates ──
  {
    to: "r.osei@vanguardlegal.com", subject: "Business development tracking beyond what Clio offers",
    body: "Richard,\n\nClio is excellent for case management, but business development is a different discipline. Tracking referral sources across 5 practice areas, managing client relationships over multi-year engagements, and forecasting new business pipeline requires purpose-built BD tools.\n\nWe help law firms layer business development CRM alongside their practice management systems — referral tracking, client lifecycle management, cross-sell identification, and partner-level pipeline reporting.\n\nA firm with 4 practice areas increased their cross-practice referrals by 30% after implementing dedicated BD tracking. Would this be relevant for Vanguard?\n\n{senderName}",
    prospectId: "p28",
  },
  // ── p29: Alpine Sports Retail ──
  {
    to: "n.kramer@alpinesports.com", subject: "Bridging 18 stores and your e-commerce channel",
    body: "Natasha,\n\nWhen a customer browses hiking boots online, buys them in your Boulder store, and later calls about a warranty claim — do all three teams see the same customer? For most retailers with 18+ locations and growing e-commerce, the answer is no.\n\nCommerce Cloud + Data Cloud creates a unified customer profile across every touchpoint. Your in-store associates see online browsing history. Your e-commerce team sees store purchase patterns. And your marketing team can personalize across both channels.\n\nA sports retailer with 15 stores saw a 24% lift in repeat purchase rate after unifying their customer data. Would a demo focused on omnichannel retail be useful?\n\n{senderName}",
    prospectId: "p29",
  },
  // ── p30: Redwood Analytics Corp ──
  {
    to: "k.patel@redwoodanalytics.com", subject: "Professional sales ops before your Series A",
    body: "Kevin,\n\nInvestors in your Series A diligence will ask about your sales metrics: pipeline velocity, conversion rates, average deal size, and CAC payback period. If your answer is 'we use HubSpot free tier and spreadsheets,' that's a yellow flag.\n\nProfessionalizing your sales ops before fundraising shows operational maturity. Salesforce gives you the analytics, pipeline management, and forecasting that investors expect — and it scales without a migration when you 10x your team post-raise.\n\nA data analytics startup upgraded from HubSpot free 3 months before their Series A. Their investor deck included pipeline analytics that helped close a $12M round. Worth discussing?\n\n{senderName}",
    prospectId: "p30",
  },
];

// ══════════════════════════════════════════════════════════
// PIPELINE QA — scan results for all 30 emails
// # mix of approved, needs_personalization, and rewrite for realism
// ══════════════════════════════════════════════════════════

export const DEMO_PIPELINE_QA: EmailQAResult[] = [
  // ── Tier 1 leads (p1-p6): mostly approved, 1 needs personalization ──
  { emailIndex: 0, to: "r.torres@medvista.com", companyName: "MedVista Health Systems", verdict: "approved", confidence: 96, reason: "Strong personalization with specific pain points (Siebel, compliance gaps). Healthcare-appropriate tone. Relevant case study. Clear, low-pressure CTA.", autoSent: true },
  { emailIndex: 1, to: "jwhitfield@pinnaclefg.com", companyName: "Pinnacle Financial Group", verdict: "approved", confidence: 93, reason: "Good identification of HubSpot scaling pain. Financial services compliance angle is relevant. Concise and action-oriented CTA.", autoSent: true },
  { emailIndex: 2, to: "l.nakamura@atlasmfg.com", companyName: "Atlas Manufacturing Co.", verdict: "needs_personalization", confidence: 74, reason: "Strong opening but doesn't reference Atlas's specific SAP modules or their recently announced digital transformation budget.", suggestions: ["Reference Atlas's specific SAP ERP version", "Mention their Q2 digital transformation budget allocation ($12M)", "Add a specific Atlas product line to make the quoting example concrete"] },
  { emailIndex: 3, to: "carlos.mendez@velocityretail.com", companyName: "Velocity Retail Group", verdict: "approved", confidence: 95, reason: "Excellent personalization — references NRF panel by name. Commerce Cloud + Data Cloud positioning is spot-on. Strong case study with relevant metrics.", autoSent: true },
  { emailIndex: 4, to: "h.larsen@novacarepharma.com", companyName: "NovaCare Pharmaceuticals", verdict: "approved", confidence: 91, reason: "Compliance-forward approach appropriate for pharma. Life Sciences Cloud positioning is accurate. FDA/EMA audit reference shows industry knowledge.", autoSent: true },
  { emailIndex: 5, to: "m.santos@apexlogistics.com", companyName: "Apex Logistics International", verdict: "approved", confidence: 90, reason: "Addresses CTO mandate directly. Regional alignment challenge is real. Good case study with metrics. Professional tone for C-suite.", autoSent: true },

  // ── Tier 2 leads (p7-p16): mix of approved and flagged ──
  { emailIndex: 6, to: "priya@stratoscloud.io", companyName: "Stratos Cloud Solutions", verdict: "approved", confidence: 92, reason: "Congratulatory opening is genuine. Series B scaling pain is well identified. Pipedrive migration angle is practical.", autoSent: true },
  { emailIndex: 7, to: "r.chen@citadelproperty.com", companyName: "Citadel Property Management", verdict: "approved", confidence: 88, reason: "Subject line is attention-grabbing. Excel pain point is relatable. Good churn reduction metric.", autoSent: true },
  { emailIndex: 8, to: "k.mitchell@bluewavetelecom.com", companyName: "BlueWave Telecommunications", verdict: "approved", confidence: 89, reason: "Communications Cloud positioning is precise. Multi-year contract complexity is well addressed. Industry-specific language.", autoSent: true },
  { emailIndex: 9, to: "t.blackwell@greenedge-energy.com", companyName: "GreenEdge Energy", verdict: "needs_personalization", confidence: 71, reason: "Good framework but lacks GreenEdge-specific details. Doesn't mention their specific renewable energy vertical (solar, wind, etc.) or recent projects.", suggestions: ["Specify GreenEdge's energy focus area (solar/wind/battery)", "Reference a specific GreenEdge project or deal", "Add municipality-specific language for their sales context"] },
  { emailIndex: 10, to: "a.foster@summitedu.org", companyName: "Summit Education Group", verdict: "approved", confidence: 90, reason: "Education Cloud positioning is accurate. Student count personalization is good. Enrollment conversion metric is compelling.", autoSent: true },
  { emailIndex: 11, to: "m.davidson@ironcladdefense.com", companyName: "Ironclad Defense Systems", verdict: "approved", confidence: 94, reason: "FedRAMP/ITAR/DFARS compliance opening is exactly right for defense. Government Cloud positioning is strong. DCMA audit reference shows deep industry knowledge.", autoSent: true },
  { emailIndex: 12, to: "sobrien@meridianins.com", companyName: "Meridian Insurance Partners", verdict: "approved", confidence: 87, reason: "Renewal rate focus aligns with prospect's stated priorities. Cross-sell scoring concept is relevant. Good metric (82% → 91%).", autoSent: true },
  { emailIndex: 13, to: "d.tanaka@pacificrimtrading.com", companyName: "Pacific Rim Trading Co.", verdict: "approved", confidence: 85, reason: "Multi-currency and multi-country complexity is well addressed. Trading-specific language is appropriate.", autoSent: true },
  { emailIndex: 14, to: "s.laurent@beaconhospitality.com", companyName: "Beacon Hospitality Group", verdict: "approved", confidence: 88, reason: "Guest data siloing pain point is vivid. Data Cloud positioning for hospitality is accurate. Loyalty engagement metric is strong.", autoSent: true },
  { emailIndex: 15, to: "y.taniguchi@clearpathbio.com", companyName: "ClearPath Biotech", verdict: "needs_personalization", confidence: 69, reason: "Notion-to-CRM angle is good but the email doesn't reference ClearPath's specific therapeutic areas or partnership targets.", suggestions: ["Reference ClearPath's therapeutic focus areas", "Mention their pipeline stage (preclinical, Phase I, etc.)", "Add IP management angle for biotech partnerships"] },

  // ── Tier 3 leads (p17-p25): higher flag rate, lower scores ──
  { emailIndex: 16, to: "m.brennan@truenorthfa.com", companyName: "TrueNorth Financial Advisors", verdict: "approved", confidence: 86, reason: "AUM-specific language is appropriate. Wealthbox migration angle is practical. Client onboarding metric is compelling.", autoSent: true },
  { emailIndex: 17, to: "s.petrov@orionconstruction.com", companyName: "Orion Construction Group", verdict: "approved", confidence: 84, reason: "Dollar amount personalization ($340M) shows research. Change order risk framing is effective. Billing dispute metric is relevant.", autoSent: true },
  { emailIndex: 18, to: "l.washington@harmonyhp.com", companyName: "Harmony Health Plans", verdict: "needs_personalization", confidence: 72, reason: "Good unified member view pitch but doesn't reference Harmony's specific plan types or their member satisfaction goals for the year.", suggestions: ["Reference Harmony's plan types (HMO, PPO, Medicare Advantage)", "Mention their NPS or CAHPS score improvement targets", "Add state-specific regulatory context for Minnesota health plans"] },
  { emailIndex: 19, to: "j.morrison@quantumauto.com", companyName: "Quantum Automotive Parts", verdict: "approved", confidence: 83, reason: "Dealer portal angle is strong. Self-service ordering concept is relevant for auto parts distribution. Support ticket reduction metric is practical.", autoSent: true },
  { emailIndex: 20, to: "e.richardson@sterlingmedia.com", companyName: "Sterling Media Group", verdict: "approved", confidence: 81, reason: "Monday CRM migration angle is direct. Media-specific workflows (rate cards, insertion orders) show industry knowledge.", autoSent: true },
  { emailIndex: 21, to: "p.flores@evergreenliving.com", companyName: "Evergreen Senior Living", verdict: "approved", confidence: 82, reason: "Relationship-first framing appropriate for senior living. Occupancy rate metric is directly relevant to business outcomes.", autoSent: true },
  { emailIndex: 22, to: "a.volkov@nexuscyber.com", companyName: "Nexus Cybersecurity", verdict: "approved", confidence: 80, reason: "Enterprise sales cycle pain points are well identified. Zoho limitations are accurately stated. Win rate metric is compelling.", autoSent: true },
  { emailIndex: 23, to: "d.murphy@continentalfreight.com", companyName: "Continental Freight Services", verdict: "approved", confidence: 79, reason: "Spreadsheet risk framing is effective. Lane-based pricing concept shows freight industry knowledge.", autoSent: true },
  { emailIndex: 24, to: "c.park@solariswm.com", companyName: "Solaris Wealth Management", verdict: "approved", confidence: 84, reason: "SEC compliance angle is urgent and relevant. $1B AUM threshold reference is specific. Zero-findings audit result is powerful proof.", autoSent: true },

  // ── Tier 4 leads (p26-p30): more flags, lower confidence ──
  { emailIndex: 25, to: "b.henderson@pioneeragtech.com", companyName: "Pioneer Agriculture Tech", verdict: "needs_personalization", confidence: 65, reason: "Starter Suite positioning is right for budget but email doesn't reference Pioneer's specific crop/livestock focus or their co-op customer base.", suggestions: ["Reference Pioneer's specific AgTech product category", "Mention their seasonal sales patterns", "Add co-op specific buying process language"] },
  { emailIndex: 26, to: "j.chen@cascadeenv.com", companyName: "Cascade Environmental", verdict: "approved", confidence: 77, reason: "Project-based sales angle is appropriate. Freshsales limitation is accurately identified. Proposal win rate metric is relevant.", autoSent: true },
  { emailIndex: 27, to: "r.osei@vanguardlegal.com", companyName: "Vanguard Legal Associates", verdict: "approved", confidence: 76, reason: "Clio vs. BD CRM distinction is smart positioning. Cross-practice referral metric is directly relevant.", autoSent: true },
  { emailIndex: 28, to: "n.kramer@alpinesports.com", companyName: "Alpine Sports Retail", verdict: "needs_personalization", confidence: 68, reason: "Good omnichannel framework but doesn't reference Alpine's specific product categories, Boulder market, or their e-commerce platform.", suggestions: ["Reference Alpine's specific outdoor categories (hiking, skiing, climbing)", "Mention their Boulder flagship or expansion plans", "Specify their current e-commerce platform for integration context"] },
  { emailIndex: 29, to: "k.patel@redwoodanalytics.com", companyName: "Redwood Analytics Corp", verdict: "approved", confidence: 75, reason: "Series A preparation angle is motivating. Investor diligence framing creates urgency. Pipeline analytics for fundraising is a novel angle.", autoSent: true },
];
