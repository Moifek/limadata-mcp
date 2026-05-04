# TODO: Limadata MCP Server

## Blocking Issues

### 🔴 CRITICAL: Need Real API Spec from Jack

**Problem:** Limadata API docs are behind login wall at `app.limadata.com`. We've only inferred the API surface from public marketing pages.

**What we need from Jack:**
1. Limadata account login credentials OR
2. OpenAPI/Swagger spec export (JSON/YAML) OR  
3. Postman collection export (JSON)

**How Jack can get it:**
- Log into `https://app.limadata.com`
- Look for "Developers", "API Docs", or "Settings" section
- Find API documentation / reference
- Export spec in OpenAPI format OR Postman collection format
- Share file with dev team

**Why this matters:**
- We can't build real tools without knowing actual endpoint paths
- Query parameters and schemas need to match real API
- Can't test without real endpoints
- Assumptions = broken implementation

---

## Research Done ✅

- [x] Searched for public limadata API docs
- [x] Inferred API surface from marketing pages
- [x] Identified 9 main API areas (enrichment, search, watch, etc.)
- [x] Confirmed Bearer token auth
- [x] Documented current gaps

## Next Steps (Unblocked by Spec)

- [ ] **Get spec from Jack** ← Do this first
- [ ] Analyze actual endpoint paths and parameters
- [ ] Map endpoints to MCP tool signatures
- [ ] Identify which tools are high-priority
- [ ] Design error handling & rate limiting
- [ ] Create API client TypeScript interfaces

## Once Spec Arrives

1. Parse OpenAPI spec or Postman collection
2. List all actual endpoints with real paths
3. Confirm which ones to build into tools
4. Generate TypeScript types from spec
5. Build & test against Jack's account

---

## Notes

- **No assumptions about API shape** — will wait for real spec
- **Bearer token auth confirmed** from public docs
- **Base URL unknown** — will be in spec
- **Watch API needs special handling** for webhook delivery & events
- **Rate limiting** unknown — will check spec for limits & quotas
