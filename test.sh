#!/bin/bash

# Integration test script for Limadata MCP server
# Tests all 8 tools with publicly available values
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

echo "🧪 Testing Limadata MCP Server (All 8 Tools)"
echo "API Key: ${LIMADATA_API_KEY:0:10}..."
echo

# Test 1: Credits Balance (no input needed)
echo "1️⃣  Testing: Get Credits Balance"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getCreditsBalance()
  .then(result => console.log('✓ Credits remaining:', result.balance))
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 2: Enrich Person (Bill Gates Professional Network)
echo "2️⃣  Testing: Enrich Person (Professional Network URL)"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.enrichPerson({ profnet_url: 'https://www.profnet.com/in/williamhgates' })
  .then(result => {
    const person = result.person;
    console.log('✓ Person:', person.name);
    console.log('  Headline:', person.headline);
    console.log('  Current company:', person.employment?.company_name);
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 3: Enrich Company (Microsoft)
echo "3️⃣  Testing: Enrich Company"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.enrichCompany({ domain: 'microsoft.com' })
  .then(result => {
    const company = result.company;
    console.log('✓ Company:', company.name);
    console.log('  Website:', company.website);
    console.log('  Employee range:', company.employees?.employee_range);
    console.log('  Industry:', company.categories?.industry);
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 4: Search Companies
echo "4️⃣  Testing: Search Companies"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchCompanies({
  query: 'artificial intelligence',
  company_size: 'F,G,H',
  page: 1
})
  .then(result => {
    console.log('✓ Found', result.companies?.length || 0, 'AI companies');
    if (result.companies && result.companies.length > 0) {
      console.log('  First:', result.companies[0].name);
      console.log('  Industry:', result.companies[0].industry);
      console.log('  Location:', result.companies[0].location);
    }
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 5: Search People
echo "5️⃣  Testing: Search People"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchPeople({
  query: 'software engineer',
  page: 1
})
  .then(result => {
    console.log('✓ Found', result.total_count, 'matching people');
    if (result.people && result.people.length > 0) {
      console.log('  First:', result.people[0].full_name);
      console.log('  Headline:', result.people[0].headline);
      console.log('  Location:', result.people[0].location);
    }
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 6: Company Insights (OpenAI)
echo "6️⃣  Testing: Company Insights"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getCompanyInsights({ domain: 'openai.com' })
  .then(result => {
    console.log('✓ Company:', result.name);
    console.log('  Founded:', result.founded_date);
    console.log('  Employee range:', result.employee_range);
    console.log('  Funding rounds:', result.funding_rounds_count);
    console.log('  Tech signals:', result.technology?.interest_signals?.length || 0);
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 7: Get Professional Network Posts (Microsoft company profile)
echo "7️⃣  Testing: Get Professional Network Posts"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.getProfessional NetworkPosts({
  url: 'https://www.profnet.com/company/microsoft',
  max_results: 5
})
  .then(result => {
    console.log('✓ Retrieved', result.posts?.length || 0, 'posts');
    if (result.posts && result.posts.length > 0) {
      const post = result.posts[0];
      console.log('  Latest post by:', post.actor?.name);
      console.log('  Posted on:', post.posted_on);
      console.log('  Likes:', post.likes_count);
      console.log('  Has pagination token:', !!result.pagination_token);
    }
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo

# Test 8: Search Posts
echo "8️⃣  Testing: Search Posts"
node -e "
const { LiamataAPIClient } = require('./dist/client.js');
const client = new LiamataAPIClient(process.env.LIMADATA_API_KEY);
client.searchPosts({
  query: 'artificial intelligence',
  page: 1,
  sort_by_latest: false
})
  .then(result => {
    console.log('✓ Found', result.total_count, 'posts about AI');
    if (result.posts && result.posts.length > 0) {
      const post = result.posts[0];
      console.log('  First post by:', post.actor?.name);
      console.log('  Posted on:', post.posted_on);
      console.log('  Engagement - Likes:', post.likes_count, 'Comments:', post.comments_count);
      console.log('  Content type - Has images:', post.images?.length > 0, 'Has video:', post.videos?.length > 0);
    }
  })
  .catch(err => console.error('✗ Error:', err.message));
"

echo
echo "✅ All 8 tools tested!"
echo
echo "Summary of test values used:"
echo "  1. Credits Balance - No parameters"
echo "  2. Enrich Person - Bill Gates Professional Network URL"
echo "  3. Enrich Company - Microsoft domain (microsoft.com)"
echo "  4. Search Companies - Query: 'artificial intelligence', large companies (F,G,H)"
echo "  5. Search People - Query: 'software engineer'"
echo "  6. Company Insights - OpenAI (openai.com)"
echo "  7. Get Professional Network Posts - Microsoft company profile"
echo "  8. Search Posts - Query: 'artificial intelligence', sorted by relevance"
echo
echo "To test interactively:"
echo "  - Use Claude Desktop (run: npm run setup:claude-desktop)"
echo "  - Or run the server: npm start"
