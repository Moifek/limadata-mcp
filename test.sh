#!/bin/bash

# Minimal smoke test - validates server is running without burning credits
# For thorough testing, use Claude Desktop or test specific tools manually

set -e

# Load API key from .env
if [ -f .env ]; then
    export $(grep LIMADATA_API_KEY .env | xargs)
fi

if [ -z "$LIMADATA_API_KEY" ]; then
    echo "Error: LIMADATA_API_KEY not set"
    exit 1
fi

echo "🧪 Limadata MCP Server - Smoke Test"
echo "API Key: ${LIMADATA_API_KEY:0:10}..."
echo "Note: Only testing Credits Balance (free) to avoid burning credits"
echo

# Single test: Credits Balance (0 credits, always works)
echo "Testing: Get Credits Balance (free endpoint)"
node -e "
const { LimadataAPIClient } = require('./dist/client.js');
const client = new LimadataAPIClient(process.env.LIMADATA_API_KEY);
client.getCreditsBalance()
  .then(result => {
    console.log('✓ Server is running');
    console.log('✓ Authentication successful');
    console.log('✓ Credits remaining:', result.balance);
    process.exit(0);
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
    process.exit(1);
  });
" || exit 1

echo
echo "✅ Server is ready!"
echo
echo "To test tools without burning credits:"
echo
echo "  Option 1: Use Claude Desktop"
echo "    npm run setup:claude-desktop"
echo "    Then restart Claude Desktop and ask it to use the tools"
echo
echo "  Option 2: Test specific tools manually"
echo "    node -e \"const c = require('./dist/client.js');\"  # etc"
echo
echo "  Option 3: See example calls in docs/"
echo "    cat docs/QUICK_START.md"
echo
echo "Example tool calls (run one at a time):"
echo "  - Enrich a person: enrich_person with Professional Network URL"
echo "  - Search companies: search_companies with query"
echo "  - Company insights: get_company_insights with domain"
echo "  - Get posts: get_profnet_posts with Professional Network profile URL"
echo
echo "Each tool costs 1-5 credits per call. Use wisely!"
