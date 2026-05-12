import { getVaultData } from '../lib/vaultUtils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GemmaResponse {
  text: string;
  source: 'local-gemma' | 'cloud-gemini' | 'error';
}

/**
 * Service to handle interaction with Local Gemma via Ollama or llama.cpp
 */
export async function generateGemmaResponse(
  messages: Message[],
  mode: 'analyst' | 'companion'
): Promise<GemmaResponse> {
  const vault = getVaultData();
  const isCompanionMode = mode === 'companion';

  const systemInstruction = `
You are SafeGuard AI (Powered by Gemma).
LOCAL CONTEXT: ${vault.nickname || 'User'} is in ${vault.isAnonymous ? 'Anonymous' : 'Personal'} mode.
MODE: ${isCompanionMode ? 'Empathetic Companion' : 'Clinical Analyst'}.
${isCompanionMode 
  ? 'Provide warm, human-like psychosocial support. Use Indonesian or English.' 
  : 'Provide precise clinical risk stratification based on ICD-10 and DASS-21 criteria.'
}
CRISIS PROTOCOL: If indicators of self-harm are detected, output [TRIGGER_MERP] and provide emergency resources.
`;

  const prompt = `${systemInstruction}\n\nHistory:\n${messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}\nUSER: ${messages[messages.length - 1].text}\nMODEL:`;

  try {
    // Attempting to reach local Ollama endpoint
    // Note: This requires Ollama to be running on localhost:11434 with OLLAMA_ORIGINS="*"
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma:2b', // Falling back to 2b for local efficiency, or whatever is pulled
        prompt: prompt,
        stream: false,
        options: {
          temperature: isCompanionMode ? 0.7 : 0.1,
          top_p: 0.9,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.response,
      source: 'local-gemma'
    };
  } catch (error) {
    console.error("Local Gemma failed, falling back to Cloud Gemini", error);
    // In a real "Disconnected" scenario, this would return an error message
    // But for the hackathon, we show a fallback or error
    return {
      text: "Local Gemma is offline. Please ensure Ollama is running at localhost:11434 with 'gemma' model pulled.",
      source: 'error'
    };
  }
}
