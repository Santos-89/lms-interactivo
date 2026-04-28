"use client";

import { useSearchParams } from 'next/navigation';
import CourseCertificate from '@/components/course/CourseCertificate';
import { Suspense, useEffect } from 'react';

function PrintContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Estudiante';
  const course = searchParams.get('course') || 'Programa de Formación';

  useEffect(() => {
    // Esperar a que todo cargue y disparar impresión
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CourseCertificate 
        studentName={name}
        courseTitle={course}
        onClose={() => window.close()} 
      />
      
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function PrintCertificatePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-black">Cargando certificado para impresión...</div>}>
      <PrintContent />
    </Suspense>
  );
}
