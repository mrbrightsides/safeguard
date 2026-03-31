import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export async function analyzeBehavioralRisk(input: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following behavioral input for psychosocial risks (burnout, fatigue, distress, bullying). 
      Format the response as JSON with keys: 
      'riskLevel' (Low, Mild, Moderate, Severe, Emergency), 
      'summary', 
      'detectedPatterns', 
      'recommendations' (provide urgent advice for High/Emergency risks),
      'suggestedICD' (e.g. F32.x),
      'suggestedDSM' (e.g. Probable MDD).
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
