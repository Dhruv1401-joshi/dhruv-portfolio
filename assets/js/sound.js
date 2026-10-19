/**
 * Web Audio API Subtle Cybernetic Micro-Feedback
 * Synthesized procedurally - zero external audio asset load!
 */

class SoundSystem {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.initButton();
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  initButton() {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      this.init();
      this.enabled = !this.enabled;
      btn.classList.toggle('active', this.enabled);
      btn.setAttribute('aria-label', this.enabled ? 'Mute Interface Sound' : 'Enable Interface Sound');

      const iconPath = btn.querySelector('.sound-icon');
      if (this.enabled) {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.playPop(520, 0.08);
      }
    });

    // Attach subtle feedback to interactive buttons
    document.querySelectorAll('.btn, .window-tab, .pipeline-step-node, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (this.enabled) this.playTick();
      });
      el.addEventListener('click', () => {
        if (this.enabled) this.playPop(440, 0.06);
      });
    });
  }

  playTick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Ignore audio synthesis errors on strict policies
    }
  }

  playPop(freq = 480, duration = 0.06) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.soundSystem = new SoundSystem();
});
