# Publishing to NPM

Guide to publish limadata-mcp so Jack and others can install it via `npx`.

## Prerequisites

1. **NPM Account** — Create one at https://www.npmjs.com/signup if you don't have one
2. **Authenticated Locally** — Run `npm login` and enter your credentials
3. **Updated package.json** — Update author, repository URL (see below)

## Before Publishing

### 1. Update package.json

Edit these fields with your actual values:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/limadata-mcp.git"
  }
}
```

### 2. Verify Everything Works

```bash
npm run build       # Compile TypeScript
bash test.sh        # Smoke test
npm list            # Check dependencies
```

### 3. Ensure dist/ is Built

```bash
npm run build
ls dist/            # Verify server.js exists
```

## Publishing Process

### Step 1: Create .env.example (if not already done)

Make sure `.env.example` exists with template:

```bash
cat .env.example
# Should show:
# LIMADATA_API_KEY=your_api_key_here
```

### Step 2: Build Before Publishing

```bash
npm run build
```

This runs automatically via `prepublishOnly` hook in package.json, but good to verify.

### Step 3: Authenticate

```bash
npm login
# Enter username, password, and 2FA code if enabled
```

### Step 4: Publish

First time (will use exact version in package.json):

```bash
npm publish
```

This will:
- Validate package.json
- Include only files in `dist/` and `.env.example`
- Upload to NPM registry
- Make it available immediately

### Step 5: Verify Publication

Check it was published:

```bash
npm view limadata-mcp
```

Or visit: https://www.npmjs.com/package/limadata-mcp

## After Publishing

### Jack Can Now Use It:

**Option 1: Run directly with npx**
```bash
npx limadata-mcp
```

**Option 2: Install globally**
```bash
npm install -g limadata-mcp
limadata-mcp
```

**Option 3: Use in Claude Desktop**
```bash
npx limadata-mcp
# Add to Claude Desktop config with:
# "command": "npx",
# "args": ["limadata-mcp"]
```

## Version Bumping

When you update the code, bump the version before republishing:

```bash
# Patch (0.1.0 → 0.1.1)
npm version patch

# Minor (0.1.0 → 0.2.0)
npm version minor

# Major (0.1.0 → 1.0.0)
npm version major
```

Then publish:

```bash
npm publish
```

## NPM Registry

The package will be available at:
- **NPM Registry:** https://www.npmjs.com/package/limadata-mcp
- **Installation:** `npx limadata-mcp` or `npm install -g limadata-mcp`

## Scoped Package (Optional)

If you want a scoped package (e.g., `@company/limadata-mcp`):

1. Change name in package.json:
   ```json
   {
     "name": "@yourscope/limadata-mcp"
   }
   ```

2. Publish to scope:
   ```bash
   npm publish --access public
   ```

3. Install/run:
   ```bash
   npx @yourscope/limadata-mcp
   ```

## Troubleshooting

### "404 Authentication required"
- Run `npm login` and verify credentials
- Check username with `npm whoami`

### "You do not have permission"
- Package name already taken
- Change name in package.json (e.g., add version: limadata-mcp-v1)

### "dist/ folder missing"
- Run `npm run build` first
- Check tsconfig.json has `"outDir": "dist"`

### "prepublishOnly failed"
- Likely TypeScript compilation error
- Run `npm run build` to see errors
- Fix and retry

## What Gets Published

Files included (`package.json` files field):
- `dist/` — Compiled JavaScript and type definitions
- `.env.example` — Template for API key

Files excluded (`.npmignore`):
- `src/` — TypeScript source code
- `node_modules/` — Dependencies
- `test.sh`, `*.md` — Tests and docs
- `.env` — Your actual API key (never published)

## Security

⚠️ **Never include actual secrets in published package!**

- `.env` is in `.gitignore` and `.npmignore`
- `.env.example` is template only
- Users must provide their own LIMADATA_API_KEY
- API key is only stored locally in user's `.env` file

## Next Steps

1. Update package.json author and repository
2. Run `npm login`
3. Run `npm publish`
4. Share with Jack: `npx limadata-mcp`
