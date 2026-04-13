import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for Server-side MCP Tools
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

// SafeGuard Clinical Logic (Extracted from api/index.ts)
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

export function setupMCPServer(app: express.Application) {
  const server = new Server(
    {
      name: "SafeGuard-Clinical-Agent",
      version: "2.4.0",
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

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // SHARP Context Handling (Simulated)
    // In a real SHARP environment, context like patientId would be in request.meta
    const patientContext = (request as any).meta?.sharpContext || {};
    console.log(`[SHARP] Processing request for Patient: ${patientContext.patientId || 'Unknown'}`);

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
          const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Analyze the following behavioral input for psychosocial risks.
            Context: ${JSON.stringify(context)}
            Input: ${notes}
            
            Format as JSON: { riskLevel, summary, detectedPatterns[], recommendations[], suggestedICD, suggestedDSM }`,
            config: {
              responseMimeType: "application/json"
            }
          });

          const cleanedText = response.text || "{}";
          
          return {
            content: [{ type: "text", text: cleanedText }],
          };
        } catch (error) {
          return {
            content: [{ type: "text", text: JSON.stringify({ error: "AI Analysis failed", details: String(error) }) }],
            isError: true
          };
        }
      }
      case "get_economic_impact": {
        const { patient_count = 100 } = args as any;
        const savingsPerPatient = 12500000; // Rp 12.5M
        const totalSavings = patient_count * savingsPerPatient;
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({
              roi_ratio: "1:4",
              potential_savings: `Rp ${totalSavings.toLocaleString('id-ID')}`,
              currency: "IDR",
              clinical_basis: "INA-CBG Chapter V Mapping"
            }, null, 2) 
          }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  // MCP over SSE (Server-Sent Events) - Standard for web-based MCP
  let transport: SSEServerTransport | null = null;

  const sseHandler = async (req: express.Request, res: express.Response) => {
    transport = new SSEServerTransport("/api/mcp/messages", res);
    await server.connect(transport);
  };

  const messageHandler = async (req: express.Request, res: express.Response) => {
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send("No active SSE transport");
    }
  };

  // Support both local and Vercel /api prefix
  app.get("/mcp/sse", sseHandler);
  app.get("/api/mcp/sse", sseHandler);
  
  app.post("/mcp/messages", messageHandler);
  app.post("/api/mcp/messages", messageHandler);

  console.log("MCP Server initialized at /api/mcp/sse");
}
