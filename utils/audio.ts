// Simple Generative Audio Engine using Web Audio API
// Generates Brown Noise (Rain/Wind texture) and Drone Pads (Music)

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private isPlaying: boolean = false;
  private stopTimer: number | null = null;

  constructor() {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  private createBrownNoise(): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for gain
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    return noise;
  }

  public async play(type: string = 'calm') {
    if (this.isPlaying || !this.ctx) return;
    
    // Clear any pending stop timer
    this.clearTimer();

    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2); // Fade in
    this.masterGain.connect(this.ctx.destination);

    // 1. Texture Layer (Noise)
    const isNature = ['rain', 'wind', 'forest', 'storm'].includes(type);
    if (isNature || type === 'calm') {
      this.noiseNode = this.createBrownNoise();
      if (this.noiseNode && this.masterGain) {
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        // 'wind' is lower rumbles, 'rain' is higher hiss
        noiseFilter.frequency.value = type === 'wind' ? 300 : 800;
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.1;

        this.noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        this.noiseNode.start();
      }
    }

    // 2. Music Layer (Drone Pads)
    // Determine chord structure based on mood
    // Frequencies (approx): C3=130.8, D3=146.8, E3=164.8, F3=174.6, G3=196.0, A3=220.0
    
    let baseFreq = 174.61; // F3 (Heart Chakra / Healing freq often cited)
    let chordMultipliers = [1, 1.5, 2]; // Default: Root, 5th, Octave (Neutral)

    if (type === 'night' || type === 'sad' || type === 'lonely') {
      baseFreq = 146.83; // D3
      chordMultipliers = [1, 1.2, 1.5]; // Minor triad-ish (approx Minor 3rd is 1.189)
    } else if (type === 'anxious' || type === 'tension') {
      baseFreq = 130.81; // C3
      chordMultipliers = [1, 1.414, 2]; // Diminished-ish (Tritone) for tension? Or just keep it grounded.
    } else if (type === 'uplift' || type === 'happy' || type === 'calm' || type === 'forest') {
      baseFreq = 196.00; // G3
      // Major 7th feel: Root, Major 3rd (1.25), 5th (1.5), Major 7th (1.875)
      // This creates a dreamy, hopeful sound
      chordMultipliers = [1, 1.25, 1.5, 1.875]; 
    }

    chordMultipliers.forEach((mult, i) => {
      if (!this.ctx || !this.masterGain) return;
      
      const osc = this.ctx.createOscillator();
      // Mix sine and triangle for warmth
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = baseFreq * mult;
      
      const oscGain = this.ctx.createGain();
      // Higher notes quieter
      oscGain.gain.value = (0.1 / (i + 1)) * 0.8; 
      
      // Detune for chorus effect (richness)
      osc.detune.value = Math.random() * 12 - 6;

      // LFO for subtle movement (breathing effect)
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (Math.random() * 0.1); // Slow breathing
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.05; // Modulation depth
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start();
      this.oscillators.push(osc);
      this.oscillators.push(lfo); // Keep track to stop later
    });

    this.isPlaying = true;
  }

  public stop() {
    this.clearTimer();
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    // Fade out
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
        osc.disconnect();
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try { this.noiseNode.stop(); } catch(e) {}
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      this.masterGain?.disconnect();
      this.masterGain = null;
      this.isPlaying = false;
    }, 2100);
  }

  public toggle(type?: string) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(type);
    }
    return !this.isPlaying;
  }

  public setTimer(seconds: number, onComplete?: () => void) {
    this.clearTimer();
    // Use window.setTimeout for browser environment
    this.stopTimer = window.setTimeout(() => {
      this.stop();
      if (onComplete) onComplete();
    }, seconds * 1000);
  }

  public clearTimer() {
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();