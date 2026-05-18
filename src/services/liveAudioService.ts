
export interface LiveAudioConfig {
  sampleRate: number;
  gain: number;
  voiceName: string;
}

export class LiveAudioService {
  private ws: WebSocket | null = null;
  private audioCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private gainNode: GainNode | null = null;
  private stream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private config: LiveAudioConfig) {}

  async connect(onAudioChunk: () => void, onInterrupted: () => void, onText: (text: string) => void) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.ws = new WebSocket(`${protocol}//${host}/api/live`);

    this.ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'audio' && msg.data) {
        this.playAudioChunk(msg.data);
        onAudioChunk();
      }
      if (msg.type === 'interrupted') {
        this.interrupt();
        onInterrupted();
      }
      if (msg.type === 'text' && msg.data) {
        onText(msg.data);
      }
    };

    this.ws.onopen = () => console.log("Live Audio: WebSocket Connected");
    this.ws.onerror = (e) => console.error("Live Audio: WebSocket Error", e);
    this.ws.onclose = () => this.stop();

    await this.initAudio();
  }

  async initAudio() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ 
      sampleRate: this.config.sampleRate 
    });
    
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = this.config.gain;
    this.gainNode.connect(this.audioCtx.destination);

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.source = this.audioCtx.createMediaStreamSource(this.stream);
    
    // Inline AudioWorklet Processor to handle audio in a separate thread
    const workletCode = `
      class InputProcessor extends AudioWorkletProcessor {
        process(inputs) {
          const input = inputs[0];
          if (input.length > 0) {
            const float32Data = input[0];
            this.port.postMessage(float32Data);
          }
          return true;
        }
      }
      registerProcessor('input-processor', InputProcessor);
    `;

    const blob = new Blob([workletCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    await this.audioCtx.audioWorklet.addModule(url);
    this.workletNode = new AudioWorkletNode(this.audioCtx, 'input-processor');
    
    this.workletNode.port.onmessage = (event) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const float32Data = event.data;
        const pcmData = this.float32ToPcm(float32Data);
        const base64 = this.arrayBufferToBase64(pcmData);
        this.ws.send(JSON.stringify({ audio: base64 }));
      }
    };

    this.source.connect(this.workletNode);
    this.workletNode.connect(this.audioCtx.destination);
  }

  private float32ToPcm(float32Array: Float32Array): ArrayBuffer {
    const pcm = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private playAudioChunk(base64: string) {
    if (!this.audioCtx || !this.gainNode) return;

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Gemini Live sends 16-bit PCM (signed int16)
    const pcm = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) {
        float32[i] = pcm[i] / 32768.0;
    }

    const buffer = this.audioCtx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.gainNode);

    const currentTime = this.audioCtx.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime + 0.1; // Add small buffer
    }

    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
  }

  private interrupt() {
    // Clear playback queue if needed
    // In a simple buffer source model, this is harder without tracking all nodes
    this.nextStartTime = 0;
  }

  stop() {
    this.ws?.close();
    this.stream?.getTracks().forEach(t => t.stop());
    this.workletNode?.disconnect();
    this.source?.disconnect();
    this.audioCtx?.close();
  }

  sendText(text: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text }));
    }
  }
}
