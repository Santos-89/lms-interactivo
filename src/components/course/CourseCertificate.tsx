"use client";

import React, { useState, useEffect } from 'react';
import { Award, Download, Printer, X, ShieldCheck, Star } from 'lucide-react';
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
      const padding = window.innerWidth < 768 ? 32 : 120; // Espaciado seguro alrededor
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - padding;
      
      const certWidth = 1024;
      const certHeight = 731; // Relación 1.4/1

      const scaleW = availableWidth / certWidth;
      const scaleH = availableHeight / certHeight;
      
      setScale(Math.min(1, scaleW, scaleH));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-300 overflow-hidden print:absolute print:inset-0 print:p-0 print:m-0 print:bg-white print:flex print:items-center print:justify-center">
      
      {/* Botones de Acción Superiores */}
      <div className="absolute top-6 right-6 flex gap-4 no-print z-50">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl transition-all hover:scale-105"
        >
          <Printer className="w-5 h-5" />
          IMPRIMIR CERTIFICADO
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
        className="bg-white relative shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden origin-center print:shadow-none print:m-0 print:w-full print:h-full print:max-w-none print:!transform-none"
        style={{ width: '1024px', height: '714px', transform: `scale(${scale})` }}
      >
        
        {/* Marco Decorativo */}
        <div className="absolute inset-0 border-[30px] border-[#0F172A] print:border-[20px]"></div>
        <div className="absolute inset-4 border-[2px] border-amber-400/50"></div>
        
        {/* Adornos de Esquina */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[15px] border-l-[15px] border-amber-500 z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-[15px] border-r-[15px] border-amber-500 z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[15px] border-l-[15px] border-amber-500 z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[15px] border-r-[15px] border-amber-500 z-10"></div>

        {/* Contenido Principal */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-20 py-4 text-center">
          
          {/* Logo y Encabezado */}
          <div className="mb-2 mt-4">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <Image 
                src="/mbi-logo.png" 
                alt="Logo MBI" 
                fill 
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-xs font-black tracking-[0.4em] text-[#0F172A] uppercase mb-2">Ministerio Bethel Internacional</h1>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <h2 className="text-4xl font-black text-[#0F172A] uppercase tracking-tighter mb-3 leading-none pt-2">
            Certificado de Cumplimiento
          </h2>
          <p className="text-slate-500 text-sm italic font-medium mb-4">
            Por cuanto ha demostrado dedicación, excelencia y fiel servicio en el estudio de la Palabra de Dios, se certifica que:
          </p>

          {/* Nombre del Alumno */}
          <div className="mb-4 w-full max-w-2xl px-12">
            <h3 className="text-5xl font-black text-amber-600 border-b-4 border-slate-100 pb-3 tracking-tight">
              {studentName}
            </h3>
          </div>

          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] mb-2 text-xs">
            Ha completado satisfactoriamente el curso de:
          </p>
          <h4 className="text-3xl font-black text-[#0F172A] uppercase mb-6">
            {courseTitle}
          </h4>

          <p className="text-slate-400 text-xs mb-8">
            En la Academia Ministerial de Ministerio Bethel Internacional, con distinción académica y compromiso cristiano.<br />
            Dado este día, {date}.
          </p>

          {/* Firmas y Sello */}
          <div className="w-full flex justify-between items-end px-12 relative mb-0 mt-8">
            
            {/* Firma 1 */}
            <div className="text-center w-56">
              <div className="h-px bg-slate-300 w-full mb-2"></div>
              <p className="font-black text-[#0F172A] text-xs uppercase">Rev. Samuel López</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Presidente / Pastor Principal</p>
            </div>

            {/* Sello Central */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-200 flex items-center justify-center relative bg-white">
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 flex flex-col items-center justify-center bg-amber-50">
                   <ShieldCheck className="w-5 h-5 text-amber-600" style={{ strokeWidth: 2.5 }} />
                   <div className="flex gap-0.5 mt-0.5">
                     <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                     <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                     <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                   </div>
                </div>
              </div>
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-amber-600 mt-2">Sello de Excelencia</span>
            </div>

            {/* Firma 2 */}
            <div className="text-center w-56">
              <div className="h-px bg-slate-300 w-full mb-2"></div>
              <p className="font-black text-[#0F172A] text-xs uppercase">Dra. Rebeca Ortiz</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Directora Académica</p>
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
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseCertificate;
