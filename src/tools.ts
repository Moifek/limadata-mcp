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
    "Search for people matching specified criteria. Used for prospecting and lead discovery.",
  inputSchema: {
    type: "object" as const,
    properties: {
      job_title: {
        type: "string",
        description: "Filter by job title",
      },
      location: {
        type: "string",
        description: "Filter by location",
      },
      industry: {
        type: "string",
        description: "Filter by industry",
      },
      company_size: {
        type: "string",
        description: "Filter by company size",
      },
      company_domain: {
        type: "string",
        description: "Filter by company domain",
      },
      limit: {
        type: "number",
        description: "Number of results to return (default: 20)",
      },
      offset: {
        type: "number",
        description: "Pagination offset (default: 0)",
      },
    },
  },
};

export const searchCompaniesTool: Tool = {
  name: "search_companies",
  description:
    "Search for companies matching specified criteria. Used for account-based marketing and company research.",
  inputSchema: {
    type: "object" as const,
    properties: {
      industry: {
        type: "string",
        description: "Filter by industry",
      },
      employee_count: {
        type: "string",
        description: "Filter by employee count range",
      },
      revenue_range: {
        type: "string",
        description: "Filter by revenue range",
      },
      funding_stage: {
        type: "string",
        description: "Filter by funding stage",
      },
      location: {
        type: "string",
        description: "Filter by location",
      },
      limit: {
        type: "number",
        description: "Number of results to return (default: 20)",
      },
      offset: {
        type: "number",
        description: "Pagination offset (default: 0)",
      },
    },
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
  const { job_title, location, industry, company_size, company_domain, limit, offset } = input;

  return {
    job_title: job_title ? String(job_title) : undefined,
    location: location ? String(location) : undefined,
    industry: industry ? String(industry) : undefined,
    company_size: company_size ? String(company_size) : undefined,
    company_domain: company_domain ? String(company_domain) : undefined,
    limit: typeof limit === "number" ? limit : undefined,
    offset: typeof offset === "number" ? offset : undefined,
  };
}

export function validateSearchCompaniesInput(
  input: Record<string, unknown>
): Types.SearchCompaniesRequest {
  const { industry, employee_count, revenue_range, funding_stage, location, limit, offset } = input;

  return {
    industry: industry ? String(industry) : undefined,
    employee_count: employee_count ? String(employee_count) : undefined,
    revenue_range: revenue_range ? String(revenue_range) : undefined,
    funding_stage: funding_stage ? String(funding_stage) : undefined,
    location: location ? String(location) : undefined,
    limit: typeof limit === "number" ? limit : undefined,
    offset: typeof offset === "number" ? offset : undefined,
  };
}
