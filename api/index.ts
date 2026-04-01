import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

async function startServer() {
  const app = express();

  app.use(express.json());

  // Swagger Configuration
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SafeGuard Safespace API",
        version: "1.0.0",
        description: "API for AI-powered psychosocial health surveillance and economic evaluation.",
        contact: {
          name: "SafeGuard Team",
          url: "https://safeguard-hsil.vercel.app",
        },
      },
      servers: [
        {
          url: "https://safeguard-hsil.vercel.app",
          description: "Production Server (Vercel)",
        },
      ],
    },
    apis: [path.join(process.cwd(), "api", "index.ts")], // Absolute path for Vercel
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  
  // Swagger UI options to use reliable CDN assets
  const swaggerUiOptions = {
    customCssUrl: "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css",
    customJs: [
      "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js",
      "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"
    ]
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

  /**
   * @openapi
   * /api/v1/risk-detect:
   *   post:
     *     summary: Detect psychosocial risk level
     *     description: Analyzes user assessment data to determine risk level (L0-L3) based on clinical hierarchy.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               dass21_score:
     *                 type: integer
     *                 example: 24
     *               srq20_positive:
     *                 type: integer
     *                 example: 8
     *               suicidal_ideation:
     *                 type: boolean
     *                 example: false
     *     responses:
     *       200:
     *         description: Risk stratification result
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 risk_level:
     *                   type: string
     *                   example: "L2: Syndrome Domain"
     *                 icd_code:
     *                   type: string
     *                   example: "F41.1"
     *                 recommendation:
     *                   type: string
     *                   example: "Clinical consultation required within 48 hours."
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

  /**
   * @openapi
   * /api/v1/economic-forecast:
   *   get:
     *     summary: Get health economic evaluation data
     *     description: Returns ROI calculations and INA-CBG claim estimates for mental health interventions.
     *     responses:
     *       200:
     *         description: Economic forecast data
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 roi_ratio:
     *                   type: string
     *                   example: "1:4"
     *                 mean_claim_ina_cbg:
     *                   type: string
     *                   example: "Rp12,400,000"
     *                 potential_savings_annual:
     *                   type: string
     *                   example: "Rp1,250,000,000"
   */
  app.get("/api/v1/economic-forecast", (req, res) => {
    res.json({
      roi_ratio: "1:4",
      mean_claim_ina_cbg: "Rp12,400,000",
      potential_savings_annual: "Rp1,250,000,000",
      currency: "IDR",
      exchange_rate_jisdor: 17002
    });
  });

  /**
   * @openapi
   * /api/v1/icd-clusters:
   *   get:
     *     summary: Get top burden clusters (ICD-10)
     *     description: Returns the distribution of mental health burdens based on ICD-10 Chapter V.
     *     responses:
     *       200:
     *         description: ICD-10 burden clusters
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                   value:
     *                     type: integer
     *                   color:
     *                     type: string
   */
  app.get("/api/v1/icd-clusters", (req, res) => {
    res.json([
      { name: 'F40-F48 (Anxiety/Stress)', value: 42, color: '#0d9488' },
      { name: 'F30-F39 (Mood/Depression)', value: 28, color: '#14b8a6' },
      { name: 'F20-F29 (Psychotic)', value: 8, color: '#0f766e' },
      { name: 'F10-F19 (Substance)', value: 12, color: '#5eead4' },
      { name: 'Others (F00-F99)', value: 10, color: '#ccfbf1' },
    ]);
  });

  return app;
}

// For local development
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  startServer().then(app => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  });
}

// Export for Vercel
export default async (req: any, res: any) => {
  const app = await startServer();
  return app(req, res);
};
