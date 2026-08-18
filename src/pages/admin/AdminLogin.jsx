import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputUser = identifier.trim().toLowerCase();
    const inputPass = password.trim();

    // Accepted valid login credentials:
    // Email / User: anemone@anemonegrip.com, anemone, admin, owner
    // Master Password / Secret Key: anemonehold123, admin, admin123
    const validIdentifiers = [
      'anemone@anemonegrip.com',
      'anemone',
      'admin@anemonegrip.com',
      'admin',
      'owner'
    ];
    const validPasswords = ['anemonehold123', 'admin', 'admin123'];

    setTimeout(() => {
      if (validIdentifiers.includes(inputUser) && validPasswords.includes(inputPass)) {
        if (rememberMe) {
          localStorage.setItem('anemone_admin_auth', 'true');
          sessionStorage.setItem('anemone_admin_auth', 'true');
        } else {
          sessionStorage.setItem('anemone_admin_auth', 'true');
          localStorage.removeItem('anemone_admin_auth');
        }

        // Redirect to target path
        navigate(from, { replace: true });
      } else {
        setError('Email atau Master Password tidak valid. Silakan periksa kembali.');
        setLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 sm:p-12 font-sans relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Box Wrapper - Center Aligned */}
      <div className="relative z-10 max-w-md w-full mx-auto space-y-6">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between px-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Website</span>
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 border border-white/10 px-2 py-0.5 rounded-sm">
            PROTECTED PORTAL
          </span>
        </div>

        {/* Login Card (Minimalist SUPR Climbing Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-sm p-8 sm:p-10 space-y-8 shadow-2xl"
        >
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <Logo className="h-9 mx-auto" />
            </Link>
            <div className="space-y-1 pt-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 block">
                ADMINISTRATION ACCESS
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white text-center">
                ADMIN LOGIN
              </h1>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-950/40 border border-rose-500/40 rounded-sm p-3.5 flex items-center gap-3 text-rose-300 text-xs font-mono"
            >
              <ShieldAlert size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Username Field */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                EMAIL / USERNAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="anemone@anemonegrip.com"
                  className="w-full bg-black border border-white/10 rounded-sm pl-11 pr-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all placeholder-neutral-700"
                />
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            {/* Master Password / Secret Key Field */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                MASTER PASSWORD / SECRET KEY
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/10 rounded-sm pl-11 pr-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all placeholder-neutral-700"
                />
                <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-white rounded-sm cursor-pointer"
                />
                <span className="font-mono text-[11px]">Ingat Sesi Login Ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 rounded-sm hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2 pt-3.5 disabled:opacity-50"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'MASUK DASHBOARD'}</span>
            </button>
          </form>
        </motion.div>

        {/* Footer copyright */}
        <div className="text-center text-neutral-600 font-mono text-[10px] uppercase tracking-widest pt-2">
          &copy; 2026 ANEMONE HARDWARE &amp; TECH
        </div>

      </div>

    </div>
  );
}
