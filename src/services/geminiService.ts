import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as ImportMeta & { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// Local Gemma Configuration
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';
const GEMMA_MODEL = 'gemma4'; // Or 'gemma2' if 4 not yet available in local repo

async function tryLocalGemma(prompt: string): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for local check

    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GEMMA_MODEL,
        prompt: `Instructions: Analyze psychosocial risks. Return ONLY a JSON object.
        JSON keys: 'riskLevel' (Low, Mild, Moderate, Severe, Emergency), 'summary', 'detectedPatterns' (array), 'recommendations' (array), 'suggestedICD', 'suggestedDSM'.
        
        Input Data: ${prompt}`,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!response.ok) return null;
    
    const data = await response.json();
    return JSON.parse(data.response);
  } catch (e) {
    return null; // Silent fail, fallback to cloud
  }
}

export async function analyzeBehavioralRisk(input: string, context?: any) {
  const contextString = context ? `
  Context Information:
  - Anamnesis Type: ${context.anamnesisType === 'allo' ? 'Alloanamnesis (Third-party report)' : 'Autoanamnesis (Self-report)'}
  - Medical History: ${context.medicalHistory || 'None reported'}
  - Medication History: ${context.medicationHistory || 'None reported'}
  - Free-form Concerns: ${context.freeFormInput || 'None provided'}
  ` : '';

  const fullPrompt = `Analyze the following behavioral input and clinical context for psychosocial risks (burnout, fatigue, distress, bullying). 
  ${contextString}
  
  Format the response as JSON with keys: 
  'riskLevel' (Low, Mild, Moderate, Severe, Emergency), 
  'summary' (A concise clinical summary), 
  'detectedPatterns' (Array of identified behavioral/clinical patterns), 
  'recommendations' (Array of specific clinical or wellness advice),
  'suggestedICD' (The most relevant ICD-10 code, e.g. F32.x),
  'suggestedDSM' (The most relevant DSM-5 diagnostic framework).
  
  Input: ${input}`;

  // 1. Try Local Gemma (Phase 2 Strategy)
  const localResult = await tryLocalGemma(fullPrompt);
  if (localResult) {
    console.log("SafeGuard: Local Gemma 4 Inference Successful (Edge Mode)");
    return localResult;
  }

  // 2. Fallback to Cloud Gemini
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      riskLevel: "Unknown",
      summary: "Analysis failed. Please try again.",
      detectedPatterns: [],
      recommendations: []
    };
  }
}
