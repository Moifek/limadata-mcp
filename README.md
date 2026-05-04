# Limadata MCP Server

A Model Context Protocol (MCP) server that wraps the Limadata API, enabling Claude to enrich people/company data, search for prospects, and research companies in real-time.

**Perfect for:** Lead scoring workflows, sales intelligence, prospect research, company deep-dives.

## Project Status

**Stage:** Core implementation complete  
**Version:** 0.1.0  
**Created:** 2026-04-11  
**Updated:** 2026-05-04

## What's Implemented

### 6 Production-Ready Tools

1. **enrich_person** — Profile enrichment by email/Professional Network/name+company (1-5 credits)
2. **enrich_company** — Firmographic data by domain/Professional Network (1 credit)
3. **search_people** — Targeted people search by title, location, industry (2 credits)
4. **search_companies** — Company search by criteria (2 credits)
5. **get_company_insights** — Deep research: funding, tech stack, investors, news (5 credits)
6. **get_credits_balance** — Check account credits (free)

### ✅ Features

- [x] **Automatic credit tracking** — Response middleware captures `x-credits-*` headers and appends to all outputs
- [x] **Full TypeScript** — Zero errors, strict mode, 100% type coverage
- [x] **Input validation** — All inputs validated before API calls
- [x] **Error handling** — Fast feedback on invalid input, clear API error messages
- [x] **Request history** — Last 5 API calls tracked in memory
- [x] **Multiple deployment options** — NPM, Docker, Docker Compose, Claude Desktop, Systemd

## Quick Start

### 1. Setup

```bash
npm install
cp .env.example .env
# Edit .env and add LIMADATA_API_KEY from https://app.limadata.com/settings/apikeys
```

### 2. Run

```bash
npm start
```

The server is now running and ready for Claude to call tools.

### 3. Integrate with Claude Desktop

```bash
npm run setup:claude-desktop
# Restart Claude Desktop
```

## Project Structure

```
src/
  ├── server.ts      # MCP server, tool handlers, credit formatting
  ├── client.ts      # HTTP client, response middleware, metadata tracking
  ├── tools.ts       # 6 tool definitions + input validators
  ├── types.ts       # TypeScript interfaces (25+ types)
  └── utils.ts       # Formatting utilities

docs/
  ├── README.md      # This file
  ├── QUICK_START.md # Fastest path to running
  ├── STRUCTURE.md   # Project layout & file purposes
  ├── TECH.md        # Architecture & design decisions
  ├── CLAUDE.md      # Development guide
  ├── API_CONTRACT.md # Endpoint specifications
  └── INTEGRATION.md  # Deployment options

Configuration
  ├── package.json        # Dependencies & scripts
  ├── tsconfig.json       # TypeScript config
  ├── .env.example        # Environment template
  ├── Dockerfile          # Container definition
  └── docker-compose.yml  # Orchestration

Testing
  └── test.sh  # Integration tests (5 tools)
```

**See [STRUCTURE.md](STRUCTURE.md) for detailed file purposes and [TECH.md](TECH.md) for architecture decisions.**

## Features Highlights

### ⚡ Automatic Credit Tracking

Every tool response includes a credit summary:
```
{...result...}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Credits
  Cost: -2
  Remaining: 248
  Usage: 1% of account
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

No extra configuration needed — middleware captures headers automatically.

### 🎯 Input Validation

All inputs validated before API calls:
- Prevents wasting credits on invalid requests
- Fast feedback to users
- Clear error messages

### 🔒 Type-Safe

100% TypeScript, zero runtime errors:
- Full type coverage
- Strict mode enabled
- All API responses typed

### 📋 Well-Documented

- API_CONTRACT.md — Every endpoint specified
- TECH.md — Architecture & decisions
- CLAUDE.md — How to extend with new tools
- Inline comments — Why, not what

## Running Tests

```bash
npm test        # Run all 6 tool tests
npm run build   # Compile TypeScript (zero errors)
npm run watch   # Watch mode during development
```

## Deployment Options

| Method | Best For | Command |
|--------|----------|---------|
| Local NPM | Development | `npm start` |
| Docker | Isolated, reproducible | `docker-compose up` |
| Claude Desktop | Daily use | `npm run setup:claude-desktop` |
| Production | Systemd/k8s | See INTEGRATION.md |

**Full details:** [INTEGRATION.md](INTEGRATION.md)

## API Documentation

All endpoints documented in [API_CONTRACT.md](API_CONTRACT.md):
- Request schemas
- Response schemas
- Credit costs
- Rate limits
- Error codes

## Development Guide

Want to add a new tool? See [CLAUDE.md](CLAUDE.md) — pattern is predictable and copy-paste friendly.

## Next Steps (Phase 2)

- [ ] Batch API endpoints (POST /api/v2/batch/*)
- [ ] Watch API (webhooks for buying signals)
- [ ] Exponential backoff for rate limiting
- [ ] Caching layer (in-memory or Redis)
- [ ] Structured logging (JSON)
- [ ] Metrics & observability

## Code Quality

✅ Zero TypeScript errors (strict mode)  
✅ All inputs validated  
✅ 100% type coverage  
✅ Comprehensive error handling  
✅ Clean architecture (3 layers)  
✅ Request history for debugging
