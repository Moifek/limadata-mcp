import * as Types from "./types.js";

const BASE_URL = "https://api.limadata.com";
const DEFAULT_TIMEOUT = 30000;

export class LiamataAPIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
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
      request as unknown as Record<string, unknown>
    );
  }

  async searchCompanies(
    request: Types.SearchCompaniesRequest
  ): Promise<Types.SearchCompaniesResponse> {
    return this.request<Types.SearchCompaniesResponse>(
      "POST",
      "/api/v1/search/companies",
      request as unknown as Record<string, unknown>
    );
  }

  async getCreditsBalance(): Promise<Types.CreditsBalanceResponse> {
    return this.request<Types.CreditsBalanceResponse>(
      "GET",
      "/api/v1/credits/balance"
    );
  }
}
