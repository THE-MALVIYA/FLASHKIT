import React, { useState } from 'react';
import { ShieldCheck, Lock, Server, Key, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface ServerAuthGateProps {
  onAuthenticated: () => void;
}

const REQUIRED_PORT = '200631';
const REQUIRED_PASSWORD = 'FLASHER#V7108';

export const ServerAuthGate: React.FC<ServerAuthGateProps> = ({ onAuthenticated }) => {
  const [port, setPort] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPort = port.trim();
    const cleanPassword = password.trim();

    if (!cleanPort || !cleanPassword) {
      setError('Please provide both Server Port and Server Password.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      if (cleanPort === REQUIRED_PORT && cleanPassword === REQUIRED_PASSWORD) {
        setIsVerifying(false);
        try {
          sessionStorage.setItem('sls_authenticated_session', 'true');
        } catch {
          // ignore
        }
        onAuthenticated();
      } else {
        setIsVerifying(false);
        if (cleanPort !== REQUIRED_PORT && cleanPassword !== REQUIRED_PASSWORD) {
          setError('Invalid Server Port & Server Password. Access Restricted.');
        } else if (cleanPort !== REQUIRED_PORT) {
          setError('Invalid Server Port. Check configuration protocol.');
        } else {
          setError('Invalid Server Password. Authentication failed.');
        }
      }
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#030712] overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background cyber grid & glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080e21_1px,transparent_1px),linear-gradient(to_bottom,#080e21_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Main Auth Terminal Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/90 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-xl">
          
          {/* Top Security Header */}
          <div className="border-b border-slate-800 bg-slate-950/80 px-6 py-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-slate-900 p-3 ring-1 ring-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <Lock className="h-7 w-7 text-cyan-400 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-0.5 text-[11px] font-semibold text-cyan-300 tracking-wider uppercase mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              Secure Gateway Access
            </div>

            <h1 className="text-xl font-extrabold tracking-wider text-white">
              FLASHING SERVER
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Authentication required to initialize server load environment
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Server Port Field */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-300 uppercase">
                <span className="flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-cyan-400" />
                  SERVER PORT
                </span>
                <span className="font-mono text-[10px] text-cyan-400 font-normal">
                  PORT #
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={port}
                  onChange={(e) => {
                    setPort(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter Server Port (e.g. 200631)"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 font-mono text-sm tracking-wider text-white placeholder-slate-500 shadow-inner transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Server Password Field */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-300 uppercase">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-cyan-400" />
                  SERVER PASSWORD
                </span>
                <span className="font-mono text-[10px] text-cyan-400 font-normal">
                  SECURE KEY
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter Server Password (e.g. FLASHER#V7108)"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-4 pr-11 py-3 font-mono text-sm tracking-wider text-white placeholder-slate-500 shadow-inner transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 transition hover:text-cyan-400"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-extrabold tracking-wider uppercase text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Server Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer security tag */}
          <div className="border-t border-slate-800/80 bg-slate-950/60 px-6 py-3.5 text-center text-[11px] text-slate-500 font-mono">
            <span>PORTAL ACCESS ENCRYPTED · TLS V1.3</span>
          </div>

        </div>
      </div>
    </div>
  );
};
