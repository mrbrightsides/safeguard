import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { setupMCPServer } from "./mcp";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SHARP Context Middleware
app.use((req, res, next) => {
  const sharpContext = {
    patientId: req.headers["x-sharp-patient-id"],
    fhirBase: req.headers["x-sharp-fhir-base"],
    fhirToken: req.headers["x-sharp-fhir-token"],
    tenantId: req.headers["x-sharp-tenant-id"],
  };
  (req as any).sharpContext = sharpContext;
  next();
});

// Health Check
app.get("/api/ping", (req, res) => {
  res.json({ 
    status: "pong", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Initialize MCP Server
setupMCPServer(app);

// Clinical Endpoints
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

app.get("/api/v1/economic-forecast", (req, res) => {
  res.json({
    roi_ratio: "1:4",
    mean_claim_ina_cbg: "Rp12,400,000",
    potential_savings_annual: "Rp1,250,000,000",
    currency: "IDR"
  });
});

app.get("/api/v1/icd-clusters", (req, res) => {
  res.json([
    { name: 'F40-F48 (Anxiety/Stress)', value: 42, color: '#0d9488' },
    { name: 'F30-F39 (Mood/Depression)', value: 28, color: '#14b8a6' },
    { name: 'F20-F29 (Psychotic)', value: 8, color: '#0f766e' },
    { name: 'F10-F19 (Substance)', value: 12, color: '#5eead4' },
    { name: 'Others (F00-F99)', value: 10, color: '#ccfbf1' },
  ]);
});

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SafeGuard API",
      version: "1.0.0",
      description: "API for AI-powered psychosocial health surveillance.",
    },
    servers: [{ url: "/", description: "Current Server" }],
  },
  apis: [],
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
} else {
  // Vite middleware for development
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

export default app;
