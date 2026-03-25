"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, CheckCircle, Star, Heart, Shield, 
  ArrowRight, BookMarked, MessageCircle, Sparkles, 
  Loader2, Lock, ChevronLeft, Layout, Check, Quote,
  Trophy, Target, Zap, AlertCircle, RefreshCw, Wand2, BrainCircuit, 
  Info, Users, Flame, ScrollText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// --- CONFIGURACIÓN DE LA API DE GEMINI ---
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Icono personalizado para oración (SVG)
const PrayerIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    <path d="M7 14c.5-1 2-2 5-2s4.5 1 5 2" />
    <path d="M2 13c0 2 1.5 3 3.5 3h13c2 0 3.5-1 3.5-3" />
    <path d="M12 16v4" />
    <path d="M9 21h6" />
  </svg>
);

// --- BASE DE DATOS DIACONADO ---
const LESSONS_DATA = [
  {
    id: 0,
    title: "El Llamado Diaconal",
    badge: "Nivel 1",
    description: "Descubre el origen bíblico y el propósito fundamental del servicio diaconal.",
    content: "El diaconado no es un título de honor, sino un llamado al servicio práctico y espiritual. Originado en Hechos 6 para atender las necesidades de la comunidad, el diácono es un pilar de amor y orden en la iglesia. Su función principal es servir a las mesas y cuidar de los necesitados, permitiendo que la Palabra de Dios crezca. Ser diácono significa ser un 'servidor' (diakonos) siguiendo el ejemplo de Jesús.",
    verses: [
      { ref: "Hechos 6:2-4", text: "No es justo que nosotros dejemos la palabra de Dios, para servir a las mesas... Buscad, pues, hermanos, de entre vosotros a siete varones de buen testimonio." },
      { ref: "Mateo 20:28", text: "Como el Hijo del Hombre no vino para ser servido, sino para servir, y para dar su vida en rescate por muchos." },
      { ref: "1 Pedro 4:10", text: "Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios." }
    ],
    reflectionQuestions: ["¿Siento en mi corazón el deseo genuino de servir a los demás sin esperar reconocimiento?"],
    quiz: [
      { q: "¿Qué significa originalmente la palabra 'diakonos'?", options: ["Líder supremo", "Servidor / Ayudante", "Maestro de la ley", "Gobernador"], correct: 1 },
      { q: "¿Cuál fue el motivo principal de elegir a los primeros diáconos en Hechos 6?", options: ["Para recaudar dinero", "Para predicar en otras ciudades", "Para atender las mesas y las viudas", "Para construir el templo"], correct: 2 },
      { q: "¿Qué requisito espiritual se menciona en Hechos 6 para los diáconos?", options: ["Ser el más rico", "Ser pariente de un apóstol", "Llenos del Espíritu Santo y sabiduría", "Saber muchos idiomas"], correct: 2 },
      { q: "¿A quién imitamos primordialmente cuando servimos?", options: ["A los apóstoles", "A Jesucristo", "A los profetas", "A nosotros mismos"], correct: 1 },
      { q: "¿Cuál es el fruto de un diaconado bien ejercido?", options: ["Que el líder descanse más", "Que la Palabra de Dios crezca y se multiplique", "Ganar fama personal", "Controlar a la congregación"], correct: 1 }
    ],
    aiContext: "Origen bíblico del diaconado, Hechos 6, servicio práctico."
  },
  {
    id: 1,
    title: "Carácter y Requisitos",
    badge: "Nivel 2",
    description: "Profundiza en los requisitos morales y espirituales para un servicio que glorifica a Dios.",
    content: "El servicio efectivo brota de un carácter transformado. La Biblia establece estándares altos para quienes sirven en la casa del Señor. No se trata solo de habilidades técnicas, sino de una vida íntegra que refleje a Cristo en lo público y lo privado. El diácono debe ser alguien de 'buen testimonio', alguien en quien la congregación pueda confiar plenamente.",
    verses: [
      { ref: "1 Timoteo 3:8", text: "Los diáconos asimismo deben ser honestos, sin doblez, no dados a mucho vino, no codiciosos de ganancias deshonestas." },
      { ref: "1 Timoteo 3:9", text: "Que guarden el misterio de la fe con limpia conciencia." },
      { ref: "Filipenses 2:3", text: "Nada hagáis por contienda o por vanagloria; antes bien con humildad." }
    ],
    reflectionQuestions: ["¿Es mi conducta en casa y en el trabajo un reflejo de Cristo?"],
    quiz: [
      { q: "Según 1 Timoteo 3:8, ¿cómo deben ser los diáconos?", options: ["Elocuentes", "Honestos y sin doblez", "Muy jóvenes", "Expertos en leyes"], correct: 1 },
      { q: "¿Qué significa 'guardar el misterio de la fe con limpia conciencia'?", options: ["Saber secretos", "Vivir de acuerdo a lo que creemos", "No contar nada a nadie", "Sólo leer la Biblia"], correct: 1 },
      { q: "¿Cuál es el peligro de la 'codicia de ganancias deshonestas' en el diácono?", options: ["No pasa nada", "Corrompe el propósito del servicio", "Es necesario para el templo", "Produce envidia"], correct: 1 },
      { q: "¿Cómo debe ser el testimonio del diácono ante los de afuera?", options: ["Irrelevante", "Debe ser excelente y respetado", "Sólo importa lo que piensen en la iglesia", "Invisible"], correct: 1 },
      { q: "¿Qué actitud debe reinar en el servicio según Filipenses 2:3?", options: ["Humildad", "Competencia", "Contienda", "Vanagloria"], correct: 0 }
    ],
    aiContext: "Requisitos de 1 Timoteo 3, integridad, testimonio, conciencia limpia."
  },
  {
    id: 2,
    title: "Excelencia y Recompensa",
    badge: "Nivel 3",
    description: "Entiende el impacto eterno y la bendición de servir fielmente en la casa del Señor.",
    content: "Servir a Dios como diácono es un privilegio que trae consigo grandes promesas. Quienes ejercen bien su ministerio ganan respeto espiritual y una fe inamovible. El servicio fiel no pasa desapercibido ante los ojos del Padre, quien recompensa la diligencia y el amor puesto en cada tarea, por pequeña que parezca.",
    verses: [
      { ref: "1 Timoteo 3:13", text: "Porque los que ejerzan bien el diaconado, ganan para sí un grado honroso, y mucha confianza en la fe." },
      { ref: "Mateo 25:21", text: "Bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré; entra en el gozo de tu señor." },
      { ref: "Juan 12:26", text: "Si alguno me sirve, mi Padre le honrará." }
    ],
    reflectionQuestions: ["¿Sirvo con la alegría de saber que mi recompensa viene del Señor?"],
    quiz: [
      { q: "¿Qué ganan los que ejercen bien el diaconado según Pablo?", options: ["Un título universitario", "Un grado honroso y mucha confianza en la fe", "Un premio económico", "Autoridad para mandar"], correct: 1 },
      { q: "¿Cuál es la respuesta del Señor ante la fidelidad en lo poco?", options: ["Le quita lo que tiene", "Sobre mucho le pondrá", "Le ignora", "Le da más trabajo pesado"], correct: 1 },
      { q: "¿Qué promete el Padre a quienes sirven a Jesús según Juan 12:26?", options: ["Honra", "Riquezas", "Fama", "Poder terrenal"], correct: 0 },
      { q: "¿Qué es 'ejercer bien' el diaconado?", options: ["Hacerlo para ser visto", "Hacerlo con amor, fidelidad y excelencia", "Hacerlo sólo cuando hay gente", "Hacerlo por obligación"], correct: 1 },
      { q: "¿Hacia dónde debe apuntar nuestra excelencia en el servicio?", options: ["A nosotros mismos", "Al pastor", "A Dios y a Su Reino", "A las redes sociales"], correct: 2 }
    ],
    aiContext: "Promesas divinas, Mateo 25, servicio fiel, honra del Padre."
  }
];

