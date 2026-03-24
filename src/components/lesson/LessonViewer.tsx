"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, Home, Trophy } from 'lucide-react';
import Link from 'next/link';
import XPBar from '@/components/ui/XPBar';

interface Lesson {
  id: string;
  title: string;
  content: string;
  xpValue: number;
}

interface LessonViewerProps {
  courseId: string;
  courseTitle: string;
  lessons: Lesson[];
  initialLessonIndex?: number;
  initialCompletedLessons?: string[];
  onLessonComplete?: (lessonId: string) => void;
}

const LessonViewer = ({ 
  courseId, 
  courseTitle, 
  lessons, 
  initialLessonIndex = 0,
  initialCompletedLessons = [],
  onLessonComplete
}: LessonViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialLessonIndex);
  const [completedLessons, setCompletedLessons] = useState<string[]>(initialCompletedLessons);
  const [totalXP, setTotalXP] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentLesson = lessons[currentIndex];
  const isLastLesson = currentIndex === lessons.length - 1;

  const handleComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      // Si es una lección normal (no iframe), sumamos su valor total al completar
      if (!currentLesson.content.startsWith('/')) {
        setTotalXP(prev => prev + currentLesson.xpValue);
      }
      if (onLessonComplete) {
        onLessonComplete(currentLesson.id);
      }
    }
    
    if (!isLastLesson) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowCelebration(true);
    }
  };

  // Escuchar mensajes de lecciones interactivas (iframes)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      if (data.source === 'diacono-quest') {
        if (data.type === 'xp') {
          setTotalXP(prev => prev + (data.amount || 0));
        } else if (data.type === 'complete') {
          handleComplete();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentIndex, completedLessons]);

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#2D2D2D] font-sans">
      {/* Premium Sticky Header with Progress Map */}
      <header className="glass sticky top-0 z-50 border-b border-orange-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/cursos/${courseId}`} className="p-2.5 bg-white border border-orange-100 rounded-xl hover:bg-orange-50 transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5 text-[#FF6B35]" />
              </Link>
              <div>
                <span className="text-[#FF6B35] font-black text-[10px] uppercase tracking-widest mb-1 block">
                  {courseTitle}
                </span>
                <h2 className="text-lg font-black font-outfit truncate max-w-[180px] md:max-w-md text-[#2D2D2D]">
                  {currentLesson.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {!currentLesson.content.startsWith('/') && (
                <div className="hidden sm:flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
                  <Trophy className="w-5 h-5 text-[#FF6B35]" />
                  <span className="text-[#FF6B35] font-black text-lg">{totalXP} <span className="text-[10px] text-gray-400 uppercase tracking-tighter">XP</span></span>
                </div>
              )}
              <Link 
                href="/"
                className="p-2.5 bg-white border border-orange-100 rounded-xl hover:bg-orange-50 transition-all shadow-sm"
              >
                <Home className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Top Progress Map - Hidden for iframes */}
          {!currentLesson.content.startsWith('/') && (
            <nav className="flex gap-3 md:gap-4 items-center overflow-x-auto pb-2 no-scrollbar">
              {lessons.map((lesson, idx) => {
                const isActive = idx === currentIndex;
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentIndex(idx)}
                    className="relative shrink-0 flex flex-col items-center group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-200 scale-110' 
                        : isCompleted
                          ? 'bg-orange-100 text-[#FF6B35] border border-[#FF6B35]/20'
                          : 'bg-white text-gray-300 border border-orange-50 hover:border-orange-200'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="active-dot"
                        className="absolute -bottom-2 w-1.5 h-1.5 bg-[#FF6B35] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      <main className={`${currentLesson.content.startsWith('/') ? 'max-w-none px-0' : 'max-w-4xl px-6'} mx-auto py-12 pb-32 transition-all duration-500`}>
        {!currentLesson.content.startsWith('/') && (
          <div className="mb-12">
            <XPBar 
              currentXP={((currentIndex + 1) / lessons.length) * 100} 
              maxXP={100} 
              level={Math.floor(totalXP / 500) + 1}
              label={`Lección ${currentIndex + 1} de ${lessons.length}`}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showCelebration ? (
            <motion.article
              key={currentLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`${currentLesson.content.startsWith('/') ? 'bg-transparent border-none shadow-none p-0' : 'bg-white p-8 md:p-16 rounded-[48px] border border-orange-50 shadow-2xl shadow-orange-100'} relative overflow-hidden`}
            >
              {!currentLesson.content.startsWith('/') && (
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
              )}
              
              <div className={`${currentLesson.content.startsWith('/') ? '' : 'prose prose-orange prose-lg max-w-none'} relative z-10 text-[#2D2D2D]`}>
                <div className="font-medium leading-relaxed">
                  {currentLesson.content.startsWith('/') ? (
                    <div className="relative w-full overflow-hidden bg-white rounded-b-[40px] shadow-2xl" style={{ height: 'calc(100vh - 120px)' }}>
                      <iframe 
                        src={currentLesson.content}
                        className="w-full h-full border-none"
                        title={currentLesson.title}
                      />
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                  )}
                </div>
              </div>

              {!currentLesson.content.startsWith('/') && (
                <motion.div 
                  className="mt-20 pt-12 border-t border-orange-50 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <button 
                    onClick={() => {
                      setCurrentIndex(prev => Math.max(0, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-4 group disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    <div className="w-14 h-14 bg-white border border-orange-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#FF6B35] group-hover:border-[#FF6B35] transition-all">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Anterior</p>
                      <p className="text-sm font-black text-[#2D2D2D] truncate max-w-[150px]">
                        {currentIndex > 0 ? lessons[currentIndex - 1].title : 'Llegaste al inicio'}
                      </p>
                    </div>
                  </button>

                  <button 
                    onClick={handleComplete}
                    className="w-full md:w-auto px-12 py-5 bg-[#FF6B35] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-100 hover:bg-[#2D2D2D] hover:translate-y-[-4px] transition-all active:translate-y-0 group"
                  >
                    {isLastLesson ? 'Finalizar Curso' : 'Siguiente Lección'}
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </motion.article>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 md:p-20 rounded-[60px] border border-orange-100 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Trophy className="w-12 h-12 text-[#FF6B35]" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-outfit text-[#2D2D2D] mb-6 tracking-tight uppercase">
                  ¡Felicidades!
                </h2>
                <p className="text-xl text-gray-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                  Has completado todas las lecciones de este curso. Tu esfuerzo está dando frutos en tu crecimiento espiritual.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href={`/cursos/${courseId}`}
                    className="px-10 py-5 bg-[#FF6B35] text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:bg-[#2D2D2D] transition-all"
                  >
                    Volver al Curso
                  </Link>
                  <Link 
                    href="/"
                    className="px-10 py-5 bg-white border border-orange-100 text-[#2D2D2D] rounded-2xl font-black text-lg hover:bg-orange-50 transition-all"
                  >
                    Ir al Inicio
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonViewer;
