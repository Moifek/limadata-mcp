# Technical Architecture & Design Decisions

## Overview

Limadata MCP is a Model Context Protocol server that provides Claude with real-time access to company and people data from the Limadata API. It implements a **middleware-based architecture** with automatic credit tracking and strict input validation.

## Architecture Decisions

### 1. **Middleware Pattern for Response Capture**

**Decision**: Implement response header capture at the HTTP client level.

**Why**:
- ✅ Automatic — no duplication across 6+ tools
- ✅ Single source of truth — one place captures credits
- ✅ Transparent — users don't need to manage state
- ✅ Auditable — request history for debugging

**Implementation**:
```typescript
// client.ts: Middleware intercepts all responses
private lastMetadata: ResponseMetadata | null = null;
private requestHistory: ResponseMetadata[] = [];

// Captured headers: x-credits-cost, x-credits-remaining, endpoint, timestamp
```

**Trade-offs**:
- Slightly increases response size (footer text ~100 bytes)
- Stores request history in memory (max 5 requests)

### 2. **Strict Input Validation**

**Decision**: Validate all user inputs before making API calls.

**Why**:
- Prevents wasting credits on invalid requests (402 errors don't charge)
- Provides fast feedback to users
- Documents expected input format per tool

**Pattern**:
```typescript
// validateEnrichPersonInput() — ensures one of 3 identification methods
// validateSearchPeopleInput() — ensures 'query' is provided
// validateCompanyInsightsInput() — ensures identifier OR domain (not both, not neither)
```

### 3. **Separation of Concerns**

**Three-layer architecture**:

```
Layer 1: Server (server.ts)
├─ Handles MCP protocol
├─ Routes tool calls
└─ Formats responses with credits

Layer 2: Client (client.ts)
├─ HTTP wrapper for Limadata API
├─ Captures response headers (middleware)
├─ Stores metadata + history
└─ Converts errors to exceptions

Layer 3: Types (types.ts)
├─ Full TypeScript interfaces
├─ Request/response schemas
└─ Prevents runtime type errors
```

**Benefits**:
- Easy to test each layer independently
- Easy to swap API client for another provider
- Clear data flow

### 4. **Tool as Atomic Units**

**Decision**: Each tool = one API endpoint + validation.

**Structure**:
```typescript
// tools.ts: Definition + Schema + Validator
export const enrichPersonTool: Tool = { ... }
export function validateEnrichPersonInput(input): Request { ... }

// server.ts: Handler uses validator
case "enrich_person": {
  const validated = Tools.validateEnrichPersonInput(args);
  const result = await client.enrichPerson(validated);
  ...
}
```

**Benefits**:
- Adding a new tool is a predictable, copy-paste-friendly process
- Schemas are single source of truth (used by Claude + validation)
- Easy to test validators in isolation

### 5. **Environment Variable Management**

**Decision**: Use `dotenv` for local dev, environment variables for production.

**Why**:
- `.env` is git-ignored (can't accidentally commit secrets)
- Works in Docker via `-e` flags
- Works in Claude Desktop config via `env` object
- Works in systemd via `Environment=` directive

**File Structure**:
- `.env.example` → template (committed)
- `.env` → local secrets (git-ignored)
- No secrets in code

### 6. **Error Handling Strategy**

**Principle**: Let errors fail fast and clearly.

```typescript
// Input validation errors (caught immediately)
throw new Error("'query' is required for company search");

// API errors (caught + re-thrown with message)
if (!response.ok) {
  throw new Error(errorMessage);  // 400, 402, 429, 5xx
}

// Uncaught errors (server logs, returns isError: true)
catch (error) {
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true
  };
}
```

**Result**: Claude sees clear error messages, not cryptic API responses.

## Design Trade-offs

| Decision | Pro | Con | Alternative |
|----------|-----|-----|-------------|
| Middleware for credits | Automatic, no duplication | Slightly larger responses | Separate metadata tool |
| Strict validation | Fast feedback, saves credits | More code per tool | Rely on API validation |
| Full TypeScript | Type safety, IDE support | More LOC | Any/untyped approach |
| One tool = one endpoint | Clear pattern, easy to extend | Can't do multi-endpoint workflows | Composable tools |
| dotenv for .env | Simple, standard | Need manual setup | Env-only, no default |

## Performance Characteristics

| Operation | Speed | Credits | Scaling |
|-----------|-------|---------|---------|
| Enrich Person | ~300ms | 1-5 | O(1) |
| Enrich Company | ~300ms | 1 | O(1) |
| Search People | ~500ms | 2 | O(results) |
| Search Companies | ~500ms | 2 | O(results) |
| Company Insights | ~800ms | 5 | O(1) |
| Credits Balance | ~100ms | 0 | O(1) |

**Rate Limiting**: 1 request/second globally (per account).

## Security Model

### Secrets Management
```
LIMADATA_API_KEY
├─ Stored in .env (local, git-ignored)
├─ Passed via process.env (never logged)
├─ Sent via x-api-key header (HTTPS only)
└─ Never in code/commits/logs
```

### Input Validation
```
User Input → Tool Handler → Validator → API Call
                              ↓
                    - Check required fields
                    - Validate types
                    - Sanitize strings
                    - Reject ambiguous input
```

### API Key Scope
```
Limadata API Key
├─ Tied to specific account
├─ Controls rate limits (shared across all keys)
├─ Controls credits budget (shared across all keys)
├─ Can be rotated via app.limadata.com
└─ Should never be shared in code/config files
```

## Testing Strategy

### Unit Tests (implicit)
- Input validators catch malformed input
- TypeScript compiler catches type mismatches

### Integration Tests
- `test.sh` exercises all 6 tools
- Requires valid LIMADATA_API_KEY
- Tests real API responses (not mocked)
- Validates response structure

### Manual Testing
```bash
npm test                    # Run integration suite
npm run dev               # Development with watch
npm start                 # Production mode
```

## Extensibility

### Adding a New Tool

1. **Add endpoint to types.ts**
   ```typescript
   export interface NewEndpointRequest { ... }
   export interface NewEndpointResponse { ... }
   ```

2. **Add client method in client.ts**
   ```typescript
   async newEndpoint(req: NewEndpointRequest): Promise<NewEndpointResponse> {
     return this.request<NewEndpointResponse>("METHOD", "/path", body);
   }
   ```

3. **Add tool in tools.ts**
   ```typescript
   export const newEndpointTool: Tool = { ... }
   export function validateNewEndpointInput(input): NewEndpointRequest { ... }
   ```

4. **Add handler in server.ts**
   ```typescript
   case "new_endpoint": {
     const validated = Tools.validateNewEndpointInput(args);
     const result = await client.newEndpoint(validated);
     return { content: [{ type: "text", text: formatToolResult(...) }] };
   }
   ```

5. **Add to toolsList in server.ts**
   ```typescript
   const toolsList = [ ..., Tools.newEndpointTool ];
   ```

6. **Add test to test.sh** (optional)

**Total lines**: ~50 LOC per new tool.

## Known Limitations

1. **No pagination for large result sets** — Search tools return results page by page; batching not supported
2. **No webhook support** — Watch API not yet implemented
3. **In-memory request history** — Only last 5 requests; cleared on restart
4. **Single-threaded** — MCP server handles one request at a time (by design)
5. **No caching** — Every request hits the API (by design for freshness)

## Future Improvements

- [ ] Batch API support (POST /api/v2/batch/*)
- [ ] Watch API (webhooks for buying signals)
- [ ] Request caching layer (in-memory or Redis)
- [ ] Structured logging (JSON format)
- [ ] Metrics/observability (credits spent, API latency)
- [ ] Rate limit handling (exponential backoff)
- [ ] Multi-account support (swap API keys)

## Dependencies

### Runtime
- `@modelcontextprotocol/sdk`: MCP protocol (v1.0.0)
- `dotenv`: Environment variable loading (v17.4.2)

### Development
- `typescript`: Type checking (v5.3.3)
- `@types/node`: Node.js types (v20.10.0)

### Why These?
- MCP SDK is required for protocol compliance
- dotenv is minimal (~50KB) and standard
- TypeScript provides type safety
- No other dependencies needed (uses native Node.js fetch)

## Deployment Considerations

### Development
- `npm start` — local server, stdio
- `npm run watch` — auto-recompile on changes
- `.env` file for API key

### Production (Docker)
- Multi-stage build (install deps, build, prune)
- Non-root user (security)
- Environment variable injection
- Health check endpoint (future)

### Claude Desktop
- Configured via JSON config file
- Auto-restarts on crash
- Logs to Claude's built-in logger

### Systemd Service
- Runs as dedicated user
- Auto-restart on failure
- Journalctl logs

## Code Quality

```
TypeScript Strictness: ✅ Full strict mode
  - noImplicitAny: true
  - strictNullChecks: true
  - strictFunctionTypes: true
  - exactOptionalPropertyTypes: true

Linting: ✅ Zero errors (tsc)
Unused Variables: ✅ None (strict mode)
Type Coverage: ✅ 100%
API Validation: ✅ All inputs validated
Error Handling: ✅ All paths handled
```
