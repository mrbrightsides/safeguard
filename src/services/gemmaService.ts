import { getVaultData } from '@/src/lib/vaultUtils';

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
  const modelName = 'gemma4'; // Updated to Gemma 4 as per competition requirements

  try {
    // Attempting to reach local Ollama endpoint
    // Note: This requires Ollama to be running on localhost:11434 with OLLAMA_ORIGINS="*"
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: isCompanionMode ? 0.7 : 0.1,
          top_p: 0.9,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model '${modelName}' not found in your Ollama library. Please run 'ollama pull ${modelName}' in your terminal.`);
      }
      throw new Error(`Ollama server error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.response,
      source: 'local-gemma'
    };
  } catch (error: any) {
    console.error("Local Gemma failed", error);
    
    let errorMessage = "Local Gemma Connection Error.";
    
    if (error.message && error.message.includes('not found')) {
      errorMessage = error.message;
    } else if (error instanceof TypeError || error.message?.includes('fetch')) {
      errorMessage = "Cannot connect to Ollama. 1. Ensure Ollama is running. 2. Set OLLAMA_ORIGINS='*' 3. Ensure you have pulled the 'gemma4' model.";
    } else {
      errorMessage = `Local Error: ${error.message || 'Unknown error'}`;
    }

    return {
      text: errorMessage,
      source: 'error'
    };
  }
}
