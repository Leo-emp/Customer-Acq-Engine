// ── Pipeline-specific demo data: 30 emails + 30 QA results ──
// # This is ONLY used by /api/orchestrate (the pipeline route)
// # Independent agent buttons use demo-data.ts instead

import type { EmailQAResult } from "@/lib/demo-data";

// ══════════════════════════════════════════════════════════
// PIPELINE EMAILS — one personalized cold email per lead (all 30)
// # Professional, formal, respectful, consultative tone
// # Structure: greeting → context → value → soft CTA → sign-off
// ══════════════════════════════════════════════════════════

export const DEMO_PIPELINE_EMAILS = [
  // ── p1: MedVista Health Systems ──
  {
    to: "r.torres@medvista.com", subject: "CRM Modernisation for Healthcare: A Phased Approach",
    body: `Dear Dr. Torres,

I hope this message finds you well. I am reaching out because we have been working with several healthcare organisations navigating CRM modernisation, and I believe MedVista Health Systems may benefit from a conversation.

Transitioning from a legacy system like Siebel in a clinical environment requires careful planning. The priority is always continuity of patient care, and any technology change must support that rather than disrupt it. We understand the challenges involved, including siloed patient records, manual data entry that takes time away from clinical staff, and compliance requirements that grow more complex with each audit cycle.

We recently supported a 3,200-bed health system through a phased migration. They completed the transition in 14 weeks with no disruption to clinical operations, and their care coordination teams have since seen a 40% improvement in referral management efficiency.

If this is something MedVista is considering, I would welcome the opportunity to have a brief conversation to understand your specific requirements and share how we might be able to help.

Kind regards,
{senderName}`,
    prospectId: "p1",
  },
  // ── p2: Pinnacle Financial Group ──
  {
    to: "jwhitfield@pinnaclefg.com", subject: "Supporting Pinnacle's Growth with Scalable Sales Infrastructure",
    body: `Dear James,

I hope you are doing well. I am writing because we work with a number of financial services firms that have experienced similar growth trajectories to Pinnacle Financial Group, and I thought it might be valuable to connect.

As wealth management firms expand, the demands on sales infrastructure often evolve faster than the tools in place. Challenges such as territory management, forecast accuracy, and compliance audit trails tend to surface as teams scale, and addressing them early can make a meaningful difference.

We have helped several financial services firms navigate this transition successfully. On average, our clients have seen forecast accuracy improve from approximately 65% to over 90%, alongside fully automated compliance audit trails.

If Pinnacle is evaluating its current sales technology, I would be happy to share some of the approaches that have worked well for firms at a similar stage. Please let me know if a brief call would be of interest.

Kind regards,
{senderName}`,
    prospectId: "p2",
  },
  // ── p3: Atlas Manufacturing Co. ──
  {
    to: "l.nakamura@atlasmfg.com", subject: "Digital Transformation Tools Designed for Manufacturing Teams",
    body: `Dear Linda,

I hope this message finds you well. I noticed that Atlas Manufacturing recently appointed a VP of Digital Transformation, which speaks to a strong executive commitment to modernising your operations.

One of the challenges we frequently see in manufacturing is that digital tools are adopted at the executive level but underutilised on the factory floor. The most successful transformations we have supported have prioritised tools that fit naturally into existing workflows for sales engineers, field representatives, and account managers.

Our Manufacturing Cloud was built with this in mind. It supports complex quoting, multi-stakeholder account management, and cross-product-line forecast visibility without requiring teams to fundamentally change how they work. A 4,500-person manufacturer recently unified their customer data from SAP and spreadsheets into a single view, reducing their quote-to-close time from 23 days to 8.

I would be glad to discuss how this approach might align with Atlas's digital transformation objectives. Please let me know if you would be open to a brief conversation.

Kind regards,
{senderName}`,
    prospectId: "p3",
  },
  // ── p4: Velocity Retail Group ──
  {
    to: "carlos.mendez@velocityretail.com", subject: "Unified Customer Data Across In-Store and Digital Channels",
    body: `Dear Carlos,

I hope you are well. I came across your recent panel at NRF on bridging the gap between in-store and online customer data, and I found your perspective on omnichannel personalisation very insightful.

With 120+ locations and a growing direct-to-consumer channel, Velocity Retail Group is generating valuable customer signals across multiple touchpoints. The opportunity lies in connecting these signals into a unified customer profile that your teams can act on in real time, whether a customer is browsing online, purchasing in-store, or contacting support.

We have helped retailers achieve this with Commerce Cloud and Data Cloud. One client with 95 locations saw a 28% increase in cross-channel revenue within six months of unifying their customer data.

If this aligns with Velocity's omnichannel strategy, I would welcome the opportunity to discuss how the architecture could support your goals.

Kind regards,
{senderName}`,
    prospectId: "p4",
  },
  // ── p5: NovaCare Pharmaceuticals ──
  {
    to: "h.larsen@novacarepharma.com", subject: "Compliance-First CRM for Healthcare Professional Engagement",
    body: `Dear Dr. Larsen,

I hope this message finds you well. I am reaching out because we work with pharmaceutical companies that manage complex healthcare professional relationships at scale, and I believe NovaCare's requirements may align with our capabilities.

Managing 400+ HCP relationships across multiple therapeutic areas requires a system that provides robust compliance documentation as a foundational capability, not an afterthought. Our Life Sciences Cloud was built specifically for this purpose, with pre-configured HCP engagement tracking, sample management, and automated compliance documentation that meets FDA and EMA audit requirements.

A pharmaceutical company with a comparable portfolio size reduced their audit preparation time from six weeks to three days after implementing our solution.

If NovaCare is evaluating how to strengthen its compliance infrastructure while improving HCP engagement, I would be happy to share the case study and discuss how our approach might be relevant to your needs.

Kind regards,
{senderName}`,
    prospectId: "p5",
  },
  // ── p6: Apex Logistics International ──
  {
    to: "m.santos@apexlogistics.com", subject: "Unifying Customer Data Across Regional Operations",
    body: `Dear Maria,

I hope you are doing well. I understand that Apex Logistics is working toward consolidating customer data across 12 regional offices, and I wanted to share how we have helped logistics companies navigate similar initiatives.

The challenge of aligning multiple regional offices on a single platform goes beyond technology. It requires a solution flexible enough to accommodate regional differences while providing headquarters with a unified, reliable view of the customer relationship across the organisation.

We recently helped a global logistics firm consolidate 8 systems into one CRM. Their customer response time decreased by 45%, and leadership gained accurate pipeline visibility across all regions for the first time.

If this is relevant to Apex's current priorities, I would be glad to discuss how the integration architecture could work with your existing technology stack.

Kind regards,
{senderName}`,
    prospectId: "p6",
  },
  // ── p7: Stratos Cloud Solutions ──
  {
    to: "priya@stratoscloud.io", subject: "Scaling Sales Operations Post-Series B",
    body: `Dear Priya,

Congratulations on Stratos Cloud Solutions' recent Series B. That is an exciting milestone, and I wish you and the team continued success.

As you scale your sales team from 12 to 40 representatives, you may find that the demands on your CRM and sales processes evolve significantly. Territory management, lead routing, onboarding new hires efficiently, and maintaining forecast accuracy all become more complex at this stage.

We have supported several post-Series B SaaS companies through this transition. On average, our clients have experienced 35% faster ramp time for new representatives and 28% more accurate forecasting within the first quarter.

If Stratos is evaluating its sales infrastructure as part of this growth phase, I would be happy to share some approaches that have worked well for companies at a similar stage.

Kind regards,
{senderName}`,
    prospectId: "p7",
  },
  // ── p8: Citadel Property Management ──
  {
    to: "r.chen@citadelproperty.com", subject: "Centralised Tenant Relationship Management at Scale",
    body: `Dear Robert,

I hope this message finds you well. I am reaching out because we work with property management firms that manage large portfolios, and I believe Citadel's scale of 15,000 units across 8 states presents opportunities where a centralised CRM could add meaningful value.

At this portfolio size, managing tenant relationships, lease renewals, and maintenance requests across regions requires systems that ensure nothing is overlooked. A missed renewal or misrouted request can have a direct impact on occupancy and revenue.

We have helped a property management company with 12,000 units centralise their tenant operations, resulting in an 18% reduction in tenant churn. The primary driver was improved visibility and automated follow-up workflows that prevented items from falling through the cracks.

If Citadel is evaluating how to professionalise these workflows as you continue to grow, I would welcome a brief conversation to understand your requirements.

Kind regards,
{senderName}`,
    prospectId: "p8",
  },
  // ── p9: BlueWave Telecommunications ──
  {
    to: "k.mitchell@bluewavetelecom.com", subject: "CRM Purpose-Built for Telecommunications Deal Structures",
    body: `Dear Karen,

I hope you are well. I am reaching out because telecommunications sales present unique complexities that most general-purpose CRM platforms were not designed to handle, and I believe our Communications Cloud may be of interest to BlueWave.

Multi-year contracts, usage-based billing, bundled service packages, and enterprise accounts with multiple stakeholders all require specialised deal management capabilities. When the CRM cannot accommodate these structures natively, sales teams are often forced to work around the tool rather than with it.

Our Communications Cloud was built specifically for telecommunications companies, supporting contract lifecycle management, usage-based pricing models, and account hierarchies that reflect how telecom customers actually purchase. One telecommunications provider reduced their deal cycle by 30% by eliminating manual workarounds.

If BlueWave is evaluating its current sales technology, I would be glad to discuss how Communications Cloud handles your specific deal structures.

Kind regards,
{senderName}`,
    prospectId: "p9",
  },
  // ── p10: GreenEdge Energy ──
  {
    to: "t.blackwell@greenedge-energy.com", subject: "Managing Complex, Multi-Stakeholder Energy Sales Cycles",
    body: `Dear Tom,

I hope this message finds you well. I am writing because renewable energy sales involve some of the most complex deal cycles in B2B, and we have developed solutions specifically to support them.

When deal cycles run 6 to 18 months and involve municipal boards, utility companies, and environmental agencies, it is essential to have a system that tracks every stakeholder interaction and keeps the entire team aligned on deal progress.

We help energy companies map decision-makers across multi-phase projects, automate follow-up cadences, and provide leadership with clear visibility into where each opportunity truly stands. A clean technology company with comparable sales cycles increased their win rate by 22% through improved stakeholder tracking.

If GreenEdge is looking to strengthen its deal management capabilities, I would welcome the opportunity to discuss how our approach might support your sales process.

Kind regards,
{senderName}`,
    prospectId: "p10",
  },
  // ── p11: Summit Education Group ──
  {
    to: "a.foster@summitedu.org", subject: "Unified Student Lifecycle Management Across Institutions",
    body: `Dear Dr. Foster,

I hope you are doing well. I am reaching out because we have worked with education groups managing enrolment across multiple systems, and I believe Summit Education Group's scale of 45,000 students may present an opportunity to improve operational efficiency.

When student data is distributed across four disconnected systems, teams inevitably spend more time reconciling information than engaging with prospective students and families. Our Education Cloud provides unified student lifecycle management from initial enquiry through enrolment, retention, and alumni engagement.

A university group with 30,000 students consolidated three enrolment systems and saw a 25% increase in enrolment conversion rates within two semesters, primarily because automated follow-ups ensured no prospective student was overlooked.

If Summit is evaluating how to unify its student engagement infrastructure, I would be happy to arrange a brief walkthrough of Education Cloud.

Kind regards,
{senderName}`,
    prospectId: "p11",
  },
  // ── p12: Ironclad Defense Systems ──
  {
    to: "m.davidson@ironcladdefense.com", subject: "FedRAMP High Authorised CRM for Defence Contractors",
    body: `Dear Col. Davidson,

I hope this message finds you well. I am reaching out because defence contractors face compliance requirements that most CRM platforms cannot meet, and our Government Cloud was built specifically to address this.

FedRAMP, ITAR, and DFARS compliance must be satisfied before any platform discussion can proceed. Our Government Cloud is FedRAMP High authorised, operates on dedicated infrastructure, and is currently used by defence contractors managing programmes from $10M to $10B.

A defence firm of comparable size migrated from a legacy database to Government Cloud in 10 weeks and successfully passed their DCMA audit on the first attempt.

If Ironclad is considering modernising its customer and contract management systems, I would be glad to discuss how Government Cloud aligns with your compliance requirements.

Kind regards,
{senderName}`,
    prospectId: "p12",
  },
  // ── p13: Meridian Insurance Partners ──
  {
    to: "sobrien@meridianins.com", subject: "Strengthening Client Retention and Cross-Sell at Scale",
    body: `Dear Sarah,

I hope you are well. I am writing because insurance brokerages managing 680+ client relationships face a unique challenge: maintaining the quality of client service and identifying opportunities for growth at scale.

Effective retention requires early identification of at-risk accounts, timely renewal management, and the ability to recognise cross-sell opportunities before competitors do. These are difficult to achieve consistently without purpose-built automation.

We help insurance firms implement automated renewal workflows, cross-sell scoring, and early warning systems for at-risk clients. One brokerage improved their renewal rate from 82% to 91% in the first year after implementation.

If Meridian is focused on strengthening retention and growth across its client portfolio, I would welcome the opportunity to share their approach and discuss how it might apply to your situation.

Kind regards,
{senderName}`,
    prospectId: "p13",
  },
  // ── p14: Pacific Rim Trading Co. ──
  {
    to: "d.tanaka@pacificrimtrading.com", subject: "CRM for International Trade Across 14 Countries",
    body: `Dear David,

I hope this message finds you well. International trading companies face CRM requirements that domestic solutions often cannot meet, including multi-currency pricing, time zone coordination, and regulatory differences across jurisdictions.

With Pacific Rim Trading operating across 14 countries, managing 200+ relationships on both the supplier and buyer sides requires a platform that supports multi-currency deal tracking, multilingual communication, and relationship hierarchies that accurately reflect your partner network.

A trading firm operating across 11 countries reduced their deal processing time by 35% after consolidating from three regional tools into a single global CRM.

If Pacific Rim is evaluating its customer relationship management approach, I would be happy to discuss how our platform supports international trading operations.

Kind regards,
{senderName}`,
    prospectId: "p14",
  },
  // ── p15: Beacon Hospitality Group ──
  {
    to: "s.laurent@beaconhospitality.com", subject: "Unified Guest Profiles Across Your Property Portfolio",
    body: `Dear Sophia,

I hope you are doing well. I am reaching out because guest data management across a multi-property portfolio is a challenge we frequently help hospitality groups address.

When guest information is managed separately at each of Beacon's 28 properties, a loyal guest who has stayed at multiple locations may appear as a different individual at each one. This makes it difficult to deliver the personalised experience that builds long-term loyalty and increases revenue per guest.

Our Data Cloud creates unified guest profiles across every property, channel, and touchpoint. A hotel group with 22 properties saw a 31% increase in loyalty programme engagement after unifying their guest data.

If Beacon is exploring how to improve guest data management across your portfolio, I would welcome the opportunity to discuss how we can help.

Kind regards,
{senderName}`,
    prospectId: "p15",
  },
  // ── p16: ClearPath Biotech ──
  {
    to: "y.taniguchi@clearpathbio.com", subject: "Structured Partnership Pipeline Management for Biotech",
    body: `Dear Dr. Taniguchi,

I hope this message finds you well. I am writing because managing pharmaceutical partnership pipelines requires purpose-built structure that general productivity tools were not designed to provide.

As deal complexity grows, including stage gates, milestone tracking, intellectual property considerations, and multi-party agreements, it becomes important to have a system that supports compliance and visibility throughout the partnership lifecycle.

Our Life Sciences Cloud provides partnership lifecycle management with compliance built in, milestone-based deal tracking, and automated reporting that keeps business development teams and legal counsel aligned. A biotech managing 35 active partnership conversations closed two additional deals in one quarter that had been stalled due to missed follow-ups.

If ClearPath is evaluating how to strengthen its partnership management processes, I would be glad to discuss our approach.

Kind regards,
{senderName}`,
    prospectId: "p16",
  },
  // ── p17: TrueNorth Financial Advisors ──
  {
    to: "m.brennan@truenorthfa.com", subject: "Supporting Advisor Efficiency at $2.3B AUM",
    body: `Dear Michael,

I hope you are well. Wealth advisory firms managing portfolios at TrueNorth's level often reach a point where the time advisors spend on administrative tasks begins to affect the quality of client relationships.

Our Financial Services Cloud automates the operational workflows that consume advisor time, including client onboarding, compliance documentation, portfolio review scheduling, and household-level relationship tracking. This allows advisors to dedicate more time to the activities that grow assets under management.

An RIA managing $1.8B AUM reduced their client onboarding time from three weeks to four days using our platform. I would be happy to share the details of how they achieved this.

If TrueNorth is looking to improve advisor efficiency, please let me know if a brief conversation would be of interest.

Kind regards,
{senderName}`,
    prospectId: "p17",
  },
  // ── p18: Orion Construction Group ──
  {
    to: "s.petrov@orionconstruction.com", subject: "Centralised Project and Client Management for Construction",
    body: `Dear Steve,

I hope this message finds you well. At $340M in active projects, client and subcontractor management requires systems that provide reliable visibility and prevent costly oversights.

We help construction firms centralise project pipelines, subcontractor relationships, and client communications with automated alerts for contract milestones, change orders, and billing triggers. The goal is to ensure that nothing falls through the cracks at a scale where the financial stakes are significant.

A commercial builder with $280M in active projects reduced their billing disputes by 40% after implementing our solution. I would be happy to share their approach.

If Orion is evaluating how to strengthen its project management infrastructure, please let me know if a brief conversation would be useful.

Kind regards,
{senderName}`,
    prospectId: "p18",
  },
  // ── p19: Harmony Health Plans ──
  {
    to: "l.washington@harmonyhp.com", subject: "Unified Member View for Improved Health Plan Operations",
    body: `Dear Lisa,

I hope you are doing well. Managing 400,000 members across multiple engagement tools can make it challenging to maintain a complete picture of each member's interactions and needs.

Our Health Cloud unifies member touchpoints into a single timeline, giving service representatives full context, enabling engagement teams to target with precision, and providing analytics teams with clean, reliable data.

A health plan with 350,000 members consolidated from four tools and improved their member satisfaction scores by 19 points in the first year. The primary improvement came from service representatives having complete member context during every interaction.

If Harmony is exploring how to unify member data across your engagement platforms, I would welcome the opportunity to discuss how our solution might help.

Kind regards,
{senderName}`,
    prospectId: "p19",
  },
  // ── p20: Quantum Automotive Parts ──
  {
    to: "j.morrison@quantumauto.com", subject: "CRM-Powered Dealer Management for 2,000+ Relationships",
    body: `Dear Jake,

I hope this message finds you well. Managing 2,000+ dealer relationships at Quantum's scale requires more than contact management. It requires order history visibility, territory management, pricing tier tracking, and a dealer portal that reduces support burden.

We help automotive distributors build CRM-powered dealer portals with self-service ordering, real-time inventory visibility, and automated territory assignments. One auto parts distributor with 1,800 dealers reduced their support ticket volume by 55% after launching their portal.

If Quantum is evaluating how to improve dealer management operations, I would be glad to discuss how our approach might support your needs.

Kind regards,
{senderName}`,
    prospectId: "p20",
  },
  // ── p21: Sterling Media Group ──
  {
    to: "e.richardson@sterlingmedia.com", subject: "Purpose-Built CRM for Media Sales Operations",
    body: `Dear Emma,

I hope you are well. Managing 150+ advertiser accounts requires capabilities specifically designed for media sales, including complex rate cards, multi-insertion orders, and cross-platform campaign tracking.

Our Media Cloud was built for the workflows your team manages daily: campaign-level billing, multi-platform advertising packages, renewal forecasting, and advertiser ROI reporting. A media company with 120 accounts increased their advertising revenue by 23% after implementing our solution, largely through improved renewal tracking and visibility.

If Sterling Media Group is considering its sales technology options, I would be happy to discuss how Media Cloud supports media-specific workflows.

Kind regards,
{senderName}`,
    prospectId: "p21",
  },
  // ── p22: Evergreen Senior Living ──
  {
    to: "p.flores@evergreenliving.com", subject: "Unified Resident Engagement Across 35 Communities",
    body: `Dear Patricia,

I hope this message finds you well. Senior living is fundamentally a relationship business, and delivering consistent, personalised engagement across 35 communities requires a unified approach to resident and family data.

We help senior living operators centralise resident profiles, family communications, referral tracking, and satisfaction surveys. Community directors receive a complete picture of each resident's engagement, while corporate leadership gains visibility into trends across all locations.

A senior living operator with 28 communities improved their occupancy rate by 8% after unifying their resident engagement data across properties.

If Evergreen is exploring how to strengthen resident engagement at scale, I would welcome the opportunity to discuss our approach.

Kind regards,
{senderName}`,
    prospectId: "p22",
  },
  // ── p23: Nexus Cybersecurity ──
  {
    to: "a.volkov@nexuscyber.com", subject: "Enterprise Sales Management for Cybersecurity Companies",
    body: `Dear Alex,

I hope you are doing well. Selling cybersecurity solutions to enterprise clients involves long deal cycles, multiple stakeholders across CISO, CTO, procurement, and legal teams, and complex evaluation processes that require robust tracking capabilities.

We help cybersecurity companies manage enterprise sales processes with multi-stakeholder opportunity tracking, competitive intelligence per deal, and AI-powered win probability scoring. One cybersecurity firm increased their enterprise win rate by 18% after upgrading their CRM to better support these complex sales motions.

If Nexus is evaluating its sales infrastructure for enterprise growth, I would be happy to discuss how our platform supports cybersecurity sales processes.

Kind regards,
{senderName}`,
    prospectId: "p23",
  },
  // ── p24: Continental Freight Services ──
  {
    to: "d.murphy@continentalfreight.com", subject: "Automated Pricing and Contract Management for Freight",
    body: `Dear Dan,

I hope this message finds you well. Managing pricing and contracts for 800+ shipper accounts requires precision that manual processes can make difficult to maintain consistently at scale.

We help freight companies implement CRM-powered contract management with automated rate updates, contract lifecycle tracking, and lane-based pricing that stays current. One freight company with 650 accounts automated their rate management and reduced pricing errors by 90%.

If Continental is evaluating how to improve its pricing and contract operations, I would be glad to discuss how our freight-specific CRM workflows could support your team.

Kind regards,
{senderName}`,
    prospectId: "p24",
  },
  // ── p25: Solaris Wealth Management ──
  {
    to: "c.park@solariswm.com", subject: "SEC-Compliant CRM Infrastructure for Growing RIAs",
    body: `Dear Catherine,

I hope you are well. As Solaris continues to grow, the compliance infrastructure supporting your client relationships needs to scale accordingly. SEC audit requirements around client communications, trade documentation, and suitability records become increasingly demanding as assets under management increase.

Our Financial Services Cloud provides SEC-ready compliance documentation from day one, including automated record-keeping, communication archiving, and audit-ready reports. An RIA that recently crossed the $1B AUM threshold used our platform to pass their first full SEC audit with zero findings.

If Solaris is evaluating its compliance infrastructure as part of your growth strategy, I would welcome the opportunity to discuss how we can help.

Kind regards,
{senderName}`,
    prospectId: "p25",
  },
  // ── p26: Pioneer Agriculture Tech ──
  {
    to: "b.henderson@pioneeragtech.com", subject: "Sales Infrastructure Designed to Grow with AgTech Companies",
    body: `Dear Bill,

I hope this message finds you well. Selling to farms and co-operatives involves long relationship cycles, seasonal buying patterns, and price-sensitive customers who value hands-on support. As Pioneer grows, having the right sales infrastructure in place becomes increasingly important.

Our Starter Suite provides the essentials, including lead tracking, automated follow-ups, and pipeline visibility, at an accessible price point. It is designed to scale seamlessly, so when your needs evolve, the upgrade path is straightforward.

If Pioneer is considering how to professionalise its sales operations, I would be happy to arrange a brief demonstration.

Kind regards,
{senderName}`,
    prospectId: "p26",
  },
  // ── p27: Cascade Environmental ──
  {
    to: "j.chen@cascadeenv.com", subject: "CRM for Project-Based Environmental Consulting Sales",
    body: `Dear Julia,

I hope you are doing well. Environmental consulting sales are relationship-driven and project-based, often spanning months of proposal development. This requires a CRM that supports the full business development lifecycle, from RFP response through project delivery and repeat business.

We help consulting firms manage proposal pipelines, project-linked opportunities, and multi-phase deal tracking. One environmental consulting firm increased their proposal win rate by 15% after implementing a CRM that better reflected their sales process.

If Cascade is evaluating its business development tools, I would be glad to discuss how our platform supports consulting sales workflows.

Kind regards,
{senderName}`,
    prospectId: "p27",
  },
  // ── p28: Vanguard Legal Associates ──
  {
    to: "r.osei@vanguardlegal.com", subject: "Business Development CRM for Multi-Practice Law Firms",
    body: `Dear Richard,

I hope this message finds you well. Business development in a multi-practice law firm requires capabilities that case management tools were not designed to provide, including referral source tracking, cross-practice opportunity identification, and partner-level pipeline reporting.

We help law firms implement dedicated business development CRM alongside their existing practice management systems. A firm with four practice areas increased their cross-practice referrals by 30% after implementing structured BD tracking.

If Vanguard is looking to strengthen its business development capabilities across practice areas, I would welcome the opportunity to discuss our approach.

Kind regards,
{senderName}`,
    prospectId: "p28",
  },
  // ── p29: Alpine Sports Retail ──
  {
    to: "n.kramer@alpinesports.com", subject: "Omnichannel Customer Data for Multi-Location Retail",
    body: `Dear Natasha,

I hope you are well. For a retailer with 18 locations and a growing e-commerce channel, creating a unified customer experience across touchpoints is both an opportunity and a challenge.

Our Commerce Cloud and Data Cloud create a single customer profile across every channel. In-store associates can see online browsing history, the e-commerce team can see store purchase patterns, and the marketing team can personalise campaigns across both channels.

A sports retailer with 15 stores saw a 24% increase in repeat purchase rate after unifying their customer data. If Alpine Sports is exploring omnichannel customer management, I would be happy to discuss how our solution could support your strategy.

Kind regards,
{senderName}`,
    prospectId: "p29",
  },
  // ── p30: Redwood Analytics Corp ──
  {
    to: "k.patel@redwoodanalytics.com", subject: "Professionalising Sales Operations Ahead of Series A",
    body: `Dear Kevin,

I hope this message finds you well. As Redwood Analytics prepares for its next stage of growth, having professional sales infrastructure in place can make a meaningful difference, both operationally and in how the business presents to potential investors.

Pipeline velocity, conversion rates, average deal size, and CAC payback period are metrics that investors expect to see tracked with rigour. Having these in a purpose-built system demonstrates operational maturity and provides the analytics foundation that scales with your team.

A data analytics company in a similar position professionalised their sales operations three months before their Series A, and their pipeline analytics contributed to closing a $12M round.

If Redwood is evaluating its sales infrastructure, I would be glad to discuss options that would serve both your current needs and future growth.

Kind regards,
{senderName}`,
    prospectId: "p30",
  },
];

