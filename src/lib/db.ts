// ── Turso database client + schema initialization ──
// # Persistent storage for Brand Brain profiles, prospects, and emails

import { createClient, type Client } from "@libsql/client";

// # singleton Turso client
let _db: Client | null = null;

export function getDb(): Client {
  if (!_db) {
    // # connect to Turso (remote) or local SQLite file for dev
    _db = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:local.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return _db;
}

// # initialize all tables on first run
export async function initDb(): Promise<void> {
  const db = getDb();

  // # companies table — stores each user's Brand Brain profile
  await db.execute(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      company_name TEXT NOT NULL,
      product_description TEXT NOT NULL DEFAULT '',
      target_market TEXT NOT NULL DEFAULT '',
      sender_name TEXT NOT NULL DEFAULT '',
      sender_email TEXT NOT NULL DEFAULT '',
      value_proposition TEXT NOT NULL DEFAULT '',
      calendly_url TEXT NOT NULL DEFAULT '',
      industry TEXT NOT NULL DEFAULT '',
      key_features TEXT NOT NULL DEFAULT '[]',
      pricing TEXT NOT NULL DEFAULT '',
      tone TEXT NOT NULL DEFAULT '',
      website_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // # prospects table — leads found per company
  await db.execute(`
    CREATE TABLE IF NOT EXISTS prospects (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      title TEXT,
      email TEXT NOT NULL DEFAULT '',
      email_verified INTEGER NOT NULL DEFAULT 0,
      website TEXT NOT NULL DEFAULT '',
      industry TEXT NOT NULL DEFAULT '',
      location TEXT,
      employee_count INTEGER,
      linkedin_url TEXT,
      fit_reason TEXT NOT NULL DEFAULT '',
      score INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (company_id) REFERENCES companies(id)
    )
  `);

  // # emails table — drafted and sent emails
  await db.execute(`
    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      company_id TEXT NOT NULL,
      prospect_id TEXT NOT NULL,
      to_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      sent_at TEXT,
      opened_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (prospect_id) REFERENCES prospects(id)
    )
  `);

  // # call_records table — Twilio call logs
  await db.execute(`
    CREATE TABLE IF NOT EXISTS call_records (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      company_id TEXT NOT NULL,
      prospect_id TEXT NOT NULL,
      transcript TEXT NOT NULL DEFAULT '',
      duration INTEGER NOT NULL DEFAULT 0,
      outcome TEXT NOT NULL DEFAULT 'interested',
      summary TEXT NOT NULL DEFAULT '',
      next_action TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (prospect_id) REFERENCES prospects(id)
    )
  `);
}

// ── Company Profile CRUD ──

export interface DbCompany {
  id: string;
  company_name: string;
  product_description: string;
  target_market: string;
  sender_name: string;
  sender_email: string;
  value_proposition: string;
  calendly_url: string;
  industry: string;
  key_features: string;
  pricing: string;
  tone: string;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

// # save or update a company profile
export async function upsertCompany(profile: {
  id?: string;
  companyName: string;
  productDescription: string;
  targetMarket: string;
  senderName: string;
  senderEmail: string;
  valueProposition: string;
  calendlyUrl: string;
  industry: string;
  keyFeatures: string[];
  pricing: string;
  tone: string;
  websiteUrl?: string;
}): Promise<string> {
  const db = getDb();
  const id = profile.id || crypto.randomUUID().replace(/-/g, "");

  // # try update first, insert if not found
  if (profile.id) {
    await db.execute({
      sql: `UPDATE companies SET
        company_name = ?, product_description = ?, target_market = ?,
        sender_name = ?, sender_email = ?, value_proposition = ?,
        calendly_url = ?, industry = ?, key_features = ?,
        pricing = ?, tone = ?, website_url = ?, updated_at = datetime('now')
        WHERE id = ?`,
      args: [
        profile.companyName, profile.productDescription, profile.targetMarket,
        profile.senderName, profile.senderEmail, profile.valueProposition,
        profile.calendlyUrl, profile.industry, JSON.stringify(profile.keyFeatures),
        profile.pricing, profile.tone, profile.websiteUrl || null, id,
      ],
    });
    return id;
  }

  // # insert new company
  await db.execute({
    sql: `INSERT INTO companies (id, company_name, product_description, target_market,
      sender_name, sender_email, value_proposition, calendly_url, industry,
      key_features, pricing, tone, website_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, profile.companyName, profile.productDescription, profile.targetMarket,
      profile.senderName, profile.senderEmail, profile.valueProposition,
      profile.calendlyUrl, profile.industry, JSON.stringify(profile.keyFeatures),
      profile.pricing, profile.tone, profile.websiteUrl || null,
    ],
  });

  return id;
}

// # get all companies
export async function listCompanies(): Promise<DbCompany[]> {
  const db = getDb();
  const result = await db.execute("SELECT * FROM companies ORDER BY updated_at DESC");
  return result.rows as unknown as DbCompany[];
}

// # get one company by id
export async function getCompany(id: string): Promise<DbCompany | null> {
  const db = getDb();
  const result = await db.execute({ sql: "SELECT * FROM companies WHERE id = ?", args: [id] });
  return (result.rows[0] as unknown as DbCompany) || null;
}

// ── Prospect CRUD ──

// # save prospects for a company
export async function saveProspects(companyId: string, prospects: {
  id: string; companyName: string; contactName: string; title?: string;
  email: string; emailVerified?: boolean; website: string; industry: string;
  location?: string; employeeCount?: number; linkedinUrl?: string;
  fitReason: string; score: number; status: string;
}[]): Promise<void> {
  const db = getDb();
  for (const p of prospects) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO prospects (id, company_id, company_name, contact_name, title,
        email, email_verified, website, industry, location, employee_count,
        linkedin_url, fit_reason, score, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, companyId, p.companyName, p.contactName, p.title || null,
        p.email, p.emailVerified ? 1 : 0, p.website, p.industry,
        p.location || null, p.employeeCount || null, p.linkedinUrl || null,
        p.fitReason, p.score, p.status,
      ],
    });
  }
}

// # get prospects for a company
export async function getProspects(companyId: string): Promise<unknown[]> {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM prospects WHERE company_id = ? ORDER BY score DESC",
    args: [companyId],
  });
  return result.rows as unknown[];
}

// # save an email record
export async function saveEmail(companyId: string, email: {
  prospectId: string; to: string; subject: string; body: string; sentAt?: string;
}): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID().replace(/-/g, "");
  await db.execute({
    sql: `INSERT INTO emails (id, company_id, prospect_id, to_email, subject, body, sent_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, companyId, email.prospectId, email.to, email.subject, email.body, email.sentAt || null],
  });
  return id;
}
