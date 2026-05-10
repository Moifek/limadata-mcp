#!/usr/bin/env node
import "dotenv/config.js";
import { createRequire } from "module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { LimadataAPIClient } from "./client.js";
import { registerTools } from "./tools.js";

const API_KEY = process.env.LIMADATA_API_KEY;

if (!API_KEY) {
  console.error("Error: LIMADATA_API_KEY environment variable is not set");
  process.exit(1);
}

const _require = createRequire(import.meta.url);
const { version } = _require("../package.json") as { version: string };

const client = new LimadataAPIClient(API_KEY);

const server = new McpServer(
  { name: "limadata-mcp", version },
  { capabilities: { tools: {} } }
);

registerTools(server, client);

const transport = new StdioServerTransport();
server.connect(transport);
