"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, Download, Printer, X, ShieldCheck, Star, Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import html2canvas from 'html2canvas';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const certWidth = 1050;
      const certHeight = 740;
      const padding = 60;
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
    // NUEVA LÓGICA: Abrir página de impresión dedicada para evitar el fondo del admin
    const printUrl = `/print-certificate?name=${encodeURIComponent(studentName)}&course=${encodeURIComponent(courseTitle)}`;
    window.open(printUrl, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1050,
        height: 740,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.certificate-body') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.position = 'relative';
          }
        }
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `Certificado-${studentName.replace(/\s+/g, '-')}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al generar imagen. Prueba con el botón 'IMPRIMIR PDF'.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getNameFontSize = (name: string) => {
    if (name.length > 30) return 'text-3xl';
    if (name.length > 20) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 animate-in fade-in duration-500 overflow-hidden print:hidden">
      
      {/* Botones de Acción Superiores */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-wrap justify-end gap-2 md:gap-3 no-print z-[210]">
        <button 
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-xs md:text-sm"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? 'PROCESANDO...' : 'DESCARGAR FOTO'}
        </button>
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 text-xs md:text-sm"
        >
          <Printer className="w-4 h-4" />
          IMPRIMIR PDF
        </button>
        
        <button 
          onClick={onClose}
          className="p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl md:rounded-2xl transition-all"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Contenedor del Certificado */}
      <div 
        className="certificate-container relative"
        style={{ 
          width: '1050px', 
          height: '740px', 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <div 
          ref={certificateRef}
          className="certificate-body bg-white relative w-[1050px] h-[740px] overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 border-[35px] border-[#0F172A] z-0"></div>
          <div className="absolute inset-5 border-[2px] border-amber-400/40 z-0"></div>
          <div className="absolute top-0 left-0 w-40 h-40 border-t-[20px] border-l-[20px] border-amber-500 z-10"></div>
          <div className="absolute top-0 right-0 w-40 h-40 border-t-[20px] border-r-[20px] border-amber-500 z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 border-b-[20px] border-l-[20px] border-amber-500 z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[20px] border-r-[20px] border-amber-500 z-10"></div>

          <div className="relative z-20 h-full flex flex-col items-center justify-between px-24 py-16 text-center">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-3">
                <Image src="/mbi-logo.png" alt="Logo MBI" fill className="object-contain" unoptimized />
              </div>
              <h1 className="text-sm font-black tracking-[0.5em] text-[#0F172A] uppercase mb-2">Ministerio Bethel Internacional</h1>
              <div className="w-24 h-1.5 bg-amber-500 rounded-full"></div>
            </div>

            <div className="flex flex-col items-center w-full">
              <h2 className="text-4xl font-black text-[#0F172A] uppercase tracking-tight mb-2">Certificado de Cumplimiento</h2>
              <p className="text-slate-500 text-base italic font-medium max-w-2xl">
                Por cuanto ha demostrado dedicación, excelencia y fiel servicio en el estudio de la Palabra de Dios, se certifica que:
              </p>
            </div>

            <div className="w-full flex flex-col items-center">
              <h3 className={`font-black text-amber-600 border-b-4 border-slate-100 pb-4 tracking-tight w-full max-w-3xl ${getNameFontSize(studentName)}`}>
                {studentName}
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] mt-6 text-xs">Ha completado satisfactoriamente el curso de:</p>
              <h4 className="text-3xl font-black text-[#0F172A] uppercase mt-2">{courseTitle}</h4>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-xl">
                En la Academia Ministerial de Ministerio Bethel Internacional, con distinción académica y compromiso cristiano.<br />
                Dado este día, {date}.
              </p>
            </div>

            <div className="w-full flex justify-between items-end relative mt-4">
              <div className="text-center w-64">
                <div className="h-px bg-slate-300 w-full mb-3"></div>
                <p className="font-black text-[#0F172A] text-sm uppercase leading-none">Fausto Chiquito</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pastor Asociado</p>
              </div>

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

              <div className="text-center w-64">
                <div className="h-px bg-slate-300 w-full mb-3"></div>
                <p className="font-black text-[#0F172A] text-sm uppercase leading-none">Josué Mejía</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pastor General</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificate;
