# Limadata MCP Server Development Guide

## Quick Start

```bash
npm install                    # Install dependencies
cp .env.example .env          # Create .env from template
# Edit .env and add LIMADATA_API_KEY from https://app.limadata.com/settings/apikeys
npm start                     # Run server (dotenv loads .env automatically)
```

The MCP server is now listening on stdio, ready for Claude to call tools.

## Project Architecture

**Three-layer design**:
- **Server** (server.ts) — MCP protocol, tool request routing, response formatting
- **Client** (client.ts) — HTTP wrapper, response middleware for credit tracking
- **Types** (types.ts) — 25+ TypeScript interfaces for all API types

**Key design pattern**: Automatic response middleware captures `x-credits-*` headers from every Limadata API call and appends a formatted credit summary to all tool responses — no manual tracking needed.

## Building & Running

```bash
npm install      # Install dependencies
npm run build    # Compile TypeScript (zero errors, strict mode)
npm run watch    # Auto-recompile on changes
npm start        # Run server
npm test         # Integration tests
```

## The 5-Step Tool Extension Pattern

### 1. Add Types to types.ts

Define request and response TypeScript interfaces:

```typescript
export interface MyNewEndpointRequest {
  requiredField: string;
  optionalField?: string;
}

export interface MyNewEndpointResponse {
  result: string;
  metadata?: Record<string, unknown>;
}
```

### 2. Add Client Method to client.ts

Implement the HTTP wrapper:

```typescript
async myNewEndpoint(
  req: MyNewEndpointRequest
): Promise<MyNewEndpointResponse> {
  return this.request<MyNewEndpointResponse>(
    "POST",
    "/api/v1/path/to/endpoint",
    req
  );
}
```

The `request()` method automatically:
- Adds `x-api-key` header
- Captures `x-credits-*` response headers
- Stores metadata for response formatting
- Converts errors to exceptions

### 3. Add Tool Definition & Validator to tools.ts

Define the MCP tool schema and input validator:

```typescript
export const myNewEndpointTool: Tool = {
  name: "my_new_endpoint",
  description: "Does something useful via Limadata API",
  inputSchema: {
    type: "object",
    properties: {
      requiredField: {
        type: "string",
        description: "What this field does"
      },
      optionalField: {
        type: "string",
        description: "Optional parameter"
      }
    },
    required: ["requiredField"]
  }
};

export function validateMyNewEndpointInput(
  input: Record<string, unknown>
): MyNewEndpointRequest {
  if (!input.requiredField || typeof input.requiredField !== "string") {
    throw new Error("'requiredField' is required and must be a string");
  }
  return {
    requiredField: input.requiredField,
    optionalField: input.optionalField as string | undefined
  };
}
```

**Validator pattern**: Throw `Error` for invalid input (fast feedback before API call), convert types as needed, return typed request object.

### 4. Add Handler to server.ts

Route the tool call:

```typescript
case "my_new_endpoint": {
  const validated = Tools.validateMyNewEndpointInput(args as Record<string, unknown>);
  const result = await client.myNewEndpoint(validated);
  const text = formatToolResult(JSON.stringify(result, null, 2));
  return {
    content: [
      {
        type: "text",
        text
      }
    ]
  };
}
```

**Key details**:
- Cast args as `Record<string, unknown>` (unknown structure from Claude)
- Call validator to ensure type safety
- Call client method
- Wrap JSON response with `formatToolResult()` to append credit summary
- Return MCP response with content

### 5. Register Tool in toolsList

```typescript
const toolsList: Tool[] = [
  Tools.enrichPersonTool,
  Tools.enrichCompanyTool,
  // ... existing tools
  Tools.myNewEndpointTool  // Add here
];
```

That's it — ~50 lines of code, pattern is copy-paste friendly.

## Design Decisions

### Middleware for Credit Tracking
Every HTTP response from Limadata API includes `x-credits-cost` and `x-credits-remaining` headers. The client captures these automatically, stores them in metadata, and appends a formatted summary to all tool responses. This eliminates boilerplate credit tracking across 6+ tools.

### Strict Input Validation
Validators run before API calls. Invalid input throws immediately with clear error messages, preventing wasted credits on 402 errors. Validators also document expected input format per tool.

### Full TypeScript, Strict Mode
All types are explicit — no `any`, no implicit `unknown`. TypeScript compiler enforces type safety. Benefits: IDE autocomplete, compile-time error detection, zero runtime surprises.

### Request History
Last 5 API calls stored in memory with metadata (endpoint, credits, timestamp). Accessible via `client.getRequestHistory()` for debugging. Cleared on restart.

## Environment Setup

```bash
cp .env.example .env
# Edit .env with your API key:
# LIMADATA_API_KEY=your_key_here
```

The `.env` file is automatically loaded by `import "dotenv/config.js"` at the top of server.ts. Works in:
- Local npm: `npm start`
- Docker: `-e LIMADATA_API_KEY=...`
- Claude Desktop: `env` object in config
- Systemd: `Environment=LIMADATA_API_KEY=...`

## Debugging

```bash
# Verbose output during development
npm run watch        # Auto-recompile on file changes
npm start            # Run server with console logs

# Check last 5 API calls
# Access via: client.getRequestHistory()

# Validate a single tool
npm test             # Integration tests for all 6 tools
```

## API Contract

See `API_CONTRACT.md` for:
- All 6 endpoint specifications (request/response schemas)
- Credit costs per endpoint
- Rate limits (1 req/sec globally)
- Example curl commands
- Error handling behavior

## Deployment Options

| Method | Command | Best For |
|--------|---------|----------|
| Development | `npm start` | Local testing, manual debugging |
| Docker | `docker-compose up` | Isolated, reproducible, CI/CD |
| Claude Desktop | `npm run setup:claude-desktop` | Daily use, persistent |
| Production | See INTEGRATION.md | Systemd/k8s, cloud deployment |

## Code Quality

```
✅ Zero TypeScript errors (npm run build)
✅ Strict mode enabled
✅ 100% type coverage
✅ All inputs validated before API calls
✅ Automatic credit tracking (middleware)
✅ Request history for debugging
✅ Comprehensive error handling
```

## Next Steps

Want to extend the server? Pick one:
1. Add a new Limadata API endpoint — follow the 5-step pattern above
2. Add webhook support — Watch API integration
3. Add caching layer — in-memory or Redis
4. Add structured logging — JSON format
5. See TECH.md for full architecture details
