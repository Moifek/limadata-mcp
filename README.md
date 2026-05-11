# Limadata MCP Server (Community)

A Model Context Protocol (MCP) server that gives Claude access to the Limadata API — enrich people and companies, find emails and phones, prospect leads, monitor Professional Network changes, and search databases.

## Quick Start — Claude Desktop Extension (.dxt)

Easiest path, no Node install or JSON editing required:

1. Download `limadata-mcp.dxt` from the [latest release](https://github.com/moifek/limadata-mcp/releases).
2. Double-click the file. Claude Desktop opens an install dialog.
3. Paste your API key when prompted — get one at https://app.limadata.com/settings/apikeys.
4. Done.

## Alternative: via npx

Edit your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

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

Restart Claude Desktop after saving.

## Tools (27 total)

### Enrich
| Tool | Description | Credits |
|------|-------------|---------|
| `enrich_person` | Full profile by email, Professional Network URL, or name+company | 1–5 |
| `enrich_company` | Firmographic data by domain or Professional Network URL | 1 |

### Search
| Tool | Description | Credits |
|------|-------------|---------|
| `search_people` | People search by title, location, industry, and more | 2 |
| `search_companies` | Company search by size, location, industry | 2 |

### Find
| Tool | Description | Credits |
|------|-------------|---------|
| `find_work_email` | Work email from full name + company domain | 1 |
| `find_phone_number` | Phone numbers from Professional Network URL or name+company | 10 |
| `resolve_identity` | Social profiles (Professional Network, GitHub, X) from name+company | 2 |
| `find_company_profnet` | Company Professional Network URL from domain | low |
| `reverse_email_lookup` | Social profiles from an email address | 5 |

### Company
| Tool | Description | Credits |
|------|-------------|---------|
| `get_company` | Professional Network company profile by URL (cached or live) | 1 / 3 live |
| `get_company_jobs` | Job listings for a Professional Network company page | 2 |
| `get_company_insights` | Deep research: funding, investors, tech stack, news | 5 |

### Database (BETA)
| Tool | Description | Credits |
|------|-------------|---------|
| `database_search_company` | Company database search via AI prompt, filters, or expression | BETA |
| `database_search_people` | People database search via AI prompt, filters, or expression | BETA |

### Account
| Tool | Description | Credits |
|------|-------------|---------|
| `get_credits_balance` | Check account credit balance | free |

## Credit tracking

Every tool response includes a credit summary appended automatically:

```
{...result...}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Credits
  Cost: -2
  Remaining: 248
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
