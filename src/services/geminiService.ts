import { GoogleGenAI } from "@google/genai";

const apiKey = (import.meta as ImportMeta & { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function analyzeBehavioralRisk(input: string, context?: any) {
  try {
    const contextString = context ? `
    Context Information:
    - Anamnesis Type: ${context.anamnesisType === 'allo' ? 'Alloanamnesis (Third-party report)' : 'Autoanamnesis (Self-report)'}
    - Medical History: ${context.medicalHistory || 'None reported'}
    - Medication History: ${context.medicationHistory || 'None reported'}
    - Free-form Concerns: ${context.freeFormInput || 'None provided'}
    ` : '';

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following behavioral input and clinical context for psychosocial risks (burnout, fatigue, distress, bullying). 
      ${contextString}
      
      Format the response as JSON with keys: 
      'riskLevel' (Low, Mild, Moderate, Severe, Emergency), 
      'summary' (A concise clinical summary), 
      'detectedPatterns' (Array of identified behavioral/clinical patterns), 
      'recommendations' (Array of specific clinical or wellness advice),
      'suggestedICD' (The most relevant ICD-10 code, e.g. F32.x),
      'suggestedDSM' (The most relevant DSM-5 diagnostic framework).
      
      Input: ${input}`,
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
