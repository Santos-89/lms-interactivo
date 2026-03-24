"use client";

import React from 'react';
import LessonViewer from '@/components/lesson/LessonViewer';

import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lessons, setLessons] = React.useState<any[]>([]);
  const [course, setCourse] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [completedLessons, setCompletedLessons] = React.useState<string[]>([]);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadData() {
      // Obtener sesión de usuario
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Obtener todas las lecciones del curso
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
      } else {
        setLessons(lessonsData || []);
      }

      // Obtener detalles del curso
      const { data: courseData } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single();
      
      setCourse(courseData);

      // Obtener progreso del usuario
      if (session?.user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', session.user.id);
        
        if (progressData) {
          setCompletedLessons(progressData.map(p => p.lesson_id));
        }
      }

      setLoading(false);
    }

    loadData();
  }, [courseId]);

  const handleLessonComplete = async (id: string) => {
    if (!user) return;

    // Obtener la lección actual para saber su valor de XP
    const currentLesson = lessons.find(l => l.id === id);

    const { error } = await supabase
      .from('user_progress')
      .upsert({ user_id: user.id, lesson_id: id });
    
    if (error) {
      console.error('Error saving progress:', error);
    } else {
      // Actualizar XP en el perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ xp: (profile.xp || 0) + (currentLesson?.xp_value || 100) })
          .eq('id', user.id);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2D2D2D] bg-[#FDF8F5]">
        Curso sin lecciones disponibles
      </div>
    );
  }

  // Mapear lecciones de la base de datos al formato de LessonViewer
  const formattedLessons = lessons.map(l => {
    let content = l.content || '';
    
    // Fallback de emergencia: si es la lección de fundamentos de diaconado, forzamos la ruta del iframe
    if (courseId === 'diaconado' && l.id === 'fundamentos') {
      content = '/lessons/diaconado/fundamentos.html';
    }

    return {
      id: l.id,
      title: l.title,
      xpValue: l.xp_value || 100,
      content: content
    };
  });

  const initialIndex = lessons.findIndex(l => l.id === lessonId);

  return (
    <LessonViewer 
      courseId={courseId} 
      courseTitle={course?.title || 'Curso'} 
      lessons={formattedLessons} 
      initialLessonIndex={initialIndex !== -1 ? initialIndex : 0}
      initialCompletedLessons={completedLessons}
      onLessonComplete={handleLessonComplete}
    />
  );
}
