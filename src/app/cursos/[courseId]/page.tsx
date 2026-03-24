"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, Play, Trophy, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { supabase } from '@/lib/supabase';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = React.useState<any>(null);
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [userProgress, setUserProgress] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function loadData() {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // Fetch course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        setLoading(false);
        return;
      }

      setCourse(courseData);

      // Fetch lessons
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

      // Fetch user progress if logged in
      if (session?.user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', session.user.id);
        
        if (progressData) {
          setUserProgress(progressData.map(p => p.lesson_id));
        }
      }

      setLoading(false);
    }

    loadData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Curso no encontrado</h1>
      </div>
    );
  }

  const completedCount = lessons.filter(l => userProgress.includes(l.id)).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#FDF8F5] pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6">
        {/* Course Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[60px] bg-white border border-orange-100 p-8 md:p-16 mb-16 flex flex-col lg:flex-row gap-12 items-center shadow-xl shadow-orange-100/20"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[#FCF6F2]/50"></div>
          
          <div className="flex-1 relative z-10">
            <div className="flex gap-3 mb-8">
              <span className="px-4 py-1.5 bg-orange-100 text-[#FF6633] font-black text-[9px] uppercase tracking-[0.1em] rounded-full shadow-sm">
                Certificado
              </span>
              <span className="px-4 py-1.5 bg-[#2F3A81]/10 text-[#2F3A81] font-black text-[9px] uppercase tracking-[0.1em] rounded-full shadow-sm">
                Premium
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black font-outfit text-[#2D2D2D] mb-6 leading-[1.1]">
              <span className="block">{course.title.split(' ')[0]}</span>
              <span className="text-gradient">{course.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            
            <div className="flex flex-wrap gap-8 mt-12">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF6633]" />
                <span className="text-sm font-bold text-gray-400">~4h totales</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#FF6633]" />
                <span className="text-sm font-bold text-gray-400">{lessons.length} Lecciones</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#FF6633]" />
                <span className="text-sm font-bold text-gray-400">Nivel Intermedio</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-[450px] aspect-[4/3] bg-[#F9DCC4] rounded-[48px] overflow-hidden relative shadow-2xl group"
          >
            <Image 
              src={`/illustrations/${course.id === 'liderazgo' ? 'liderazgo' : course.id === 'diaconado' ? 'diaconado' : 'maestros'}.png`}
              alt={course.title}
              fill
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Syllabus */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black font-outfit text-[#2D2D2D]">
                Programa del curso
              </h2>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-orange-100 shadow-sm">
                <ArrowRight className="w-5 h-5 rotate-90 text-[#FF6633]" />
              </div>
            </div>
            
            <div className="space-y-6">
              {lessons.map((lesson, index) => {
                const isCompleted = userProgress.includes(lesson.id);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={`/cursos/${courseId}/lessons/${lesson.id}`}
                      className="block bg-white group p-8 rounded-[40px] border border-transparent shadow-sm hover:shadow-2xl hover:shadow-orange-100/30 transition-all duration-500"
                    >
                      <div className="flex items-center gap-8">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shrink-0 transition-all ${
                          isCompleted 
                            ? 'bg-[#FF6633] text-white' 
                            : 'bg-[#FF6633]/10 text-[#FF6633]'
                        }`}>
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-black font-outfit text-[#2D2D2D] mb-2 leading-tight">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">{lesson.duration || '45 min'}</span>
                            <Play className="w-3.5 h-3.5 ml-2 p-1 bg-orange-100 text-[#FF6633] rounded-full box-content cursor-pointer" />
                          </div>
                        </div>

                        {!isCompleted && index > 2 && (
                          <div className="w-10 h-10 bg-[#F9F9F9] rounded-2xl flex items-center justify-center text-gray-300">
                            <Lock className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Combined Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Progress Card */}
            <div className="bg-white p-10 rounded-[48px] border border-orange-100 shadow-sm sticky top-32">
              <h3 className="text-xl font-black font-outfit text-[#2D2D2D] mb-8">Tu Progreso</h3>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{completedCount} de {lessons.length} lecciones</span>
                <span className="text-[#FF6633] font-black text-2xl">{Math.round(progressPercentage)}%</span>
              </div>
              
              <div className="h-2 bg-[#FEEFEA] rounded-full overflow-hidden mb-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-[#FF6633]"
                ></motion.div>
              </div>

              <Link 
                href={
                  courseId === 'liderazgo' ? '/cursos/liderazgo/interactivo' :
                  courseId === 'diaconado' ? '/cursos/diaconado/interactivo' :
                  (lessons.length > 0 ? `/cursos/${courseId}/lessons/${lessons[0].id}` : '#')
                }
                className="w-full py-5 bg-[#FF6633] text-white rounded-[24px] font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-orange-300 hover:bg-[#E85A1D] transition-all active:scale-95 group/btn"
              >
                Continuar Lección
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Materials Card */}
            <div className="bg-white p-10 rounded-[48px] border border-orange-50 shadow-sm">
              <h3 className="text-xl font-black font-outfit text-[#2D2D2D] mb-8 uppercase tracking-widest text-xs">Materiales del curso</h3>
              <div className="space-y-6">
                {[
                  { name: 'Guía de Liderazgo PDF', size: '3.4 MB', type: 'PDF' },
                  { name: 'Plantilla Estratégica', size: '1.1 MB', type: 'DOCX' },
                  { name: 'Lecturas Recomendadas', size: 'Enlace', type: 'WEB' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6633] group-hover:bg-[#FF6633] group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#2D2D2D]">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.size} • {item.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF6633] transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Card */}
            <div className="bg-[#FEF6F1] p-10 rounded-[48px] border border-orange-50">
              <p className="text-[10px] font-black text-[#FF6633] uppercase tracking-widest mb-6">Tu Instructor</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#2D2D2D] rounded-full overflow-hidden border-2 border-white">
                  <div className="w-full h-full flex items-center justify-center text-white font-black">MBI</div>
                </div>
                <div>
                  <h4 className="font-black text-[#2D2D2D]">Ministerio Bethel</h4>
                  <p className="text-[10px] font-bold text-gray-400">Equipo de Capacitación</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-[#FF6633] uppercase tracking-widest hover:underline">Ver perfil completo</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-40 border-t border-orange-50 py-10 text-center">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 MBI Academy. Formando lideres para el futuro.</p>
      </footer>
    </div>
  );
}
