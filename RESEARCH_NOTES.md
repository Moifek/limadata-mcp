# Research Notes: Limadata API

**Date:** 2026-04-11  
**Status:** Blocked waiting for account access  

## Agent Findings

Comprehensive search performed by Mmo agent to find public limadata API documentation.

### What's Publicly Available

1. **People Enrichment** (inferred from blog posts)
   - Input: Email address (+ optional name)
   - Output: Person object + Company object
   - Person fields: full name, job title, bio, location, work history, education, skills, social profiles
   - Company fields: industry, headcount, HQ location, funding stage, capital raised, growth signals
   - Pricing: 3 credits (business email) / 6 credits (personal email)

2. **Company Enrichment** (inferred)
   - Input: Domain or company name
   - Output: Company profile with headcount, revenue, funding, tech stack, industry

3. **People Search/Prospecting**
   - Filters: job title, location, industry, company size, etc.
   - Output: List of matching person profiles

4. **Company Search**
   - Filters: various company attributes
   - Output: List of matching companies

5. **Jobs API**
   - Presumably GET endpoint
   - Returns: Job postings tied to company profiles

6. **Posts API**
   - Presumably GET endpoint
   - Returns: Social post data for tracked entities

7. **Watch API (Webhooks/Signals)**
   - Method: POST to register watch
   - Delivery: Webhook to your configured URL
   - 20+ event types including:
     - **People:** job_change, promotion, social_mention, social_post, news_mention
     - **Companies:** funding_round, new_hire, job_posting, news_mention, social_post
   - Payload schema: `{ event, timestamp, data }`
   - Format: Schema_v2, UTF-8

8. **AI Search**
   - Listed on homepage
   - Likely natural language search over data layer

9. **Extraction API**
   - Listed on homepage
   - Likely for scraping/extracting structured data from URLs

### What's NOT Publicly Available

❌ Base URL (assumed `https://api.limadata.com` but not confirmed)  
❌ Exact endpoint paths (e.g., `/v1/people/enrich`)  
❌ Query parameters & filter syntax  
❌ Request/response JSON schemas  
❌ Pagination strategy  
❌ Rate limits & quota info  
❌ Full event payload schemas for Watch API  
❌ Error response format  

### Why Docs Are Gated

- No public OpenAPI/Swagger spec
- No public Postman workspace
- No indexed API reference (requires `app.limadata.com` login)
- WebFetch blocked on marketing pages

### Access Points

All full documentation is behind login at:
- **Portal:** https://app.limadata.com
- **Expected sections:** Developers, API Docs, API Reference, or Settings
- **Typical exports:** OpenAPI spec (JSON/YAML) or Postman collection (JSON)

## Decision: No Assumptions

We are **NOT** guessing at endpoint paths or schemas. Once Jack shares the actual spec, we will:
1. Parse the real endpoints
2. Map them to MCP tools
3. Generate correct TypeScript types
4. Build against the truth, not assumptions

## Next Action

→ Contact Jack for limadata account access or API spec export
