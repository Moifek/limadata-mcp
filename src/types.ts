// TypeScript type definitions for all Limadata API endpoints
//
// Request/Response Pairs (8 tools):
// 1. Enrich Person:        EnrichPersonRequest -> EnrichPersonResponse
// 2. Enrich Company:       EnrichCompanyRequest -> EnrichCompanyResponse
// 3. Search People:        SearchPeopleRequest -> SearchPeopleResponse
// 4. Search Companies:     SearchCompaniesRequest -> SearchCompaniesResponse
// 5. Company Insights:     CompanyInsightsRequest -> CompanyInsights
// 6. Get Professional Network Posts:   GetProfessional NetworkPostsRequest -> GetProfessional NetworkPostsResponse
// 7. Search Posts:         SearchPostsRequest -> SearchPostsResponse
// 8. Credits Balance:      (no request) -> CreditsBalanceResponse
//
// Supporting Types:
// - Person: Full person profile from enrich/search
// - InsightsPerson: Simplified person object in company insights
// - Company: Full company profile from enrich
// - CompanySearchResult: Minimal company object from search
// - PersonSearchResult: Minimal person object from search
// - Professional NetworkPost: Post object with full metadata
// - AttachedPost: Post object (simplified, used in reposts)
// - Money, Employment, Education, Location, PhoneNumber: Common structures
// - And 20+ other supporting interfaces for nested data

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

// Used in Company Insights (simplified person object)
export interface InsightsPerson {
  image: string | null;
  name: string | null;
  permalink: string | null;
  title: string | null;
}

