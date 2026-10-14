/**
 * SERVER LOAD SERVER
 * Banking Server Load & Diagnostic Suite
 */
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ServerConfigForm } from './components/ServerConfigForm';
import { ConfigPreviewModal } from './components/ConfigPreviewModal';
import { ProcessingDashboard } from './components/ProcessingDashboard';
import { CompletionReport } from './components/CompletionReport';
import { ServerAuthGate } from './components/ServerAuthGate';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ServerConfig, SimulationSession } from './types';
import { generateSimulationId } from './utils/formatters';
import { PROCESSING_STAGES } from './constants/stages';
import {
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  FileCheck
} from 'lucide-react';

const STORAGE_KEY = 'sls_config_state_v1';

export default function App() {
  // Authentication Gate state: requires SERVER PORT 200631 & SERVER PASSWORD FLASHER#V7108
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Navigation / Mode state: 'config' | 'processing' | 'report'
  const [currentView, setCurrentView] = useState<'config' | 'processing' | 'report'>('config');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<ServerConfig | null>(null);

  // Fresh Server Configuration state
  const [serverConfig, setServerConfig] = useState<ServerConfig>({
    serverName: '',
    serverUrl: '',
    serverHolderName: '',
    serverNumber: '',
    serverIfsc: '',
    serverLogin: '',
    serverVolume: ''
  });

  // Session State
  const [session, setSession] = useState<SimulationSession>({
    sessionId: '',
    config: serverConfig,
    startTime: 0,
    endTime: null,
    status: 'idle',
    targetDurationSec: 600, // 10 minutes = 600 seconds
    elapsedSeconds: 0,
    progressPercent: 0,
    currentStageIndex: 0,
    speedMultiplier: 1 // default real-time
  });

  const handleLock = () => {
    try {
      sessionStorage.removeItem('sls_authenticated_session');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  // Toast feedback notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save config to temporary session storage
  const handleSaveConfig = (cfg: ServerConfig) => {
    setServerConfig(cfg);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch {
      // ignore
    }
  };

  // Start Load Test Handler
  const handleStartSimulation = (cfg: ServerConfig) => {
    handleSaveConfig(cfg);
    const newSessionId = generateSimulationId();
    const now = Date.now();

    const newSession: SimulationSession = {
      sessionId: newSessionId,
      config: cfg,
      startTime: now,
      endTime: null,
      status: 'running',
      targetDurationSec: 600, // 10 minutes (actual elapsed time)
      elapsedSeconds: 0,
      progressPercent: 0,
      currentStageIndex: 0,
      speedMultiplier: 1
    };

    setSession(newSession);
    setCurrentView('processing');
    addToast('info', `Session ${newSessionId} initialized. 10:00 load cycle started.`);
  };

  // Open Preview Modal
  const handleOpenPreview = (cfg: ServerConfig) => {
    setPreviewConfig(cfg);
    setIsPreviewOpen(true);
  };

  // Handle Complete (Triggered automatically when countdown finishes)
  const handleSimulationComplete = () => {
    setSession((prev) => ({
      ...prev,
      status: 'completed',
      endTime: prev.endTime || Date.now(),
      progressPercent: 100,
      currentStageIndex: 5
    }));
    setCurrentView('report');
    addToast('success', 'Load cycle completed (100%). Audit report ready.');
  };

  // Cancel / Abort
  const handleCancelSimulation = () => {
    setSession((prev) => ({
      ...prev,
      status: 'idle',
      elapsedSeconds: 0,
      progressPercent: 0
    }));
    setCurrentView('config');
    addToast('info', 'Session aborted. Returned to configuration.');
  };

  // New Load Test from Report
  const handleNewSimulation = () => {
    setSession((prev) => ({
      ...prev,
      status: 'idle',
      elapsedSeconds: 0,
      progressPercent: 0,
      endTime: null
    }));
    setCurrentView('config');
  };

  // Return to Dashboard from Report
  const handleReturnToDashboard = () => {
    setCurrentView('processing');
  };

  const activeStage = PROCESSING_STAGES[session.currentStageIndex];

  // If not authenticated, show the gateway screen requiring SERVER PORT and SERVER PASSWORD
  if (!isAuthenticated) {
    return <ServerAuthGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Dashboard Header */}
      <Header
        status={session.status}
        sessionId={session.sessionId || null}
        activeStageName={activeStage ? activeStage.name : undefined}
        onLock={handleLock}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Mode Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('config')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                currentView === 'config'
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Server Configuration
            </button>

            <button
              onClick={() => {
                if (session.sessionId) {
                  setCurrentView('processing');
                } else {
                  addToast('info', 'Please start a load test first.');
                }
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                currentView === 'processing'
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Processing Dashboard (10m)
              {session.status === 'running' && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => {
                if (session.status === 'completed') {
                  setCurrentView('report');
                } else {
                  addToast('info', 'Completion report is generated upon 10:00 countdown completion.');
                }
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                currentView === 'report'
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50'
                  : session.status === 'completed'
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Completion Report
              {session.status === 'completed' && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Quick Context Tag */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>SYNTHETIC SANDBOX</span>
            <span>·</span>
            <span className="text-cyan-400">10-MIN REALTIME RUNTIME</span>
          </div>
        </div>

        {/* VIEW 1: Configuration Form */}
        {currentView === 'config' && (
          <div className="space-y-6">
            
            {/* Hero Banner with Key Metrics */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-[#070e20] p-6 sm:p-8">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  Banking Infrastructure Load Testing Environment
                </div>
                
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  High Quality Flashing Server Loader
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Configure your server profile, volume thresholds, and routing endpoints. Launch the <strong>10-minute real-time load cycle</strong> to inspect continuous multi-stage telemetry, live activity logs, and obtain an official audit completion receipt with the official <strong>FLASHING— VOLUME BALANCE</strong>.
                </p>
              </div>

              {/* Quick Feature Badges */}
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-800/80 pt-5">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span>10:00 Countdown Timer</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span>6 Processing Stages</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <span>Live Telemetry Log Stream</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <FileCheck className="h-4 w-4 text-cyan-400" />
                  <span>PDF Audit Receipt Export</span>
                </div>
              </div>
            </div>

            {/* Server Configuration Form */}
            <ServerConfigForm
              initialConfig={serverConfig}
              onSubmit={handleStartSimulation}
              onPreview={handleOpenPreview}
              isLoading={session.status === 'running'}
            />

          </div>
        )}

        {/* VIEW 2: Processing Dashboard (10-minute active timer & logs) */}
        {currentView === 'processing' && (
          <ProcessingDashboard
            session={session}
            onUpdateSession={setSession}
            onComplete={handleSimulationComplete}
            onCancel={handleCancelSimulation}
          />
        )}

        {/* VIEW 3: Completion Report / Receipt */}
        {currentView === 'report' && (
          <CompletionReport
            session={session}
            onNewSimulation={handleNewSimulation}
            onReturnToDashboard={handleReturnToDashboard}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">FLASHING PROCESS</span>
            <span>·</span>
            <span>Local Browser Sandbox</span>
          </div>

          <div className="font-mono text-[11px] text-cyan-500/70">
            V4.2.0-STABLE
          </div>
        </div>
      </footer>

      {/* Config Preview Modal */}
      {previewConfig && (
        <ConfigPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          config={previewConfig}
          onConfirmStart={() => handleStartSimulation(previewConfig)}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
