export interface ServerConfig {
  serverName: string;
  serverUrl: string;
  serverHolderName: string;
  serverNumber: string;
  serverIfsc: string;
  serverLogin: string;
  serverVolume: string;
}

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface SimulationSession {
  sessionId: string;
  config: ServerConfig;
  startTime: number; // Unix timestamp ms
  endTime: number | null; // Unix timestamp ms
  status: SimulationStatus;
  targetDurationSec: number; // default 600 (10 minutes)
  elapsedSeconds: number;
  progressPercent: number;
  currentStageIndex: number;
  speedMultiplier: number; // 1 = real-time, 10 = 10x, 60 = 60x, etc.
}

export interface SimulationLog {
  id: string;
  timestamp: string; // e.g. [19:30:01]
  message: string;
  category: 'system' | 'network' | 'diagnostic' | 'workload' | 'security';
  level: 'info' | 'success' | 'warning' | 'telemetry' | 'diagnostic';
  stageIndex: number;
}

export interface StageDefinition {
  id: number;
  name: string;
  subtitle: string;
  minPercent: number;
  maxPercent: number;
  description: string;
  checkpoints: string[];
}
