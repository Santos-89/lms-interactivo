"use client";

import React from 'react';
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
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-300 no-print">
      
      {/* Botones de Acción Superiores */}
      <div className="absolute top-6 right-6 flex gap-4 no-print">
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
      <div className="bg-white w-full max-w-5xl aspect-[1.4/1] relative shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden print:shadow-none print:m-0 print:w-full">
        
        {/* Marco Decorativo */}
        <div className="absolute inset-0 border-[30px] border-[#0F172A] print:border-[20px]"></div>
        <div className="absolute inset-4 border-[2px] border-amber-400/50"></div>
        
        {/* Adornos de Esquina */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[15px] border-l-[15px] border-amber-500 z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-[15px] border-r-[15px] border-amber-500 z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[15px] border-l-[15px] border-amber-500 z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[15px] border-r-[15px] border-amber-500 z-10"></div>

        {/* Contenido Principal */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-20 text-center">
          
          {/* Logo y Encabezado */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image 
                src="/mbi-logo.png" 
                alt="Logo MBI" 
                fill 
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-sm font-black tracking-[0.5em] text-[#0F172A] uppercase mb-2">Ministerio Bethel Internacional</h1>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <h2 className="text-5xl font-black text-[#0F172A] uppercase tracking-tighter mb-4 leading-none pt-4">
            Certificado de Cumplimiento
          </h2>
          <p className="text-slate-500 italic font-medium mb-12">
            Por cuanto ha demostrado dedicación, excelencia y fiel servicio en el estudio de la Palabra de Dios, se certifica que:
          </p>

          {/* Nombre del Alumno */}
          <div className="mb-10 w-full max-w-2xl px-12">
            <h3 className="text-6xl font-black text-amber-600 border-b-4 border-slate-100 pb-4 tracking-tight">
              {studentName}
            </h3>
          </div>

          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] mb-4 text-sm">
            Ha completado satisfactoriamente el curso de:
          </p>
          <h4 className="text-4xl font-black text-[#0F172A] uppercase mb-12">
            {courseTitle}
          </h4>

          <p className="text-slate-400 text-sm mb-16">
            En la Academia Ministerial de Ministerio Bethel Internacional, con distinción académica y compromiso cristiano.<br />
            Dado este día, {date}.
          </p>

          {/* Firmas y Sello */}
          <div className="w-full flex justify-between items-end px-12 relative">
            
            {/* Firma 1 */}
            <div className="text-center w-64">
              <div className="h-px bg-slate-300 w-full mb-3"></div>
              <p className="font-black text-[#0F172A] text-sm uppercase">Rev. Samuel López</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Presidente / Pastor Principal</p>
            </div>

            {/* Sello Central */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-amber-500/30 flex items-center justify-center relative">
                <div className="absolute inset-2 rounded-full border-2 border-amber-500/50 flex flex-col items-center justify-center bg-amber-50/50 backdrop-blur-sm">
                   <ShieldCheck className="w-10 h-10 text-amber-600" />
                   <div className="flex gap-0.5 mt-0.5">
                     <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                     <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                     <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                   </div>
                </div>
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-600 mt-2">Sello de Excelencia</span>
            </div>

            {/* Firma 2 */}
            <div className="text-center w-64">
              <div className="h-px bg-slate-300 w-full mb-3"></div>
              <p className="font-black text-[#0F172A] text-sm uppercase">Dra. Rebeca Ortiz</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Directora Académica</p>
            </div>

          </div>

        </div>

      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseCertificate;
