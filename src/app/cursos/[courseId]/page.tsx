import CoursePageClient from '@/components/course/CoursePageClient';
import { Suspense } from 'react';

// Hardcoded para Static Export (Cloudflare Free Tier)
export function generateStaticParams() {
  return [
    { courseId: 'liderazgo' },
    { courseId: 'diaconado' }
  ];
}

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  // En Next.js App Router (Server Component), params es una Promise
  return (
    <CoursePageInner params={params} />
  );
}

async function CoursePageInner({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CoursePageClient courseId={resolvedParams.courseId} />
    </Suspense>
  );
}
