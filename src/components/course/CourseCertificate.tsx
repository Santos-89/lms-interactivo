"use client";

import React, { useState, useEffect } from 'react';
import { Award, Download, Printer, X, ShieldCheck, Star, Camera } from 'lucide-react';
import Image from 'next/image';

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  date?: string;
  onClose: () => void;
}

const CourseCertificate: React.FC<CertificateProps> = ({ 
  studentName, 
  courseTitle, 
  date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  onClose 
}) => {
  
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // Forzar dimensiones de certificado profesional (Relación A4 Landscape)
      const certWidth = 1050;
      const certHeight = 740;
      
      const padding = 40;
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - padding;
      
      const scaleW = availableWidth / certWidth;
      const scaleH = availableHeight / certHeight;
      
      setScale(Math.min(1, scaleW, scaleH));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Función para determinar el tamaño del nombre según su longitud
  const getNameFontSize = (name: string) => {
    if (name.length > 30) return 'text-3xl';
    if (name.length > 20) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-in fade-in duration-500 overflow-hidden print:static print:bg-white print:p-0">
      
      {/* Botones de Acción Superiores */}
      <div className="absolute top-6 right-6 flex gap-3 no-print z-50">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Printer className="w-5 h-5" />
          IMPRIMIR / PDF
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Contenedor del Certificado */}
      <div 
        className="bg-white relative shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden origin-center print:shadow-none print:m-0 print:!transform-none"
        style={{ 
          width: '1050px', 
          height: '740px', 
          transform: `scale(${scale})`,
          minWidth: '1050px',
          minHeight: '740px'
        }}
      >
        
        {/* Marco Decorativo Robusto */}
        <div className="absolute inset-0 border-[35px] border-[#0F172A] z-0"></div>
        <div className="absolute inset-5 border-[2px] border-amber-400/40 z-0"></div>
        
        {/* Adornos de Esquina Premium */}
        <div className="absolute top-0 left-0 w-40 h-40 border-t-[20px] border-l-[20px] border-amber-500 z-10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 border-t-[20px] border-r-[20px] border-amber-500 z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 border-b-[20px] border-l-[20px] border-amber-500 z-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[20px] border-r-[20px] border-amber-500 z-10"></div>

        {/* Contenido Principal */}
        <div className="relative z-20 h-full flex flex-col items-center justify-between px-24 py-16 text-center">
          
          {/* Logo y Encabezado */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-3">
              <Image 
                src="/mbi-logo.png" 
                alt="Logo MBI" 
                fill 
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-sm font-black tracking-[0.5em] text-[#0F172A] uppercase mb-2">Ministerio Bethel Internacional</h1>
            <div className="w-24 h-1.5 bg-amber-500 rounded-full"></div>
          </div>

          <div className="flex flex-col items-center w-full">
            <h2 className="text-4xl font-black text-[#0F172A] uppercase tracking-tight mb-2">
              Certificado de Cumplimiento
            </h2>
            <p className="text-slate-500 text-base italic font-medium max-w-2xl">
              Por cuanto ha demostrado dedicación, excelencia y fiel servicio en el estudio de la Palabra de Dios, se certifica que:
            </p>
          </div>

          {/* Nombre del Alumno - Adaptable */}
          <div className="w-full flex flex-col items-center">
            <h3 className={`font-black text-amber-600 border-b-4 border-slate-100 pb-4 tracking-tight w-full max-w-3xl ${getNameFontSize(studentName)}`}>
              {studentName}
            </h3>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] mt-6 text-xs">
              Ha completado satisfactoriamente el curso de:
            </p>
            <h4 className="text-3xl font-black text-[#0F172A] uppercase mt-2">
              {courseTitle}
            </h4>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-xl">
              En la Academia Ministerial de Ministerio Bethel Internacional, con distinción académica y compromiso cristiano.<br />
              Dado este día, {date}.
            </p>
          </div>

          {/* Firmas y Sello Final */}
          <div className="w-full flex justify-between items-end relative mt-4">
            
            {/* Firma Izquierda */}
            <div className="text-center w-64">
              <div className="h-px bg-slate-300 w-full mb-3"></div>
              <p className="font-black text-[#0F172A] text-sm uppercase leading-none">Fausto Chiquito</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pastor Asociado</p>
            </div>

            {/* Sello de Excelencia */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-[6px] border-amber-100 flex items-center justify-center relative bg-white shadow-sm">
                <div className="w-14 h-14 rounded-full border-2 border-amber-400 flex flex-col items-center justify-center bg-amber-50">
                   <ShieldCheck className="w-6 h-6 text-amber-600" style={{ strokeWidth: 2.5 }} />
                   <div className="flex gap-1 mt-1">
                     <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                     <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                     <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                   </div>
                </div>
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-600 mt-2">Sello de Excelencia</span>
            </div>

            {/* Firma Derecha */}
            <div className="text-center w-64">
              <div className="h-px bg-slate-300 w-full mb-3"></div>
              <p className="font-black text-[#0F172A] text-sm uppercase leading-none">Josué Mejía</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pastor General</p>
            </div>

          </div>

        </div>

      </div>

      <style jsx>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            height: 100vh;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseCertificate;
