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
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; // Priorizamos variable de entorno

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

// --- BASE DE DATOS ---
const LESSONS_DATA = [
  {
    id: 0,
    title: "El Liderazgo Cristiano como Servicio",
    badge: "Lección 1",
    description: "Diferencia radical entre el poder del mundo y el modelo de Cristo.",
    content: "El liderazgo cristiano difiere radicalmente de los modelos propuestos por el mundo. Mientras que el liderazgo secular suele asociarse con poder, control, jerarquía y dominio, el liderazgo cristiano se fundamenta en el servicio, la humildad y la entrega. Jesucristo, el máximo referente, redefinió la autoridad: la grandeza verdadera se manifiesta en la capacidad de servir. No busca exaltación personal, sino glorificar a Dios y edificar a los demás. En el Reino de Dios, liderar no significa imponerse sobre otros, sino ponerse al servicio de ellos con amor, obediencia y fidelidad.",
    verses: [
      { ref: "Marcos 10:42–45", text: "Sabéis que los que son tenidos por gobernantes de las naciones se enseñorean de ellas... Pero no será así entre vosotros; sino que el que quiera hacerse grande entre vosotros será vuestro servidor." },
      { ref: "Mateo 20:26–28", text: "El que quiera hacerse grande entre vosotros será vuestro servidor." },
      { ref: "Juan 13:14–15", text: "Pues si yo, el Señor y el Maestro, he lavado vuestros pies, vosotros también debéis lavaros los pies los unos a los otros." },
      { ref: "Filipenses 2:5–7", text: "Haya, pues, en vosotros este mantener que hubo también en Cristo Jesús... tomando forma de siervo." }
    ],
    reflectionQuestions: ["¿Estoy dispuesto a renunciar a mis privilegios por amor a los demás?"],
    quiz: [
      { q: "Según Jesús, ¿qué define la grandeza en el Reino de Dios?", options: ["El servicio", "El poder", "La autoridad", "El reconocimiento"], correct: 0 },
      { q: "¿Qué modelo de liderazgo propone el mundo generalmente?", options: ["Servicio humilde", "Dominio sobre otros", "Sacrificio personal", "Amor al prójimo"], correct: 1 },
      { q: "¿Qué acción realizó Jesús para enseñar liderazgo servicial?", options: ["Lavó los pies de sus discípulos", "Predicó a multitudes", "Multiplicó panes", "Sanó enfermos"], correct: 0 },
      { q: "¿Cuál es la base fundamental del liderazgo cristiano?", options: ["El ejemplo y el servicio", "La jerarquía", "La imposición", "La autoridad legal"], correct: 0 }, 
      { q: "¿Qué fruto produce el liderazgo basado en el servicio?", options: ["Edificación del cuerpo de Cristo", "Fama personal", "Control total", "Ganancia económica"], correct: 0 }
    ],
    aiContext: "Liderazgo servicial vs autoritarismo mundano."
  },
  {
    id: 1,
    title: "Liderar con el Ejemplo",
    badge: "Lección 2",
    description: "La vida del líder habla más fuerte que sus palabras.",
    content: "Uno de los principios más poderosos del liderazgo cristiano es que la vida del líder habla más fuerte que sus palabras. El liderazgo no se valida por discursos elocuentes ni por cargos visibles, sino por una vida coherente que refleja el carácter de Cristo. Liderar con el ejemplo implica vivir primero aquello que luego se enseña. Jesús nunca pidió a sus discípulos hacer algo que Él no estuviera dispuesto a hacer primero. Su liderazgo fue profundamente práctico: sirvió antes de enseñar y amó antes de exigir.",
    verses: [
      { ref: "Juan 13:15", text: "Porque ejemplo os he dado, para que como yo os he hecho, vosotros también hagáis." },
      { ref: "1 Timoteo 4:12", text: "Sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza." },
      { ref: "Santiago 1:22", text: "Sed hacedores de la palabra, y no tan solamente oidores." },
      { ref: "Filipenses 3:17", text: "Sed imitadores de mí, así como yo de Cristo." }
    ],
    reflectionQuestions: ["¿Hay coherencia entre lo que predico y cómo trato a mi familia y equipo?"],
    quiz: [
      { q: "¿Qué valida realmente el liderazgo en el Reino de Dios?", options: ["Los discursos elocuentes", "La vida coherente del líder", "El cargo visible", "El conocimiento teológico"], correct: 1 },
      { q: "Según 1 Timoteo 4:12, ¿en qué áreas debe ser ejemplo el líder?", options: ["Solo en el habla", "En palabra, conducta, amor, fe y pureza", "Solo en la fe", "Solo en el conocimiento"], correct: 1 },
      { q: "¿Qué significa 'servir antes de hablar'?", options: ["Acompañar antes de corregir", "Ignorar las faltas", "Solo hacer tareas físicas", "No hablar nunca"], correct: 0 },
      { q: "¿Qué precede a la instrucción en el liderazgo cristiano?", options: ["La autoridad legal", "El ejemplo personal", "El título académico", "La antigüedad"], correct: 1 },
      { q: "¿Qué produce la incoherencia en un líder?", options: ["Más respeto", "Crecimiento de la iglesia", "Pérdida de autoridad espiritual", "Popularidad"], correct: 2 }
    ],
    aiContext: "Coherencia, testimonio y poder del ejemplo."
  },
  {
    id: 2,
    title: "El Servicio Formador de Carácter",
    badge: "Lección 3",
    description: "Dios moldea el corazón del líder a través del servicio sencillo.",
    content: "En el liderazgo cristiano, el carácter es más importante que la capacidad. El servicio es el principal medio que Dios utiliza para formarlo. Mientras el mundo prioriza habilidades y carisma, Dios trabaja primero en el interior del líder. El servicio no es solo una función, es un proceso formativo espiritual donde se aprende humildad, paciencia y obediencia. Cada acto, especialmente los que pasan desapercibidos, es una herramienta divina para forjar un carácter conforme a Cristo.",
    verses: [
      { ref: "1 Pedro 5:5", text: "Dios resiste a los soberbios, y da gracia a los humildes." },
      { ref: "Romanos 5:3-4", text: "La tribulación produce paciencia; y la paciencia, carácter probado." },
      { ref: "Filipenses 2:3", text: "Nada hagáis por contienda o por vanagloria; antes bien con humildad." },
      { ref: "Gálatas 6:9", text: "No nos cansemos, pues, de hacer bien." }
    ],
    reflectionQuestions: ["¿Estoy permitiendo que el servicio transforme mi carácter?"],
    quiz: [
      { q: "¿Qué es más importante que la capacidad en el liderazgo cristiano?", options: ["La inteligencia", "El carácter", "La elocuencia", "El carisma"], correct: 1 },
      { q: "¿Qué virtud se desarrolla al servir sin reconocimiento público?", options: ["La humildad", "El orgullo", "El control", "La impaciencia"], correct: 0 },
      { q: "¿Qué precede a la autoridad en el Reino de Dios?", options: ["El servicio", "El cargo", "El poder", "La jerarquía"], correct: 0 }, 
      { q: "¿Cuál es la función del servicio en el líder según el texto?", options: ["Ganar fama", "Moldeado del carácter", "Hacer amigos", "Evitar el trabajo"], correct: 1 },
      { q: "¿Cómo es un liderazgo sin carácter formado?", options: ["Firme", "Confiable", "Frágil", "Transformador"], correct: 2 }
    ],
    aiContext: "Formación de carácter, humildad y anonimato."
  },
  {
    id: 3,
    title: "Edificar y Fortalecer el Cuerpo",
    badge: "Lección 4",
    description: "Cada miembro es vital para que la Iglesia crezca saludablemente.",
    content: "El servicio cristiano no es un acto aislado; su propósito principal es edificar y fortalecer el cuerpo de Cristo. La Iglesia es un cuerpo vivo donde cada miembro cumple una función esencial. Cuando un miembro deja de cumplir su función, todo el cuerpo se ve afectado. Dios otorga dones espirituales no para beneficio personal, sino para edificar a los demás y promover la unidad. Una iglesia fortalecida por el servicio genera estabilidad y testimonio ante el mundo.",
    verses: [
      { ref: "1 Corintios 12:12", text: "El cuerpo es uno, y tiene muchos miembros, pero todos los miembros del cuerpo, siendo muchos, son un solo cuerpo." },
      { ref: "Efesios 4:12", text: "A fin de perfeccionar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo." },
      { ref: "1 Pedro 4:10", text: "Cada uno según el don que ha recibido, minístrelo a los otros." }
    ],
    reflectionQuestions: ["¿Cómo estoy contribuyendo a la edificación del cuerpo de Cristo?"],
    quiz: [
      { q: "¿Cuál es el propósito principal del servicio cristiano?", options: ["Éxito individual", "Edificar el cuerpo de Cristo", "Competencia", "Beneficio económico"], correct: 1 },
      { q: "¿Qué sucede cuando un miembro deja de cumplir su función?", options: ["Nada", "Todo el cuerpo se ve afectado", "El líder trabaja más", "La iglesia cierra"], correct: 1 },
      { q: "¿Para qué otorga Dios dones espirituales?", options: ["Para presumir", "Para beneficio personal", "Para edificar a los demás", "Para mandar"], correct: 2 },
      { q: "¿Cuál es el resultado de un servicio ejercido con amor y humildad?", options: ["Unidad y madurez", "División", "Confusión", "Desorden"], correct: 0 },
      { q: "¿Cómo debe realizarse el servicio según el texto?", options: ["Por obligación", "Por costumbre", "Con fidelidad y amor", "Por reconocimiento"], correct: 2 }
    ],
    aiContext: "Edificación del cuerpo, unidad y dones."
  },
  {
    id: 4,
    title: "Reflejar el Corazón de Cristo",
    badge: "Lección 5",
    description: "La meta final del líder es que otros vean a Jesús a través de su vida.",
    content: "El propósito más profundo del liderazgo no es solo guiar, sino reflejar el corazón de Cristo en cada acción. El servicio es el medio mediante el cual el carácter de Jesús se hace visible. Cristo no solo enseñó amor y compasión; Él los vivió plenamente. Por lo tanto, servir no es una estrategia, sino una expresión del corazón transformado. Cuando un líder sirve con sinceridad y humildad, está mostrando al mundo cómo es Jesús en realidad.",
    verses: [
      { ref: "Mateo 11:29", text: "Aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas." },
      { ref: "Juan 13:34-35", text: "En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros." },
      { ref: "1 Juan 3:18", text: "No amemos de palabra ni de lengua, sino de hecho y en verdad." }
    ],
    reflectionQuestions: ["¿Ven otros a Cristo en mis acciones diarias?"],
    quiz: [
      { q: "¿Qué revela principalmente el servicio cristiano?", options: ["La capacidad humana", "El corazón de Cristo", "La autoridad del líder", "El reconocimiento"], correct: 1 },
      { q: "¿Cómo se manifiesta el amor cristiano según la Biblia?", options: ["Solo en palabras", "En hechos y servicio", "En títulos", "En cargos"], correct: 1 },
      { q: "¿Qué caracteriza el corazón de Cristo según Mateo 11?", options: ["Orgullo y poder", "Dureza", "Mansedumbre y humildad", "Autoridad impositiva"], correct: 2 },
      { q: "¿Qué hace visible el testimonio cristiano ante el mundo?", options: ["La jerarquía", "El conocimiento", "El servicio con amor", "La crítica"], correct: 2 },
      { q: "¿Qué implica reflejar a Cristo a través del servicio?", options: ["Un estilo de vida constante", "Una acción ocasional", "Una obligación religiosa", "Una estrategia"], correct: 0 }
    ],
    aiContext: "Reflejar a Jesús, compasión y testimonio final."
  }
];

