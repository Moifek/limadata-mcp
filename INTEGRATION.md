# Integration Guide: Running Limadata MCP Server

## Option 1: NPM/NPX (Development & Local)

### Direct npm (fastest for development)

```bash
# Install and build
npm install
npm run build

# Run with API key
LIMADATA_API_KEY=your_key_here npm start
```

### NPX with local path

```bash
# Run without installing globally
npx --yes node ./dist/server.js
```

This is useful if you want to keep the server project separate and run it on demand.

### NPX from npm registry (after publishing)

Once published to npm as `@yourorg/limadata-mcp`:

```bash
LIMADATA_API_KEY=your_key node node_modules/.bin/limadata-mcp
```

---

## Option 2: Docker

### Build the image

```bash
docker build -t limadata-mcp:latest .
```

### Run with Docker

```bash
docker run -e LIMADATA_API_KEY=your_key_here limadata-mcp:latest
```

### Docker Compose (recommended for integration)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  limadata-mcp:
    build: .
    environment:
      LIMADATA_API_KEY: ${LIMADATA_API_KEY}
    stdin_open: true
    tty: true
```

Run with:

```bash
LIMADATA_API_KEY=your_key docker-compose up
```

### Push to registry (for production)

```bash
docker tag limadata-mcp:latest your-registry/limadata-mcp:latest
docker push your-registry/limadata-mcp:latest
```

---

## Option 3: Configure with Claude Code

### For Claude Desktop / VS Code Extension

Create `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "limadata": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/limadata_mcp",
      "env": {
        "LIMADATA_API_KEY": "your_key_here"
      }
    }
  }
}
```

Or with Docker:

```json
{
  "mcpServers": {
    "limadata": {
      "command": "docker",
      "args": ["run", "--rm", "-i", 
               "-e", "LIMADATA_API_KEY=your_key_here",
               "limadata-mcp:latest"]
    }
  }
}
```

Or with Node directly:

```json
{
  "mcpServers": {
    "limadata": {
      "command": "node",
      "args": ["/path/to/limadata_mcp/dist/server.js"],
      "env": {
        "LIMADATA_API_KEY": "your_key_here"
      }
    }
  }
}
```

### For Claude Code (Web)

Claude Code web doesn't directly support MCP servers. Use local Claude Desktop instead.

### For Cline Extension

If using Cline (Claude in VSCode), the config is similar:

```json
{
  "cline": {
    "mcpServers": {
      "limadata": {
        "command": "npm",
        "args": ["start"],
        "cwd": "/path/to/limadata_mcp",
        "env": {
          "LIMADATA_API_KEY": "your_key_here"
        }
      }
    }
  }
}
```

---

## Option 4: Production Deployment

### As a System Service (Linux/Mac)

Create `/etc/systemd/system/limadata-mcp.service`:

```ini
[Unit]
Description=Limadata MCP Server
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/limadata_mcp
Environment="LIMADATA_API_KEY=your_key_here"
ExecStart=/usr/bin/node /opt/limadata_mcp/dist/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable limadata-mcp
sudo systemctl start limadata-mcp
sudo systemctl status limadata-mcp
```

### On Heroku

1. Create `Procfile`:
   ```
   web: node dist/server.js
   ```

2. Deploy:
   ```bash
   heroku create
   heroku config:set LIMADATA_API_KEY=your_key_here
   git push heroku main
   ```

### On AWS Lambda (with custom runtime)

Requires wrapping the MCP stdio interface, more complex.

---

## Recommended Setup by Use Case

| Use Case | Method | Command |
|----------|--------|---------|
| Local development | NPM | `npm run dev` |
| Quick test | NPX | `npx --yes node ./dist/server.js` |
| Docker local | Docker | `docker-compose up` |
| Claude Desktop | npm in config | See config above |
| Production deployment | Docker + registry | Push to registry, deploy via orchestration |
| VPS/Self-hosted | Systemd service | Create service unit |

---

## Environment Variable Management

### For local development
Create `.env` file (not committed):
```
LIMADATA_API_KEY=xxx
```

Load it:
```bash
export $(cat .env | xargs)
npm start
```

### For Docker
Use `.env.docker`:
```bash
docker-compose --env-file .env.docker up
```

### For production
Use your platform's secrets management (AWS Secrets Manager, GitHub Secrets, etc.)

---

## Debugging

### Check if server is running
```bash
# Should list the 5 tools
curl -X POST http://localhost:9999/health 2>/dev/null || echo "Not running"
```

### View logs (Docker)
```bash
docker-compose logs -f limadata-mcp
```

### View logs (Systemd)
```bash
sudo journalctl -u limadata-mcp -f
```

### Test the API client locally
```bash
LIMADATA_API_KEY=test npm run dev
# Should start without errors
```
