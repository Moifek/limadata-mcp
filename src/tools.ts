import { Tool } from "@modelcontextprotocol/sdk/types.js";
import * as Types from "./types.js";

export const enrichPersonTool: Tool = {
  name: "enrich_person",
  description:
    "Enrich a person's professional profile using email, Professional Network URL, or name+company. Returns comprehensive profile data including work history, education, social profiles, and current company information.",
  inputSchema: {
    type: "object" as const,
    properties: {
      email: {
        type: "string",
        description: "Person's email address (e.g., john.doe@example.com)",
      },
      name: {
        type: "string",
        description: "Person's full name (required with company lookup)",
      },
      company_name: {
        type: "string",
        description:
          "Company name for identity resolution (use with name, e.g., Microsoft)",
      },
      company_domain: {
        type: "string",
        description:
          "Company domain for identity resolution (use with name, e.g., microsoft.com)",
      },
      profnet_url: {
        type: "string",
        description:
          "Person's Professional Network profile URL (e.g., https://profnet.com/in/johndoe)",
      },
      include_work_email: {
        type: "boolean",
        description:
          "Include person's work email in response (adds 1 credit if found)",
      },
      include_phone: {
        type: "boolean",
        description:
          "Include person's phone number in response (adds 10 credits if found)",
      },
    },
  },
};

export const enrichCompanyTool: Tool = {
  name: "enrich_company",
  description:
    "Enrich a company's profile using domain or Professional Network URL. Returns comprehensive firmographic data including industry, size, locations, funding, and social presence.",
  inputSchema: {
    type: "object" as const,
    properties: {
      domain: {
        type: "string",
        description: "Company domain (e.g., microsoft.com or https://microsoft.com)",
      },
      profnet_url: {
        type: "string",
        description:
          "Company's Professional Network URL (e.g., https://profnet.com/company/microsoft)",
      },
    },
    required: [],
  },
};

export const searchPeopleTool: Tool = {
  name: "search_people",
  description:
    "Search for people by keywords with optional filters for title, company, location, and industry. Best used for targeted searches (specific names, titles, etc.)",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          "Search query/keywords (required). Example: 'John Smith', 'Software Engineer at Microsoft', or 'Product Manager in SF'",
      },
      title: {
        type: "string",
        description: "Filter by job title keywords. Example: 'Software Engineer'",
      },
      company: {
        type: "string",
        description: "Filter by company name keywords. Example: 'Microsoft'",
      },
      first_name: {
        type: "string",
        description: "Filter by first name keywords",
      },
      last_name: {
        type: "string",
        description: "Filter by last name keywords",
      },
      current_company_list: {
        type: "string",
        description:
          "Filter by current company (comma-separated Professional Network company IDs). Example: '1035' for Microsoft",
      },
      past_company_list: {
        type: "string",
        description:
          "Filter by past company (comma-separated Professional Network company IDs)",
      },
      industry_list: {
        type: "string",
        description:
          "Filter by industry (comma-separated Professional Network industry IDs). Example: '4' for Software Development",
      },
      location_list: {
        type: "string",
        description:
          "Filter by location (comma-separated location IDs). Example: '103644278' for United States",
      },
      page: {
        type: "number",
        description: "Page number (1-100, default: 1)",
      },
    },
    required: ["query"],
  },
};

export const searchCompaniesTool: Tool = {
  name: "search_companies",
  description:
    "Search for companies by keywords with optional filters for size, location, industry, and hiring status.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description:
          "Search query/keywords (required). Example: 'AI companies' or 'Microsoft'",
      },
      company_size: {
        type: "string",
        description:
          "Filter by company size (comma-separated codes). A=1-10, B=11-50, C=51-200, D=201-500, E=501-1000, F=1001-5000, G=5001-10000, H=10001+. Example: 'F,G,H' for 1000+ employees",
      },
      industry_list: {
        type: "string",
        description:
          "Filter by industry (comma-separated Professional Network industry IDs). Example: '4' for Software Development",
      },
      location_list: {
        type: "string",
        description:
          "Filter by location (comma-separated location IDs). Example: '103644278' for United States",
      },
      has_jobs: {
        type: "boolean",
        description: "Filter for companies currently hiring",
      },
      page: {
        type: "number",
        description: "Page number (1-100, default: 1)",
      },
    },
    required: ["query"],
  },
};

