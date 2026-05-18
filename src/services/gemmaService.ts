import { getVaultData } from '@/src/lib/vaultUtils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GemmaResponse {
  text: string;
  source: 'local-gemma' | 'cloud-gemini' | 'error';
  stream?: ReadableStream<Uint8Array> | null;
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
  const modelToUse = 'gemma4'; // Strict competition requirement

  try {
    // Attempting to reach local Ollama endpoint with streaming enabled
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        prompt: prompt,
        stream: true, // Enable streaming for real-time feedback
        options: {
          temperature: isCompanionMode ? 0.7 : 0.1,
          top_p: 0.9,
          num_ctx: 1024,   // Optimized for 8GB RAM systems
          num_predict: 512, // Limit response length
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama server error (${response.status}): ${response.statusText}`);
    }

    // Return the response stream for the UI
    return {
      text: "", 
      source: 'local-gemma',
      stream: response.body
    };

  } catch (error: any) {
    console.error("Local Gemma failed", error);
    
    let errorMessage = "Local Gemma Connection Error.";
    
    if (error.message && error.message.includes('not found')) {
      errorMessage = error.message;
    } else if (error instanceof TypeError || error.message?.includes('fetch')) {
      errorMessage = "Cannot connect to Ollama. 1. Ensure Ollama is running. 2. Set OLLAMA_ORIGINS='*' 3. Highly recommended: 'ollama pull gemma:2b' for smooth performance.";
    } else {
      errorMessage = `Local Error: ${error.message || 'Unknown error'}`;
    }

    return {
      text: errorMessage,
      source: 'error'
    };
  }
}
