import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Scroll, Pause, Play, ShieldAlert, Filter, Copy, Check } from 'lucide-react';
import { SimulationLog } from '../types';

interface LiveActivityLogsProps {
  logs: SimulationLog[];
  currentStageName: string;
  elapsedFormatted: string;
  remainingFormatted: string;
  progressPercent: number;
}

export const LiveActivityLogs: React.FC<LiveActivityLogsProps> = ({
  logs,
  currentStageName,
  elapsedFormatted,
  remainingFormatted,
  progressPercent
}) => {
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    if (filterCategory === 'all') return true;
    return log.category === filterCategory;
  });

  const handleCopyLogs = () => {
    const text = logs.map((l) => `${l.timestamp} ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogLevelClass = (level: SimulationLog['level']) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400';
      case 'warning':
        return 'text-amber-400';
      case 'diagnostic':
        return 'text-blue-400';
      case 'telemetry':
        return 'text-cyan-300';
      case 'info':
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#070b16] shadow-2xl overflow-hidden backdrop-blur-xl">
      
      {/* Terminal Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 py-3 sm:px-6">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Live Activity Logs (Telemetry Stream)
            </span>
          </div>
        </div>

        {/* Live Metrics in terminal header */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden items-center gap-1 text-slate-400 sm:flex">
            <span>ELAPSED:</span>
            <span className="font-bold text-cyan-400 tabular-nums">{elapsedFormatted}</span>
          </div>
          <span className="hidden text-slate-700 sm:inline">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>REMAINING:</span>
            <span className="font-bold text-amber-400 tabular-nums">{remainingFormatted}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span>PROGRESS:</span>
            <span className="font-bold text-emerald-400 tabular-nums">{progressPercent.toFixed(1)}%</span>
          </div>
        </div>

      </div>

      {/* Terminal Sub-header with Filter & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 bg-slate-900/40 px-4 py-2 text-xs sm:px-6">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Filter className="h-3 w-3" />
            Filter:
          </span>
          {['all', 'system', 'network', 'diagnostic', 'workload'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded px-2 py-0.5 font-mono text-[11px] capitalize transition ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[11px] transition ${
              autoScroll
                ? 'bg-slate-800 text-cyan-300'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title={autoScroll ? 'Pause auto-scrolling' : 'Resume auto-scrolling'}
          >
            {autoScroll ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {autoScroll ? 'Auto-scroll On' : 'Paused'}
          </button>

          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300 transition hover:bg-slate-700 hover:text-white"
            title="Copy logs to clipboard"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

      </div>

      {/* Mandatory Synthetic Workload Events Notice Banner */}
      <div className="flex items-center gap-2 border-b border-cyan-500/20 bg-cyan-950/30 px-4 py-1.5 text-[11px] text-cyan-300 sm:px-6">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
        <span className="truncate">
          SYNTHETIC WORKLOAD STREAM: Real-time mathematical load test. No external banking network or live financial server accessed.
        </span>
      </div>

      {/* Terminal Log Console Body */}
      <div className="h-72 overflow-y-auto p-4 font-mono text-xs sm:p-5 select-text">
        {filteredLogs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            Awaiting load test telemetry stream...
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="group flex items-start gap-2.5 rounded px-2 py-1 transition hover:bg-slate-900/60"
              >
                {/* Timestamp */}
                <span className="shrink-0 text-cyan-500/80 tabular-nums">
                  {log.timestamp}
                </span>

                {/* Category tag */}
                <span className="hidden shrink-0 rounded bg-slate-900 px-1 py-0.2 text-[9px] uppercase tracking-wider text-slate-400 ring-1 ring-slate-800 md:inline-block">
                  {log.category}
                </span>

                {/* Log message */}
                <span className={`break-words leading-relaxed ${getLogLevelClass(log.level)}`}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>

      {/* Terminal Bottom Status Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 bg-slate-950/90 px-4 py-2 font-mono text-[11px] text-slate-400 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>STAGE: <strong className="text-white">{currentStageName}</strong></span>
        </div>
        <div className="text-slate-400">
          LOG ENTRIES: <span className="text-cyan-400 tabular-nums">{logs.length}</span>
        </div>
      </div>

    </div>
  );
};
