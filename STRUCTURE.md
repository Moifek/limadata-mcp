# Project Structure

```
limadata-mcp/
│
├── src/                          # TypeScript source code
│   ├── server.ts                # MCP server entrypoint & tool handlers (142 lines)
│   ├── client.ts                # Limadata API HTTP client with middleware (145 lines)
│   ├── tools.ts                 # Tool definitions & input validation (334 lines)
│   ├── types.ts                 # TypeScript interfaces for all API types (450+ lines)
│   └── utils.ts                 # Utility functions (formatCreditsInfo) (28 lines)
│
├── dist/                         # Compiled JavaScript (auto-generated)
│   ├── *.js                     # Compiled source files
│   └── *.d.ts                   # TypeScript declarations
│
├── scripts/                      # Helper scripts
│   ├── setup-claude-desktop.sh  # Auto-configure Claude Desktop
│   └── build-docker.sh          # Build Docker image
│
├── node_modules/                # Dependencies (auto-installed)
│
├── Documentation
│   ├── README.md                # Project overview & quick start
│   ├── QUICK_START.md           # Fastest path to running the server
│   ├── CLAUDE.md                # Development guide & how to add tools
│   ├── API_CONTRACT.md          # Detailed API endpoint documentation
│   ├── INTEGRATION.md           # Integration options (NPM, Docker, Claude Desktop)
│   ├── STRUCTURE.md             # This file - project layout
│   └── TECH.md                  # Technical architecture & decisions
│
├── Configuration
│   ├── package.json             # Dependencies & npm scripts
│   ├── tsconfig.json            # TypeScript compiler options
│   ├── .env.example             # Environment variable template
│   ├── .gitignore               # Git ignore patterns
│   └── .dockerignore            # Docker ignore patterns
│
├── Docker
│   ├── Dockerfile               # Container definition
│   └── docker-compose.yml       # Multi-service orchestration
│
├── Testing
│   └── test.sh                  # Integration test script (5 tools)
│
└── Git & Version Control
    └── .git/                    # Git repository
```

## File Purposes

### Core Implementation (src/)

| File | Purpose | Lines | Key Classes/Functions |
|------|---------|-------|----------------------|
| `server.ts` | MCP server setup, tool request handlers, credit formatting | 142 | `Server`, `ListToolsRequest`, `CallToolRequest` handlers |
| `client.ts` | HTTP client for Limadata API, response metadata capture | 145 | `LiamataAPIClient`, response middleware, metadata tracking |
| `tools.ts` | MCP tool definitions, input validation | 334 | 6 tools + 6 validators |
| `types.ts` | TypeScript interfaces for requests/responses | 450+ | 25+ types (Person, Company, CompanyInsights, etc.) |
| `utils.ts` | Utilities for formatting output | 28 | `formatCreditsInfo()` |

### Dependencies

```json
{
  "@modelcontextprotocol/sdk": "^1.0.0",  // MCP protocol implementation
  "dotenv": "^17.4.2"                      // Environment variable loading
}
```

### Build Tools

```json
{
  "typescript": "^5.3.3",                  // TypeScript compiler
  "@types/node": "^20.10.0"                // Node.js type definitions
}
```

## Tool Mapping

```
MCP Tools → Limadata API Endpoints
├── enrich_person           → POST /api/v1/enrich/person (1-5 credits)
├── enrich_company          → POST /api/v1/enrich/company (1 credit)
├── search_people           → POST /api/v1/search/people (2 credits)
├── search_companies        → POST /api/v1/search/companies (2 credits)
├── get_company_insights    → GET /api/v1/company/insights (5 credits)
└── get_credits_balance     → GET /api/v1/credits/balance (0 credits)
```

## Request/Response Flow

```
User Input (Claude)
    ↓
MCP Server (server.ts)
    ↓
Tool Handler (validates input)
    ↓
LiamataAPIClient (client.ts)
    ↓
HTTP Request → Limadata API
    ↓
Capture Headers (x-credits-*)
    ↓
Response Middleware (formatCreditsInfo)
    ↓
Format Output with Credits Summary
    ↓
Return to User
```

## Deployment Targets

- **Local Development**: `npm start` (stdio)
- **Claude Desktop**: Configured via `~/.config/Claude/claude_desktop_config.json`
- **Docker**: `docker-compose up` or `docker run`
- **Production**: Systemd service or cloud container orchestration

## Environment Files

```
.env                     # Local secrets (git-ignored)
.env.example             # Template for .env (committed)
.env.docker              # Alternative for Docker (optional)
```

## Type System

All API responses are fully typed:
- Request types: `EnrichPersonRequest`, `SearchCompaniesRequest`, etc.
- Response types: `Person`, `Company`, `CompanyInsights`, etc.
- Metadata types: `ResponseMetadata` (credits tracking)
- Error types: `APIError`

## Code Quality

- ✅ Zero TypeScript errors (strict mode)
- ✅ All inputs validated before API calls
- ✅ Comprehensive error handling
- ✅ Automatic credit tracking (response middleware)
- ✅ Request history (last 5 calls)
