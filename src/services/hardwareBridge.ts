
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
export function speakResponse(text: string) {
  if (!('speechSynthesis' in window)) return;

  // Stop any current speaking
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Get all available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Detect language roughly (prefer id since primary context is Indonesian)
  const hasIndonesianMarkers = /saya|kamu|anda|halo|selamat|pagi|siang|malam|terima|kasih|dengan|adalah/i.test(text);
  const targetLang = hasIndonesianMarkers ? 'id-ID' : 'en-US';
  utterance.lang = targetLang;

  // Voice Selection Priority Logic
  let selectedVoice = null;

  if (targetLang === 'id-ID') {
    // 1. Try Google Indonesian Natural
    selectedVoice = voices.find(v => v.lang.startsWith('id') && v.name.includes('Google'));
    // 2. Try any Indonesian voice
    if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith('id'));
  } else {
    // 1. Try English Neural/Natural/Google
    selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural')));
    // 2. Try any English voice
    if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith('en'));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // Adjust parameters for a more "empathetic" human tone
  utterance.pitch = 1.05; 
  utterance.rate = 1.0; 
  
  // Important: On some browsers, we need to re-fetch voices if the array is empty
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      speakResponse(text); // Retry once
      window.speechSynthesis.onvoiceschanged = null; // Prevent loops
    };
    return;
  }

  window.speechSynthesis.speak(utterance);
}
