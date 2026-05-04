import * as Types from "./types.js";

const BASE_URL = "https://api.limadata.com";
const DEFAULT_TIMEOUT = 30000;

export class LiamataAPIClient {
  private apiKey: string;
  private lastMetadata: Types.ResponseMetadata | null = null;
  private requestHistory: Types.ResponseMetadata[] = [];

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;
  }

  getLastMetadata(): Types.ResponseMetadata | null {
    return this.lastMetadata;
  }

  getRequestHistory(): Types.ResponseMetadata[] {
    return this.requestHistory.slice(-5); // Last 5 requests
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };

    const options: RequestInit & { timeout?: number } = {
      method,
      headers,
      timeout: DEFAULT_TIMEOUT,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // Capture response metadata (headers)
    const creditsCost = response.headers.get("x-credits-cost");
    const creditsRemaining = response.headers.get("x-credits-remaining");

    const metadata: Types.ResponseMetadata = {
      creditsCost: creditsCost ? parseInt(creditsCost, 10) : null,
      creditsRemaining: creditsRemaining ? parseInt(creditsRemaining, 10) : null,
      timestamp: new Date(),
      endpoint: path,
    };

    this.lastMetadata = metadata;
    this.requestHistory.push(metadata);

    const data = await response.json() as T & { error?: unknown };

    if (!response.ok) {
      const errorMessage =
        typeof data.error === "string"
          ? data.error
          : `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  }

  async enrichPerson(
    request: Types.EnrichPersonRequest
  ): Promise<Types.EnrichPersonResponse> {
    return this.request<Types.EnrichPersonResponse>(
      "POST",
      "/api/v1/enrich/person",
      request as Record<string, unknown>
    );
  }

  async enrichCompany(
    request: Types.EnrichCompanyRequest
  ): Promise<Types.EnrichCompanyResponse> {
    return this.request<Types.EnrichCompanyResponse>(
      "POST",
      "/api/v1/enrich/company",
      request as Record<string, unknown>
    );
  }

  async searchPeople(
    request: Types.SearchPeopleRequest
  ): Promise<Types.SearchPeopleResponse> {
    return this.request<Types.SearchPeopleResponse>(
      "POST",
      "/api/v1/search/people",
      request    );
  }

  async searchCompanies(
    request: Types.SearchCompaniesRequest
  ): Promise<Types.SearchCompaniesResponse> {
    return this.request<Types.SearchCompaniesResponse>(
      "POST",
      "/api/v1/search/companies",
      request    );
  }

  async getCreditsBalance(): Promise<Types.CreditsBalanceResponse> {
    return this.request<Types.CreditsBalanceResponse>(
      "GET",
      "/api/v1/credits/balance"
    );
  }

  async getCompanyInsights(
    request: Types.CompanyInsightsRequest
  ): Promise<Types.CompanyInsights> {
    const params = new URLSearchParams();
    if (request.identifier) {
      params.append("identifier", request.identifier);
    }
    if (request.domain) {
      params.append("domain", request.domain);
    }

    const url = `/api/v1/company/insights?${params.toString()}`;
    return this.request<Types.CompanyInsights>("GET", url);
  }

  async getProfessional NetworkPosts(
    req: Types.GetProfessional NetworkPostsRequest
  ): Promise<Types.GetProfessional NetworkPostsResponse> {
    const params = new URLSearchParams();
    params.append("url", req.url);
    if (req.max_results !== undefined && req.max_results !== null) {
      params.append("max_results", String(req.max_results));
    }
    if (req.pagination_token) {
      params.append("pagination_token", req.pagination_token);
    }

    const url = `/api/v2/posts?${params.toString()}`;
    return this.request<Types.GetProfessional NetworkPostsResponse>("GET", url);
  }

  async searchPosts(
    req: Types.SearchPostsRequest
  ): Promise<Types.SearchPostsResponse> {
    return this.request<Types.SearchPostsResponse>(
      "POST",
      "/api/v1/search/posts",
      req
    );
  }
}
