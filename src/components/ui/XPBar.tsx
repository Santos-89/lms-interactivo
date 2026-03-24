"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  label?: string;
}

const XPBar = ({ currentXP, maxXP, level, label = "Progreso de Lección" }: XPBarProps) => {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <div className="glass rounded-[40px] p-10 mb-12 border-white bg-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.03)] backdrop-blur-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-[#818CF8] rounded-3xl flex flex-col items-center justify-center text-white shadow-[0_10px_25px_rgba(99,102,241,0.2)]">
            <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">Nivel</span>
            <span className="text-2xl font-black font-outfit leading-none">{level}</span>
          </div>
          <div>
            <span className="text-primary font-black text-[11px] uppercase tracking-[0.2em] mb-2 block">{label}</span>
            <h4 className="text-[#1E293B] font-black text-2xl font-outfit uppercase tracking-tighter">Energía Espiritual</h4>
          </div>
        </div>
        <div className="text-left md:text-right bg-white/40 px-6 py-3 rounded-2xl border border-white shadow-sm">
          <span className="text-primary font-black text-4xl font-outfit leading-none">{currentXP}</span>
          <span className="text-[#64748B] font-bold ml-3 text-sm uppercase tracking-[0.2em]">/ {maxXP} XP</span>
        </div>
      </div>
      
      <div className="h-5 bg-white/60 rounded-full overflow-hidden relative border border-white shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-primary to-[#818CF8] relative rounded-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
          {/* Luz dinámica */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
          />
        </motion.div>
      </div>
    </div>



  );
};

export default XPBar;
