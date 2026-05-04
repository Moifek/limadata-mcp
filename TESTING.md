# Testing Guide

**⚠️ WARNING: Every test call costs credits. Test wisely!**

## Quick Check (Free)

Verify the server is running without using credits:

```bash
npm run build
npm start              # Terminal 1
bash test.sh          # Terminal 2 - runs Credits Balance only (free)
```

This confirms:
- ✅ Server is running
- ✅ Authentication works
- ✅ API is accessible

## Recommended: Test via Claude Desktop

The best way to test without wasting credits is to use Claude Desktop naturally:

```bash
npm run setup:claude-desktop
# Restart Claude Desktop
# Then ask Claude to use the tools
```

**Example prompts:**
- "Get detailed insights about Microsoft"
- "Search for software engineers in San Francisco"
- "What are the latest posts from the Professional Network company profile?"

Claude will use tools intelligently and you'll see results directly.

## Manual Testing (Use Sparingly)

If you need to test specific tools, run them individually in Node.js:

### Test 1: Enrich Person (1-5 credits)

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.enrichPerson({ 
  profnet_url: 'https://www.profnet.com/in/williamhgates' 
})
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message));
"
```

### Test 2: Enrich Company (1 credit)

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.enrichCompany({ domain: 'microsoft.com' })
  .then(r => console.log(JSON.stringify(r.company, null, 2)))
  .catch(e => console.error(e.message));
"
```

### Test 3: Search Companies (2 credits)

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchCompanies({ 
  query: 'artificial intelligence', 
  page: 1 
})
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message));
"
```

### Test 4: Search People (2 credits)

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchPeople({ 
  query: 'software engineer', 
  page: 1 
})
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message));
"
```

### Test 5: Company Insights (5 credits) ⚠️ Expensive

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getCompanyInsights({ domain: 'amazon.com' })
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message));
"
```

### Test 6: Get Professional Network Posts (1+ credits)

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getProfessional NetworkPosts({ 
  url: 'https://www.profnet.com/company/profnet',
  max_results: 3
})
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message));
"
```

### Test 7: Search Posts (2 credits)

```bash
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchPosts({ 
  query: 'innovation', 
  page: 1 
})
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message));
"
```

## Credit Costs Reference

| Tool | Cost | Notes |
|------|------|-------|
| Credits Balance | **Free** | Always safe to test |
| Enrich Person | 1-5 | Depends on data found |
| Enrich Company | 1 | Fixed cost |
| Search Companies | 2 | Per search |
| Search People | 2 | Per search |
| Company Insights | 5 | Expensive - use sparingly |
| Get Professional Network Posts | 1+ | 1 credit per post |
| Search Posts | 2 | Per search |

## Best Practices

1. **Test in Claude Desktop first** — it's the primary use case
2. **Manual tests only when needed** — each test costs credits
3. **Use Credits Balance** to check remaining budget before expensive ops
4. **Read the type definitions** in `src/types.ts` to understand request/response shapes
5. **Check API_CONTRACT.md** for detailed endpoint specs

## Troubleshooting

### "HTTP 400" Error
- Check request parameters match the spec
- Verify values exist (e.g., domain, Professional Network URL)
- See API_CONTRACT.md for parameter format

### "HTTP 402" Error
- Out of credits
- Check balance with Credits Balance tool
- Recharge account at https://app.limadata.com/settings/apikeys

### "HTTP 429" Error
- Rate limited (1 req/sec global limit)
- Wait and retry
- Don't run multiple tests simultaneously

### Test won't run
- Run `npm run build` first
- Ensure `npm start` is running in another terminal
- Check `.env` file has valid API key
