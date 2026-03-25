import CoursePageClient from '@/components/course/CoursePageClient';

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
  return <CoursePageClient courseId={resolvedParams.courseId} />;
}
