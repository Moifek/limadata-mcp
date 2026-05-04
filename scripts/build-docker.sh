#!/bin/bash

# Build and optionally push Limadata MCP Docker image

set -e

echo "Building Limadata MCP Docker image..."
docker build -t limadata-mcp:latest .

echo
echo "✓ Image built successfully!"
echo
echo "To run:"
echo "  docker run -e LIMADATA_API_KEY=your_key limadata-mcp:latest"
echo
echo "Or with docker-compose:"
echo "  LIMADATA_API_KEY=your_key docker-compose up"
