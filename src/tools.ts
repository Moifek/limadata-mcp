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
  - profnet_url: Professional Network profile URL (https://profnet.com/in/username)
  - name + company_name/company_domain: Name-based lookup (requires name + at least one company field)
  - include_work_email: Also return work email (+1 credit if found)
  - include_phone: Also return phone number (+10 credits if found)

At least one identifier (email, profnet_url, or name+company) is required.`,
      inputSchema: z.object({
        email: z.string().optional().describe("Email address (personal or work)"),
        name: z.string().optional().describe("Full name — use with company_name or company_domain"),
        company_name: z.string().optional().describe("Company name for name-based lookup (e.g. Microsoft)"),
        company_domain: z.string().optional().describe("Company domain for name-based lookup (e.g. microsoft.com)"),
        profnet_url: z.string().optional().describe("Professional Network profile URL (e.g. https://profnet.com/in/johndoe)"),
        include_work_email: z.boolean().optional().describe("Return work email (+1 credit if found)"),
        include_phone: z.boolean().optional().describe("Return phone number (+10 credits if found)"),
      }).refine(
        (d) => d.email || d.profnet_url || (d.name && (d.company_name || d.company_domain)),
        "Must provide email, profnet_url, or (name + company_name/company_domain)"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.enrichPerson({
        email: params.email ?? null,
        name: params.name ?? null,
        company_name: params.company_name ?? null,
        company_domain: params.company_domain ?? null,
        profnet_url: params.profnet_url ?? null,
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
  - profnet_url: Company Professional Network URL (e.g. https://profnet.com/company/microsoft)

Provide at least one of domain or profnet_url.`,
      inputSchema: z.object({
        domain: z.string().optional().describe("Company domain (e.g. microsoft.com)"),
        profnet_url: z.string().optional().describe("Company Professional Network URL (e.g. https://profnet.com/company/microsoft)"),
      }).refine(
        (d) => d.domain || d.profnet_url,
        "Must provide domain or profnet_url"
      ),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async (params) => {
      const result = await client.enrichCompany({
        domain: params.domain ?? null,
        profnet_url: params.profnet_url ?? null,
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
      const result = await client.getProfessional NetworkPosts({
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
}
