# Limadata API Contract

**Base URL:** `https://api.limadata.com`  
**Authentication:** Bearer token via `x-api-key` header  
**API Version:** v1/v2 (mixed)

## Response Headers

All responses include:
- `x-credits-cost`: Number of credits used for request
- `x-credits-remaining`: Credits remaining in account

## Error Handling

- **400** - Bad Request (no charge)
- **401** - Unauthorized
- **402** - Insufficient Credits (no charge)
- **429** - Too Many Requests (no charge, apply backoff)
- **5xx** - Server error (no charge, apply backoff)

## Rate Limits

- **Global:** 1 request/sec per account
- **Exempt endpoints:** Enrich Person/Company, Credits Balance (higher concurrency allowed)

---

## Implemented Tools

### 1. Enrich Person

**Endpoint:** `POST /api/v1/enrich/person`

**Description:** Enrich a person's professional profile using email, Professional Network URL, or name+company. Returns comprehensive profile data including work history, education, social profiles, and current company information.

**Rate Limit:** Exempt from global rate limit

**Credits:**
- 1 credit: Professional Network URL or work email
- 2 credits: Name + Company lookup
- 5 credits: Personal email
- +1 credit: Optional work email inclusion
- +10 credits: Optional phone number inclusion

**Request Body:**
```typescript
{
  // Choose one of three identification methods:
  
  // Option 1: Email address (required with this method)
  email?: string;                    // e.g., john.doe@company.com
  
  // Option 2: Name + Company (both required)
  name?: string;                     // e.g., John Doe
  company_name?: string;             // e.g., Microsoft
  company_domain?: string;           // e.g., microsoft.com
  
  // Option 3: Professional Network URL
  profnet_url?: string;             // e.g., https://profnet.com/in/johndoe
  
  // Optional enrichments
  include_work_email?: boolean;      // Adds 1 credit if found
  include_phone?: boolean;           // Adds 10 credits if found
}
```

**Response (200 OK):**
```typescript
{
  person: {
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    headline: string | null;
    about: string | null;
    gender: string | null;
    age_in_years: number | null;
    location: {
      city: string | null;
      state: string | null;
      country: string | null;
      text: string | null;
    };
    emails: string[];
    phone_numbers: Array<{
      number: string | null;
      type: string | null;
    }>;
    profnet: {
      handle: string | null;
      url: string | null;
    };
    github: {
      handle: string | null;
      url: string | null;
    };
    x: {
      handle: string | null;
      url: string | null;
    };
    facebook: {
      handle: string | null;
      url: string | null;
    };
    employment: {
      title: string | null;
      company_name: string | null;
      company_domain: string | null;
      location: string | null;
      seniority: string | null;
      start_date: string | null;
      end_date: string | null;
    };
    education: {
      degree_name: string | null;
      school_name: string | null;
      start_date: string | null;
      end_date: string | null;
    };
    profile_image_url: string | null;
  };
  company: CompanyObject;
}
```

---

### 2. Enrich Company

**Endpoint:** `POST /api/v1/enrich/company`

**Description:** Enrich a company's profile using domain or Professional Network URL. Returns comprehensive firmographic data including industry, size, locations, funding, and social presence.

**Rate Limit:** Exempt from global rate limit

**Credits:** 1 credit per request

**Request Body:**
```typescript
{
  // At least one required
  domain?: string;                   // e.g., microsoft.com or https://microsoft.com
  profnet_url?: string;             // e.g., https://profnet.com/company/microsoft
}
```

**Response (200 OK):**
```typescript
{
  company: CompanyObject;
}
```

---

### 3. Search People

**Endpoint:** `POST /api/v1/search/people`

**Description:** Search for people by keywords with optional filters for title, company, location, and industry. Optimized for targeted searches (specific names, titles, etc.), not bulk lead generation.

**Rate Limit:** Global (1 req/sec)

**Credits:** 2 credits per request

**Request Body:**
```typescript
{
  // Required
  query: string;                    // Search keywords (e.g., "John Smith", "Software Engineer", "Product Manager in SF")
  
  // Optional filters
  title?: string;                   // Job title keywords (e.g., "Software Engineer")
  company?: string;                 // Company name keywords (e.g., "Microsoft")
  first_name?: string;              // First name keywords
  last_name?: string;               // Last name keywords
  
  current_company_list?: string;    // Comma-separated Professional Network company IDs
                                    // Example: "1035" for Microsoft
  
  past_company_list?: string;       // Comma-separated Professional Network company IDs (previous employers)
  
  industry_list?: string;           // Comma-separated Professional Network industry IDs
                                    // Example: "4" for Software Development
  
  location_list?: string;           // Comma-separated location IDs
                                    // Example: "103644278" for United States
  
  page?: number;                    // Page number (1-100, default: 1)
}
```

**Response (200 OK):**
```typescript
{
  total_count: number;
  people: Array<{
    full_name: string | null;
    profile_url: string | null;
    image_url: string | null;
    headline: string | null;
    location: string | null;
  }>;
}
```

**Important Note:** This endpoint is optimized for targeted searches. Requests with overly broad criteria may return limited results or be rejected. Keep searches specific (e.g., "John Smith at Microsoft" rather than just "Software Engineer").

---

### 4. Search Companies

**Endpoint:** `POST /api/v1/search/companies`

**Description:** Search for companies by keywords with optional filters for size, location, industry, and hiring status.

**Rate Limit:** Global (1 req/sec)

**Credits:** 2 credits per request

