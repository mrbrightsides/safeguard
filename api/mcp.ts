import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleGenAI } from "@google/genai";
import express from "express";

// --- MCP Clinical Logic ---
function calculateRisk(dass21_score: number, srq20_positive: number, suicidal_ideation: boolean) {
  let risk = "L3: Prognostic Layer";
  let icd = "N/A";
  let rec = "Continue routine wellness monitoring.";

  if (suicidal_ideation) {
    risk = "L0: Emergency";
    icd = "F32.3";
    rec = "IMMEDIATE ESCALATION: Psychiatric emergency protocol activated.";
  } else if (srq20_positive > 12) {
    risk = "L1: Organic/Substance";
    icd = "F10-F19";
    rec = "Medical rule-out required for organic or substance-related factors.";
  } else if (dass21_score > 20) {
    risk = "L2: Syndrome Domain";
    icd = "F41.1";
    rec = "Clinical consultation required within 48 hours.";
  }

  return { risk_level: risk, icd_code: icd, recommendation: rec };
}

// --- MCP Server Instance ---
const server = new Server(
  {
    name: "SafeGuard-Clinical-Agent",
    version: "2.6.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools: Tool[] = [
  {
    name: "get_risk_stratification",
    description: "Analyze DASS-21 and SRQ-20 scores to determine clinical risk level (L0-L3).",
    inputSchema: {
      type: "object",
      properties: {
        dass21_score: { type: "integer", description: "Total DASS-21 score" },
        srq20_positive: { type: "integer", description: "Number of positive SRQ-20 items" },
        suicidal_ideation: { type: "boolean", description: "Presence of suicidal ideation" },
      },
      required: ["dass21_score", "srq20_positive", "suicidal_ideation"],
    },
  },
  {
    name: "analyze_psychosocial_notes",
    description: "AI-powered analysis of clinical notes or patient statements to detect behavioral risks.",
    inputSchema: {
      type: "object",
      properties: {
        notes: { type: "string", description: "The clinical notes or patient statement to analyze" },
        context: { 
          type: "object", 
          description: "Additional clinical context (medical history, etc.)",
          properties: {
            anamnesisType: { type: "string", enum: ["auto", "allo"] },
            medicalHistory: { type: "string" },
            medicationHistory: { type: "string" }
          }
        }
      },
      required: ["notes"],
    },
  },
  {
    name: "get_economic_impact",
    description: "Calculate ROI and potential savings for mental health interventions.",
    inputSchema: {
      type: "object",
      properties: {
        patient_count: { type: "integer", description: "Number of patients in the cohort" },
      },
    },
  }
];

// Register Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "get_risk_stratification": {
      const { dass21_score, srq20_positive, suicidal_ideation } = args as any;
      const result = calculateRisk(dass21_score, srq20_positive, suicidal_ideation);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
    case "analyze_psychosocial_notes": {
      const { notes, context = {} } = args as any;
      try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY not configured.");
        const genAI = new GoogleGenAI({ apiKey });
        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `Analyze: ${notes}\nContext: ${JSON.stringify(context)}`,
          config: { responseMimeType: "application/json" }
        });
        return { content: [{ type: "text", text: response.text || "{}" }] };
      } catch (error) {
        return { content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }], isError: true };
      }
    }
    case "get_economic_impact": {
      const { patient_count = 100 } = args as any;
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            roi_ratio: "1:4",
            potential_savings: `Rp ${(patient_count * 12500000).toLocaleString('id-ID')}`
          }, null, 2) 
        }],
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// --- Session Management ---
const transports = new Map<string, SSEServerTransport>();

export function setupMCPServer(app: express.Application) {
  
  app.get("/api/mcp/sse", async (req, res) => {
    console.log(`[MCP] New SSE connection from ${req.ip}`);

    // Set headers for long-lived connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Use absolute URL for messages if possible to avoid path resolution issues
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const messageUrl = `${protocol}://${host}/api/mcp/messages`;
    
    console.log(`[MCP] Initializing transport with message URL: ${messageUrl}`);
    const transport = new SSEServerTransport(messageUrl, res);
    transports.set(transport.sessionId, transport);

    try {
      await server.connect(transport);
      console.log(`[MCP] Session ${transport.sessionId} connected.`);
    } catch (error) {
      console.error("❌ Failed to connect MCP server:", error);
    }

    req.on('close', () => {
      console.log(`[MCP] Session ${transport.sessionId} closed.`);
      transports.delete(transport.sessionId);
    });
  });

  app.post("/api/mcp/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    console.log(`[MCP] POST message for session: ${sessionId}`);
    const transport = transports.get(sessionId);

    if (transport) {
      try {
        await transport.handlePostMessage(req, res);
      } catch (err) {
        console.error(`[MCP] Message Error (Session ${sessionId}):`, err);
        res.status(500).send("Error handling message");
      }
    } else {
      console.warn(`[MCP] Session not found: ${sessionId}`);
      res.status(400).send("No active session.");
    }
  });

  app.get("/api/mcp/debug", (req, res) => {
    res.json({
      status: "ok",
      activeSessions: transports.size,
      sessionIds: Array.from(transports.keys()),
      env: {
        hasGeminiKey: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
        isVercel: !!process.env.VERCEL
      }
    });
  });

  console.log("MCP Server (Low-Level) routes registered.");
}
