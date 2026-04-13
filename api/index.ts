import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

// --- Session Management ---
const transports = new Map<string, SSEServerTransport>();

// --- Routes ---

// Health Check
app.get("/api/ping", (req, res) => {
  res.json({ 
    status: "pong", 
    timestamp: new Date().toISOString(),
    hasAI: !!genAI
  });
});

// Agent Card for Prompt Opinion (A2A)
app.get("/.well-known/agent-card.json", (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;

  res.json({
    schema_version: "v1",
    version: "1.0.0",
    protocolVersion: "1.0",
    name: "SafeGuard Clinical Agent",
    description: "AI-powered psychosocial health surveillance and economic evaluation.",
    url: baseUrl,
    capabilities: {
      chat: true,
      tools: true
    },
    defaultInputModes: ["text"],
    auth: {
      type: "none"
    },
    api: {
      type: "openapi",
      url: `${baseUrl}/api-docs/swagger.json`
    },
    contact_email: "khudri@binadarma.ac.id"
  });
});

// A2A Endpoints
/**
 * @openapi
 * /api/v1/analyze:
 *   post:
 *     summary: AI Clinical Analysis
 *     description: Comprehensive psychosocial risk assessment using Gemini AI.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes: { type: string, example: "Patient reports feeling overwhelmed." }
 *               dass21_score: { type: integer, example: 18 }
 *               srq20_positive: { type: integer, example: 5 }
 *     responses:
 *       200: { description: Analysis result }
 */
app.post("/api/v1/analyze", async (req, res) => {
  const { notes, dass21_score, srq20_positive } = req.body;
  if (!genAI) return res.status(500).json({ error: "AI Service not configured" });
  try {
    const model = (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `As a Clinical Psychologist, analyze this patient data:\nNotes: ${notes}\nDASS-21 Score: ${dass21_score}\nSRQ-20 Positive: ${srq20_positive}\nProvide a structured analysis including:\n1. Risk Level (L0-L3)\n2. Clinical Summary\n3. Suggested ICD-10 Code\n4. Immediate Recommendations`;
    const result = await model.generateContent(prompt);
    res.json({ analysis: result.response.text(), timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * @openapi
 * /api/v1/risk-detect:
 *   post:
 *     summary: Rule-based Risk Detection
 *     description: Fast clinical risk stratification based on scoring thresholds.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dass21_score: { type: integer, example: 24 }
 *               srq20_positive: { type: integer, example: 8 }
 *               suicidal_ideation: { type: boolean, example: false }
 *     responses:
 *       200: { description: Risk level and recommendation }
 */
app.post("/api/v1/risk-detect", (req, res) => {
  const { dass21_score, srq20_positive, suicidal_ideation } = req.body;
  const result = calculateRisk(dass21_score, srq20_positive, suicidal_ideation);
  res.json(result);
});

// MCP Endpoints
app.get("/api/mcp/sse", async (req, res) => {
  const server = new Server({ name: "SafeGuard-Clinical-Agent", version: "2.7.0" }, { capabilities: { tools: {} } });
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.get('host');
  const messageUrl = `${protocol}://${host}/api/mcp/messages`;
  const transport = new SSEServerTransport(messageUrl, res);
  transports.set(transport.sessionId, transport);

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
      case "get_risk_stratification": {
        const { dass21_score, srq20_positive, suicidal_ideation } = args as any;
        return { content: [{ type: "text", text: JSON.stringify(calculateRisk(dass21_score, srq20_positive, suicidal_ideation), null, 2) }] };
      }
      case "analyze_psychosocial_notes": {
        const { notes, context = {} } = args as any;
        try {
          if (!genAI) throw new Error("GEMINI_API_KEY not configured.");
          const model = (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent(`Analyze: ${notes}\nContext: ${JSON.stringify(context)}`);
          return { content: [{ type: "text", text: result.response.text() || "{}" }] };
        } catch (error) {
          return { content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }], isError: true };
        }
      }
      case "get_economic_impact": {
        const { patient_count = 100 } = args as any;
        return { content: [{ type: "text", text: JSON.stringify({ roi_ratio: "1:4", potential_savings: `Rp ${(patient_count * 12500000).toLocaleString('id-ID')}` }, null, 2) }] };
      }
      default: throw new Error(`Unknown tool: ${name}`);
    }
  });

  const heartbeat = setInterval(() => { try { res.write(': heartbeat\n\n'); } catch (e) { clearInterval(heartbeat); } }, 30000);
  try { await server.connect(transport); } catch (error) { console.error("MCP connect error:", error); }
  req.on('close', () => { clearInterval(heartbeat); transports.delete(transport.sessionId); });
});

app.post("/api/mcp/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);
  if (transport) {
    try { await transport.handlePostMessage(req, res); } catch (err) { res.status(500).send("Error handling message"); }
  } else { res.status(400).send("No active session."); }
});

app.get("/api/mcp/debug", (req, res) => {
  res.json({ status: "ok", activeSessions: transports.size, sessionIds: Array.from(transports.keys()) });
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "SafeGuard Clinical Agent API", version: "1.0.0", description: "AI-powered psychosocial health surveillance and economic evaluation." },
    servers: [{ url: "https://server-safeguard.onrender.com", description: "Production Server (Render)" }],
  },
  apis: ["./api/index.ts"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerDocs);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SafeGuard Server listening on port ${PORT}`);
    console.log(`📖 Swagger UI: https://server-safeguard.onrender.com/api-docs`);
  });
}

startServer();
export default app;