export const creditsBalanceTool: Tool = {
  name: "get_credits_balance",
  description:
    "Get the current credit balance for your Limadata account. No credits are consumed by this request.",
  inputSchema: {
    type: "object" as const,
    properties: {},
  },
};

export const companyInsightsTool: Tool = {
  name: "get_company_insights",
  description:
    "Get detailed company insights from Business Intelligence and other data sources including news, funding rounds, investors, employees, technology stack, acquisitions, and IT spending. Perfect for lead scoring.",
  inputSchema: {
    type: "object" as const,
    properties: {
      identifier: {
        type: "string",
        description:
          "Business Intelligence identifier (last part of Business Intelligence URL). Example: 'amazon' from https://www.bizdata.com/organization/amazon. Use this if you know the identifier.",
      },
      domain: {
        type: "string",
        description:
          "Company domain (e.g., amazon.com). Use this if you don't know the Business Intelligence identifier. We'll look it up for you.",
      },
    },
  },
};

export function validateEnrichPersonInput(
  input: Record<string, unknown>
): Types.EnrichPersonRequest {
  const { email, name, company_name, company_domain, profnet_url, include_work_email, include_phone } = input;

  if (!email && !profnet_url && !(name && (company_name || company_domain))) {
    throw new Error(
      "Must provide one of: email, profnet_url, or (name + company_name/company_domain)"
    );
  }

  return {
    email: email ? String(email) : null,
    name: name ? String(name) : null,
    company_name: company_name ? String(company_name) : null,
    company_domain: company_domain ? String(company_domain) : null,
    profnet_url: profnet_url ? String(profnet_url) : null,
    include_work_email: typeof include_work_email === "boolean" ? include_work_email : null,
    include_phone: typeof include_phone === "boolean" ? include_phone : null,
  };
}

export function validateEnrichCompanyInput(
  input: Record<string, unknown>
): Types.EnrichCompanyRequest {
  const { domain, profnet_url } = input;

  if (!domain && !profnet_url) {
    throw new Error("Must provide domain or profnet_url");
  }

  return {
    domain: domain ? String(domain) : null,
    profnet_url: profnet_url ? String(profnet_url) : null,
  };
}

export function validateSearchPeopleInput(
  input: Record<string, unknown>
): Types.SearchPeopleRequest {
  const {
    query,
    title,
    company,
    first_name,
    last_name,
    current_company_list,
    past_company_list,
    industry_list,
    location_list,
    page,
  } = input;

  if (!query) {
    throw new Error("'query' is required for people search");
  }

  return {
    query: String(query),
    title: title ? String(title) : null,
    company: company ? String(company) : null,
    first_name: first_name ? String(first_name) : null,
    last_name: last_name ? String(last_name) : null,
    current_company_list: current_company_list ? String(current_company_list) : null,
    past_company_list: past_company_list ? String(past_company_list) : null,
    industry_list: industry_list ? String(industry_list) : null,
    location_list: location_list ? String(location_list) : null,
    page: typeof page === "number" ? page : undefined,
  };
}

export function validateCompanyInsightsInput(
  input: Record<string, unknown>
): Types.CompanyInsightsRequest {
  const { identifier, domain } = input;

  if (!identifier && !domain) {
    throw new Error("Either 'identifier' or 'domain' is required for company insights");
  }

  if (identifier && domain) {
    throw new Error("Only one of 'identifier' or 'domain' should be provided");
  }

  return {
    identifier: identifier ? String(identifier) : null,
    domain: domain ? String(domain) : null,
  };
}

export function validateSearchCompaniesInput(
  input: Record<string, unknown>
): Types.SearchCompaniesRequest {
  const { query, company_size, industry_list, location_list, has_jobs, page } = input;

  if (!query) {
    throw new Error("'query' is required for company search");
  }

  return {
    query: String(query),
    company_size: company_size ? String(company_size) : null,
    industry_list: industry_list ? String(industry_list) : null,
    location_list: location_list ? String(location_list) : null,
    has_jobs: typeof has_jobs === "boolean" ? has_jobs : null,
    page: typeof page === "number" ? page : undefined,
  };
}
