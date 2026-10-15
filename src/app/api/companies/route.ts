// ── Companies API: CRUD for Brand Brain profiles ──
// # Persistent storage of each company's Brand Brain data

import { NextRequest } from "next/server";
import { initDb, upsertCompany, listCompanies, getCompany } from "@/lib/db";

// # ensure tables exist on first request
let initialized = false;
async function ensureInit() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

// # GET — list all companies, or get one by ?id=xxx
export async function GET(req: NextRequest) {
  await ensureInit();

  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    // # get single company
    const company = await getCompany(id);
    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }
    // # convert DB row to frontend CompanyProfile format
    return Response.json({
      company: {
        id: company.id,
        companyName: company.company_name,
        productDescription: company.product_description,
        targetMarket: company.target_market,
        senderName: company.sender_name,
        senderEmail: company.sender_email,
        valueProposition: company.value_proposition,
        calendlyUrl: company.calendly_url,
        industry: company.industry,
        keyFeatures: JSON.parse(company.key_features || "[]"),
        pricing: company.pricing,
        tone: company.tone,
        websiteUrl: company.website_url,
      },
    });
  }

  // # list all companies
  const companies = await listCompanies();
  return Response.json({
    companies: companies.map((c) => ({
      id: c.id,
      companyName: c.company_name,
      productDescription: c.product_description,
      targetMarket: c.target_market,
      senderName: c.sender_name,
      senderEmail: c.sender_email,
      valueProposition: c.value_proposition,
      calendlyUrl: c.calendly_url,
      industry: c.industry,
      keyFeatures: JSON.parse(c.key_features || "[]"),
      pricing: c.pricing,
      tone: c.tone,
      websiteUrl: c.website_url,
    })),
  });
}

// # POST — create or update a company profile
export async function POST(req: NextRequest) {
  await ensureInit();

  const body = await req.json();

  // # validate required field
  if (!body.companyName || typeof body.companyName !== "string") {
    return Response.json({ error: "companyName is required" }, { status: 400 });
  }

  const id = await upsertCompany({
    id: body.id,
    companyName: body.companyName,
    productDescription: body.productDescription || "",
    targetMarket: body.targetMarket || "",
    senderName: body.senderName || "",
    senderEmail: body.senderEmail || "",
    valueProposition: body.valueProposition || "",
    calendlyUrl: body.calendlyUrl || "",
    industry: body.industry || "",
    keyFeatures: body.keyFeatures || [],
    pricing: body.pricing || "",
    tone: body.tone || "",
    websiteUrl: body.websiteUrl,
  });

  return Response.json({ id, success: true });
}
