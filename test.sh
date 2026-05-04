#!/bin/bash

# Integration test script for Limadata MCP server
# Run this while 'npm start' is running in another terminal

set -e

# Load API key from .env
if [ -f .env ]; then
    export $(grep LIMADATA_API_KEY .env | xargs)
fi

if [ -z "$LIMADATA_API_KEY" ]; then
    echo "Error: LIMADATA_API_KEY not set"
    exit 1
fi

echo "🧪 Testing Limadata MCP Server"
echo "API Key: ${LIMADATA_API_KEY:0:10}..."
echo

# Test 1: Credits Balance (no input needed)
echo "1️⃣  Testing: Get Credits Balance"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getCreditsBalance()
  .then(result => console.log('✓ Credits:', result.balance))
  .catch(err => console.error('✗ Error:', err.message));
" || echo "⚠️  Note: Run 'npm run build' first"

echo

# Test 2: Enrich Person
echo "2️⃣  Testing: Enrich Person (by email)"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.enrichPerson({ email: '' })
  .then(result => {
    const person = result.person;
    console.log('✓ Person:', person.name || '(no name found)');
    console.log('  Email:', person.emails[0] || '(no email)');
  })
  .catch(err => console.error('✗ Error:', err.message));
" || echo "⚠️  Note: Run 'npm run build' first"

echo

# Test 3: Search Companies
echo "3️⃣  Testing: Search Companies"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchCompanies({
  query: 'AI',
  company_size: 'F,G,H',
  page: 1
})
  .then(result => {
    console.log('✓ Found', result.companies.length, 'companies');
    if (result.companies.length > 0) {
      console.log('  First:', result.companies[0].name);
      console.log('  Industry:', result.companies[0].industry);
    }
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
  });
" || echo "⚠️  Note: Run 'npm run build' first"

echo

# Test 4: Search People
echo "4️⃣  Testing: Search People"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchPeople({
  query: 'John Smith',
  page: 1
})
  .then(result => {
    console.log('✓ Found', result.total_count, 'people');
    if (result.people.length > 0) {
      console.log('  First:', result.people[0].full_name);
      console.log('  Headline:', result.people[0].headline);
    }
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
  });
" || echo "⚠️  Note: Run 'npm run build' first"

echo

# Test 5: Company Insights
echo "5️⃣  Testing: Company Insights"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getCompanyInsights({ domain: 'openai.com' })
  .then(result => {
    console.log('✓ Company:', result.name);
    console.log('  Founded:', result.founded_date);
    console.log('  Funding Total (USD):', result.funding_total?.value_usd);
    console.log('  Employees:', result.employee_range);
    console.log('  Tech Interest Signals:', result.technology?.interest_signals?.length || 0);
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
  });
" || echo "⚠️  Note: Run 'npm run build' first"

echo
echo "✅ All tests complete!"
echo
echo "To test interactively:"
echo "  - Use Claude Desktop (run: npm run setup:claude-desktop)"
echo "  - Try: 'Get detailed insights about OpenAI'"