export default function DiaconadoInteractive() {
  const [view, setView] = useState('dashboard'); 
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [unlockedLessons, setUnlockedLessons] = useState([0]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados de Lección
  const [currentStep, setCurrentStep] = useState(0); 
  const [unlockedVerses, setUnlockedVerses] = useState<number[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizError, setQuizError] = useState(false);

  // Estados de IA ✨
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiReflectionFeedback, setAiReflectionFeedback] = useState<string | null>(null);
  const [aiPrayer, setAiPrayer] = useState<string | null>(null);

  const activeLesson = LESSONS_DATA[activeLessonIdx];
  const courseId = 'diaconado';

  useEffect(() => {
    async function initData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', session.user.id);
      
      if (progressData) {
        const completedIds = progressData.map(p => p.lesson_id);
        const completedIndices: number[] = [];
        const unlockedIndices: number[] = [0];

        LESSONS_DATA.forEach((_, idx) => {
          const dbId = `${courseId}-interactivo-${idx + 1}`;
          if (completedIds.includes(dbId)) {
            completedIndices.push(idx);
            if (idx + 1 < LESSONS_DATA.length) {
              unlockedIndices.push(idx + 1);
            }
          }
        });

        setCompletedLessons(completedIndices);
        setUnlockedLessons([...new Set(unlockedIndices)]);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setPoints(profile.xp || 0);
      }

      setLoading(false);
    }

    initData();
  }, []);

  const callGemini = async (prompt: string, systemPrompt: string) => {
    setAiLoading(true);
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || `HTTP ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        setAiLoading(false);
        return text;
      } catch (error: any) {
        retries++;
        if (retries >= maxRetries) {
          setAiLoading(false);
          return `Error técnico de IA: ${error.message || 'Desconocido'}. Por favor avísame.`;
        }
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(res => setTimeout(res, delay));
      }
    }
    setAiLoading(false);
    return "Error al conectar con la IA.";
  };

  const handleAiExplicate = async () => {
    const prompt = `Como mentor de diáconos, explica profundamente el tema "${activeLesson.title}". Contenido: ${activeLesson.content}`;
    const system = "Eres un mentor experto en el ministerio del diaconado cristiano. Tu tono es práctico, servicial y bíblico. Responde en español.";
    const result = await callGemini(prompt, system);
    setAiExplanation(result);
  };

  const handleAiAnalyzeReflection = async () => {
    const prompt = `Analiza esta reflexión sobre el diaconado: "${reflectionText}" de la lección "${activeLesson.title}". Brinda aliento y 3 consejos prácticos para servir con excelencia.`;
    const system = "Eres un mentor para nuevos diáconos. Tu objetivo es fortalecer su corazón de siervo con base en su reflexión.";
    const result = await callGemini(prompt, system);
    setAiReflectionFeedback(result);
  };

  const handleAiGeneratePrayer = async () => {
    const prompt = `Crea una oración para un diácono basada en la lección "${activeLesson.title}".`;
    const system = "Eres un guía espiritual para siervos de la iglesia. Crea oraciones de humildad y entrega.";
    const result = await callGemini(prompt, system);
    setAiPrayer(result);
  };

  const canMoveToNext = () => {
    if (currentStep === 0) return true; 
    if (currentStep === 1) return unlockedVerses.length === activeLesson.verses.length; 
    if (currentStep === 2) return reflectionSaved; 
    if (currentStep === 3) {
      const correctCount = Object.keys(quizAnswers).filter(key => quizAnswers[Number(key)] === activeLesson.quiz[Number(key)].correct).length;
      return correctCount === activeLesson.quiz.length; 
    }
    return false;
  };

  const startLesson = (index: number) => {
    if (!unlockedLessons.includes(index)) return;
    setActiveLessonIdx(index);
    setCurrentStep(0);
    setUnlockedVerses([]);
    setReflectionText("");
    setReflectionSaved(false);
    setQuizAnswers({});
    setQuizError(false);
    setAiExplanation(null);
    setAiReflectionFeedback(null);
    setAiPrayer(null);
    setView('lesson');
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const completeLesson = async () => {
    if (!completedLessons.includes(activeLessonIdx)) {
      setCompletedLessons(prev => [...prev, activeLessonIdx]);
      if (activeLessonIdx + 1 < LESSONS_DATA.length) {
        setUnlockedLessons(prev => [...new Set([...prev, activeLessonIdx + 1])]);
      }

      if (user) {
        const dbId = `${courseId}-interactivo-${activeLessonIdx + 1}`;
        await supabase
          .from('user_progress')
          .upsert({ user_id: user.id, lesson_id: dbId, course_id: courseId });
      }
    }
    setView('dashboard');
  };

  const addPoints = async (val: number) => {
    setPoints(p => {
      const newPoints = p + val;
      if (user) {
        supabase
          .from('profiles')
          .update({ xp: newPoints })
          .eq('id', user.id)
          .then(({ error }) => {
            if (error) console.error('Error updating XP:', error);
          });
      }
      return newPoints;
    });
  };

  const handleQuizAnswer = (qIdx: number, oIdx: number) => {
    const isCorrect = activeLesson.quiz[qIdx].correct === oIdx;
    if (isCorrect) {
      setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
      if (Object.keys(quizAnswers).length + 1 === activeLesson.quiz.length) {
        setQuizError(false);
      }
      addPoints(20);
    } else {
      setQuizError(true);
      setQuizAnswers({});
    }
  };

  const ProgressBar = ({ current, total, color="bg-indigo-600" }: { current: number, total: number, color?: string }) => (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
  );

  const AiLoadingOverlay = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="text-indigo-700 font-bold animate-pulse">Consultando al Mentor de Diáconos ✨</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-bold animate-pulse">Cargando misión diaconal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 max-w-md">
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">Acceso Reservado</h2>
          <p className="text-slate-500 mb-8 font-medium">Inicia sesión para comenzar tu formación como siervo del Reino.</p>
          <a href="/auth" className="block w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            INICIAR SESIÓN
          </a>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:scale-110" />
                  Volver al Inicio
                </Link>
                <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
                  <Heart className="text-red-500 fill-red-500" /> El Camino del servicio - Diaconado
                </h1>
                <p className="text-slate-500 font-medium mt-1">Formándote para servir con excelencia en la casa de Dios ✨</p>
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 min-w-[240px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Experiencia Ministerial</span>
                  <span className="text-indigo-600 font-black">{points} XP</span>
                </div>
                <ProgressBar current={points % 1000} total={1000} color="bg-gradient-to-r from-indigo-500 to-amber-500" />
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LESSONS_DATA.map((lesson, idx) => {
              const isUnlocked = unlockedLessons.includes(idx);
              const isCompleted = completedLessons.includes(idx);
              return (
                <div 
                  key={idx}
                  onClick={() => isUnlocked && startLesson(idx)}
                  className={`relative group bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 
                    ${isUnlocked 
                      ? 'border-transparent shadow-md hover:shadow-2xl hover:-translate-y-2 cursor-pointer' 
                      : 'border-slate-100 opacity-60 grayscale cursor-not-allowed'}`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className={`p-4 rounded-2xl ${isCompleted ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {isCompleted ? <Award className="w-6 h-6" /> : isUnlocked ? <Zap className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">{lesson.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{lesson.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <button onClick={() => setView('dashboard')} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="flex-1 hidden md:block">
            <ProgressBar current={currentStep + 1} total={5} color="bg-amber-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-amber-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-amber-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-black text-amber-700 text-sm">{points} XP</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1]">{activeLesson.title}</h1>
              <div className="h-2 w-20 bg-amber-500 rounded-full"></div>
            </div>
            <p className="text-xl text-slate-700 leading-relaxed font-medium">{activeLesson.content}</p>

            <div className="pt-6">
              {!aiExplanation ? (
                <button 
                  onClick={handleAiExplicate}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black py-5 rounded-[2rem] shadow-xl hover:scale-105 transition-transform"
                >
                  <BrainCircuit className="w-6 h-6" /> Profundizar con IA ✨
                </button>
              ) : (
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem] p-8 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-3 text-indigo-700 mb-2">
                    <ScrollText className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-sm">Perspectiva del Mentor ✨</span>
                  </div>
                  <div className="text-slate-800 leading-relaxed prose prose-indigo whitespace-pre-wrap font-inherit">
                    {aiExplanation}
                  </div>
                </div>
              )}
              {aiLoading && !aiExplanation && <AiLoadingOverlay />}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-3xl font-black text-slate-900">Base Bíblica del Siervo</h2>
            <p className="text-slate-500 font-bold">Reflexiona en cada versículo para continuar.</p>
            <div className="grid gap-6">
              {activeLesson.verses.map((v, i) => (
                <div 
                  key={i} 
                  onClick={() => !unlockedVerses.includes(i) && (setUnlockedVerses([...unlockedVerses, i]), addPoints(10))}
                  className={`group p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer 
                  ${unlockedVerses.includes(i) ? 'border-amber-50 bg-amber-50/20' : 'border-dashed border-slate-200 bg-slate-50'}`}
                >
                  {!unlockedVerses.includes(i) ? (
                    <div className="flex justify-between items-center text-slate-400 font-bold">
                      <span>Explorar {v.ref}</span>
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="animate-in zoom-in-95">
                      <span className="text-amber-600 font-black text-xs tracking-widest uppercase">{v.ref}</span>
                      <p className="mt-4 text-slate-800 text-xl leading-relaxed italic">"{v.text}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-3xl font-black text-slate-900">Reflexión del Ministerio</h2>
            <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 text-indigo-200">{activeLesson.reflectionQuestions[0]}</h3>
                <textarea 
                  className="w-full bg-white/10 rounded-2xl p-6 min-h-[160px] text-lg text-white border-2 border-transparent focus:border-amber-400 outline-none placeholder:text-white/30"
                  placeholder="Escibe aquí tu reflexión ministerial..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  disabled={reflectionSaved}
                />
                {!reflectionSaved ? (
                  <button 
                    onClick={() => {setReflectionSaved(true); addPoints(30); handleAiAnalyzeReflection();}}
                    disabled={reflectionText.trim().length < 10}
                    className="mt-6 w-full bg-amber-500 text-white font-black py-4 rounded-2xl disabled:opacity-30 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-900/20"
                  >
                    GUARDAR Y RECIBIR MENTORÍA IA ✨
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-green-500/20 rounded-2xl flex items-center gap-3 text-green-300 font-bold">
                      <CheckCircle className="w-5 h-5" /> Reflexión registrada.
                    </div>
                    {aiLoading ? <AiLoadingOverlay /> : (
                      aiReflectionFeedback && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl animate-in fade-in duration-500">
                          <div className="flex items-center gap-2 text-amber-300 mb-3">
                            <Wand2 className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-widest uppercase">Guía del Mentor ✨</span>
                          </div>
                          <div className="text-white text-base italic whitespace-pre-wrap leading-relaxed opacity-90">
                            {aiReflectionFeedback}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">Sabiduría Diaconal</h2>
              <div className="text-amber-600 font-black text-sm">
                {Object.keys(quizAnswers).length} / {activeLesson.quiz.length} Correctas
              </div>
            </div>

            {quizError && (
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl flex items-center gap-4 text-red-700 animate-bounce">
                <AlertCircle className="shrink-0" />
                <div>
                  <p className="font-black">¡Atención, siervo!</p>
                  <p className="text-sm opacity-80">Revisa bien tus conceptos y vuelve a intentarlo.</p>
                </div>
              </div>
            )}

            {activeLesson.quiz.map((item, qIdx) => (
              <div key={qIdx} className="space-y-6">
                <p className="text-xl font-bold text-slate-800">{qIdx + 1}. {item.q}</p>
                <div className="grid gap-3">
                  {item.options.map((opt, oIdx) => {
                    const isAnswered = quizAnswers[qIdx] !== undefined;
                    const isCorrect = quizAnswers[qIdx] === oIdx;
                    return (
                      <button 
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(qIdx, oIdx)}
                        className={`p-5 rounded-2xl border-2 text-left font-bold transition-all 
                          ${isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 hover:border-amber-400 opacity-100 shadow-sm'}
                          ${isAnswered && !isCorrect ? 'opacity-40 grayscale' : ''}
                        `}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-in zoom-in-95 duration-700 text-center space-y-10">
            <div className="bg-indigo-700 p-12 rounded-[4rem] text-white shadow-3xl overflow-hidden relative">
              <div className="relative z-10">
                <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-6 drop-shadow-lg" />
                <h2 className="text-4xl font-black mb-6">¡Misión Cumplida!</h2>
                
                <div className="max-w-md mx-auto mb-10">
                  {!aiPrayer ? (
                    <button 
                      onClick={handleAiGeneratePrayer}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl w-full flex items-center justify-center gap-2 transition-all"
                    >
                      <PrayerIcon className="w-5 h-5 text-amber-300" />
                      <span className="font-bold">Generar Oración de Servidor ✨</span>
                    </button>
                  ) : (
                    <div className="bg-indigo-900/40 p-6 rounded-[2rem] border border-white/10 animate-in slide-in-from-top-4">
                      <Quote className="w-8 h-8 text-amber-400 mx-auto mb-4 opacity-50" />
                      <p className="italic text-lg leading-relaxed mb-4">{aiPrayer}</p>
                      <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Amén</p>
                    </div>
                  )}
                  {aiLoading && !aiPrayer && <div className="mt-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-white" /></div>}
                </div>

                <button 
                  onClick={completeLesson}
                  className="bg-amber-500 text-white font-black px-12 py-5 rounded-[2rem] text-xl shadow-2xl hover:scale-105 transition-transform"
                >
                  FINALIZAR NIVEL
                </button>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-50"></div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto flex justify-between items-center pointer-events-auto">
            <button 
              disabled={currentStep === 0}
              onClick={() => {setCurrentStep(s => s - 1); if (typeof window !== 'undefined') window.scrollTo(0,0);}}
              className="text-slate-400 font-black hover:text-indigo-600 disabled:opacity-0 transition-colors"
            >
              Anterior
            </button>
            
            {currentStep < 4 && (
              <div className="group relative">
                {!canMoveToNext() && (
                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Completa tu misión para avanzar
                  </div>
                )}
                <button 
                  disabled={!canMoveToNext()}
                  onClick={() => {setCurrentStep(s => s + 1); if (typeof window !== 'undefined') window.scrollTo(0,0);}}
                  className={`px-10 py-4 rounded-2xl font-black flex items-center transition-all shadow-xl
                    ${canMoveToNext() ? 'bg-indigo-600 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  Siguiente <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
