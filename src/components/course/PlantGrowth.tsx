"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlantGrowthProps {
  completedCount: number; // 0 to 10
  className?: string;
  size?: number;
}

export default function PlantGrowth({ completedCount, className = "", size = 280 }: PlantGrowthProps) {
  // Asegurar límites del progreso
  const stage = Math.min(10, Math.max(0, completedCount));

  // Configuración de elementos visibles por etapa
  const showSeed = stage === 0;
  const showSprout = stage >= 1;
  const showLeavesGroup1 = stage >= 3;
  const showLeavesGroup2 = stage >= 5;
  const showBuds = stage >= 7;
  const showFlowers = stage >= 8;
  const showFruits = stage === 10;

  // Altura del tallo principal según etapa
  const getStemHeight = () => {
    if (stage === 0) return 0;
    if (stage === 1) return 15;
    if (stage === 2) return 30;
    if (stage === 3) return 45;
    if (stage === 4) return 60;
    if (stage === 5) return 80;
    if (stage === 6) return 95;
    if (stage === 7) return 110;
    if (stage === 8) return 125;
    if (stage === 9) return 135;
    return 145; // Etapa 10 (árbol completo)
  };

  const stemHeight = getStemHeight();

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`} style={{ width: size, height: size + 40 }}>
      <svg 
        viewBox="0 0 200 240" 
        className="w-full h-full drop-shadow-xl"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* GRADIENTES Y DECORACIONES */}
        <defs>
          {/* Suelo */}
          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8D6E63" />
            <stop offset="70%" stopColor="#5D4037" />
            <stop offset="100%" stopColor="#3E2723" />
          </linearGradient>

          {/* Maceta de Cristal */}
          <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
          </linearGradient>

          {/* Tallo (Verde Fresco a Maduro) */}
          <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#81C784" />
          </linearGradient>

          {/* Hoja Izquierda */}
          <linearGradient id="leafLeft" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1B5E20" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>

          {/* Hoja Derecha */}
          <linearGradient id="leafRight" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1B5E20" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>

          {/* Oro/Aura para etapas avanzadas */}
          <radialGradient id="auraGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
          </radialGradient>

          {/* Brillo del fruto */}
          <radialGradient id="fruitRed" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FF8A80" />
            <stop offset="40%" stopColor="#FF1744" />
            <stop offset="100%" stopColor="#D50000" />
          </radialGradient>
        </defs>

        {/* Aura Espiritual detrás de la planta (se vuelve más fuerte en fases finales) */}
        {stage >= 5 && (
          <motion.circle 
            cx="100" 
            cy={200 - stemHeight} 
            r={stage * 7} 
            fill="url(#auraGold)" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* --- MACETA Y SUELO (SIEMPRE VISIBLE) --- */}
        {/* Suelo interior de la maceta */}
        <path d="M45 190 C 45 190, 100 180, 155 190 L 150 230 C 150 230, 100 235, 50 230 Z" fill="url(#soilGrad)" />
        
        {/* Maceta de Cristal Modernista */}
        <path 
          d="M40 185 L 160 185 L 152 232 C 152 232, 100 238, 48 232 Z" 
          fill="url(#potGrad)" 
          stroke="rgba(255, 255, 255, 0.5)" 
          strokeWidth="1.5"
        />
        {/* Brillo en el borde de la maceta */}
        <line x1="45" y1="187" x2="155" y2="187" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

        {/* raíces visibles en el suelo en etapas avanzadas */}
        {stage >= 3 && (
          <g opacity="0.35">
            <motion.path 
              d="M100 195 C 95 205, 80 212, 70 218" 
              stroke="#3E2723" 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.path 
              d="M100 198 C 105 208, 120 216, 130 222" 
              stroke="#3E2723" 
              strokeWidth="2" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
            {stage >= 6 && (
              <motion.path 
                d="M100 205 C 100 218, 95 225, 98 232" 
                stroke="#3E2723" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
            )}
          </g>
        )}

        {/* --- ETAPA 0: SEMILLA --- */}
        <AnimatePresence>
          {showSeed && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              className="cursor-pointer"
            >
              {/* Aura dorada de la semilla */}
              <circle cx="100" cy="205" r="8" fill="rgba(255, 215, 0, 0.3)" className="animate-ping" style={{ animationDuration: '3s' }} />
              {/* Semilla de café / trigo */}
              <path d="M96 205 C 96 201, 104 201, 104 205 C 104 209, 96 209, 96 205 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
              <path d="M100 201 C 100 201, 98 205, 100 209" stroke="#8D6E63" strokeWidth="0.8" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* --- TALLO PRINCIPAL (SE ANIMA SU CRECIMIENTO) --- */}
        {showSprout && (
          <motion.path
            d={`M100 188 L 100 ${188 - stemHeight}`}
            stroke="url(#stemGrad)"
            strokeWidth={stage >= 6 ? "5.5" : stage >= 3 ? "4.5" : "3"}
            strokeLinecap="round"
            initial={{ d: "M100 188 L 100 188" }}
            animate={{ d: `M100 188 Q ${100 + (stage > 4 ? Math.sin(stage) * 5 : 0)} ${188 - stemHeight / 2}, 100 ${188 - stemHeight}` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        )}

        {/* --- BROTE DE HOJAS PRIMARIAS (FASES 1-2) --- */}
        {stage >= 1 && (
          <g>
            {/* Hoja de brote izquierda */}
            <motion.path 
              d={`M100 ${188 - Math.min(30, stemHeight)} C 90 ${188 - Math.min(30, stemHeight) - 8}, 85 ${188 - Math.min(30, stemHeight) + 2}, 100 ${188 - Math.min(30, stemHeight)}`}
              fill="url(#leafLeft)"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            />
            {/* Hoja de brote derecha */}
            <motion.path 
              d={`M100 ${188 - Math.min(30, stemHeight)} C 110 ${188 - Math.min(30, stemHeight) - 8}, 115 ${188 - Math.min(30, stemHeight) + 2}, 100 ${188 - Math.min(30, stemHeight)}`}
              fill="url(#leafRight)"
              initial={{ scale: 0, rotate: 30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            />
          </g>
        )}

        {/* --- GRUPO DE HOJAS 1 (FASES 3+) --- */}
        {showLeavesGroup1 && (
          <g>
            {/* Hoja media izquierda */}
            <motion.path 
              d={`M100 145 C 80 140, 70 152, 100 158`}
              fill="url(#leafLeft)"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1.1, rotate: 0 }}
              transition={{ type: "spring" }}
            />
            {/* Hoja media derecha */}
            <motion.path 
              d={`M100 140 C 120 135, 130 147, 100 153`}
              fill="url(#leafRight)"
              initial={{ scale: 0, rotate: 15 }}
              animate={{ scale: 1.1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
            />
          </g>
        )}

        {/* --- GRUPO DE HOJAS 2 (FASES 5+) --- */}
        {showLeavesGroup2 && (
          <g>
            {/* Rama superior izquierda */}
            <motion.path 
              d="M100 110 Q 75 100, 60 115" 
              stroke="url(#stemGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            <motion.path 
              d="M60 115 C 45 110, 48 128, 60 120"
              fill="url(#leafLeft)"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ delay: 0.2 }}
            />

            {/* Rama superior derecha */}
            <motion.path 
              d="M100 100 Q 125 90, 140 105" 
              stroke="url(#stemGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            <motion.path 
              d="M140 105 C 155 100, 152 118, 140 110"
              fill="url(#leafRight)"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ delay: 0.3 }}
            />
          </g>
        )}

        {/* --- CAPULLOS DE FLORES (FASES 7+) --- */}
        {showBuds && !showFlowers && (
          <g>
            {/* Capullo Central */}
            <motion.circle 
              cx="100" 
              cy={188 - stemHeight} 
              r="4.5" 
              fill="#FFB74D" 
              stroke="#F57C00" 
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* Capullo Izquierdo */}
            {stage >= 7 && (
              <motion.circle 
                cx="58" 
                cy="114" 
                r="3.5" 
                fill="#FFB74D" 
                stroke="#F57C00"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
            {/* Capullo Derecho */}
            {stage >= 7 && (
              <motion.circle 
                cx="142" 
                cy="104" 
                r="3.5" 
                fill="#FFB74D" 
                stroke="#F57C00"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </g>
        )}

        {/* --- FLORES FLORECIENDO (FASES 8+) --- */}
        {showFlowers && (
          <g>
            {/* Flor Central Principal */}
            <motion.g 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: stage === 10 ? 1.3 : 1.1, rotate: 0 }}
              className="cursor-pointer"
              style={{ transformOrigin: `100px ${188 - stemHeight}px` }}
            >
              {/* Pétalos */}
              <circle cx="100" cy={188 - stemHeight - 8} r="6" fill="#FFF" opacity="0.95" />
              <circle cx="100" cy={188 - stemHeight + 8} r="6" fill="#FFF" opacity="0.95" />
              <circle cx={100 - 8} cy={188 - stemHeight} r="6" fill="#FFF" opacity="0.95" />
              <circle cx={100 + 8} cy={188 - stemHeight} r="6" fill="#FFF" opacity="0.95" />
              <circle cx="100" cy={188 - stemHeight} r="5.5" fill="#FFC107" /> {/* Centro */}
            </motion.g>

            {/* Flores Secundarias en ramas laterales */}
            <motion.g 
              initial={{ scale: 0 }}
              animate={{ scale: 0.9 }}
              style={{ transformOrigin: "60px 115px" }}
            >
              <circle cx="60" cy="109" r="4.5" fill="#FFF" />
              <circle cx="60" cy="121" r="4.5" fill="#FFF" />
              <circle cx="54" cy="115" r="4.5" fill="#FFF" />
              <circle cx="66" cy="115" r="4.5" fill="#FFF" />
              <circle cx="60" cy="115" r="4" fill="#FFC107" />
            </motion.g>

            <motion.g 
              initial={{ scale: 0 }}
              animate={{ scale: 0.9 }}
              style={{ transformOrigin: "140px 105px" }}
            >
              <circle cx="140" cy="99" r="4.5" fill="#FFF" />
              <circle cx="140" cy="111" r="4.5" fill="#FFF" />
              <circle cx="134" cy="105" r="4.5" fill="#FFF" />
              <circle cx="146" cy="105" r="4.5" fill="#FFF" />
              <circle cx="140" cy="105" r="4" fill="#FFC107" />
            </motion.g>
          </g>
        )}

        {/* --- FRUTOS BRILLANTES (FLEXIBLE / ETAPA 10 COMPLETO) --- */}
        {showFruits && (
          <g>
            {/* Fruto Rojo 1 (Cuerpo) */}
            <motion.g
              initial={{ scale: 0, y: -5 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              style={{ transformOrigin: "85px 158px" }}
            >
              {/* Tallo del fruto */}
              <path d="M100 158 Q 88 162, 85 168" stroke="#2E7D32" strokeWidth="1.5" fill="none" />
              {/* Manzana / Cereza brillante */}
              <circle cx="85" cy="172" r="7.5" fill="url(#fruitRed)" />
              {/* Brillo */}
              <circle cx="82" cy="169" r="2" fill="#FFF" opacity="0.6" />
            </motion.g>

            {/* Fruto Rojo 2 (Copa) */}
            <motion.g
              initial={{ scale: 0, y: -5 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
              style={{ transformOrigin: "115px 148px" }}
            >
              <path d="M100 148 Q 112 152, 115 158" stroke="#2E7D32" strokeWidth="1.5" fill="none" />
              <circle cx="115" cy="162" r="7.5" fill="url(#fruitRed)" />
              <circle cx="112" cy="159" r="2" fill="#FFF" opacity="0.6" />
            </motion.g>

            {/* Fruto Dorado Especial (Crecimiento Espiritual) */}
            <motion.g
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1.1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              style={{ transformOrigin: "100px 85px" }}
            >
              {/* Conector */}
              <path d="M100 70 L 100 80" stroke="#FFC107" strokeWidth="2" fill="none" />
              {/* Fruto de Oro */}
              <circle cx="100" cy="86" r="9" fill="#FFD700" stroke="#FF8F00" strokeWidth="1" />
              {/* Estrella de brillo */}
              <path d="M100 81 L 101.5 84.5 L 105 86 L 101.5 87.5 L 100 91 L 98.5 87.5 L 95 86 L 98.5 84.5 Z" fill="#FFF" />
            </motion.g>

            {/* Partículas de brillo flotantes animadas (Fase 10) */}
            <g className="no-print">
              {[
                { cx: 70, cy: 90, r: 1.5, delay: 0 },
                { cx: 130, cy: 75, r: 2, delay: 0.5 },
                { cx: 100, cy: 50, r: 1.5, delay: 0.2 },
                { cx: 80, cy: 130, r: 1, delay: 0.8 },
                { cx: 120, cy: 140, r: 1.8, delay: 0.4 }
              ].map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill="#FFD700"
                  animate={{ 
                    opacity: [0.2, 1, 0.2],
                    y: [p.cy, p.cy - 12, p.cy],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2.5 + i * 0.3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: p.delay 
                  }}
                />
              ))}
            </g>
          </g>
        )}
      </svg>

      {/* Rótulo de la Etapa de Crecimiento */}
      <div className="mt-4 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/50 shadow-inner flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none font-outfit">
          {stage === 0 ? "Semilla Plantada" :
           stage <= 2 ? "Brote de Fe" :
           stage <= 4 ? "Crecimiento Joven" :
           stage <= 6 ? "Tallo Fortalecido" :
           stage <= 7 ? "Capullos de Promesa" :
           stage <= 9 ? "Floración Espiritual" :
           "¡Árbol Fructífero!"}
        </span>
      </div>
    </div>
  );
}
