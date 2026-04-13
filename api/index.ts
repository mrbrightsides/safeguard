import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { GoogleGenAI } from "@google/genai";
import { setupMCPServer } from "./mcp_server.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Health Check
app.get("/api/ping", (req, res) => {
  res.json({ 
    status: "pong", 
    timestamp: new Date().toISOString(),
    hasAI: !!genAI
  });
});

// --- A2A / External Agent Endpoints ---

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
 *               notes:
 *                 type: string
 *                 description: Clinical notes or patient statement
 *                 example: "Patient reports feeling overwhelmed and having trouble sleeping for 2 weeks."
 *               dass21_score:
 *                 type: integer
 *                 description: Total DASS-21 score
 *                 example: 18
 *               srq20_positive:
 *                 type: integer
 *                 description: Number of positive SRQ-20 items
 *                 example: 5
 *     responses:
 *       200:
 *         description: Analysis result
 */
app.post("/api/v1/analyze", async (req, res) => {
  const { notes, dass21_score, srq20_positive } = req.body;

  if (!genAI) {
    return res.status(500).json({ error: "AI Service not configured" });
  }

  try {
    const model = (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      As a Clinical Psychologist, analyze this patient data:
      Notes: ${notes}
      DASS-21 Score: ${dass21_score}
      SRQ-20 Positive: ${srq20_positive}

      Provide a structured analysis including:
      1. Risk Level (L0-L3)
      2. Clinical Summary
      3. Suggested ICD-10 Code
      4. Immediate Recommendations
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    res.json({ 
      analysis: response.text(),
      timestamp: new Date().toISOString()
    });
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
 *       200:
 *         description: Risk level and recommendation
 */
app.post("/api/v1/risk-detect", (req, res) => {
  const { dass21_score, srq20_positive, suicidal_ideation } = req.body;
  
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

  res.json({ risk_level: risk, icd_code: icd, recommendation: rec });
});

// Initialize MCP Server (Keep as fallback)
setupMCPServer(app);

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SafeGuard Clinical Agent API",
      version: "1.0.0",
      description: "AI-powered psychosocial health surveillance and economic evaluation.",
      contact: {
        name: "SafeGuard Team",
        url: "https://server-safeguard.onrender.com",
      },
    },
    servers: [
      {
        url: "https://server-safeguard.onrender.com",
        description: "Production Server (Render)",
      },
    ],
  },
  apis: ["./api/index.ts"], // Scan this file for OpenAPI annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SafeGuard Server listening on port ${PORT}`);
  console.log(`📖 Swagger UI: https://server-safeguard.onrender.com/api-docs`);
});

export default app;
