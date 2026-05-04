#!/bin/bash

# This script helps set up the Limadata MCP server with Claude Desktop

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Limadata MCP - Claude Desktop Setup${NC}"
echo

# Get the absolute path of the project
PROJECT_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
echo "Project path: $PROJECT_PATH"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CONFIG_PATH="$HOME/.config/Claude/claude_desktop_config.json"
    OS="Linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
    OS="Windows"
else
    echo -e "${RED}Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

echo -e "${YELLOW}Detected OS: $OS${NC}"
echo "Config path: $CONFIG_PATH"
echo

# Check if API key is set
if [ -z "$LIMADATA_API_KEY" ]; then
    echo -e "${YELLOW}Warning: LIMADATA_API_KEY is not set${NC}"
    echo "Get your API key from: https://app.limadata.com/settings/apikeys"
    read -p "Enter your API key (or press Enter to skip): " API_KEY
    if [ -n "$API_KEY" ]; then
        export LIMADATA_API_KEY="$API_KEY"
    fi
fi

echo

# Check if config file exists
if [ ! -f "$CONFIG_PATH" ]; then
    echo -e "${YELLOW}Creating new config file...${NC}"
    mkdir -p "$(dirname "$CONFIG_PATH")"
    cat > "$CONFIG_PATH" << 'EOF'
{
  "mcpServers": {}
}
EOF
fi

# Generate the server config
SERVER_CONFIG=$(cat <<EOF
{
  "command": "npm",
  "args": ["start"],
  "cwd": "$PROJECT_PATH"
}
EOF
)

if [ -n "$LIMADATA_API_KEY" ]; then
    SERVER_CONFIG=$(cat <<EOF
{
  "command": "npm",
  "args": ["start"],
  "cwd": "$PROJECT_PATH",
  "env": {
    "LIMADATA_API_KEY": "$LIMADATA_API_KEY"
  }
}
EOF
)
fi

# Use Python to update JSON (more reliable than jq)
python3 << PYTHON_EOF
import json

config_path = "$CONFIG_PATH"

with open(config_path, 'r') as f:
    config = json.load(f)

if 'mcpServers' not in config:
    config['mcpServers'] = {}

config['mcpServers']['limadata'] = $SERVER_CONFIG

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

print("✓ Updated config file")
PYTHON_EOF

echo
echo -e "${GREEN}Setup complete!${NC}"
echo
echo "Next steps:"
echo "1. Close Claude Desktop completely"
echo "2. Reopen Claude Desktop"
echo "3. The Limadata tools should now be available"
echo
echo "To verify:"
echo "  - Try: 'Get my Limadata credit balance'"
echo "  - Try: 'Enrich john.doe@example.com'"