export interface InsightsFundingRound {
  announced_on: string | null;
  id: string | null;
  image: string | null;
  investor_count: number | null;
  lead_investors: InsightsPerson[];
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
  acquiree: InsightsPerson;
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
  employees: InsightsPerson[];
  investors: InsightsPerson[];
  funding_rounds: InsightsFundingRound[];
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

// ── Find endpoints ────────────────────────────────────────────────────────────

export interface FindWorkEmailRequest {
  full_name: string;
  company_domain: string;
}

export interface FindWorkEmailResponse {
  email: string | null;
}

export interface FindPhoneRequest {
  profnet_url?: string | null;
  name?: string | null;
  company_name?: string | null;
  company_domain?: string | null;
}

export interface FindPhoneResponse {
  phone_numbers: PhoneNumber[];
}

export interface ResolveIdentityRequest {
  full_name: string;
  company_domain?: string | null;
  company_name?: string | null;
  email?: string | null;
}

export interface ResolveIdentityResponse {
  profnet_url: string | null;
  github_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
}

export interface FindCompanyProfessional NetworkRequest {
  domain: string;
}

export interface FindCompanyProfessional NetworkResponse {
  profnet_url: string | null;
}

export interface ReverseEmailLookupRequest {
  email: string;
  require_profnet?: boolean | null;
  require_x?: boolean | null;
}

export interface ReverseEmailLookupResponse {
  profnet_url: string | null;
  github_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
}

// ── Company endpoints ──────────────────────────────────────────────────────────

export interface GetCompanyRequest {
  url: string;
  live?: boolean | null;
}

export interface Professional NetworkCompanyFundingRound {
  name: string | null;
  amount_text: string | null;
  amount: number | null;
  currency: string | null;
  url: string | null;
  date: string | null;
}

export interface Professional NetworkCompanyInvestor {
  name: string | null;
  url: string | null;
  logo_url: string | null;
}

export interface Professional NetworkCompanyFunding {
  bizdata_url: string | null;
  rounds: number | null;
  last_funding_round: Professional NetworkCompanyFundingRound;
  investors: Professional NetworkCompanyInvestor[];
}

export interface Professional NetworkCompanyHeadquarters {
  city: string | null;
  state: string | null;
  country: string | null;
  text: string | null;
}

export interface Professional NetworkCompanyLocation {
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_hq: boolean | null;
}

export interface Professional NetworkCompany {
  id: string | null;
  name: string | null;
  public_identifier: string | null;
  profile_url: string | null;
  domain: string | null;
  website: string | null;
  founded_year: number | null;
  industries: string[];
  tagline: string | null;
  description: string | null;
  employee_count: number;
  company_size: string | null;
  company_type: string | null;
  follower_count: number;
  profile_image_url: string | null;
  cover_image_url: string | null;
  specialities: string[];
  headquarters: Professional NetworkCompanyHeadquarters;
  locations: Professional NetworkCompanyLocation[];
  funding: Professional NetworkCompanyFunding;
}

export interface GetCompanyJobsRequest {
  url: string;
  page?: number | null;
}

export interface JobHiringTeamMember {
  full_name: string | null;
  profile_url: string | null;
  image_url: string | null;
  headline: string | null;
}

export interface JobCompany {
  id: string | null;
  name: string | null;
  url: string | null;
  logo_url: string | null;
  employee_count: number | null;
}

export interface JobListing {
  id: string | null;
  url: string | null;
  title: string | null;
  company_name: string | null;
  company: JobCompany;
  location: string | null;
  country: string | null;
  employment_status: string | null;
  experience_level: string | null;
  industries: string | null;
  description: string | null;
  benefits: string | null;
  company_apply_url: string | null;
  easy_apply_url: string | null;
  listed_at: string | null;
  hiring_team: JobHiringTeamMember[];
}

export interface GetCompanyJobsResponse {
  total_count: number;
  jobs: JobListing[];
}

// ── Prospect endpoints ─────────────────────────────────────────────────────────

export interface ProspectorRangeValue {
  sub_filter?: string;
  min: number;
  max: number;
}

export interface ProspectorRequestFilter {
  filter_type: string;
  operator?: string | null;
  values?: string[] | null;
  range_value?: ProspectorRangeValue | null;
}

export interface ProspectPersonPosition {
  company_name: string | null;
  company_domain: string | null;
  title: string | null;
  profile_url: string | null;
  company_slug_url: string | null;
  image_url: string | null;
  company_id: string | null;
  is_current: boolean | null;
  started_at_position: string | null;
  started_at_company: string | null;
}

export interface ProspectPersonResult {
  full_name: string | null;
  profile_url: string | null;
  headline: string | null;
  location: string | null;
  image_url: string | null;
  position: ProspectPersonPosition;
}

export interface ProspectCompanyResult {
  company_name: string | null;
  company_domain: string | null;
  profile_url: string | null;
  company_id: string | null;
  image_url: string | null;
  description: string | null;
  industry: string | null;
  employee_count_range: string | null;
  employee_count: number | null;
}

export interface ProspectCompaniesFilterRequest {
  filters: ProspectorRequestFilter[];
  page?: number;
}

export interface ProspectCompaniesResponse {
  total_count: number;
  companies: ProspectCompanyResult[];
}

export interface ProspectCompaniesByUrlRequest {
  search_url: string;
  page?: number;
}

export interface ProspectPeopleFilterRequest {
  filters: ProspectorRequestFilter[];
  page?: number;
  settings_match_all_company_urls?: boolean | null;
}

export interface ProspectPeopleResponse {
  total_count: number;
  people: ProspectPersonResult[];
}

export interface ProspectPeopleByUrlRequest {
  search_url: string;
  page?: number;
}

export interface ProspectEmployeesRequest {
  url: string;
  keyword?: string | null;
  titles?: string[];
  locations?: string[];
  seniorities?: string[];
  recently_changed_jobs?: boolean | null;
  page?: number;
}

// ── Watch API ──────────────────────────────────────────────────────────────────

export type WatchType =
  | "PersonJobChanges"
  | "PersonProfileUpdates"
  | "PersonSocialPosts"
  | "CompanySocialPosts"
  | "CompanyJobPosts";

export interface WatchResponse {
  id: number;
  name: string | null;
  type: WatchType;
  notification_url: string | null;
  frequency_days: number;
  is_active: boolean;
}

export interface WatchSettings {
  people_urls?: string[];
  company_urls?: string[];
}

export interface CreateWatchRequest {
  name: string;
  type: WatchType;
  notification_url: string;
  frequency_days: number;
  external_id?: string | null;
  settings?: WatchSettings | null;
}

export interface ListWatchesRequest {
  page?: number | null;
}

export interface ListWatchesResponse {
  watches: WatchResponse[];
}

export interface UpdateWatchRequest {
  id: number;
  name?: string;
  notification_url?: string | null;
  frequency_days?: number;
  is_active?: boolean | null;
  external_id?: string;
}

// ── Database endpoints (BETA) ──────────────────────────────────────────────────

export interface DbProspectFilter {
  filter_type: string;
  includes?: string[];
  excludes?: string[];
}

export interface DatabaseSearchCompanyRequest {
  ai_prompt?: string | null;
  filters?: DbProspectFilter[] | null;
  filter_expression?: string | null;
  max_records?: number;
  include_total?: boolean;
}

export interface DatabaseSearchPeopleRequest {
  ai_prompt?: string | null;
  filters?: DbProspectFilter[] | null;
  filter_expression?: string | null;
  max_records?: number;
  include_total?: boolean;
}

export interface DbPersonExperienceRole {
  title: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
}

export interface DbPersonExperience {
  company: string | null;
  title: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  company_id: string | null;
  profile_url: string | null;
  logo_url: string | null;
  description: string | null;
  employment_type: string | null;
  workplace_type: string | null;
  skills: string[];
  roles: DbPersonExperienceRole[];
}

export interface DbPersonEducation {
  school: string | null;
  degree_name: string | null;
  field_of_study: string | null;
  starts_at: string | null;
  ends_at: string | null;
  school_id: string | null;
  logo_url: string | null;
  profile_url: string | null;
}

export interface DbPersonCertification {
  name: string | null;
  issuer: string | null;
  issued_at: string | null;
  expires_at: string | null;
  credential_id: string | null;
}

export interface DbPersonResult {
  full_name: string | null;
  profile_url: string | null;
  urn: string | null;
  website: string | null;
  connections: number | null;
  followers: number | null;
  premium: boolean | null;
  verified: boolean | null;
  open_to_work: boolean | null;
  hiring: boolean | null;
  headline: string | null;
  about: string | null;
  location: Location;
  profile_image_url: string | null;
  cover_image_url: string | null;
  experiences: DbPersonExperience[];
  educations: DbPersonEducation[];
  languages: Array<{ name: string | null; proficiency: string | null }>;
  certifications: DbPersonCertification[];
  skills: Array<{ name: string | null }>;
  recommendations: Array<{
    type: string | null;
    name: string | null;
    profile_url: string | null;
    text: string | null;
  }>;
}

export interface DatabaseSearchPeopleResponse {
  total_records: number | null;
  filter_expression: string | null;
  results: DbPersonResult[];
}

// ── Shared metadata ────────────────────────────────────────────────────────────

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
