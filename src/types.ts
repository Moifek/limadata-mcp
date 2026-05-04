// Core API response/request types

export interface EnrichPersonRequest {
  email?: string | null;
  name?: string | null;
  company_name?: string | null;
  company_domain?: string | null;
  profnet_url?: string | null;
  include_work_email?: boolean | null;
  include_phone?: boolean | null;
}

export interface EnrichCompanyRequest {
  domain?: string | null;
  profnet_url?: string | null;
}

export interface Location {
  city: string | null;
  state: string | null;
  country: string | null;
  text: string | null;
}

export interface PhoneNumber {
  number: string | null;
  type: string | null;
}

export interface SocialProfile {
  handle: string | null;
  url: string | null;
}

export interface Professional NetworkProfile extends SocialProfile {
  website?: string | null;
  follower_count?: number | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
}

export interface Employment {
  title: string | null;
  company_name: string | null;
  company_domain: string | null;
  location: string | null;
  seniority: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Education {
  degree_name: string | null;
  school_name: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Person {
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  about: string | null;
  gender: string | null;
  age_in_years: number | null;
  location: Location;
  emails: string[];
  phone_numbers: PhoneNumber[];
  profnet: SocialProfile;
  github: SocialProfile;
  x: SocialProfile;
  facebook: SocialProfile;
  employment: Employment;
  education: Education;
  profile_image_url: string | null;
}

export interface FundingRound {
  type: string | null;
  amount: number | null;
  amount_text: string | null;
  date: string | null;
  number_of_investors: number | null;
}

export interface Funding {
  total_amount: number | null;
  round_count: number | null;
  lead_investors: string[];
  funding_rounds: FundingRound[];
}

export interface Employees {
  employee_count: number | null;
  employee_range: string | null;
  employee_growth_rate: number | null;
}

export interface AppStoreInfo {
  url: string | null;
  rating: number | null;
  review_count: number | null;
  download_count: number | null;
  category: string | null;
}

export interface Apps {
  has_mobile_app: boolean | null;
  has_web_app: boolean | null;
  app_store: AppStoreInfo;
  play_store: AppStoreInfo;
}

export interface Categories {
  industry: string | null;
  specialities: string[];
  keywords: string[];
  sic_codes: string[];
  naics_codes: string[];
}

export interface Technologies {
  categories: Record<string, string[]>;
}

export interface EmailTechnology {
  hosting: string[];
  security: string[];
}

export interface CompanyLocation {
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  is_hq: boolean | null;
}

export interface Revenue {
  min: number | null;
  max: number | null;
  range: string | null;
}

export interface Traffic {
  monthly_total: number | null;
  monthly_organic: number | null;
  monthly_paid: number | null;
  monthly_google_ad_spend: number | null;
}

export interface CompanyAttributes {
  domain_tld: string | null;
  is_website_working: boolean | null;
  legal_type: string | null;
}

export interface Company {
  name: string | null;
  domain: string | null;
  website: string | null;
  logo_url: string | null;
  founded_year: number | null;
  type: string | null;
  employees: Employees;
  emails: string[];
  phones: string[];
  tagline: string | null;
  description: string | null;
  funding: Funding;
  profnet: Professional NetworkProfile;
  bizdata: SocialProfile;
  facebook: SocialProfile;
  x: SocialProfile;
  locations: CompanyLocation[];
  revenue: Revenue;
  traffic: Traffic;
  apps: Apps;
  categories: Categories;
  technologies: Technologies;
  email_technology: EmailTechnology;
  attributes: CompanyAttributes;
}

export interface EnrichPersonResponse {
  person: Person;
  company: Company;
}

export interface EnrichCompanyResponse {
  company: Company;
}

export interface CreditsBalanceResponse {
  balance: number;
}

export interface SearchPeopleRequest {
  query: string; // Required: search keywords
  title?: string | null; // Optional: job title keywords
  company?: string | null; // Optional: company name keywords
  first_name?: string | null; // Optional: first name keywords
  last_name?: string | null; // Optional: last name keywords
  location_list?: string | null; // Optional: comma-separated location IDs
  current_company_list?: string | null; // Optional: comma-separated Professional Network company IDs
  past_company_list?: string | null; // Optional: comma-separated Professional Network company IDs
  industry_list?: string | null; // Optional: comma-separated Professional Network industry IDs
  page?: number; // Optional: page number (1-100)
}

export interface PersonSearchResult {
  full_name: string | null;
  profile_url: string | null;
  image_url: string | null;
  headline: string | null;
  location: string | null;
}

export interface SearchPeopleResponse {
  total_count: number;
  people: PersonSearchResult[];
}

export interface SearchCompaniesRequest {
  query: string; // Required: search keywords
  company_size?: string | null; // Optional: comma-separated codes (A,B,C,D,E,F,G,H)
  industry_list?: string | null; // Optional: comma-separated Professional Network industry IDs
  location_list?: string | null; // Optional: comma-separated location IDs
  has_jobs?: boolean | null; // Optional: filter for companies currently hiring
  page?: number; // Optional: page number (1-100)
}

export interface CompanySearchResult {
  name: string | null;
  url: string | null;
  image_url: string | null;
  industry: string | null;
  location: string | null;
  headline: string | null;
}

export interface SearchCompaniesResponse {
  companies: CompanySearchResult[];
}

export interface APIError {
  status: number;
  message: string;
  type?: string;
}
