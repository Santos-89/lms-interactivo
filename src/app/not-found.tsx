"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0F1E] text-white p-6 text-center relative overflow-hidden font-sans">
      {/* Background Decor - Visual Excellence */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl px-4"
      >
        <div className="w-24 h-24 bg-white/80 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-10 shadow-2xl relative overflow-hidden p-3 shadow-blue-500/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
          <Image 
            src="/mbi-logo.png" 
            alt="MBI Logo" 
            width={60} 
            height={60} 
            className="relative z-10 drop-shadow-lg"
            unoptimized
          />
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tight uppercase font-outfit bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[1.1]">
          Próximamente
        </h1>
        
        <p className="text-slate-400 text-lg md:text-2xl font-medium mb-16 max-w-lg mx-auto leading-relaxed italic">
          Estamos preparando algo especial para ti. Esta sección estará lista muy pronto para acompañarte en tu formación.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
                href="/"
                className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:translate-y-[-4px] transition-all shadow-2xl shadow-blue-900/40 active:translate-y-0 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                Volver al Inicio
            </Link>
        </div>
      </motion.div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
  );
}
