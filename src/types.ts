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

export interface Money {
  currency: string | null;
  value: number | null;
  value_usd: number | null;
}

export interface Person {
  image: string | null;
  name: string | null;
  permalink: string | null;
  title: string | null;
}

export interface FundingRound {
  announced_on: string | null;
  id: string | null;
  image: string | null;
  investor_count: number | null;
  lead_investors: Person[];
  money_raised: Money;
}

export interface NewsItem {
  date: string | null;
  organization: string | null;
  publisher: string | null;
  thumbnail_url: string | null;
  title: string | null;
  url: string | null;
}

export interface Acquisition {
  acquiree: Person;
  announced_on: string | null;
  price: Money;
}

export interface AcquiredBy {
  acquirer: string | null;
  acquirer_permalink: string | null;
  acquisition_price: string | null;
  date: string | null;
  transaction_name: string | null;
}

export interface InterestSignal {
  topic: string | null;
  surge_score: number | null;
}

export interface TechnologyInsights {
  monthly_web_visits: number | null;
  monthly_web_visits_growth: number | null;
  actively_used_products_count: number | null;
  active_website_tech_count: number | null;
  total_ip_count: number | null;
  most_popular_ip_class: string | null;
  it_spend: Money;
  interest_signals: InterestSignal[];
}

export interface CompanyInsights {
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
  logo_url: string | null;
  legal_name: string | null;
  stock_symbol: string | null;
  linked_in: string | null;
  twitter: string | null;
  facebook: string | null;
  advisor_count: number | null;
  investor_count: number | null;
  funding_rounds_count: number | null;
  funding_total: Money;
  acquired_by: AcquiredBy;
  employees: Person[];
  investors: Person[];
  funding_rounds: FundingRound[];
  news: NewsItem[];
  similar_companies: Array<{ name: string | null; url: string | null }>;
  technology: TechnologyInsights;
  acquisitions: Acquisition[];
}

export interface CompanyInsightsRequest {
  identifier?: string | null; // Business Intelligence identifier
  domain?: string | null; // Company domain (if identifier not provided)
}

export interface PostActor {
  name: string | null;
  image_url: string | null;
  profile_url: string | null;
  headline: string | null;
}

export interface PostVideo {
  thumbnail: string | null;
  url: string | null;
  duration: number | null;
}

export interface PostArticle {
  title: string | null;
  subtitle: string | null;
  url: string | null;
  image_url: string | null;
}

export interface PostDocument {
  title: string | null;
  url: string | null;
}

export interface ReactionCount {
  type: string | null;
  count: number;
}

export interface AttachedPost {
  text: string | null;
  url: string | null;
  posted_on: string; // ISO date
  actor: PostActor;
  links: string[];
  images: string[];
  videos: PostVideo[];
}

export interface Professional NetworkPost {
  text: string | null;
  url: string | null;
  posted_on: string; // ISO date
  actor: PostActor;
  links: string[];
  images: string[];
  videos: PostVideo[];
  article: PostArticle;
  document: PostDocument;
  is_repost: boolean;
  attached_post: AttachedPost | null;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  reaction_counts: ReactionCount[];
  reactions_urn: string | null;
  comments_urn: string | null;
}

export interface GetProfessional NetworkPostsRequest {
  url: string; // Professional Network profile URL (person or company)
  max_results?: number | null;
  pagination_token?: string | null;
}

export interface GetProfessional NetworkPostsResponse {
  pagination_token: string | null;
  posts: Professional NetworkPost[];
}

export interface SearchPostsRequest {
  query: string; // Search query/keywords
  author_company?: string | null; // Comma-separated Professional Network company IDs
  author_industry?: string | null; // Comma-separated Professional Network industry URNs
  author_job_title?: string | null; // Job title keywords
  content_type?: string | null; // photos, videos, liveVideos, collaborativeArticles, documents
  from_member?: string | null; // Comma-separated Professional Network member URNs
  from_organization?: string | null; // Comma-separated Professional Network organization IDs
  mentions_member?: string | null; // Comma-separated Professional Network member URNs
  mentions_organization?: string | null; // Comma-separated Professional Network organization IDs
  page?: number | null; // Page number (1-100)
  sort_by_latest?: boolean | null; // true for latest, false/null for most relevant
}

export interface SearchPostsResponse {
  total_count: number;
  posts: Professional NetworkPost[];
}

export interface ResponseMetadata {
  creditsCost: number | null;
  creditsRemaining: number | null;
  timestamp: Date;
  endpoint: string;
}

export interface APIError {
  status: number;
  message: string;
  type?: string;
}