**Request Body:**
```typescript
{
  // Required
  query: string;                    // Search keywords (e.g., "AI companies", "Microsoft")
  
  // Optional filters
  company_size?: string;            // Comma-separated codes: A,B,C,D,E,F,G,H
                                    // A=1-10, B=11-50, C=51-200, D=201-500, E=501-1000, 
                                    // F=1001-5000, G=5001-10000, H=10001+
                                    // Example: "F,G,H" for companies with 1000+ employees
  
  industry_list?: string;           // Comma-separated Professional Network industry IDs
                                    // Example: "4" for Software Development
                                    // Find IDs in Professional Network search query strings
  
  location_list?: string;           // Comma-separated location IDs
                                    // Example: "103644278" for United States
                                    // Use /references/locations endpoint to find IDs
  
  has_jobs?: boolean;               // Filter for companies currently hiring
  
  page?: number;                    // Page number (1-100, default: 1)
}
```

**Response (200 OK):**
```typescript
{
  companies: Array<{
    name: string | null;
    url: string | null;
    image_url: string | null;
    industry: string | null;
    location: string | null;
    headline: string | null;
  }>;
}
```

---

### 5. Company Insights

**Endpoint:** `GET /api/v1/company/insights`

**Description:** Get detailed company insights from Business Intelligence and other data sources. Returns comprehensive data including news, funding rounds, investors, employees, technology stack, acquisitions, and IT spending. Perfect for lead scoring and company research.

**Rate Limit:** Global (1 req/sec)

**Credits:** 5 credits per request

**Query Parameters (exactly one required):**
```typescript
{
  identifier?: string;    // Business Intelligence identifier (e.g., "amazon")
                          // Last part of Business Intelligence URL
                          // Only use if you know the identifier
  
  domain?: string;        // Company domain (e.g., "amazon.com")
                          // Use this if you don't know the Business Intelligence identifier
                          // Returns 404 with no charge if identifier can't be found
}
```

**Response (200 OK):**
```typescript
{
  name: string | null;
  website: string | null;
  profile_url: string | null;
  headline: string | null;
  description: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  categories: string[];
  operating_status: string | null;
  founded_date: string | null;
  company_type: string | null;
  employee_range: string | null;
  ipo_status: string | null;
  
  // Social & profiles
  linked_in: string | null;
  twitter: string | null;
  facebook: string | null;
  
  // Team
  advisor_count: number | null;
  investor_count: number | null;
  employees: Array<{ name, title, image, permalink }>;
  investors: Array<{ name, title, image, permalink }>;
  
  // Funding
  funding_rounds_count: number | null;
  funding_total: { currency, value, value_usd };
  funding_rounds: Array<{
    announced_on: string;
    money_raised: { currency, value, value_usd };
    lead_investors: Array<{ name, title }>;
  }>;
  
  // M&A
  acquired_by: { acquirer, acquisition_price, date };
  acquisitions: Array<{ acquiree, announced_on, price }>;
  
  // Technology & web
  technology: {
    monthly_web_visits: number | null;
    monthly_web_visits_growth: number | null;
    actively_used_products_count: number | null;
    it_spend: { currency, value, value_usd };
    interest_signals: Array<{ topic, surge_score }>;
  };
  
  // Coverage
  news: Array<{ title, url, publisher, date, thumbnail_url }>;
  similar_companies: Array<{ name, url }>;
}
```

---

### 6. Credits Balance

**Endpoint:** `GET /api/v1/credits/balance`

**Description:** Get current credit balance. Can also extract balance from `x-credits-remaining` header on any response.

**Rate Limit:** Exempt from global rate limit

**Credits:** No charge

**Request:** No body, just authentication header

**Response (200 OK):**
```typescript
{
  balance: number;
}
```

---

## Type Definitions

### CompanyObject

```typescript
{
  name: string | null;
  domain: string | null;
  website: string | null;
  logo_url: string | null;
  founded_year: number | null;
  type: string | null;
  
  employees: {
    employee_count: number | null;
    employee_range: string | null;
    employee_growth_rate: number | null;
  };
  
  emails: string[];
  phones: string[];
  tagline: string | null;
  description: string | null;
  
  funding: {
    total_amount: number | null;
    round_count: number | null;
    lead_investors: string[];
    funding_rounds: Array<{
      type: string | null;
      amount: number | null;
      amount_text: string | null;
      date: string | null;
      number_of_investors: number | null;
    }>;
  };
  
  profnet: {
    handle: string | null;
    url: string | null;
    website: string | null;
    follower_count: number | null;
    logo_url: string | null;
    cover_image_url: string | null;
  };
  
  bizdata: {
    handle: string | null;
    url: string | null;
  };
  
  facebook: {
    handle: string | null;
    url: string | null;
  };
  
  x: {
    handle: string | null;
    url: string | null;
  };
  
  locations: Array<{
    street: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    is_hq: boolean | null;
  }>;
  
  revenue: {
    min: number | null;
    max: number | null;
    range: string | null;
  };
  
  traffic: {
    monthly_total: number | null;
    monthly_organic: number | null;
    monthly_paid: number | null;
    monthly_google_ad_spend: number | null;
  };
  
  apps: {
    has_mobile_app: boolean | null;
    has_web_app: boolean | null;
    app_store: {
      url: string | null;
      rating: number | null;
      review_count: number | null;
      download_count: number | null;
      category: string | null;
    };
    play_store: {
      url: string | null;
      rating: number | null;
      review_count: number | null;
      download_count: number | null;
      category: string | null;
    };
  };
  
  categories: {
    industry: string | null;
    specialities: string[];
    keywords: string[];
    sic_codes: string[];
    naics_codes: string[];
  };
  
  technologies: {
    categories: Record<string, string[]>;
  };
  
  email_technology: {
    hosting: string[];
    security: string[];
  };
  
  attributes: {
    domain_tld: string | null;
    is_website_working: boolean | null;
    legal_type: string | null;
  };
}
```

### PersonObject

Similar to person field in Enrich Person response.
