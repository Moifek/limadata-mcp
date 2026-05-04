# Limadata MCP Server

An MCP (Model Context Protocol) server that wraps the Limadata API, enabling Claude to enrich people/company data and search for prospects.

## Project Status

**Stage:** Implementation (Phase 1 complete)  
**Version:** 0.1.0  
**Created:** 2026-04-11  
**Updated:** 2026-05-04

## Current Implementation

### ✅ Completed

- [x] TypeScript project setup with MCP SDK
- [x] Full API type definitions from spec
- [x] Limadata API client (HTTP wrapper with auth)
- [x] 5 core tools implemented:
  - `enrich_person` - Profile enrichment by email/Professional Network/name+company
  - `enrich_company` - Firmographic data by domain/Professional Network
  - `search_people` - Prospecting by job title, location, industry, etc.
  - `search_companies` - Company search by industry, size, funding, etc.
  - `get_credits_balance` - Check account credit balance
- [x] Input validation for all tools
- [x] API_CONTRACT.md with endpoint documentation
- [x] Project documentation (CLAUDE.md)

### 📋 Architecture

```
limadata-mcp/
├── src/
│   ├── server.ts          # MCP server (tool request handler)
│   ├── client.ts          # Limadata API client wrapper
│   ├── tools.ts           # Tool schemas & validation
│   └── types.ts           # TypeScript interfaces
├── API_CONTRACT.md        # Endpoint specifications
├── CLAUDE.md              # Development guide
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
└── .env.example           # Environment template
```

**Tech Stack:** TypeScript, Node.js, @modelcontextprotocol/sdk

## Getting Started

### Setup

```bash
npm install
cp .env.example .env
# Add your LIMADATA_API_KEY to .env
```

### Build & Run

```bash
npm run build      # Compile TypeScript
npm run dev        # Build + run
npm run watch      # Watch mode for development
npm start          # Run compiled server
```

### Environment

Set `LIMADATA_API_KEY` from https://app.limadata.com/settings/apikeys

## API Documentation

See **API_CONTRACT.md** for:
- Endpoint specifications
- Request/response schemas
- Credit costs per endpoint
- Rate limits & error handling
- Full TypeScript type definitions

## Next Steps (Phase 2)

- [ ] Add remaining endpoints (Watch webhooks, Jobs, Posts, Batch operations)
- [ ] Implement error recovery with exponential backoff
- [ ] Add request/response logging
- [ ] Test suite with mock API
- [ ] Performance optimization
- [ ] Integration with Claude desktop/web

## Development

See **CLAUDE.md** for detailed development guide including how to add new tools.
