# Limadata MCP Server Development Guide

## Project Overview

This is a Model Context Protocol (MCP) server that wraps the Limadata API, enabling Claude to enrich people/company data and search for prospects.

## Architecture

```
src/
├── server.ts         # MCP server entrypoint (handles tool requests)
├── client.ts         # Limadata API client (HTTP wrapper)
├── types.ts          # TypeScript interfaces for all API types
└── tools.ts          # Tool definitions & input validation
```

## Building & Running

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Development mode (build + run)
npm run dev

# Run compiled server
npm start

# Watch mode for development
npm run watch
```

## Environment Setup

1. Create `.env` file from `.env.example`
2. Add your Limadata API key from https://app.limadata.com/settings/apikeys
3. Set `LIMADATA_API_KEY` environment variable

## Implemented Tools

1. **enrich_person** - Enrich a person using email, Professional Network, or name+company
2. **enrich_company** - Enrich a company using domain or Professional Network URL
3. **search_people** - Search for people by job title, location, industry, etc.
4. **search_companies** - Search for companies by industry, size, location, etc.
5. **get_credits_balance** - Check remaining credits in account

## API Contract

See `API_CONTRACT.md` for detailed endpoint documentation including:
- Request schemas
- Response schemas
- Credit costs
- Rate limits
- Error handling

## Adding New Tools

To add a new tool:

1. Add endpoint method to `LiamataAPIClient` in `client.ts`
2. Add request/response types to `types.ts`
3. Define tool schema in `tools.ts`
4. Add validation function in `tools.ts`
5. Add handler in `server.ts` under `CallToolRequest`
6. Update `API_CONTRACT.md` with endpoint details
