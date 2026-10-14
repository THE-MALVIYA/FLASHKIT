import React, { useState } from 'react';
import {
  Server,
  Globe,
  User,
  Hash,
  Building2,
  Lock,
  Database,
  Eye,
  EyeOff,
  RotateCcw,
  Eye as EyePreview,
  Play,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ServerConfig } from '../types';
import { DEMO_CONFIGS } from '../constants/stages';

interface ServerConfigFormProps {
  initialConfig: ServerConfig;
  onSubmit: (config: ServerConfig) => void;
  onPreview: (config: ServerConfig) => void;
  isLoading?: boolean;
}

interface FormErrors {
  serverName?: string;
  serverUrl?: string;
  serverHolderName?: string;
  serverNumber?: string;
  serverIfsc?: string;
  serverLogin?: string;
  serverVolume?: string;
}

export const ServerConfigForm: React.FC<ServerConfigFormProps> = ({
  initialConfig,
  onSubmit,
  onPreview,
  isLoading = false
}) => {
  const [config, setConfig] = useState<ServerConfig>(initialConfig);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Show/Hide state for sensitive fields
  const [showNumber, setShowNumber] = useState(false);
  const [showIfsc, setShowIfsc] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const validateField = (name: keyof ServerConfig, value: string): string | undefined => {
    const val = value.trim();
    switch (name) {
      case 'serverName':
        if (!val) return 'Server Bank Name is required.';
        if (val.length < 3) return 'Server Bank Name must be at least 3 characters.';
        return undefined;
      case 'serverUrl':
        if (!val) return 'Server Bank URL is required.';
        if (!/^https?:\/\/.+/i.test(val)) {
          return 'Enter a valid URL starting with http:// or https://';
        }
        return undefined;
      case 'serverHolderName':
        if (!val) return 'Server Holder Name is required.';
        if (val.length < 2) return 'Holder Name must be at least 2 characters.';
        return undefined;
      case 'serverNumber':
        if (!val) return 'Server Account Number is required.';
        if (val.length < 4) return 'Server Account Number must be at least 4 characters/digits.';
        return undefined;
      case 'serverIfsc':
        if (!val) return 'Server Account IFSC is required.';
        if (val.length < 4) return 'IFSC code must be at least 4 characters.';
        return undefined;
      case 'serverLogin':
        if (!val) return 'Server Login identifier is required.';
        if (val.length < 3) return 'Server Login must be at least 3 characters.';
        return undefined;
      case 'serverVolume':
        if (!val) return 'Server Flash Balance is required.';
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(config) as (keyof ServerConfig)[]).forEach((key) => {
      const err = validateField(key, config[key]);
      if (err) {
        newErrors[key] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      serverName: true,
      serverUrl: true,
      serverHolderName: true,
      serverNumber: true,
      serverIfsc: true,
      serverLogin: true,
      serverVolume: true
    });

    return isValid;
  };

  const handleChange = (name: keyof ServerConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (name: keyof ServerConfig) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, config[name]);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleReset = () => {
    setConfig({
      serverName: '',
      serverUrl: '',
      serverHolderName: '',
      serverNumber: '',
      serverIfsc: '',
      serverLogin: '',
      serverVolume: ''
    });
    setErrors({});
    setTouched({});
  };

  const handleQuickLoad = (demoIndex = 0) => {
    const selected = DEMO_CONFIGS[demoIndex].config;
    setConfig(selected);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(config);
    }
  };

  const handlePreviewClick = () => {
    if (validateAll()) {
      onPreview(config);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      
      {/* Decorative ambient lighting */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Form Header with Quick Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
              <Server className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Server Configuration Profile
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Define target server topology, authentication credentials, and workload thresholds.
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickLoad(0)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Load Sample Profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* 1. Server Bank Name */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-cyan-400" />
                1. SERVER BANK NAME <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Cluster or Gateway Node</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={config.serverName}
                onChange={(e) => handleChange('serverName', e.target.value)}
                onBlur={() => handleBlur('serverName')}
                placeholder="e.g. HDFC-RTGS-SWITCH-HOST-01"
                className={`w-full rounded-xl border bg-slate-950/80 px-4 py-2.5 font-mono text-xs text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverName
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              {touched.serverName && !errors.serverName && config.serverName && (
                <CheckCircle2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-emerald-400" />
              )}
            </div>
            {errors.serverName && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverName}
              </p>
            )}
          </div>

          {/* 2. Server Bank URL */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-cyan-400" />
                2. SERVER BANK URL <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Target Endpoint</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={config.serverUrl}
                onChange={(e) => handleChange('serverUrl', e.target.value)}
                onBlur={() => handleBlur('serverUrl')}
                placeholder="e.g. https://switch.banking-grid.internal/api/load"
                className={`w-full rounded-xl border bg-slate-950/80 px-4 py-2.5 font-mono text-xs text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverUrl
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              {touched.serverUrl && !errors.serverUrl && config.serverUrl && (
                <CheckCircle2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-emerald-400" />
              )}
            </div>
            {errors.serverUrl && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverUrl}
              </p>
            )}
          </div>

          {/* 3. Server Holder Name */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                3. Server Holder Name <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Authorized Operator / Unit</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={config.serverHolderName}
                onChange={(e) => handleChange('serverHolderName', e.target.value)}
                onBlur={() => handleBlur('serverHolderName')}
                placeholder="e.g. Apex Banking Infrastructure Corp"
                className={`w-full rounded-xl border bg-slate-950/80 px-4 py-2.5 font-mono text-xs text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverHolderName
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              {touched.serverHolderName && !errors.serverHolderName && config.serverHolderName && (
                <CheckCircle2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-emerald-400" />
              )}
            </div>
            {errors.serverHolderName && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverHolderName}
              </p>
            )}
          </div>

          {/* 4. Server Account Number (Sensitive with Show/Hide) */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-cyan-400" />
                4. SERVER ACCOUNT NUMBER <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Routing / Hardware ID</span>
            </label>
            <div className="relative">
              <input
                type={showNumber ? 'text' : 'password'}
                value={config.serverNumber}
                onChange={(e) => handleChange('serverNumber', e.target.value)}
                onBlur={() => handleBlur('serverNumber')}
                placeholder="e.g. SRV-9042-8821-4419"
                className={`w-full rounded-xl border bg-slate-950/80 pl-4 pr-11 py-2.5 font-mono text-xs text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverNumber
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNumber(!showNumber)}
                className="absolute right-3 top-2.5 text-slate-400 transition hover:text-cyan-400"
                title={showNumber ? 'Hide Sensitive Value' : 'Show Sensitive Value'}
              >
                {showNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.serverNumber && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverNumber}
              </p>
            )}
          </div>

          {/* 5. Server Account IFSC (Sensitive with Show/Hide) */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                5. SERVER ACCOUNT IFSC <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Financial System Routing Code</span>
            </label>
            <div className="relative">
              <input
                type={showIfsc ? 'text' : 'password'}
                value={config.serverIfsc}
                onChange={(e) => handleChange('serverIfsc', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('serverIfsc')}
                placeholder="e.g. HDFC0000001 or SBIN0001234"
                className={`w-full rounded-xl border bg-slate-950/80 pl-4 pr-11 py-2.5 font-mono text-xs uppercase text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverIfsc
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowIfsc(!showIfsc)}
                className="absolute right-3 top-2.5 text-slate-400 transition hover:text-cyan-400"
                title={showIfsc ? 'Hide Sensitive Value' : 'Show Sensitive Value'}
              >
                {showIfsc ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.serverIfsc && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverIfsc}
              </p>
            )}
          </div>

          {/* 6. Server Login (Sensitive with Show/Hide) */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                6. Server Login <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Auth Token / Service Account</span>
            </label>
            <div className="relative">
              <input
                type={showLogin ? 'text' : 'password'}
                value={config.serverLogin}
                onChange={(e) => handleChange('serverLogin', e.target.value)}
                onBlur={() => handleBlur('serverLogin')}
                placeholder="e.g. SYSADMIN_SLS_MASTER_KEY"
                className={`w-full rounded-xl border bg-slate-950/80 pl-4 pr-11 py-2.5 font-mono text-xs text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverLogin
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowLogin(!showLogin)}
                className="absolute right-3 top-2.5 text-slate-400 transition hover:text-cyan-400"
                title={showLogin ? 'Hide Sensitive Value' : 'Show Sensitive Value'}
              >
                {showLogin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.serverLogin && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverLogin}
              </p>
            )}
          </div>

          {/* 7. Server Flash Balance (Full width on md) */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                7. SERVER FLASH BALANCE <span className="text-red-400">*</span>
              </span>
              <span className="text-[10px] text-slate-400">Workload Capacity / Volume Throughput</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={config.serverVolume}
                onChange={(e) => handleChange('serverVolume', e.target.value)}
                onBlur={() => handleBlur('serverVolume')}
                placeholder="e.g. 50,000,000 TPS / MB or ₹ 100,000,000.00"
                className={`w-full rounded-xl border bg-slate-950/80 px-4 py-2.5 font-mono text-xs text-white placeholder-slate-400 shadow-inner transition focus:outline-none ${
                  errors.serverVolume
                    ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                    : 'border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                }`}
              />
              {touched.serverVolume && !errors.serverVolume && config.serverVolume && (
                <CheckCircle2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-emerald-400" />
              )}
            </div>
            
            {/* Quick volume presets */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="text-slate-400">Presets:</span>
              {[
                '10,000,000 TPS / MB',
                '50,000,000 TPS / MB',
                '100,000,000 TPS / MB',
                '500,000,000 TPS / MB'
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleChange('serverVolume', preset)}
                  className="rounded border border-slate-800 bg-slate-950/60 px-2 py-0.5 font-mono text-[11px] text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300"
                >
                  {preset}
                </button>
              ))}
            </div>

            {errors.serverVolume && (
              <p className="flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.serverVolume}
              </p>
            )}
          </div>

        </div>

        {/* Security & Synthetic Isolation Notice */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            <div>
              <span className="font-semibold text-slate-200">Local Sandbox Isolation:</span> All entered server configurations remain strictly inside your browser state. actual banking network, clearing house, or external financial server is reached.
            </div>
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 pt-2 sm:flex-row">
          
          <div className="flex w-full items-center gap-3 sm:w-auto">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:w-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Form
            </button>

            {/* Preview Details Button */}
            <button
              type="button"
              onClick={handlePreviewClick}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-500/60 hover:bg-cyan-900/40 sm:w-auto"
            >
              <EyePreview className="h-3.5 w-3.5" />
              Preview Details
            </button>
          </div>

          {/* START SERVER LOAD BUTTON (Large animated button) */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[length:200%_auto] px-8 py-3.5 font-bold tracking-wider text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 hover:bg-[position:right_center] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] active:scale-[0.99] disabled:opacity-50 sm:w-auto"
          >
            <div className="relative flex items-center gap-2">
              <Play className="h-5 w-5 fill-white text-white transition group-hover:scale-110" />
              <span className="text-sm font-extrabold tracking-widest uppercase sm:text-base">
                START SERVER LOAD
              </span>
            </div>
            {/* Animated shimmer sweep */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>

        </div>

      </form>

    </div>
  );
};
