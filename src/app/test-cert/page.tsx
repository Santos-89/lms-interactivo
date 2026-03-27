"use client";

import CourseCertificate from '@/components/course/CourseCertificate';

export default function TestCertPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-20">
      <CourseCertificate 
        studentName="Santos Mejia Chacon" 
        courseTitle="Programa de Diaconado" 
        onClose={() => {}} 
      />
    </div>
  );
}
