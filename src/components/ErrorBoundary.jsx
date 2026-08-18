import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full space-y-4 bg-neutral-950 border border-white/10 p-8 rounded-lg">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
              SYSTEM RECOVERY
            </span>
            <h1 className="text-xl font-bold uppercase text-white tracking-wider">
              Anemone Climbing Holds
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Terjadi sedikit kendala teknis saat memuat komponen halaman. Silakan muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-3 rounded hover:bg-neutral-200 transition-colors"
            >
              REFRESH HALAMAN
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
