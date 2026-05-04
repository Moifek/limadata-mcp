import "dotenv/config.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { LiamataAPIClient } from "./client.js";
import * as Tools from "./tools.js";

const API_KEY = process.env.LIMADATA_API_KEY;

if (!API_KEY) {
  console.error("Error: LIMADATA_API_KEY environment variable is not set");
  process.exit(1);
}

const client = new LiamataAPIClient(API_KEY);

const server = new Server(
  {
    name: "limadata-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const toolsList: Tool[] = [
  Tools.enrichPersonTool,
  Tools.enrichCompanyTool,
  Tools.searchPeopleTool,
  Tools.searchCompaniesTool,
  Tools.companyInsightsTool,
  Tools.creditsBalanceTool,
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolsList,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case "enrich_person": {
        const validated = Tools.validateEnrichPersonInput(args as Record<string, unknown>);
        const result = await client.enrichPerson(validated);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "enrich_company": {
        const validated = Tools.validateEnrichCompanyInput(args as Record<string, unknown>);
        const result = await client.enrichCompany(validated);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_people": {
        const validated = Tools.validateSearchPeopleInput(args as Record<string, unknown>);
        const result = await client.searchPeople(validated);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_companies": {
        const validated = Tools.validateSearchCompaniesInput(args as Record<string, unknown>);
        const result = await client.searchCompanies(validated);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_company_insights": {
        const validated = Tools.validateCompanyInsightsInput(args as Record<string, unknown>);
        const result = await client.getCompanyInsights(validated);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_credits_balance": {
        const result = await client.getCreditsBalance();
        return {
          content: [
            {
              type: "text",
              text: `Your Limadata account has ${result.balance} credits remaining.`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error calling ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
