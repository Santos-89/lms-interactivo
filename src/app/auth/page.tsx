"use client";
export const dynamic = 'force-dynamic';
export const runtime = 'edge';


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Chrome, Grid, Eye, EyeOff, Sparkles, Instagram, Facebook, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const router = useRouter();
  
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        alert('Cuenta creada. Revisa tu correo para confirmar.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tAuth = isLogin ? {
    title: 'Welcome',
    subtitle: 'Back',
    tagline: 'Tu portal a la academia espiritual',
    action: 'SIGN IN',
    switch: '¿No tienes cuenta? Registrate',
    formTitle: 'SIGN IN'
  } : {
    title: 'Únete',
    subtitle: 'Ahora',
    tagline: 'Comienza tu formación hoy mismo',
    action: 'SIGN UP',
    switch: '¿Ya eres miembro? Inicia sesión',
    formTitle: 'SIGN UP'
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans p-4 md:p-8 relative overflow-hidden bg-[#0A0F1E]">
      {/* Background Image - Clean & Vibrant */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Fondo.jpeg" 
          alt="Background" 
          fill 
          className="object-cover" 
          priority
          unoptimized
        />
        {/* Very subtle vignette to keep focus centered */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white/5 backdrop-blur-[80px] rounded-[40px] border border-white/30 shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Left Section: Welcome Info */}
        <div className="w-full md:w-5/12 p-10 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10">
          <Link href="/" className="mb-12 flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image 
                src="/mbi-logo.png" 
                alt="MBI Logo" 
                fill 
                className="object-contain" 
                unoptimized
              />
            </div>
            <span className="text-lg font-black font-outfit text-white tracking-tighter uppercase whitespace-nowrap">MBI ACADEMIA</span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'welcome-login' : 'welcome-register'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <h1 className="text-6xl md:text-7xl font-black font-outfit text-white leading-[1.1] mb-4">
                {tAuth.title}<br />
                <span className="text-gradient pr-2">{tAuth.subtitle}</span>
              </h1>
              <p className="text-white/70 text-sm font-medium tracking-wide mb-12">
                {tAuth.tagline}
              </p>

              <div className="flex gap-6 mt-auto pt-8">
                {[Instagram, Facebook, Youtube].map((Icon, idx) => (
                  <button key={idx} className="text-white/40 hover:text-white transition-colors hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Section: Minimalist Form */}
        <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center bg-transparent">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center justify-between mb-16 px-1">
              <h2 className="text-2xl font-black font-outfit text-white tracking-widest uppercase">
                {tAuth.formTitle}
              </h2>
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4"
              >
                {tAuth.switch}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-8" onSubmit={handleAuth}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <label className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2 block">Name</label>
                    <input 
                      type="text" 
                      placeholder="Tu nombre completo"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white font-bold focus:outline-none focus:border-primary transition-colors placeholder:text-white/30"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <label className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white font-bold focus:outline-none focus:border-primary transition-colors placeholder:text-white/30"
                />
              </div>

              <div className="relative">
                <label className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-2 block">Password</label>
                <div className="flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white font-bold focus:outline-none focus:border-primary transition-colors placeholder:text-white/30"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-white/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between gap-6">
                <button 
                  disabled={loading}
                  className="px-10 py-4 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-[0_15px_30px_rgba(99,102,241,0.2)] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Processing...' : tAuth.action}
                </button>
                
                <div className="flex gap-4">
                  <button type="button" className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
                    <Chrome className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </button>
                  <button type="button" className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group">
                    <Github className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
