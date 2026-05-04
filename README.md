# Limadata MCP Server

A Model Context Protocol (MCP) server that wraps the Limadata API, enabling Claude to enrich people/company data, search for prospects, and research companies in real-time.

**Perfect for:** Lead scoring workflows, sales intelligence, prospect research, company deep-dives.

## What's Implemented

### 8 Production-Ready Tools

1. **enrich_person** — Profile enrichment by email/Professional Network/name+company (1-5 credits)
2. **enrich_company** — Firmographic data by domain/Professional Network (1 credit)
3. **search_people** — Targeted people search by title, location, industry (2 credits)
4. **search_companies** — Company search by criteria (2 credits)
5. **get_company_insights** — Deep research: funding, tech stack, investors, news (5 credits)
6. **get_profnet_posts** — Get Professional Network posts from profiles with pagination (1 credit per post)
7. **search_posts** — Search Professional Network posts by keywords and filters (2 credits)
8. **get_credits_balance** — Check account credits (free)

### ✅ Features

- [x] **Automatic credit tracking** — Response middleware captures `x-credits-*` headers and appends to all outputs
- [x] **Full TypeScript** — Zero errors, strict mode, 100% type coverage
- [x] **Input validation** — All inputs validated before API calls
- [x] **Error handling** — Fast feedback on invalid input, clear API error messages
- [x] **Request history** — Last 5 API calls tracked in memory
- [x] **Multiple deployment options** — NPM, Docker, Docker Compose, Claude Desktop, Systemd

## Quick Start (via npx)

The fastest way is to use the published NPM package — no install, no clone:

Add this to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "limadata": {
      "command": "npx",
      "args": ["limadata-mcp"],
      "env": {
        "LIMADATA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Get your API key from https://app.limadata.com/settings/apikeys, then restart Claude Desktop.

## Local Development

```bash
git clone https://github.com/Moifek/limadata-mcp.git
cd limadata-mcp
npm install
cp .env.example .env
# Edit .env and add LIMADATA_API_KEY
npm start
```

## Project Structure

```
src/
  ├── server.ts      # MCP server, tool handlers, credit formatting
  ├── client.ts      # HTTP client, response middleware, metadata tracking
  ├── tools.ts       # 8 tool definitions + input validators
  ├── types.ts       # TypeScript interfaces (40+ types)
  └── utils.ts       # Formatting utilities

Documentation (root)
  ├── README.md       # This file
  ├── QUICK_START.md  # Local development setup
  ├── CLAUDE.md       # Development guide (5-step pattern for new tools)
  ├── API_CONTRACT.md # Endpoint specifications
  ├── INTEGRATION.md  # Docker, systemd, production deployment
  ├── TESTING.md      # Credit-conscious testing guide
  └── PUBLISH.md      # NPM publishing notes

Configuration
  ├── package.json
  ├── tsconfig.json
  ├── .env.example
  ├── Dockerfile
  └── docker-compose.yml

Testing
  └── test.sh         # Smoke test (Credits Balance, free)
```

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
- CLAUDE.md — How to extend with new tools

## Running Tests

```bash
npm test        # Smoke test (free — Credits Balance only)
npm run build   # Compile TypeScript
npm run watch   # Watch mode during development
```

See [TESTING.md](TESTING.md) for credit-conscious manual test snippets per tool.

## Deployment Options

| Method | Best For | How |
|--------|----------|-----|
| Claude Desktop via npx | Daily use | See [Quick Start](#quick-start-via-npx) above |
| Docker | Isolated, reproducible | `docker-compose up` |
| Production | Systemd/k8s | See [INTEGRATION.md](INTEGRATION.md) |

## API Documentation

All endpoints documented in [API_CONTRACT.md](API_CONTRACT.md):
- Request schemas
- Response schemas
- Credit costs
- Rate limits
- Error codes

## Development Guide

Want to add a new tool? See [CLAUDE.md](CLAUDE.md) — pattern is predictable and copy-paste friendly.

