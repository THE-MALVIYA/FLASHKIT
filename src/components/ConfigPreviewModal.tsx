import React from 'react';
import { X, Server, ShieldCheck, Play, ArrowLeft } from 'lucide-react';
import { ServerConfig } from '../types';

interface ConfigPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServerConfig;
  onConfirmStart: () => void;
}

export const ConfigPreviewModal: React.FC<ConfigPreviewModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfirmStart
}) => {
  if (!isOpen) return null;

  const items = [
    { label: '1. SERVER BANK NAME', value: config.serverName },
    { label: '2. SERVER BANK URL', value: config.serverUrl },
    { label: '3. Server Holder Name', value: config.serverHolderName },
    { label: '4. SERVER ACCOUNT NUMBER', value: config.serverNumber },
    { label: '5. SERVER ACCOUNT IFSC', value: config.serverIfsc },
    { label: '6. Server Login', value: config.serverLogin },
    { label: '7. SERVER FLASH BALANCE', value: config.serverVolume }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white sm:text-lg">
                Preview Server Configuration Profile
              </h3>
              <p className="text-xs text-slate-400">
                Verify parameters prior to launching 10-minute load cycle.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Parameters List */}
        <div className="my-5 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-1 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 sm:flex-row sm:items-center"
            >
              <span className="text-xs font-semibold text-slate-400">
                {item.label}
              </span>
              <span className="font-mono text-xs font-bold text-cyan-300 break-all sm:text-right">
                {item.value || '—'}
              </span>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-950/30 p-3 text-xs text-blue-300">
          <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
          <span>
            Target execution cycle is locked at <strong>10 minutes (600 seconds)</strong> using real elapsed-time tracking. All tests are strictly synthetic client-side tests.
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Edit
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirmStart();
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:from-cyan-400 hover:to-blue-500"
          >
            <Play className="h-4 w-4 fill-white" />
            Confirm & Launch Load Test
          </button>
        </div>

      </div>
    </div>
  );
};
