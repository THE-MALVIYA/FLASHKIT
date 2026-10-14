/**
 * Formats a timestamp into 24-hour time HH:mm:ss
 */
export function formatTime24(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Gets the time zone abbreviation or offset (e.g. IST, UTC, EDT)
 */
export function getTimeZoneAbbr(date: Date = new Date()): string {
  try {
    const str = date.toLocaleTimeString('en-us', { timeZoneName: 'short' });
    const parts = str.split(' ');
    return parts[parts.length - 1] || 'UTC';
  } catch {
    return 'LOCAL';
  }
}

/**
 * Formats date into "14 October 2026"
 */
export function formatDateLong(date: Date = new Date()): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Full formatted date-time string: "14 October 2026, 19:42:35 IST"
 */
export function formatFullDateTime(date: Date = new Date()): string {
  return `${formatDateLong(date)}, ${formatTime24(date)} ${getTimeZoneAbbr(date)}`;
}

/**
 * Formats seconds into mm:ss
 */
export function formatDurationMMSS(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Formats duration into "10m 00s" or "3m 42s"
 */
export function formatDurationHuman(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

/**
 * Generates a unique Server Load Session ID
 * Format: SLS-SRV-2026-XXXXX
 */
export function generateSimulationId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SLS-SRV-${year}-${randomSuffix}${randomDigits}`;
}

/**
 * Mask sensitive string for display
 */
export function maskSensitive(str: string, visibleChars = 4): string {
  if (!str) return '—';
  if (str.length <= visibleChars) return '••••';
  const visible = str.slice(-visibleChars);
  return `•••• •••• ${visible}`;
}

/**
 * Professional Web Audio synthesizer for subtle interface telemetry audio
 */
class AudioTelemetry {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio autoplay policy quiet catch
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // quiet catch
    }
  }
}

export const telemetryAudio = new AudioTelemetry();
