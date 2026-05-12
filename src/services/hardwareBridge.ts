
/**
 * Service to bridge the Web App with Physical Hardware (Arduino/ESP32)
 * Uses Web Serial API to communicate
 */
export class HardwareBridge {
  private port: any | null = null;
  private writer: any | null = null;

  async connect() {
    try {
      // @ts-ignore - Web Serial API is experimental but works in Chrome/Edge
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.writer = this.port.writable.getWriter();
      console.log("Connected to SafeGuard Companion Hardware!");
      return true;
    } catch (err) {
      console.error("Hardware connection failed:", err);
      return false;
    }
  }

  async sendToDoll(text: string) {
    if (!this.writer) return;
    
    // We send characters to Arduino. Arduino can then trigger 
    // internal behaviors or pass it to a dedicated TTS module like DFPlayer
    const encoder = new TextEncoder();
    await this.writer.write(encoder.encode(text + "\n"));
  }

  async disconnect() {
    if (this.writer) {
      await this.writer.releaseLock();
      await this.port.close();
    }
  }
}

export const hardwareBridge = new HardwareBridge();

/**
 * Client-side Text-to-Speech using Web Speech API
 * This can be routed to the computer speaker or a bluetooth speaker inside the doll
 */
export function speakResponse(text: string, voiceName?: string) {
  if (!('speechSynthesis' in window)) return;

  // Stop any current speaking
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a warm/empathetic voice
  const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural'));
  if (preferredVoice) utterance.voice = preferredVoice;
  
  utterance.pitch = 1.1; 
  utterance.rate = 0.9; // Slightly slower for better empathy
  
  window.speechSynthesis.speak(utterance);
}
