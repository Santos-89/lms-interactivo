"use client";


import React from 'react';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { Compass, BookOpen, Users, Pencil, ArrowRight, Sparkles, Facebook, Instagram, Youtube, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const COURSES = [
  {
    id: 'diaconado',
    title: 'Diaconado',
    description: 'Aprende sobre el ministerio del diaconado, sus responsabilidades y cómo servir con excelencia.',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'bg-bethel-red',
    href: '/cursos/diaconado'
  },
  {
    id: 'liderazgo',
    title: 'Liderazgo',
    description: 'Desarrolla habilidades de liderazgo cristiano y aprende a guiar a otros con sabiduría y amor.',
    icon: <Users className="w-8 h-8" />,
    color: 'bg-bethel-blue',
    href: '/cursos/liderazgo'
  },
  {
    id: 'maestros',
    title: 'Maestros',
    description: 'Capacítate para enseñar la Palabra de Dios de manera efectiva y transformadora.',
    icon: <Pencil className="w-8 h-8" />,
    color: 'bg-bethel-red',
    href: '/cursos/maestros'
  }
];

import { supabase } from '@/lib/supabase';

const TRANSLATIONS: any = {
  es: {
    heroTitle: "Bienvenidos a nuestra",
    heroSubtitle: "plataforma de aprendizaje",
    heroDesc: "Selecciona uno de nuestros programas de formación para comenzar tu camino de crecimiento espiritual y liderazgo. Cada programa está diseñado para fortalecer tu fe y prepararte para servir en la iglesia.",
    explore: "EXPLORAR",
    whyChoose: "¿Por qué elegir",
    whyChooseSub: "Un enfoque etéreo que prioriza la claridad espiritual y el crecimiento tecnológico.",
    feature1Title: "Formación Bíblica",
    feature1Desc: "Contenido sólido basado estrictamente en la Palabra.",
    feature2Title: "Liderazgo Activo",
    feature2Desc: "No solo teoría, preparamos líderes para el servicio real.",
    feature3Title: "Progreso Etéreo",
    feature3Desc: "Experiencia fluida y transparente en cada lección.",
    curriculum: "Currícula 2026",
    ourPrograms: "Nuestros",
    ourProgramsSub: "Programas",
    accessCourse: "ACCEDER AL CURSO",
    noCourses: "No hay cursos disponibles actualmente.",
    selectLanguage: "Selecciona tu idioma",
    rights: "Todos los derechos reservados",
    wait: "Buscando cursos...",
    header: {
      home: "Inicio",
      courses: "Cursos",
      resources: "Recursos",
      enter: "Entrar",
      exit: "Salir"
    }
  },
  en: {
    heroTitle: "Welcome to our",
    heroSubtitle: "learning platform",
    heroDesc: "Select one of our training programs to begin your journey of spiritual growth and leadership. Each program is designed to strengthen your faith and prepare you to serve in the church.",
    explore: "EXPLORE",
    whyChoose: "Why choose",
    whyChooseSub: "An ethereal approach that prioritizes spiritual clarity and technological growth.",
    feature1Title: "Biblical Training",
    feature1Desc: "Solid content based strictly on the Word.",
    feature2Title: "Active Leadership",
    feature2Desc: "Not just theory, we prepare leaders for real service.",
    feature3Title: "Ethereal Progress",
    feature3Desc: "Smooth and transparent experience in every lesson.",
    curriculum: "2026 Curriculum",
    ourPrograms: "Our",
    ourProgramsSub: "Programs",
    accessCourse: "ACCESS COURSE",
    noCourses: "No courses available at the moment.",
    selectLanguage: "Select your language",
    rights: "All rights reserved",
    wait: "Fetching courses...",
    header: {
      home: "Home",
      courses: "Courses",
      resources: "Resources",
      enter: "Log in",
      exit: "Log out"
    }
  }
};

export default function Home() {
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [language, setLanguage] = React.useState('es');

  const t = TRANSLATIONS[language];

  React.useEffect(() => {
    async function fetchCourses() {
      console.log('Fetching courses from Supabase...');
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching courses:', error);
          setCourses(COURSES); // Fallback on error
        } else if (!data || data.length === 0) {
          console.log('No courses found in database, using fallback.');
          setCourses(COURSES); // Fallback on empty
        } else {
          console.log('Courses fetched successfully:', data);
          setCourses(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching courses:', err);
        setCourses(COURSES);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#F8FAFC] text-[#1E293B]">
      {/* Header local state passed as prop */}
      <Header language={language} />

      <main className="max-w-7xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <section className="mt-8 mb-20 relative overflow-hidden rounded-[48px] bg-white/40 border border-white/60 p-8 md:p-20 backdrop-blur-xl shadow-[0_20px_60px_rgba(30,41,59,0.05)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] -ml-40 -mb-40"></div>

          {/* Título Centrado Superior */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 relative z-10"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-outfit leading-[1.1] text-[#1E293B] tracking-tight">
              {t.heroTitle}<br />
              <span className="text-gradient">{t.heroSubtitle}</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
            {/* Columna Izquierda: Texto y Botón */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center space-y-10 min-h-[400px] lg:min-h-[500px]"
            >
              <p className="text-xl md:text-2xl text-[#64748B] leading-relaxed font-medium max-w-lg">
                {t.heroDesc}
              </p>
              <div>
                <Link 
                  href="#programas" 
                  className="inline-block px-14 py-6 bg-primary text-white rounded-3xl font-black text-xl shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:bg-[#4F46E5] transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                >
                  {t.explore}
                </Link>
              </div>
            </motion.div>

            {/* Columna Derecha: Imagen */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative w-full h-[400px] lg:h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-indigo-400/5 rounded-full blur-[100px]"></div>
              <div className="relative w-full h-full">
                <Image
                  src="/illustrations/Fondo-PP.png"
                  alt="Bienvenidos"
                  fill
                  className="object-contain scale-125 lg:scale-150 drop-shadow-[0_30px_60px_rgba(0,0,0,0.06)]"
                  unoptimized
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* Categories / Steps Section */}
        <section className="mb-24">
          <div className="text-center mb-24">

            <h2 className="text-4xl md:text-6xl font-black font-outfit text-[#1E293B] mb-6">
              {t.whyChoose} <span className="text-primary italic">Bethel</span>?
            </h2>
            <p className="text-[#64748B] font-medium max-w-2xl mx-auto text-lg">
              {t.whyChooseSub}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: t.feature1Title, desc: t.feature1Desc, icon: <BookOpen />, color: 'indigo' },
              { title: t.feature2Title, desc: t.feature2Desc, icon: <Users />, color: 'blue' },
              { title: t.feature3Title, desc: t.feature3Desc, icon: <Compass />, color: 'indigo' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -15, scale: 1.02 }}
                className="bg-white/40 p-12 rounded-[56px] border border-white shadow-[0_15px_45px_rgba(0,0,0,0.03)] transition-all hover:bg-white/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl group"
              >
                <div className={`w-16 h-16 ${item.color === 'indigo' ? 'bg-primary/10 text-primary' : 'bg-blue-400/10 text-blue-400'} rounded-[24px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-inner`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
                </div>
                <h3 className="text-2xl font-black font-outfit mb-6 text-[#1E293B] uppercase tracking-tighter leading-none">{item.title}</h3>
                <p className="text-[#64748B] font-medium leading-relaxed text-lg">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section id="programas">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="max-w-4xl">
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] block mb-6 shadow-sm border border-primary/20 bg-primary/5 w-fit px-4 py-1 rounded-full">{t.curriculum}</span>
              <h2 className="text-4xl md:text-6xl font-black font-outfit text-[#1E293B] tracking-tight whitespace-nowrap">
                {t.ourPrograms} <span className="text-gradient">{t.ourProgramsSub}</span>
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {courses.length > 0 ? courses.map((course, index) => {
                const config = {
                  diaconado: { bg: 'bg-[#F9DCC4]', circle: 'bg-[#F08E52]/20', img: '/illustrations/diaconado.png' },
                  liderazgo: { bg: 'bg-[#BDE0FE]', circle: 'bg-[#4895EF]/20', img: '/illustrations/liderazgo.png' },
                  maestros: { bg: 'bg-[#D0F4DE]', circle: 'bg-[#40916C]/20', img: '/illustrations/maestros.png' }
                } as any;

                
                const courseConfig = config[course.id] || config.diaconado;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative group h-[720px]"
                  >
                        <div className={`bg-white/40 h-full rounded-[64px] p-12 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white transition-all duration-700 group-hover:-translate-y-6 group-hover:bg-white/60 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl`}>
                      {/* Illustration Area */}
                      <div className="relative flex-1 flex items-center justify-center mb-16 px-4">
                        <div className={`absolute w-72 h-72 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
                        <div className={`relative z-10 w-full aspect-square`}>
                          <Image
                            src={courseConfig.img}
                            alt={course.title}
                            fill
                            className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="relative z-20">
                        <h3 className="text-3xl font-black font-outfit text-[#1E293B] mb-6 leading-none tracking-tighter uppercase whitespace-pre-line">
                          {course.title}
                        </h3>
                        <p className="text-[#64748B] font-medium text-lg leading-relaxed mb-12 line-clamp-3">
                          {course.description}
                        </p>

                        {/* Botón de Acción Único */}
                        <div className="flex flex-col gap-4 mt-auto">
                          <Link
                            href={
                              course.id === 'liderazgo' ? '/cursos/liderazgo/interactivo' :
                              course.id === 'diaconado' ? '/cursos/diaconado/interactivo' :
                              `/cursos/${course.id}`
                            }
                            className="w-full px-8 py-5 bg-primary rounded-[28px] text-xs font-black text-white uppercase tracking-[0.3em] shadow-[0_15px_35px_rgba(99,102,241,0.2)] hover:bg-[#4F46E5] transition-all active:scale-95 flex items-center justify-center gap-3 transition-all duration-300 group/btn"
                          >
                            <span>{t.accessCourse}</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              }) : (
                <div className="col-span-full text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center backdrop-blur-sm">
                  <BookOpen className="w-16 h-16 text-primary/20 mb-4" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t.noCourses}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="py-24 bg-white/40 border-t border-white shadow-[0_-15px_50px_rgba(0,0,0,0.02)] backdrop-blur-xl mt-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary mb-2">
              <Globe className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.selectLanguage}</span>
            </div>
            <div className="flex gap-4">
              {['ESPAÑOL', 'INGLÉS'].map((lang, idx) => {
                const langCode = lang === 'ESPAÑOL' ? 'es' : 'en';
                const isActive = language === langCode;
                return (
                  <button 
                    key={lang} 
                    onClick={() => setLanguage(langCode)}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-primary/10 border-primary/20 text-primary shadow-sm' 
                        : 'bg-white/40 border-white text-[#64748B] hover:bg-white/60'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[#64748B] text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left">
            &copy; 2026 Ministerio Bethel Internacional.<br className="md:hidden" /> {t.rights}.
          </p>

          <div className="flex gap-4">
            {[
              { id: 'FB', icon: <Facebook className="w-5 h-5" /> },
              { id: 'IG', icon: <Instagram className="w-5 h-5" /> },
              { id: 'YT', icon: <Youtube className="w-5 h-5" /> }
            ].map(social => (
              <div key={social.id} className="w-12 h-12 bg-white/60 border border-white rounded-xl flex items-center justify-center text-[#1E293B] hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-primary/20 hover:-translate-y-1">
                {social.icon}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
