"use client";

import { useSearchParams } from 'next/navigation';
import CourseCertificate from '@/components/course/CourseCertificate';
import { Suspense, useEffect } from 'react';

function PrintContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Estudiante';
  const course = searchParams.get('course') || 'Programa de Formación';

  useEffect(() => {
    // Pequeña espera para que las fuentes y el logo carguen bien
    const timer = setTimeout(() => {
      window.print();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="print-page min-h-screen bg-white">
      <CourseCertificate 
        studentName={name}
        courseTitle={course}
        onClose={() => window.close()} 
      />
      
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

export default function PrintCertificatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black">Preparando certificado...</div>}>
      <PrintContent />
    </Suspense>
  );
}
