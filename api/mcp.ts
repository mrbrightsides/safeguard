import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { GoogleGenAI } from "@google/genai";
import express from "express";
import { z } from "zod";

// --- MCP Server Instance (Stateful for Render) ---
const server = new McpServer({
  name: "SafeGuard-Clinical-Agent",
  version: "2.5.0",
});

// --- Clinical Logic ---
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

// --- Register Tools ---

server.tool(
  "get_risk_stratification",
  "Analyze DASS-21 and SRQ-20 scores to determine clinical risk level (L0-L3).",
  {
    dass21_score: z.number().int().describe("Total DASS-21 score"),
    srq20_positive: z.number().int().describe("Number of positive SRQ-20 items"),
    suicidal_ideation: z.boolean().describe("Presence of suicidal ideation"),
  },
  async ({ dass21_score, srq20_positive, suicidal_ideation }) => {
    const result = calculateRisk(dass21_score, srq20_positive, suicidal_ideation);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.tool(
  "analyze_psychosocial_notes",
  "AI-powered analysis of clinical notes or patient statements to detect behavioral risks.",
  {
    notes: z.string().describe("The clinical notes or patient statement to analyze"),
    context: z.object({
      anamnesisType: z.enum(["auto", "allo"]).optional(),
      medicalHistory: z.string().optional(),
      medicationHistory: z.string().optional()
    }).optional()
  },
  async ({ notes, context = {} }) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY not configured.");
      const genAI = new GoogleGenAI({ apiKey });
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Analyze the following behavioral input for psychosocial risks.
        Context: ${JSON.stringify(context)}
        Input: ${notes}
        
        Format as JSON: { riskLevel, summary, detectedPatterns[], recommendations[], suggestedICD, suggestedDSM }`,
        config: { responseMimeType: "application/json" }
      });
      return { content: [{ type: "text", text: response.text || "{}" }] };
    } catch (error) {
      return { content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }], isError: true };
    }
  }
);

server.tool(
  "get_economic_impact",
  "Calculate ROI and potential savings for mental health interventions.",
  {
    patient_count: z.number().int().default(100).describe("Number of patients in the cohort"),
  },
  async ({ patient_count }) => {
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
);

// --- Session Management ---
const transports = new Map<string, SSEServerTransport>();

export function setupMCPServer(app: express.Application) {
  
  app.get("/api/mcp/sse", async (req, res) => {
    console.log(`[MCP] New SSE connection from ${req.ip}`);

    // Set headers for long-lived connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Render/Standard Express doesn't need the Vercel anti-buffering hacks as much,
    // but keeping them doesn't hurt.
    res.setHeader('X-Accel-Buffering', 'no');

    const transport = new SSEServerTransport("/api/mcp/messages", res);
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
    const transport = transports.get(sessionId);

    if (transport) {
      try {
        await transport.handlePostMessage(req, res);
      } catch (err) {
        console.error(`[MCP] Message Error (Session ${sessionId}):`, err);
        res.status(500).send("Error handling message");
      }
    } else {
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

  console.log("MCP Server (Stateful) routes registered.");
}
