import * as Types from "./types.js";

const BASE_URL = "https://api.limadata.com";
const DEFAULT_TIMEOUT = 30000;

export class LimadataAPIClient {
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
    return this.requestHistory.slice();
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

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    });

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
    if (this.requestHistory.length > 5) this.requestHistory.shift();

    let data;
    try {
      data = await response.json() as T & { error?: unknown };
    } catch {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      throw new Error("Failed to parse response");
    }

    if (!response.ok) {
      const apiError = data as unknown as Record<string, unknown>;
      const bodyMessage =
        typeof data.error === "string"
          ? data.error
          : typeof apiError.detail === "string"
          ? apiError.detail
          : typeof apiError.message === "string"
          ? apiError.message
          : null;

      if (response.status === 401) throw new Error("Invalid API key. Set LIMADATA_API_KEY correctly.");
      if (response.status === 402) throw new Error("Insufficient credits. Check balance with get_credits_balance.");
      if (response.status === 429) throw new Error("Rate limit exceeded. Wait 1 second before retrying.");
      throw new Error(bodyMessage ?? `HTTP ${response.status}`);
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
      request
    );
  }

  async searchCompanies(
    request: Types.SearchCompaniesRequest
  ): Promise<Types.SearchCompaniesResponse> {
    return this.request<Types.SearchCompaniesResponse>(
      "POST",
      "/api/v1/search/companies",
      request
    );
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
