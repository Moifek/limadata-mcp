import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LimadataAPIClient } from "./client.js";
import { formatCreditsInfo } from "./utils.js";

function withCredits(json: string, client: LimadataAPIClient): string {
  return json + formatCreditsInfo(client.getLastMetadata());
}

export function registerTools(server: McpServer, client: LimadataAPIClient): void {
  // ── enrich_person ──────────────────────────────────────────────────────────
  server.registerTool(
    "enrich_person",
    {
      title: "Enrich Person",
      description: `Enrich a person's professional profile using email, Professional Network URL, or name+company.
Returns comprehensive profile data: work history, education, social profiles, and current company.

Credits: 1 (Professional Network URL / work email) · 2 (name+company) · 5 (personal email) · +1 work email · +10 phone

Args:
  - email: Person's email address (personal or work)
  - linkedin_url: Professional Network profile URL (https://profnet.com/in/username)
  - name + company_name/company_domain: Name-based lookup (requires name + at least one company field)
  - include_work_email: Also return work email (+1 credit if found)
  - include_phone: Also return phone number (+10 credits if found)

At least one identifier (email, linkedin_url, or name+company) is required.`,
      inputSchema: z.object({
        email: z.string().optional().describe("Email address (personal or work)"),
        name: z.string().optional().describe("Full name — use with company_name or company_domain"),
        company_name: z.string().optional().describe("Company name for name-based lookup (e.g. Microsoft)"),
        company_domain: z.string().optional().describe("Company domain for name-based lookup (e.g. microsoft.com)"),
        linkedin_url: z.string().optional().describe("Professional Network profile URL (e.g. https://profnet.com/in/johndoe)"),
        include_work_email: z.boolean().optional().describe("Return work email (+1 credit if found)"),
        include_phone: z.boolean().optional().describe("Return phone number (+10 credits if found)"),
      }).refine(
        (d) => d.email || d.linkedin_url || (d.name && (d.company_name || d.company_domain)),
        "Must provide email, linkedin_url, or (name + company_name/company_domain)"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.enrichPerson({
        email: params.email ?? null,
        name: params.name ?? null,
        company_name: params.company_name ?? null,
        company_domain: params.company_domain ?? null,
        linkedin_url: params.linkedin_url ?? null,
        include_work_email: params.include_work_email ?? null,
        include_phone: params.include_phone ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── enrich_company ─────────────────────────────────────────────────────────
  server.registerTool(
    "enrich_company",
    {
      title: "Enrich Company",
      description: `Enrich a company's profile using domain or Professional Network URL.
Returns firmographic data: industry, size, locations, funding, social presence, technologies, and more.

Credits: 1 per request

Args:
  - domain: Company domain (e.g. microsoft.com or https://microsoft.com)
  - linkedin_url: Company Professional Network URL (e.g. https://profnet.com/company/microsoft)

Provide at least one of domain or linkedin_url.`,
      inputSchema: z.object({
        domain: z.string().optional().describe("Company domain (e.g. microsoft.com)"),
        linkedin_url: z.string().optional().describe("Company Professional Network URL (e.g. https://profnet.com/company/microsoft)"),
      }).refine(
        (d) => d.domain || d.linkedin_url,
        "Must provide domain or linkedin_url"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.enrichCompany({
        domain: params.domain ?? null,
        linkedin_url: params.linkedin_url ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── search_people ──────────────────────────────────────────────────────────
  server.registerTool(
    "search_people",
    {
      title: "Search People",
      description: `Search for people by keywords with optional filters for title, company, location, and industry.
Best for targeted searches (specific names, titles). Not designed for bulk lead generation.

Credits: 2 per request

Args:
  - query (required): Keywords (e.g. 'John Smith', 'Software Engineer at Microsoft')
  - title: Job title filter (e.g. 'Software Engineer')
  - company: Company name filter (e.g. 'Microsoft')
  - first_name / last_name: Name filters
  - current_company_list: Comma-separated Professional Network company IDs (e.g. '1035' for Microsoft)
  - past_company_list: Comma-separated Professional Network company IDs for previous employers
  - industry_list: Comma-separated Professional Network industry IDs (e.g. '4' for Software Development)
  - location_list: Comma-separated location IDs (e.g. '103644278' for United States)
  - page: Page number 1-100 (default 1)`,
      inputSchema: {
        query: z.string().describe("Search keywords (required)"),
        title: z.string().optional().describe("Job title filter"),
        company: z.string().optional().describe("Company name filter"),
        first_name: z.string().optional().describe("First name filter"),
        last_name: z.string().optional().describe("Last name filter"),
        current_company_list: z.string().optional().describe("Comma-separated Professional Network company IDs for current employer"),
        past_company_list: z.string().optional().describe("Comma-separated Professional Network company IDs for past employers"),
        industry_list: z.string().optional().describe("Comma-separated Professional Network industry IDs"),
        location_list: z.string().optional().describe("Comma-separated location IDs"),
        page: z.number().optional().describe("Page number 1-100 (default 1)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.searchPeople({
        query: params.query,
        title: params.title ?? null,
        company: params.company ?? null,
        first_name: params.first_name ?? null,
        last_name: params.last_name ?? null,
        current_company_list: params.current_company_list ?? null,
        past_company_list: params.past_company_list ?? null,
        industry_list: params.industry_list ?? null,
        location_list: params.location_list ?? null,
        page: params.page,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── search_companies ───────────────────────────────────────────────────────
  server.registerTool(
    "search_companies",
    {
      title: "Search Companies",
      description: `Search for companies by keywords with optional filters for size, location, industry, and hiring status.

Credits: 2 per request

Args:
  - query (required): Keywords (e.g. 'AI companies', 'Microsoft')
  - company_size: Comma-separated size codes — A=1-10, B=11-50, C=51-200, D=201-500, E=501-1000, F=1001-5000, G=5001-10000, H=10001+
  - industry_list: Comma-separated Professional Network industry IDs (e.g. '4' for Software Development)
  - location_list: Comma-separated location IDs (e.g. '103644278' for United States)
  - has_jobs: Filter for companies currently hiring
  - page: Page number 1-100 (default 1)`,
      inputSchema: {
        query: z.string().describe("Search keywords (required)"),
        company_size: z.string().optional().describe("Comma-separated size codes (A-H), e.g. 'F,G,H' for 1000+ employees"),
        industry_list: z.string().optional().describe("Comma-separated Professional Network industry IDs"),
        location_list: z.string().optional().describe("Comma-separated location IDs"),
        has_jobs: z.boolean().optional().describe("Filter for companies currently hiring"),
        page: z.number().optional().describe("Page number 1-100 (default 1)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.searchCompanies({
        query: params.query,
        company_size: params.company_size ?? null,
        industry_list: params.industry_list ?? null,
        location_list: params.location_list ?? null,
        has_jobs: params.has_jobs ?? null,
        page: params.page,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_company_insights ───────────────────────────────────────────────────
  server.registerTool(
    "get_company_insights",
    {
      title: "Get Company Insights",
      description: `Get detailed company insights from Business Intelligence: funding rounds, investors, employees, tech stack, IT spending, news, acquisitions, and similar companies. Ideal for lead scoring and deep research.

Credits: 5 per request (free 404 if identifier/domain not found)

Args:
  - identifier: Business Intelligence identifier (last segment of Business Intelligence URL, e.g. 'amazon'). Use when known.
  - domain: Company domain (e.g. amazon.com). The API resolves to Business Intelligence automatically.

Provide exactly one of identifier or domain.`,
      inputSchema: z.object({
        identifier: z.string().optional().describe("Business Intelligence identifier (e.g. 'amazon' from bizdata.com/organization/amazon)"),
        domain: z.string().optional().describe("Company domain (e.g. amazon.com) — resolved to Business Intelligence automatically"),
      }).refine(
        (d) => d.identifier || d.domain,
        "Either identifier or domain is required"
      ).refine(
        (d) => !(d.identifier && d.domain),
        "Provide only one of identifier or domain, not both"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.getCompanyInsights({
        identifier: params.identifier ?? null,
        domain: params.domain ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_profnet_posts ─────────────────────────────────────────────────────
  server.registerTool(
    "get_profnet_posts",
    {
      title: "Get Professional Network Posts",
      description: `Get Professional Network posts from a person or company profile with pagination support.
Returns post text, engagement metrics (likes, comments, reposts), media, and actor info.

Credits: 1 per post (minimum 1 credit even if profile has no posts)

Args:
  - url (required): Professional Network profile URL
      Person:  https://www.profnet.com/in/username
      Company: https://www.profnet.com/company/name
  - max_results: Maximum number of posts to return
  - pagination_token: Token from a previous response to fetch the next page`,
      inputSchema: {
        url: z.string().describe("Professional Network profile URL (person: /in/username or company: /company/name)"),
        max_results: z.number().optional().describe("Maximum number of posts to return"),
        pagination_token: z.string().optional().describe("Token from previous response for next-page pagination"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.getProfNetPosts({
        url: params.url,
        max_results: params.max_results ?? null,
        pagination_token: params.pagination_token ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── search_posts ───────────────────────────────────────────────────────────
  server.registerTool(
    "search_posts",
    {
      title: "Search Professional Network Posts",
      description: `Search Professional Network posts by keywords with optional filters for content type, author, and sorting.
Useful for intent detection, competitive analysis, and content discovery.

Credits: 2 per request

Args:
  - query (required): Keywords (e.g. 'AI Technology', 'Digital Marketing')
  - content_type: 'photos', 'videos', 'liveVideos', 'collaborativeArticles', or 'documents'
  - from_member: Comma-separated Professional Network member URNs (posts by specific people)
  - from_organization: Comma-separated Professional Network organization IDs (posts by specific companies)
  - author_job_title: Filter by author job title (e.g. 'CEO')
  - author_company: Comma-separated Professional Network company IDs (posts from people at these companies)
  - author_industry: Comma-separated Professional Network industry URNs
  - mentions_member: Comma-separated Professional Network member URNs (posts mentioning these people)
  - mentions_organization: Comma-separated Professional Network organization IDs (posts mentioning these companies)
  - page: Page number 1-100 (default 1)
  - sort_by_latest: true = latest first, false/omit = most relevant first`,
      inputSchema: {
        query: z.string().describe("Search keywords (required)"),
        content_type: z.string().optional().describe("Content type filter: photos, videos, liveVideos, collaborativeArticles, documents"),
        from_member: z.string().optional().describe("Comma-separated Professional Network member URNs to filter by author"),
        from_organization: z.string().optional().describe("Comma-separated Professional Network organization IDs to filter by author"),
        author_job_title: z.string().optional().describe("Filter by author job title (e.g. CEO)"),
        author_company: z.string().optional().describe("Comma-separated Professional Network company IDs (only posts from employees)"),
        author_industry: z.string().optional().describe("Comma-separated Professional Network industry URNs"),
        mentions_member: z.string().optional().describe("Comma-separated Professional Network member URNs (posts mentioning them)"),
        mentions_organization: z.string().optional().describe("Comma-separated Professional Network organization IDs (posts mentioning them)"),
        page: z.number().optional().describe("Page number 1-100 (default 1)"),
        sort_by_latest: z.boolean().optional().describe("true = latest first, false/omit = most relevant first"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.searchPosts({
        query: params.query,
        author_company: params.author_company ?? null,
        author_industry: params.author_industry ?? null,
        author_job_title: params.author_job_title ?? null,
        content_type: params.content_type ?? null,
        from_member: params.from_member ?? null,
        from_organization: params.from_organization ?? null,
        mentions_member: params.mentions_member ?? null,
        mentions_organization: params.mentions_organization ?? null,
        page: params.page ?? null,
        sort_by_latest: params.sort_by_latest ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_credits_balance ────────────────────────────────────────────────────
  server.registerTool(
    "get_credits_balance",
    {
      title: "Get Credits Balance",
      description: "Get the current credit balance for your Limadata account. No credits are consumed by this request.",
      inputSchema: {},
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async () => {
      const result = await client.getCreditsBalance();
      return {
        content: [{
          type: "text" as const,
          text: `Your Limadata account has ${result.balance} credits remaining.`,
        }],
      };
    }
  );

  // ── find_work_email ────────────────────────────────────────────────────────
  server.registerTool(
    "find_work_email",
    {
      title: "Find Work Email",
      description: `Find the most likely business email address for a person given their full name and company domain.
Returns 404 (no charge) if not found.

Credits: 1 on success · 0 on 404

Args:
  - full_name (required): Person's full name (e.g. "William Gates")
  - company_domain (required): Company domain (e.g. "microsoft.com")`,
      inputSchema: {
        full_name: z.string().min(1).describe("Person's full name (e.g. William Gates)"),
        company_domain: z.string().min(1).describe("Company domain (e.g. microsoft.com)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.findWorkEmail({ full_name: params.full_name, company_domain: params.company_domain });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── find_phone_number ──────────────────────────────────────────────────────
  server.registerTool(
    "find_phone_number",
    {
      title: "Find Phone Number",
      description: `Find phone numbers for a person from a Professional Network URL or via name + company.
Returns 404 (no charge) if not found.

Credits: 10 when found · 0 on 404 — ALWAYS confirm with the user before calling.

Input (choose one):
  - Option 1: linkedin_url
  - Option 2: name + company_name and/or company_domain`,
      inputSchema: z.object({
        linkedin_url: z.string().optional().describe("Professional Network profile URL"),
        name: z.string().optional().describe("Person's full name — use with company fields"),
        company_name: z.string().optional().describe("Company name — use with name"),
        company_domain: z.string().optional().describe("Company domain — use with name"),
      }).refine(
        (d) => d.linkedin_url || (d.name && (d.company_name || d.company_domain)),
        "Provide linkedin_url, or name + company_name/company_domain"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.findPhone({
        linkedin_url: params.linkedin_url ?? null,
        name: params.name ?? null,
        company_name: params.company_name ?? null,
        company_domain: params.company_domain ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── resolve_identity ───────────────────────────────────────────────────────
  server.registerTool(
    "resolve_identity",
    {
      title: "Resolve Identity",
      description: `Find a person's social profile URLs (Professional Network, GitHub, X, Facebook) by name + company or email.
Charged on every call including 404s. Supports partial names (e.g. "Bill G").

Credits: 2 per call (always charged, even on 404)

Args:
  - full_name (required): Person's name — can be partial
  - company_domain: Increases match accuracy (e.g. "microsoft.com")
  - company_name: Alternative to domain (e.g. "Microsoft")
  - email: Work email — used as an additional signal

Provide full_name + at least one of company_name, company_domain, or email.`,
      inputSchema: z.object({
        full_name: z.string().min(1).describe("Person's full name (supports partials like 'Bill G')"),
        company_domain: z.string().optional().describe("Company domain for accuracy (e.g. microsoft.com)"),
        company_name: z.string().optional().describe("Company name (e.g. Microsoft)"),
        email: z.string().optional().describe("Work email address"),
      }).refine(
        (d) => d.company_domain || d.company_name || d.email,
        "Provide at least one of company_domain, company_name, or email alongside full_name"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.resolveIdentity({
        full_name: params.full_name,
        company_domain: params.company_domain ?? null,
        company_name: params.company_name ?? null,
        email: params.email ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── find_company_profnet ──────────────────────────────────────────────────
  server.registerTool(
    "find_company_profnet",
    {
      title: "Find Company Professional Network",
      description: `Find the Professional Network page URL for a company given its domain.
Returns 404 (no charge) if not found.

Credits: Low-cost lookup (exact cost not specified in docs) · 0 on 404

Args:
  - domain (required): Company domain (e.g. "microsoft.com" or "https://microsoft.com")`,
      inputSchema: {
        domain: z.string().min(1).describe("Company domain (e.g. microsoft.com)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.findCompanyProfNet({ domain: params.domain });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── reverse_email_lookup ───────────────────────────────────────────────────
  server.registerTool(
    "reverse_email_lookup",
    {
      title: "Reverse Email Lookup",
      description: `Find Professional Network, GitHub, and X profile URLs from a person's email address.
Works with both work and personal emails.

Credits: 5 when a profile is found · 0 on 404 (default: 404 if Professional Network not found)

require_* flags control what counts as a hit:
  - require_linkedin=true (default): 404 if Professional Network not found (free)
  - require_x=true: 404 if X not found (free)
  - Both false: always pay 5 credits on any result

Args:
  - email (required): Person's work or personal email
  - require_linkedin: Return 404 (free) if Professional Network not found (default true)
  - require_x: Return 404 (free) if X not found`,
      inputSchema: {
        email: z.string().min(1).describe("Person's email address (work or personal)"),
        require_linkedin: z.boolean().optional().describe("Return 404 (free) if Professional Network not found (default true)"),
        require_x: z.boolean().optional().describe("Return 404 (free) if X not found"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.reverseEmailLookup({
        email: params.email,
        require_linkedin: params.require_linkedin ?? null,
        require_x: params.require_x ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_company ────────────────────────────────────────────────────────────
  server.registerTool(
    "get_company",
    {
      title: "Get Company (Professional Network)",
      description: `Get company profile data from a Professional Network company URL.
Returns headcount, industry, funding, locations, and more.

Credits: 1 (cached, default) · 3 with live=true (real-time from Professional Network)

IMPORTANT — live flag: Always default to live=false. Only use live=true if the user explicitly
asks for current/up-to-date data (e.g. "current headcount", "did they just raise?", "latest info").
Ask before using live=true: "This will use 3 credits instead of 1 — proceed?"

Args:
  - url (required): Professional Network company URL (e.g. https://profnet.com/company/microsoft)
  - live: true = real-time (3 credits), false/omit = cached (1 credit)`,
      inputSchema: {
        url: z.string().describe("Professional Network company URL (e.g. https://profnet.com/company/microsoft)"),
        live: z.boolean().optional().describe("true = real-time from Professional Network (3 credits), false/omit = cached (1 credit)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.getCompany({ url: params.url, live: params.live ?? null });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_company_jobs ───────────────────────────────────────────────────────
  server.registerTool(
    "get_company_jobs",
    {
      title: "Get Company Jobs",
      description: `Get Professional Network job listings for a company. Returns 20 results per page.

Credits: 2 per request

Args:
  - url (required): Professional Network company profile URL (e.g. https://profnet.com/company/microsoft)
  - page: Page number starting from 1`,
      inputSchema: {
        url: z.string().describe("Professional Network company profile URL (e.g. https://profnet.com/company/microsoft)"),
        page: z.number().int().min(1).optional().describe("Page number (starting from 1)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.getCompanyJobs({ url: params.url, page: params.page ?? null });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── prospect_companies_filter ──────────────────────────────────────────────
  server.registerTool(
    "prospect_companies_filter",
    {
      title: "Prospect Companies (Filter)",
      description: `Advanced company prospecting with granular filters. Up to 25 results/page, max 60 pages.
Results are live Professional Network Sales Navigator data.

Credits: 25 per request — ALWAYS confirm with the user before calling.
"This will use 25 credits for a live Professional Network prospect search — proceed?"

Filter types: company_headcount, company_headquarters, industry, number_of_followers, fortune,
recent_activities, job_opportunities, company_headcount_growth (between), annual_revenue (between),
department_headcount (between), department_headcount_growth (between), keywords

Filter object:
  { filter_type, operator ("in"/"not_in"/"between"), values (string[]), range_value ({ sub_filter?, min, max }) }

Args:
  - filters (required): Array of filter objects
  - page: 1–60 (default 1, 25 results per page)`,
      inputSchema: {
        filters: z.array(z.object({
          filter_type: z.string().describe("Filter type (e.g. industry, company_headcount)"),
          operator: z.string().nullable().optional().describe("in | not_in | between | null (boolean filters)"),
          values: z.array(z.string()).nullable().optional().describe("Array of values (null for between/boolean filters)"),
          range_value: z.object({
            sub_filter: z.string().optional().describe("Required for some range types (e.g. currency for annual_revenue)"),
            min: z.number(),
            max: z.number(),
          }).nullable().optional().describe("Only for between operator"),
        })).describe("Array of filter objects (AND'd together)"),
        page: z.number().int().min(1).max(60).optional().describe("Page number 1–60 (25 results per page)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.prospectCompaniesFilter({
        filters: params.filters,
        page: params.page,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── prospect_companies_by_url ──────────────────────────────────────────────
  server.registerTool(
    "prospect_companies_by_url",
    {
      title: "Prospect Companies (by Sales Navigator URL)",
      description: `Prospect companies using a Professional Network Sales Navigator Account Search URL.
Build your search in Sales Navigator's UI, then pass the URL here. Up to 25 results/page, max 60 pages.

Credits: 25 per request — ALWAYS confirm with the user before calling.
"This will use 25 credits for a live Professional Network prospect search — proceed?"

Args:
  - search_url (required): Professional Network Sales Navigator company search URL
  - page: 1–60 (optional)`,
      inputSchema: {
        search_url: z.string().describe("Professional Network Sales Navigator company search URL"),
        page: z.number().int().min(1).max(60).optional().describe("Page number 1–60 (optional)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.prospectCompaniesByUrl({ search_url: params.search_url, page: params.page });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── prospect_people_filter ─────────────────────────────────────────────────
  server.registerTool(
    "prospect_people_filter",
    {
      title: "Prospect People (Filter)",
      description: `Advanced people prospecting with granular filters. Up to 25 results/page, max 100 pages.
Results are live Professional Network Sales Navigator data.

Credits: 25 per request — ALWAYS confirm with the user before calling.
"This will use 25 credits for a live Professional Network prospect search — proceed?"

Filter types: company, company_past, company_headcount, company_type, company_headquarters, function,
current_title, seniority, past_title, years_in_current_company, years_in_current_position,
year_of_experience, location, industry, first_name, last_name, profile_language, school,
recently_changed_jobs (boolean — omit operator/values), posted_on_linked_in (boolean), keywords

Filter object:
  { filter_type, operator ("in"/"not_in"), values (string[]) }
  Boolean filters: { filter_type } only (no operator/values)

Args:
  - filters (required): Array of filter objects
  - page: 1–100
  - settings_match_all_company_urls: true = all company URLs must resolve before returning results`,
      inputSchema: {
        filters: z.array(z.object({
          filter_type: z.string().describe("Filter type (e.g. current_title, seniority, company)"),
          operator: z.string().nullable().optional().describe("in | not_in | null (boolean filters)"),
          values: z.array(z.string()).nullable().optional().describe("Filter values (null for boolean filters)"),
          range_value: z.object({
            sub_filter: z.string().optional(),
            min: z.number(),
            max: z.number(),
          }).nullable().optional(),
        })).describe("Array of filter objects (AND'd together)"),
        page: z.number().int().min(1).max(100).optional().describe("Page number 1–100 (25 results per page)"),
        settings_match_all_company_urls: z.boolean().nullable().optional().describe("true = wait for all company URLs to resolve"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.prospectPeopleFilter({
        filters: params.filters,
        page: params.page,
        settings_match_all_company_urls: params.settings_match_all_company_urls ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── prospect_people_by_url ─────────────────────────────────────────────────
  server.registerTool(
    "prospect_people_by_url",
    {
      title: "Prospect People (by Sales Navigator URL)",
      description: `Prospect people using a Professional Network Sales Navigator Leads Search URL.
Build your search in Sales Navigator's UI, then pass the URL here. Up to 25 results/page, max 100 pages.

Credits: 25 per request — ALWAYS confirm with the user before calling.
"This will use 25 credits for a live Professional Network prospect search — proceed?"

Args:
  - search_url (required): Professional Network Sales Navigator leads search URL
  - page: 1–100 (optional)`,
      inputSchema: {
        search_url: z.string().describe("Professional Network Sales Navigator leads search URL"),
        page: z.number().int().min(1).max(100).optional().describe("Page number 1–100 (optional)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.prospectPeopleByUrl({ search_url: params.search_url, page: params.page });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── prospect_employees ─────────────────────────────────────────────────────
  server.registerTool(
    "prospect_employees",
    {
      title: "Prospect Employees",
      description: `Get current employees of a company for prospecting or candidate sourcing.
All filter params are optional. Up to 25 results/page, max 100 pages.

Credits: 25 per request — ALWAYS confirm with the user before calling.
"This will use 25 credits for a live Professional Network prospect search — proceed?"

Args:
  - url (required): Professional Network company profile URL (e.g. https://profnet.com/company/microsoft)
  - keyword: Keyword filter across employee profiles
  - titles: Job title filters (array, e.g. ["Head of Marketing", "Marketing Manager"])
  - locations: Location filters (array, e.g. ["United States"])
  - seniorities: Seniority filters (array, e.g. ["Director", "Vice President"])
  - recently_changed_jobs: Filter for employees who recently changed jobs
  - page: 1–100`,
      inputSchema: {
        url: z.string().describe("Professional Network company profile URL (e.g. https://profnet.com/company/microsoft)"),
        keyword: z.string().nullable().optional().describe("Keyword filter across employee profiles"),
        titles: z.array(z.string()).optional().describe("Job title filters (e.g. ['Head of Marketing'])"),
        locations: z.array(z.string()).optional().describe("Location filters (e.g. ['United States'])"),
        seniorities: z.array(z.string()).optional().describe("Seniority filters (e.g. ['Director', 'Vice President'])"),
        recently_changed_jobs: z.boolean().nullable().optional().describe("Filter for employees who recently changed jobs"),
        page: z.number().int().min(1).max(100).optional().describe("Page number 1–100"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.prospectEmployees({
        url: params.url,
        keyword: params.keyword ?? null,
        titles: params.titles,
        locations: params.locations,
        seniorities: params.seniorities,
        recently_changed_jobs: params.recently_changed_jobs ?? null,
        page: params.page,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── create_watch ───────────────────────────────────────────────────────────
  server.registerTool(
    "create_watch",
    {
      title: "Create Watch",
      description: `Create a persistent Professional Network monitoring subscription that fires webhooks when changes occur.
Credits are consumed per-profile at check time (not at creation). CRUD operations cost 0 credits.

Watch types:
  - PersonJobChanges: fires when person's company changes (3 credits/profile/check)
  - PersonProfileUpdates: fires on any profile field change (3 credits/profile/check)
  - PersonSocialPosts: fires on new post (2 credits/profile/check)
  - CompanySocialPosts: fires on new company post (2 credits/company/check)
  - CompanyJobPosts: fires on new job listing (2 credits/company/check)

Scheduling: checks begin 24 hours after creation, repeat every frequency_days.
First run: PersonSocialPosts/CompanySocialPosts notify about last 7 days; CompanyJobPosts last 14 days.

Args:
  - name (required): Watch name (max 200 chars)
  - type (required): One of the 5 watch type values above
  - notification_url (required): HTTPS webhook endpoint
  - frequency_days (required): 1–60 days between checks
  - settings: { people_urls: string[] } for person types, { company_urls: string[] } for company types
  - external_id: Your own tenant/client ID (max 500 chars)`,
      inputSchema: z.object({
        name: z.string().max(200).describe("Watch name (max 200 chars)"),
        type: z.enum(["PersonJobChanges", "PersonProfileUpdates", "PersonSocialPosts", "CompanySocialPosts", "CompanyJobPosts"]).describe("Watch type"),
        notification_url: z.string().url().describe("HTTPS webhook endpoint"),
        frequency_days: z.number().int().min(1).max(60).describe("Days between checks (1–60)"),
        external_id: z.string().max(500).optional().describe("Your tenant/client ID (max 500 chars)"),
        settings: z.object({
          people_urls: z.array(z.string()).min(1).max(10000).optional().describe("Professional Network profile URLs (for person-based types)"),
          company_urls: z.array(z.string()).min(1).max(10000).optional().describe("Professional Network company URLs (for company-based types)"),
        }).nullable().optional().describe("URLs to monitor (required for person/company types)"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    async (params) => {
      const result = await client.createWatch({
        name: params.name,
        type: params.type,
        notification_url: params.notification_url,
        frequency_days: params.frequency_days,
        external_id: params.external_id ?? null,
        settings: params.settings ?? null,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── list_watches ───────────────────────────────────────────────────────────
  server.registerTool(
    "list_watches",
    {
      title: "List Watches",
      description: `List all watch subscriptions for your account.

Credits: 0

Args:
  - page: Page number (1-indexed, default 1)`,
      inputSchema: {
        page: z.number().int().min(1).optional().describe("Page number (default 1)"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (params) => {
      const result = await client.listWatches({ page: params.page ?? null });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_watch ──────────────────────────────────────────────────────────────
  server.registerTool(
    "get_watch",
    {
      title: "Get Watch",
      description: `Get a watch subscription by ID.

Credits: 0

Args:
  - id (required): Watch ID (integer)`,
      inputSchema: {
        id: z.number().int().describe("Watch ID"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (params) => {
      const result = await client.getWatch(params.id);
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── update_watch ───────────────────────────────────────────────────────────
  server.registerTool(
    "update_watch",
    {
      title: "Update Watch",
      description: `Update a watch subscription's configuration.
Only name, notification_url, frequency_days, is_active, and external_id can be modified.
Watch type and monitored URLs cannot be changed — create a new watch instead.

Credits: 0

is_active — pause and resume:
  There is no delete endpoint. Use is_active to stop/start a watch:
  - is_active=false: pause (no more checks or webhooks until reactivated)
  - is_active=true: resume (checks restart on next scheduled interval)
  Natural language mapping:
  - "stop", "pause", "disable", "turn off" → is_active: false
  - "start", "resume", "enable", "turn on" → is_active: true

Args:
  - id (required): Watch ID to update
  - name: New name (max 200 chars)
  - notification_url: New webhook URL
  - frequency_days: New check interval (1–60)
  - is_active: false=pause, true=resume
  - external_id: Your tenant/client ID`,
      inputSchema: z.object({
        id: z.number().int().describe("Watch ID to update"),
        name: z.string().max(200).optional().describe("New watch name"),
        notification_url: z.string().nullable().optional().describe("New webhook endpoint URL"),
        frequency_days: z.number().int().min(1).max(60).optional().describe("New check interval in days (1–60)"),
        is_active: z.boolean().nullable().optional().describe("false=pause watch, true=resume watch"),
        external_id: z.string().max(500).optional().describe("Your tenant/client ID"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (params) => {
      const result = await client.updateWatch({
        id: params.id,
        name: params.name,
        notification_url: params.notification_url ?? undefined,
        frequency_days: params.frequency_days,
        is_active: params.is_active ?? null,
        external_id: params.external_id,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── get_watch_mock_payload ─────────────────────────────────────────────────
  server.registerTool(
    "get_watch_mock_payload",
    {
      title: "Get Watch Mock Payload",
      description: `Get a sample webhook payload for a given watch type.
Use to validate your webhook endpoint and test signature verification before creating a real watch.

Credits: 0

Args:
  - type (required): One of PersonJobChanges, PersonProfileUpdates, PersonSocialPosts, CompanySocialPosts, CompanyJobPosts`,
      inputSchema: {
        type: z.enum(["PersonJobChanges", "PersonProfileUpdates", "PersonSocialPosts", "CompanySocialPosts", "CompanyJobPosts"]).describe("Watch type to get mock payload for"),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    async (params) => {
      const result = await client.getMockWatchPayload(params.type);
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── database_search_company (DISABLED — BETA, not publicly available) ─────
  /* server.registerTool(
    "database_search_company",
    {
      title: "Database Search Company (BETA)",
      description: `Search Limadata's company database using AI prompt, structured filters, or a filter expression.
BETA: Requires Limadata to enable access on your account. Credits not specified — confirm before large queries.

Query modes (pass exactly one):
  1. ai_prompt — natural language: "SaaS companies in the US with 100-500 employees"
  2. filters — structured enum filters: [{ filter_type, includes, excludes }]
  3. filter_expression — expression syntax: "headquarters_country_name=United States, employee_count_min>100"

Expression operators: = != < > <= >= =* (contains) !* (not contains) ^ (starts with) $ (ends with) , (AND) | (OR) () (group)
Never wrap values in quotes: field=Software Development NOT field="Software Development"

Key filter fields: company_name, domain, headquarters_country_name (Enum), industry_linkedin (Enum),
employee_count_min/max (int), employee_count_range (Enum), revenue_range (Enum), all_tech (Enum), founded (number)

Args:
  - ai_prompt: Natural language query (Mode 1)
  - filters: Structured filter array (Mode 2) — each: { filter_type, includes?, excludes? }
  - filter_expression: Expression string (Mode 3)
  - max_records: 1–10,000 (default 10)
  - include_total: Include exact total count (adds latency, default false)`,
      inputSchema: z.object({
        ai_prompt: z.string().nullable().optional().describe("Natural language company search (Mode 1)"),
        filters: z.array(z.object({
          filter_type: z.string().describe("Field name from available fields table"),
          includes: z.array(z.string()).optional().describe("Values to match"),
          excludes: z.array(z.string()).optional().describe("Values to exclude"),
        })).nullable().optional().describe("Structured enum filters (Mode 2)"),
        filter_expression: z.string().nullable().optional().describe("Filter expression string (Mode 3)"),
        max_records: z.number().int().min(1).max(10000).optional().describe("Max results to return (default 10, max 10,000)"),
        include_total: z.boolean().optional().describe("Include exact total count (adds latency, default false)"),
      }).refine(
        (d) => [d.ai_prompt, d.filters, d.filter_expression].filter(Boolean).length === 1,
        "Pass exactly one of: ai_prompt, filters, or filter_expression"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.databaseSearchCompany({
        ai_prompt: params.ai_prompt ?? null,
        filters: params.filters ?? null,
        filter_expression: params.filter_expression ?? null,
        max_records: params.max_records,
        include_total: params.include_total,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );

  // ── database_search_people ─────────────────────────────────────────────────
  server.registerTool(
    "database_search_people",
    {
      title: "Database Search People (BETA)",
      description: `Search Limadata's people database using AI prompt, structured filters, or a filter expression.
BETA: Requires Limadata to enable access on your account. Credits not specified — confirm before large queries.

Query modes (pass exactly one):
  1. ai_prompt — natural language: "Software engineers in the US at companies with 51-200 employees"
  2. filters — structured enum filters: [{ filter_type, includes, excludes }]
  3. filter_expression — expression syntax: "country_name=United States, job_title^Engineer, org_employee_count_range=51-200"

Key filter fields: full_name, first_name, last_name, linkedin_url, linkedin_headline,
job_title (string), job_function (Enum), job_level (Enum), job_is_current (boolean),
country_name (Enum), city, org_company_name, org_domain, org_industry_linkedin (Enum),
org_employee_count_range (Enum), org_revenue_range (Enum)
Note: All company fields for people are prefixed with org_

Args:
  - ai_prompt: Natural language query (Mode 1)
  - filters: Structured filter array (Mode 2)
  - filter_expression: Expression string (Mode 3)
  - max_records: 1–10,000 (default 10)
  - include_total: Include exact total count (adds latency, default false)`,
      inputSchema: z.object({
        ai_prompt: z.string().nullable().optional().describe("Natural language people search (Mode 1)"),
        filters: z.array(z.object({
          filter_type: z.string().describe("Field name from available fields table"),
          includes: z.array(z.string()).optional().describe("Values to match"),
          excludes: z.array(z.string()).optional().describe("Values to exclude"),
        })).nullable().optional().describe("Structured enum filters (Mode 2)"),
        filter_expression: z.string().nullable().optional().describe("Filter expression string (Mode 3)"),
        max_records: z.number().int().min(1).max(10000).optional().describe("Max results to return (default 10, max 10,000)"),
        include_total: z.boolean().optional().describe("Include exact total count (adds latency, default false)"),
      }).refine(
        (d) => [d.ai_prompt, d.filters, d.filter_expression].filter(Boolean).length === 1,
        "Pass exactly one of: ai_prompt, filters, or filter_expression"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async (params) => {
      const result = await client.databaseSearchPeople({
        ai_prompt: params.ai_prompt ?? null,
        filters: params.filters ?? null,
        filter_expression: params.filter_expression ?? null,
        max_records: params.max_records,
        include_total: params.include_total,
      });
      return { content: [{ type: "text" as const, text: withCredits(JSON.stringify(result, null, 2), client) }] };
    }
  );
  */ // end disabled database tools
}
