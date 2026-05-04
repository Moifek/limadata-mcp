# Quick Start: Running Limadata MCP Server

## 🚀 Fastest Way (for local development)

```bash
# 1. Get your API key from https://app.limadata.com/settings/apikeys

# 2. Create .env file
cp .env.example .env
# Edit .env and paste your API key

# 3. Build and run
npm install
npm run build
npm start
```

That's it! The server reads from `.env` automatically and is now running via stdio (MCP protocol).

---

## 🐳 Docker (if you prefer containers)

```bash
# Build
docker build -t limadata-mcp .

# Run
docker run -e LIMADATA_API_KEY=your_api_key_here limadata-mcp
```

Or with docker-compose:

```bash
LIMADATA_API_KEY=your_api_key_here docker-compose up
```

---

## 🔌 Use with Claude Desktop

### Step 1: Get the config path

**macOS/Linux:**
```bash
cat ~/.config/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Step 2: Add the server config

Edit the config file and add (inside `mcpServers` object):

**Option A: Run from npm**
```json
"limadata": {
  "command": "npm",
  "args": ["start"],
  "cwd": "/absolute/path/to/limadata_mcp",
  "env": {
    "LIMADATA_API_KEY": "your_api_key_here"
  }
}
```

**Option B: Run from compiled dist**
```json
"limadata": {
  "command": "node",
  "args": ["/absolute/path/to/limadata_mcp/dist/server.js"],
  "env": {
    "LIMADATA_API_KEY": "your_api_key_here"
  }
}
```

**Option C: Run from Docker**
```json
"limadata": {
  "command": "docker",
  "args": ["run", "--rm", "-i", "-e", "LIMADATA_API_KEY=your_api_key_here", "limadata-mcp:latest"]
}
```

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop. You should now see the Limadata tools available.

---

## 🧪 Test It's Working

In Claude Desktop or Claude Code, try:

```
Use the enrich_person tool to look up someone by email: john.doe@example.com
```

Or check your credits:

```
What's my current Limadata credit balance?
```

---

## 🔑 Credential Management

### Never hardcode API keys in files you commit!

**Option 1: Environment variable (recommended)**
```bash
export LIMADATA_API_KEY=xxx
npm start
```

**Option 2: .env file (ignored by git)**
```bash
cp .env.example .env
# Edit .env and add your key
npm start
```

**Option 3: Pass to command**
```bash
LIMADATA_API_KEY=xxx npm start
```

---

## 📋 Common Commands

| Task | Command |
|------|---------|
| Build | `npm run build` |
| Run | `LIMADATA_API_KEY=xxx npm start` |
| Watch mode | `npm run watch` |
| Build Docker image | `docker build -t limadata-mcp .` |
| Run Docker | `docker run -e LIMADATA_API_KEY=xxx limadata-mcp` |
| Docker compose | `LIMADATA_API_KEY=xxx docker-compose up` |

---

## 🐛 Troubleshooting

**"LIMADATA_API_KEY is not set"**
- Make sure you export or pass the API key before running
- `export LIMADATA_API_KEY=your_key` then `npm start`

**"Cannot find module"**
- Run `npm install` first
- Make sure you're in the `limadata_mcp` directory

**Claude doesn't see the tools**
- Restart Claude Desktop completely (quit + reopen)
- Check the config file syntax is valid JSON
- Check the file path is absolute (not relative)
- Look at Claude's debug logs

**"Port already in use"** (if using Docker)
- Change the port in docker-compose.yml
- Or kill the existing process: `docker-compose down`

---

For more details, see **INTEGRATION.md**
