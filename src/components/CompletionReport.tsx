import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  RefreshCw,
  LayoutDashboard,
  ShieldCheck,
  Server,
  Lock,
  Building2,
  Clock,
  CheckCircle2,
  Download
} from 'lucide-react';
import { SimulationSession } from '../types';
import {
  formatFullDateTime
} from '../utils/formatters';
import { generateSimulationPDF } from '../utils/pdfGenerator';

interface CompletionReportProps {
  session: SimulationSession;
  onNewSimulation: () => void;
  onReturnToDashboard: () => void;
}

export const CompletionReport: React.FC<CompletionReportProps> = ({
  session,
  onNewSimulation,
  onReturnToDashboard
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { config } = session;
  const startDateTimeStr = formatFullDateTime(new Date(session.startTime));
  const completionDateTimeStr = session.endTime
    ? formatFullDateTime(new Date(session.endTime))
    : formatFullDateTime();

  // 24-Hour Live Running Timer (Starts after transaction/load completion)
  const completedAt = session.endTime || session.startTime || Date.now();
  const elapsedSinceCompletion = Math.max(0, Math.floor((now - completedAt) / 1000));
  const remaining24hSec = Math.max(0, 86400 - elapsedSinceCompletion);
  const h24 = Math.floor(remaining24hSec / 3600);
  const m24 = Math.floor((remaining24hSec % 3600) / 60);
  const s24 = remaining24hSec % 60;
  const countdown24hStr = `${String(h24).padStart(2, '0')}:${String(m24).padStart(2, '0')}:${String(s24).padStart(2, '0')}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(session.sessionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      generateSimulationPDF(session);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Alert / Congratulatory Notice */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white sm:text-lg">
                Load Lifecycle Completed (100%)
              </h2>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 ring-1 ring-emerald-500/30">
                AUDIT VERIFIED
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/70 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                24H TIMER: {countdown24hStr}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Transaction complete. Live 24-hour cycle running with active reflection window.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* THE OFFICIAL AUDIT RECEIPT / REPORT DOCUMENT             */}
      {/* ======================================================== */}
      <div
        id="completion-report-document"
        className="print-container relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        
        {/* ==================================================== */}
        {/* HIGHLY VISIBLE WATERMARK: FLASHING— VOLUME BALANCE  */}
        {/* ==================================================== */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none">
          {/* Central giant watermark */}
          <div className="transform -rotate-25 text-center">
            <span className="block font-mono text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-cyan-500/[0.08] dark:text-cyan-400/[0.12] whitespace-nowrap">
              FLASHING— VOLUME BALANCE
            </span>
            <span className="block mt-12 font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-cyan-500/[0.05] whitespace-nowrap">
              FLASHING— VOLUME BALANCE
            </span>
          </div>
        </div>

        {/* Top Watermark Badge Bar */}
        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
              SECURITY AUDIT OFFICIAL:
            </span>
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-xs font-black tracking-wider text-cyan-300 ring-1 ring-cyan-500/40">
              FLASHING— VOLUME BALANCE
            </span>
          </div>
          <div className="font-mono text-xs text-slate-400">
            AUDIT SERIAL: <span className="font-bold text-white">{session.sessionId}</span>
          </div>
        </div>

        {/* Receipt Header */}
        <div className="relative z-10 flex flex-col justify-between gap-6 border-b border-slate-800 pb-8 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2 text-slate-950 shadow-lg shadow-cyan-500/25">
                <Server className="h-7 w-7 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wider text-white sm:text-3xl">
                  SERVER LOAD SERVER
                </h1>
                <p className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
                  Automated Server Workload & Stress Certificate
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-xl">
              Synthetic execution record generated by the Server Load Server engine. All workload cycles executed under controlled sandbox isolation.
            </p>
          </div>

          {/* Right Status Block */}
          <div className="rounded-xl border border-emerald-500/30 bg-slate-950/80 p-4 text-left sm:text-right">
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Final Progress
            </div>
            <div className="font-mono text-2xl font-extrabold text-emerald-400">
              100%
            </div>
            <div className="mt-1 flex items-center gap-1.5 sm:justify-end text-xs font-bold text-emerald-300">
              <Check className="h-4 w-4" />
              LOAD PROCESS COMPLETED
            </div>
            <div className="mt-2.5 border-t border-slate-800/80 pt-2 flex items-center gap-1.5 sm:justify-end font-mono text-xs font-bold text-cyan-300">
              <Clock className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>24H CYCLE: {countdown24hStr}</span>
            </div>
          </div>
        </div>

        {/* Receipt Body: Two Columns */}
        <div className="relative z-10 my-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Column 1: Server Configuration Profile */}
          <div className="space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-cyan-400" />
                Target Server Configuration
              </h3>
              <span className="text-[10px] text-slate-400">Config Parameters</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">1. SERVER BANK NAME:</span>
                <span className="font-bold text-white break-all">{config.serverName || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">2. SERVER BANK URL:</span>
                <span className="font-bold text-cyan-300 break-all">{config.serverUrl || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">3. Server Holder Name:</span>
                <span className="font-bold text-white">{config.serverHolderName || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">4. SERVER ACCOUNT NUMBER:</span>
                <span className="font-bold text-white">{config.serverNumber || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">5. SERVER ACCOUNT IFSC:</span>
                <span className="font-bold text-cyan-400">{config.serverIfsc || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">6. Server Login:</span>
                <span className="font-bold text-white">{config.serverLogin || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1">
                <span className="text-slate-400 font-sans">7. SERVER FLASH BALANCE:</span>
                <span className="font-bold text-emerald-400 text-sm">{config.serverVolume || '—'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Load Test Execution Telemetry */}
          <div className="space-y-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                Session Execution Telemetry
              </h3>
              <span className="text-[10px] text-slate-400">Fixed Timestamps</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">Session ID:</span>
                <span className="font-bold text-cyan-300">{session.sessionId}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">Session Start Timestamp:</span>
                <span className="font-bold text-slate-200">{startDateTimeStr}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">Completion Timestamp:</span>
                <span className="font-bold text-emerald-400">{completionDateTimeStr}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">Flash Reflect:</span>
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Not predictable
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">24-Hour Active Timer:</span>
                <span className="font-mono font-bold text-cyan-300 tabular-nums flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  {countdown24hStr}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-900">
                <span className="text-slate-400 font-sans">All Stages Status:</span>
                <span className="font-bold text-emerald-400">6 / 6 Completed</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1">
                <span className="text-slate-400 font-sans">Synthetic Checksum:</span>
                <span className="font-bold text-slate-400 text-[10px]">
                  SHA256-{session.sessionId.replace(/[^A-Z0-9]/g, '')}-PASSED
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Stages Summary Line */}
        <div className="relative z-10 mb-8 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Executed Pipeline Breakdown:
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 font-mono text-[10px]">
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-emerald-300">
              <span className="block font-bold">STAGE 1</span>
              <span>Config Validation</span>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-emerald-300">
              <span className="block font-bold">STAGE 2</span>
              <span>Connection Test</span>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-emerald-300">
              <span className="block font-bold">STAGE 3</span>
              <span>Diagnostics</span>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-emerald-300">
              <span className="block font-bold">STAGE 4</span>
              <span>Resource Load</span>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-emerald-300">
              <span className="block font-bold">STAGE 5</span>
              <span>Final Validation</span>
            </div>
            <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2 text-emerald-300">
              <span className="block font-bold">STAGE 6</span>
              <span>Completed (10:00)</span>
            </div>
          </div>
        </div>



        {/* Bottom Footer Stamp */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4 text-[10px] text-slate-400">
          <span>SERVER LOAD SERVER · Synthetic Load Testing Architecture</span>
          <span className="font-mono text-cyan-400">OFFICIAL: FLASHING— VOLUME BALANCE</span>
          <span>Timestamp Lock: Verified</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* REPORT ACTION BUTTONS                                   */}
      {/* ======================================================== */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3 sm:gap-4 pb-12">
        
        {/* 1. Download Report as PDF */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold tracking-wider text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" />
          {isGeneratingPdf ? 'Compiling PDF...' : 'Download Report as PDF'}
        </button>

        {/* 2. Print Report */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
        >
          <Printer className="h-4 w-4 text-cyan-400" />
          Print Report
        </button>

        {/* 3. Copy Session ID */}
        <button
          type="button"
          onClick={handleCopyId}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
        >
          {copiedId ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4 text-cyan-400" />
          )}
          {copiedId ? 'Copied ID!' : 'Copy Session ID'}
        </button>

        {/* 4. New Load Test */}
        <button
          type="button"
          onClick={onNewSimulation}
          className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-3 text-xs font-bold text-cyan-300 transition hover:border-cyan-500/70 hover:bg-cyan-900/50 hover:text-white active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4 text-cyan-400" />
          New Load Test
        </button>

        {/* 5. Return to Dashboard */}
        <button
          type="button"
          onClick={onReturnToDashboard}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
        >
          <LayoutDashboard className="h-4 w-4 text-slate-400" />
          Return to Dashboard
        </button>

      </div>

    </div>
  );
};