// ══════════════════════════════════════════════════════════
// PIPELINE QA — scan results for all 30 emails
// # mix of approved, needs_personalization, and rewrite for realism
// ══════════════════════════════════════════════════════════

export const DEMO_PIPELINE_QA: EmailQAResult[] = [
  // ── Tier 1 leads (p1-p6): mostly approved, 1 needs personalization ──
  { emailIndex: 0, to: "r.torres@medvista.com", companyName: "MedVista Health Systems", verdict: "approved", confidence: 96, reason: "Professional tone with specific healthcare pain points (Siebel, compliance). Respectful CTA. Relevant case study. Appropriate formality for medical professional.", autoSent: true },
  { emailIndex: 1, to: "jwhitfield@pinnaclefg.com", companyName: "Pinnacle Financial Group", verdict: "approved", confidence: 93, reason: "Well-structured, consultative approach. Financial services compliance angle is relevant. Non-pushy CTA. Appropriate for SVP-level recipient.", autoSent: true },
  { emailIndex: 2, to: "l.nakamura@atlasmfg.com", companyName: "Atlas Manufacturing Co.", verdict: "needs_personalization", confidence: 74, reason: "Strong professional tone. Manufacturing Cloud positioning is sharp. However, does not reference Atlas's specific SAP modules or their recently announced digital transformation budget.", suggestions: ["Reference Atlas's specific SAP ERP version for integration credibility", "Mention their Q2 digital transformation budget allocation ($12M, publicly reported)", "Add a specific Atlas product line to make the quoting example concrete"] },
  { emailIndex: 3, to: "carlos.mendez@velocityretail.com", companyName: "Velocity Retail Group", verdict: "approved", confidence: 95, reason: "Excellent personalisation referencing NRF panel. Commerce Cloud + Data Cloud positioning is accurate. Professional, non-pushy tone throughout. Strong case study.", autoSent: true },
  { emailIndex: 4, to: "h.larsen@novacarepharma.com", companyName: "NovaCare Pharmaceuticals", verdict: "approved", confidence: 91, reason: "Compliance-forward approach appropriate for pharma. Life Sciences Cloud positioning is accurate. FDA/EMA audit reference demonstrates industry knowledge. Respectful tone.", autoSent: true },
  { emailIndex: 5, to: "m.santos@apexlogistics.com", companyName: "Apex Logistics International", verdict: "approved", confidence: 90, reason: "Addresses regional alignment challenge professionally. Good case study with metrics. Appropriate tone for C-suite communication.", autoSent: true },

  // ── Tier 2 leads (p7-p16): mix of approved and flagged ──
  { emailIndex: 6, to: "priya@stratoscloud.io", companyName: "Stratos Cloud Solutions", verdict: "approved", confidence: 92, reason: "Congratulatory opening is genuine and professional. Series B scaling challenges are well identified. Consultative, non-presumptuous approach.", autoSent: true },
  { emailIndex: 7, to: "r.chen@citadelproperty.com", companyName: "Citadel Property Management", verdict: "approved", confidence: 88, reason: "Portfolio scale is well contextualised. Professional framing of operational challenges. Good churn reduction metric.", autoSent: true },
  { emailIndex: 8, to: "k.mitchell@bluewavetelecom.com", companyName: "BlueWave Telecommunications", verdict: "approved", confidence: 89, reason: "Communications Cloud positioning is precise. Multi-year contract complexity is well addressed. Industry-appropriate language throughout.", autoSent: true },
  { emailIndex: 9, to: "t.blackwell@greenedge-energy.com", companyName: "GreenEdge Energy", verdict: "needs_personalization", confidence: 71, reason: "Professional framework but lacks GreenEdge-specific details. Does not mention their specific renewable energy vertical (solar, wind, etc.) or recent projects.", suggestions: ["Specify GreenEdge's energy focus area (solar/wind/battery)", "Reference a specific GreenEdge project or deal", "Add municipality-specific language for their sales context"] },
  { emailIndex: 10, to: "a.foster@summitedu.org", companyName: "Summit Education Group", verdict: "approved", confidence: 90, reason: "Education Cloud positioning is accurate. Student count personalisation is strong. Enrolment conversion metric is compelling. Professional tone for academic audience.", autoSent: true },
  { emailIndex: 11, to: "m.davidson@ironcladdefense.com", companyName: "Ironclad Defense Systems", verdict: "approved", confidence: 94, reason: "FedRAMP/ITAR/DFARS compliance opening is precisely correct for defence. Government Cloud positioning is strong. DCMA audit reference demonstrates deep industry knowledge.", autoSent: true },
  { emailIndex: 12, to: "sobrien@meridianins.com", companyName: "Meridian Insurance Partners", verdict: "approved", confidence: 87, reason: "Renewal rate focus aligns with prospect's stated priorities. Cross-sell scoring concept is relevant. Strong metric (82% to 91%). Professional, consultative tone.", autoSent: true },
  { emailIndex: 13, to: "d.tanaka@pacificrimtrading.com", companyName: "Pacific Rim Trading Co.", verdict: "approved", confidence: 85, reason: "Multi-currency and multi-country complexity is well addressed. Trading-specific language is appropriate and professional.", autoSent: true },
  { emailIndex: 14, to: "s.laurent@beaconhospitality.com", companyName: "Beacon Hospitality Group", verdict: "approved", confidence: 88, reason: "Guest data management challenge is clearly articulated. Data Cloud positioning for hospitality is accurate. Loyalty engagement metric is strong.", autoSent: true },
  { emailIndex: 15, to: "y.taniguchi@clearpathbio.com", companyName: "ClearPath Biotech", verdict: "needs_personalization", confidence: 69, reason: "Professional tone is appropriate. However, the email does not reference ClearPath's specific therapeutic areas or partnership targets.", suggestions: ["Reference ClearPath's therapeutic focus areas", "Mention their pipeline stage (preclinical, Phase I, etc.)", "Add IP management angle for biotech partnerships"] },

  // ── Tier 3 leads (p17-p25): higher flag rate, lower scores ──
  { emailIndex: 16, to: "m.brennan@truenorthfa.com", companyName: "TrueNorth Financial Advisors", verdict: "approved", confidence: 86, reason: "AUM-specific language is appropriate. Client onboarding metric is compelling. Professional, non-pushy approach throughout.", autoSent: true },
  { emailIndex: 17, to: "s.petrov@orionconstruction.com", companyName: "Orion Construction Group", verdict: "approved", confidence: 84, reason: "Dollar amount contextualisation ($340M) demonstrates research. Change order risk framing is professional. Billing dispute metric is relevant.", autoSent: true },
  { emailIndex: 18, to: "l.washington@harmonyhp.com", companyName: "Harmony Health Plans", verdict: "needs_personalization", confidence: 72, reason: "Well-structured unified member view pitch but does not reference Harmony's specific plan types or their member satisfaction goals for the year.", suggestions: ["Reference Harmony's plan types (HMO, PPO, Medicare Advantage)", "Mention their NPS or CAHPS score improvement targets", "Add state-specific regulatory context for Minnesota health plans"] },
  { emailIndex: 19, to: "j.morrison@quantumauto.com", companyName: "Quantum Automotive Parts", verdict: "approved", confidence: 83, reason: "Dealer portal angle is relevant. Self-service ordering concept is appropriate for auto parts distribution. Support ticket reduction metric is practical.", autoSent: true },
  { emailIndex: 20, to: "e.richardson@sterlingmedia.com", companyName: "Sterling Media Group", verdict: "approved", confidence: 81, reason: "Media-specific workflows (rate cards, insertion orders) demonstrate industry knowledge. Professional tone.", autoSent: true },
  { emailIndex: 21, to: "p.flores@evergreenliving.com", companyName: "Evergreen Senior Living", verdict: "approved", confidence: 82, reason: "Relationship-first framing appropriate for senior living. Occupancy rate metric is directly relevant. Respectful, consultative tone.", autoSent: true },
  { emailIndex: 22, to: "a.volkov@nexuscyber.com", companyName: "Nexus Cybersecurity", verdict: "approved", confidence: 80, reason: "Enterprise sales cycle challenges are well identified. Professional framing of CRM limitations. Win rate metric is compelling.", autoSent: true },
  { emailIndex: 23, to: "d.murphy@continentalfreight.com", companyName: "Continental Freight Services", verdict: "approved", confidence: 79, reason: "Precision and scale framing is professional. Lane-based pricing concept demonstrates freight industry knowledge.", autoSent: true },
  { emailIndex: 24, to: "c.park@solariswm.com", companyName: "Solaris Wealth Management", verdict: "approved", confidence: 84, reason: "SEC compliance angle is relevant and professionally presented. $1B AUM threshold reference is specific. Zero-findings audit result is strong evidence.", autoSent: true },

  // ── Tier 4 leads (p26-p30): more flags, lower confidence ──
  { emailIndex: 25, to: "b.henderson@pioneeragtech.com", companyName: "Pioneer Agriculture Tech", verdict: "needs_personalization", confidence: 65, reason: "Starter Suite positioning is appropriate for budget but email does not reference Pioneer's specific crop/livestock focus or their co-operative customer base.", suggestions: ["Reference Pioneer's specific AgTech product category", "Mention their seasonal sales patterns", "Add co-operative specific buying process language"] },
  { emailIndex: 26, to: "j.chen@cascadeenv.com", companyName: "Cascade Environmental", verdict: "approved", confidence: 77, reason: "Project-based sales angle is appropriate. Proposal win rate metric is relevant. Professional and respectful throughout.", autoSent: true },
  { emailIndex: 27, to: "r.osei@vanguardlegal.com", companyName: "Vanguard Legal Associates", verdict: "approved", confidence: 76, reason: "BD vs. case management CRM distinction is well articulated. Cross-practice referral metric is directly relevant.", autoSent: true },
  { emailIndex: 28, to: "n.kramer@alpinesports.com", companyName: "Alpine Sports Retail", verdict: "needs_personalization", confidence: 68, reason: "Good omnichannel framework but does not reference Alpine's specific product categories, market presence, or their e-commerce platform.", suggestions: ["Reference Alpine's specific outdoor categories (hiking, skiing, climbing)", "Mention their flagship store or expansion plans", "Specify their current e-commerce platform for integration context"] },
  { emailIndex: 29, to: "k.patel@redwoodanalytics.com", companyName: "Redwood Analytics Corp", verdict: "approved", confidence: 75, reason: "Series A preparation angle is professionally framed. Investor diligence context is appropriate. Pipeline analytics for fundraising is a valuable perspective.", autoSent: true },
];