export default function LiderazgoInteractive() {
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
  const courseId = 'liderazgo';

  useEffect(() => {
    async function initData() {
      // 1. Obtener sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      // 2. Obtener progreso de lecciones
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', session.user.id);
      
      if (progressData) {
        const completedIds = progressData.map(p => p.lesson_id);
        const completedIndices: number[] = [];
        const unlockedIndices: number[] = [0];

        LESSONS_DATA.forEach((_, idx) => {
          const dbId = `${courseId}-leccion-${idx + 1}`;
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

      // 3. Obtener XP del perfil
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

  // --- Integración con Gemini API ✨ ---
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
    const prompt = `Por favor, explica profundamente la lección "${activeLesson.title}" para un líder cristiano moderno. El contenido base es: ${activeLesson.content}`;
    const system = "Eres un mentor teológico experto en liderazgo servicial. Tu tono es inspirador, sabio y bíblico. Responde en español de forma estructurada.";
    const result = await callGemini(prompt, system);
    setAiExplanation(result);
  };

  const handleAiAnalyzeReflection = async () => {
    const prompt = `El usuario ha reflexionado lo siguiente sobre la lección "${activeLesson.title}": "${reflectionText}". Evalúa su reflexión y ofrece 3 consejos prácticos de liderazgo basados en principios bíblicos.`;
    const system = "Eres un mentor de liderazgo cristiano. Tu objetivo es animar al líder y darle consejos prácticos y profundos basados en su reflexión. Sé breve pero impactante.";
    const result = await callGemini(prompt, system);
    setAiReflectionFeedback(result);
  };

  const handleAiGeneratePrayer = async () => {
    const prompt = `Redacta una oración breve y poderosa basada en la lección "${activeLesson.title}" para que un líder la realice hoy.`;
    const system = "Eres un guía espiritual. Crea oraciones que nazcan del corazón y se alineen con el servicio y la humildad de Cristo.";
    const result = await callGemini(prompt, system);
    setAiPrayer(result);
  };

  // --- Lógica de Avance ---
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

      // Persistir en Supabase
      if (user) {
        const dbId = `${courseId}-leccion-${activeLessonIdx + 1}`;
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
      // Persistir XP en perfil
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
      setQuizError(false);
      addPoints(20);
    } else {
      setQuizError(true);
      setQuizAnswers({});
    }
  };

  // --- Componentes UI ---
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
      <p className="text-indigo-700 font-bold animate-pulse">Consultando al Mentor Espiritual ✨</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-bold animate-pulse">Cargando tu progreso espiritual...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200 max-w-md">
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">Acceso Restringido</h2>
          <p className="text-slate-500 mb-8 font-medium">Debes iniciar sesión para guardar tu progreso y ganar XP en la Academia de Líderes.</p>
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
                  <Trophy className="text-amber-500" /> Academia de Líderes
                </h1>
                <p className="text-slate-500 font-medium mt-1">Tu camino de formación espiritual impulsado por IA ✨</p>
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 min-w-[240px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Experiencia Total</span>
                  <span className="text-indigo-600 font-black">{points} XP</span>
                </div>
                <ProgressBar current={points % 1000} total={1000} color="bg-gradient-to-r from-indigo-500 to-purple-600" />
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
                    <div className={`p-4 rounded-2xl ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : isUnlocked ? <Zap className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
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
            <ProgressBar current={currentStep + 1} total={5} />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-indigo-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-black text-indigo-700 text-sm">{points} XP</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* PASO 0: INTRODUCCIÓN CON EXPLICACIÓN IA ✨ */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1]">{activeLesson.title}</h1>
              <div className="h-2 w-20 bg-indigo-600 rounded-full"></div>
            </div>
            <p className="text-xl text-slate-700 leading-relaxed font-medium">{activeLesson.content}</p>

            <div className="pt-6">
              {!aiExplanation ? (
                <button 
                  onClick={handleAiExplicate}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-5 rounded-[2rem] shadow-xl hover:scale-105 transition-transform"
                >
                  <BrainCircuit className="w-6 h-6" /> Profundizar con IA ✨
                </button>
              ) : (
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem] p-8 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-3 text-indigo-700 mb-2">
                    <ScrollText className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-sm">Perspectiva del Mentor IA ✨</span>
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

        {/* PASO 1: VERSÍCULOS */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-3xl font-black">Base Bíblica</h2>
            <p className="text-slate-500 font-bold">Revela todos los versículos para poder continuar.</p>
            <div className="grid gap-6">
              {activeLesson.verses.map((v, i) => (
                <div 
                  key={i} 
                  onClick={() => !unlockedVerses.includes(i) && (setUnlockedVerses([...unlockedVerses, i]), addPoints(10))}
                  className={`group p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer 
                  ${unlockedVerses.includes(i) ? 'border-indigo-50 bg-indigo-50/20' : 'border-dashed border-slate-200 bg-slate-50'}`}
                >
                  {!unlockedVerses.includes(i) ? (
                    <div className="flex justify-between items-center text-slate-400 font-bold">
                      <span>Revelar {v.ref}</span>
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="animate-in zoom-in-95">
                      <span className="text-indigo-600 font-black text-xs tracking-widest uppercase">{v.ref}</span>
                      <p className="mt-4 text-slate-800 text-xl leading-relaxed italic">"{v.text}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: REFLEXIÓN CON ANÁLISIS IA ✨ */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-3xl font-black">Reflexión Interior</h2>
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 text-indigo-300">{activeLesson.reflectionQuestions[0]}</h3>
                <textarea 
                  className="w-full bg-slate-800/50 rounded-2xl p-6 min-h-[160px] text-lg text-white border-2 border-transparent focus:border-indigo-500 outline-none"
                  placeholder="Escribe tu reflexión obligatoria aquí..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  disabled={reflectionSaved}
                />
                {!reflectionSaved ? (
                  <button 
                    onClick={() => {setReflectionSaved(true); addPoints(30); handleAiAnalyzeReflection();}}
                    disabled={reflectionText.trim().length < 10}
                    className="mt-6 w-full bg-white text-slate-900 font-black py-4 rounded-2xl disabled:opacity-30 hover:bg-indigo-50 transition-colors"
                  >
                    GUARDAR Y ANALIZAR CON IA ✨
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-green-500/20 rounded-2xl flex items-center gap-3 text-green-300 font-bold">
                      <CheckCircle className="w-5 h-5" /> Reflexión guardada con éxito.
                    </div>
                    {aiLoading ? <AiLoadingOverlay /> : (
                      aiReflectionFeedback && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl animate-in fade-in duration-500">
                          <div className="flex items-center gap-2 text-indigo-300 mb-3">
                            <Wand2 className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-widest uppercase">Retroalimentación del Mentor ✨</span>
                          </div>
                          <div className="text-indigo-50 text-base italic whitespace-pre-wrap leading-relaxed">
                            {aiReflectionFeedback}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        )}

        {/* PASO 3: CUESTIONARIO */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black">Evaluación</h2>
              <div className="text-indigo-600 font-black text-sm">
                {Object.keys(quizAnswers).length} / {activeLesson.quiz.length} Correctas
              </div>
            </div>

            {quizError && (
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl flex items-center gap-4 text-red-700 animate-bounce">
                <AlertCircle className="shrink-0" />
                <div>
                  <p className="font-black">¡Respuesta Incorrecta!</p>
                  <p className="text-sm opacity-80">El cuestionario se ha reiniciado. Debes responder todas correctamente para avanzar.</p>
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
                          ${isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 hover:border-indigo-400 opacity-100'}
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

        {/* PASO 4: ACCIÓN FINAL CON ORACIÓN IA ✨ */}
        {currentStep === 4 && (
          <div className="animate-in zoom-in-95 duration-700 text-center space-y-10">
            <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-3xl overflow-hidden relative">
              <div className="relative z-10">
                <Award className="w-20 h-20 text-amber-400 mx-auto mb-6" />
                <h2 className="text-4xl font-black mb-6">¡Lección Dominada!</h2>
                
                <div className="max-w-md mx-auto mb-10">
                  {!aiPrayer ? (
                    <button 
                      onClick={handleAiGeneratePrayer}
                      className="bg-indigo-400/30 hover:bg-indigo-400/50 border border-white/20 p-4 rounded-2xl w-full flex items-center justify-center gap-2 transition-all"
                    >
                      <PrayerIcon className="w-5 h-5 text-indigo-100" />
                      <span className="font-bold">Generar Oración de Cierre ✨</span>
                    </button>
                  ) : (
                    <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 animate-in slide-in-from-top-4">
                      <Quote className="w-8 h-8 text-indigo-300 mx-auto mb-4 opacity-50" />
                      <p className="italic text-lg leading-relaxed mb-4">{aiPrayer}</p>
                      <p className="text-xs font-black text-indigo-200 uppercase tracking-widest">Amén</p>
                    </div>
                  )}
                  {aiLoading && !aiPrayer && <div className="mt-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-white" /></div>}
                </div>

                <button 
                  onClick={completeLesson}
                  className="bg-white text-indigo-700 font-black px-12 py-5 rounded-[2rem] text-xl shadow-2xl hover:scale-105 transition-transform"
                >
                  FINALIZAR Y VOLVER
                </button>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-700 opacity-50"></div>
            </div>
          </div>
        )}

        {/* Navegación Inferior */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto flex justify-between items-center pointer-events-auto">
            <button 
              disabled={currentStep === 0}
              onClick={() => {setCurrentStep(s => s - 1); if (typeof window !== 'undefined') window.scrollTo(0,0);}}
              className="text-slate-400 font-black hover:text-indigo-600 disabled:opacity-0"
            >
              Anterior
            </button>
            
            {currentStep < 4 && (
              <div className="group relative">
                {!canMoveToNext() && (
                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Completa la sección actual para avanzar
                  </div>
                )}
                <button 
                  disabled={!canMoveToNext()}
                  onClick={() => {setCurrentStep(s => s + 1); if (typeof window !== 'undefined') window.scrollTo(0,0);}}
                  className={`px-10 py-4 rounded-2xl font-black flex items-center transition-all shadow-xl
                    ${canMoveToNext() ? 'bg-slate-900 text-white hover:bg-indigo-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
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
