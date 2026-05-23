"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, CheckCircle, Star, Heart, 
  ArrowRight, BookMarked, MessageCircle, Sparkles, 
  Loader2, Lock, ChevronLeft, Check, Quote,
  Trophy, Target, Zap, AlertCircle, RefreshCw, Wand2, BrainCircuit, 
  Info, Users, Flame, ScrollText, GraduationCap, Medal, PhoneCall
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCertificate from './CourseCertificate';
import PlantGrowth from './PlantGrowth';

// --- CONFIGURACIÓN DE LA API DE GEMINI ---
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// Icono personalizado para oración
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

// --- CURRICULUM DE DISCIPULADO DE 10 LECCIONES ---
const LESSONS_DATA = [
  {
    "id": 0,
    "title": "Discípulo",
    "badge": "Lección 1",
    "description": "Aprende el significado de ser un aprendiz y seguidor verdadero de Cristo.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Mateo 28:19-20 (RVR1960)</span>\n                        </div>\n                        <p>Esta fue la gran encomienda que Dios, en la persona de Jesús, nos dejó antes de ascender al cielo. Es lamentable decir que hoy en día, en la iglesia, te puedes encontrar con diferentes tipos de personas y los discípulos reales son escasos.</p>\n                        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 my-6\">\n                            <div class=\"bg-blue-50 border border-blue-100 p-5 rounded-xl\">\n                                <h4 class=\"font-bold text-blue-900 text-sm uppercase tracking-wide mb-2\"><i class=\"fa-solid fa-users text-blue-600 mr-2\"></i>La Multitud de Admiradores</h4>\n                                <p class=\"text-sm text-slate-600\">La Biblia habla de una gran multitud siguiendo a Jesús. Había personas que le admiraban y le seguían a dondequiera que fuera por sus milagros o por curiosidad. Hoy en día abundan los admiradores, pero Jesús no pidió admiradores.</p>\n                            </div>\n                            <div class=\"bg-amber-50 border border-amber-100 p-5 rounded-xl\">\n                                <h4 class=\"font-bold text-amber-900 text-sm uppercase tracking-wide mb-2\"><i class=\"fa-solid fa-user-graduate text-amber-600 mr-2\"></i>El Discípulo Verdadero</h4>\n                                <p class=\"text-sm text-slate-600\">Un discípulo es un <strong>aprendiz</strong>: es aquella persona que voluntariamente decide seguir, vivir y defender activamente la doctrina y los métodos de su Maestro. Decidimos aprender diariamente de Él.</p>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">¿Cómo funciona el discipulado en Cristo?</h3>\n                        <p>Debes comprender que <strong>tú no eres discipulado solo en esta aula de clases</strong>. Desde el momento que dispusiste tu corazón, Dios comenzó una obra transformadora en ti. Estas lecciones son solo la preparación inicial para enfrentar la gran aventura que emprendiste el día que Cristo se apareció en tu vida.</p>\n                        <div class=\"bg-indigo-50 border border-indigo-100 p-5 rounded-xl flex items-start gap-3 my-6\">\n                            <div class=\"text-indigo-600 text-xl\"><i class=\"fa-solid fa-lightbulb\"></i></div>\n                            <div>\n                                <h4 class=\"font-bold text-indigo-950 text-sm\">¡Todo discípulo llega a ser líder!</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600 mt-1\">Mira el ejemplo en <strong>Josué 1:1-9</strong>. Moisés fue el líder de Josué, pero llegado el momento, Josué tuvo el privilegio y la responsabilidad de liderar a Israel. Al vivir el Reino de Dios, toda persona se convierte de una u otra forma en un ejemplo, en un modelo a seguir.</p>\n                            </div>\n                        </div>\n                        <div class=\"bg-slate-50 p-4 rounded-xl border border-slate-200\">\n                            <p class=\"text-xs sm:text-sm italic text-slate-600\">\"Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.\" — 2 Timoteo 1:7</p>\n                        </div>\n                        <p class=\"text-center font-bold text-blue-900 font-serif italic text-base my-4\">\"En la mayoría de los casos, Dios no llama a preparados, Dios prepara a sus llamados.\"</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La diferencia clave: Creyente vs. Discípulo</h3>\n                        <p>La diferencia principal entre un simple creyente y un discípulo radica en la palabra <strong>\"TODO\"</strong> que encontramos en la gran comisión:</p>\n                        <ul class=\"space-y-2 pl-4\">\n                            <li class=\"flex items-start gap-2.5 text-sm\"><i class=\"fa-solid fa-circle-check text-emerald-600 mt-1\"></i> <span><strong>Todas las naciones:</strong> Ir a cualquier lugar sin excusas.</span></li>\n                            <li class=\"flex items-start gap-2.5 text-sm\"><i class=\"fa-solid fa-circle-check text-emerald-600 mt-1\"></i> <span><strong>Todas las cosas:</strong> Obedecer y enseñar todas las órdenes sin acomodarlas a nuestra manera.</span></li>\n                            <li class=\"flex items-start gap-2.5 text-sm\"><i class=\"fa-solid fa-circle-check text-emerald-600 mt-1\"></i> <span><strong>Todos los días:</strong> Vivir el evangelio diariamente, no solo los domingos.</span></li>\n                        </ul>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor, yo te doy gracias por lo que hasta este momento has hecho en mi vida, ayúdame a entender tus planes en mí. Dame la fortaleza necesaria para llegar hasta el final. En el nombre de Jesús tu hijo amado oramos, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Mateo 28:19-20",
        "text": "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén."
      }
    ],
    "reflectionQuestions": [
      "¿Qué cambios necesito hacer en mi rutina diaria para comprometerme a ser un discípulo verdadero todos los días y no solo un admirador?"
    ],
    "quiz": [
      {
        "q": "¿Cuál es la diferencia fundamental que define al discípulo frente al simple creyente de acuerdo al texto?",
        "options": [
          "El creyente conoce la teología y el discípulo sabe de memoria toda la Biblia.",
          "El discípulo obedece, enseña y vive 'todas las cosas' ordenadas por Cristo, 'todos los días' y en 'todo lugar'.",
          "El creyente asiste a los servicios y el discípulo asiste a clases todos los días."
        ],
        "correct": 1
      }
    ],
    "aiContext": "El significado de ser discípulo verdadero, la multitud vs. el aprendiz de Jesús y la obediencia."
  },
  {
    "id": 1,
    "title": "Tiempo de Cambio",
    "badge": "Lección 2",
    "description": "Descubre la necesidad del arrepentimiento y de ordenar tu vida espiritual.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"De modo que, si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— 2 Corintios 5:17 (RVR1960)</span>\n                        </div>\n                        <p>Muchos de los sufrimientos, conflictos e insatisfacciones que has enfrentado se deben enteramente a tus decisiones y acciones pasadas. Somos, al final del día, el fruto de nuestras siembras.</p>\n                        <div class=\"bg-red-50 border border-red-100 p-5 rounded-xl my-4\">\n                            <h4 class=\"font-bold text-red-900 text-sm uppercase mb-2\"><i class=\"fa-solid fa-triangle-exclamation mr-2\"></i>La Ley de la Siembra y la Cosecha</h4>\n                            <p class=\"text-sm text-slate-600\"><strong>Gálatas 6:7</strong> nos dice: <em>\"No os engañéis; Dios no puede ser burlado: pues todo lo que el hombre sembrare, eso también segará.\"</em> Si queremos que nuestra vida cambie, debemos cambiar radicalmente nuestra forma de vivir.</p>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Ordenar la Casa: La parábola de la Dracma Perdida</h3>\n                        <p>En <strong>Lucas 15:8-9</strong>, vemos la historia de la mujer que pierde una dracma. Ella hace tres cosas fundamentales para recuperarla:</p>\n                        <div class=\"space-y-4 my-4\">\n                            <div class=\"flex gap-3\">\n                                <span class=\"bg-indigo-600 text-white font-bold h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1\">1</span>\n                                <div>\n                                    <strong>Enciende la lámpara (Salir de la oscuridad):</strong> La mujer pierde la moneda porque estaba a oscuras. La ausencia de la Palabra en la vida de una persona es total oscuridad. Como dice el <strong>Salmo 119:105</strong>: <em>\"Lámpara es a mis pies tu palabra...\"</em>.\n                                </div>\n                            </div>\n                            <div class=\"flex gap-3\">\n                                <span class=\"bg-indigo-600 text-white font-bold h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1\">2</span>\n                                <div>\n                                    <strong>Barre la casa (Limpiar el desorden y suciedad):</strong> El desorden y la suciedad ocultan lo valioso. Hay cosas en tu vida (felicidad, amor, familia, finanzas) que se perdieron en el desorden espiritual de las tinieblas y que solo la luz de la Palabra te permitirá identificar y restaurar.\n                                </div>\n                            </div>\n                            <div class=\"flex gap-3\">\n                                <span class=\"bg-indigo-600 text-white font-bold h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1\">3</span>\n                                <div>\n                                    <strong>Busca con diligencia:</strong> Implica cambios definitivos. Lo que el enemigo te robó en tu pasado de desorden, Dios te lo devolverá con creces una vez que ordenes tu vida.\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"bg-slate-900 text-white p-6 rounded-2xl my-6\">\n                            <h4 class=\"font-bold text-amber-400 text-sm uppercase tracking-wider mb-3\"><i class=\"fa-solid fa-list-check mr-2\"></i>Identificando el Desorden de la Carne</h4>\n                            <p class=\"text-sm text-slate-300 mb-4\">El apóstol Pablo nos da una lista clara en <strong>Gálatas 5:19-21</strong> sobre las obras de la carne que contradicen el reino de Dios y deben ser eliminadas:</p>\n                            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm\">\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-xmark text-rose-500\"></i> Unión libre (fornicación)</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-xmark text-rose-500\"></i> Relación fuera del matrimonio (adulterio)</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-xmark text-rose-500\"></i> Pornografía e inmoralidad</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-xmark text-rose-500\"></i> Ocultismo (brujería, hechicería, santería)</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-xmark text-rose-500\"></i> Chismes y contiendas</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-xmark text-rose-500\"></i> Robo, mentira y borracheras</div>\n                            </div>\n                        </div>\n                        <p>Recuerda el llamado apostólico en <strong>Hechos 3:19</strong>: <em>\"Así que, arrepentíos y convertíos, para que sean borrados vuestros pecados; para que vengan de la presencia del Señor tiempos de refrigerio...\"</em>.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor te pido la fuerza y el carácter necesario para hacer cambios en mi vida, toma el control de mis sentimientos y emociones, permite sacar todo aquello irreal en mi vida. No quiero nada en mi vida que no provenga de ti, solo quiero tu voluntad. En el nombre de Jesús, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "2 Corintios 5:17",
        "text": "De modo que, si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas."
      }
    ],
    "reflectionQuestions": [
      "¿Qué áreas o 'obras de la carne' en mi vida necesitan ser limpiadas y ordenadas bajo la luz de la Palabra?"
    ],
    "quiz": [
      {
        "q": "¿Cuáles son las dos principales razones analizadas por las que la mujer de Lucas 15 pierde su moneda (dracma)?",
        "options": [
          "Porque era distraída y la casa tenía un piso de arena movediza.",
          "Estaba a oscuras (ausencia de la Palabra) y vivía en suciedad/desorden (obras de la carne).",
          "Porque las amigas y vecinas le habían robado mientras dormía."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La siembra y la cosecha, arrepentimiento, limpieza espiritual y la lámpara de la palabra."
  },
  {
    "id": 2,
    "title": "Seguridad en Él",
    "badge": "Lección 3",
    "description": "Edifica tu vida sobre el fundamento firme de la obediencia a la Roca.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"El temor del hombre pondrá lazo; Mas el que confía en Jehová será exaltado.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Proverbios 29:25 (RVR1960)</span>\n                        </div>\n                        <p>Todos los seres humanos edificamos constantemente cosas en nuestro diario vivir: relaciones familiares, proyectos, matrimonios y nuestro propio carácter. Jesucristo dividió a los constructores en dos tipos muy específicos:</p>\n                        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6 my-6\">\n                            <div class=\"border border-indigo-100 bg-indigo-50/50 p-5 rounded-2xl flex flex-col justify-between\">\n                                <div>\n                                    <h4 class=\"font-serif font-bold text-lg text-indigo-950 mb-2\"><i class=\"fa-solid fa-mountain text-indigo-600 mr-2\"></i>Edificar sobre la Roca</h4>\n                                    <p class=\"text-xs sm:text-sm text-slate-600\">Representa a quien oye las palabras de Jesús y las <strong>hace</strong> (obediencia). Cuando descienda la lluvia, vengan ríos y soplen vientos, la casa no caerá porque sus bases son eternas.</p>\n                                </div>\n                            </div>\n                            <div class=\"border border-rose-100 bg-rose-50/50 p-5 rounded-2xl flex flex-col justify-between\">\n                                <div>\n                                    <h4 class=\"font-serif font-bold text-lg text-rose-950 mb-2\"><i class=\"fa-solid fa-water text-rose-600 mr-2\"></i>Edificar sobre la Arena</h4>\n                                    <p class=\"text-xs sm:text-sm text-slate-600\">Representa a quien oye las palabras pero <strong>no las hace</strong>. Ante las mismas tormentas y vientos de la vida, su caída será estrepitosa y grande será su ruina.</p>\n                                </div>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Las Tormentas son Inevitables</h3>\n                        <p>Note un detalle crítico en las palabras de Jesús: <strong>ambas casas experimentaron exactamente las mismas tormentas</strong>. Cristo no te promete una vida libre de tormentas o dificultades —vivimos en un mundo complejo— pero te asegura que en Él prevalecerás y nada definitivo te hará daño si edificas sobre Su voluntad.</p>\n                        <div class=\"bg-blue-950 text-white p-6 rounded-2xl\">\n                            <h4 class=\"font-bold text-amber-400 text-sm uppercase tracking-wider mb-2\"><i class=\"fa-solid fa-shield-halved mr-2\"></i>La Promesa Activa</h4>\n                            <p class=\"text-xs sm:text-sm leading-relaxed text-slate-200\">Como le fue dicho a Josué (Josué 1:5): <em>\"Nadie te podrá hacer frente en todos los días de tu vida; como estuve con Moisés, estaré contigo; no te dejaré, ni te desamparará\"</em>. Solamente esfuérzate, sé valiente y medita de día y de noche en el libro de la ley.</p>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Dios mío y Señor mío, quiero confiar ciegamente en ti, quiero que tú dirijas mi camino. Quiero descansar en tus brazos y saber que todo va a estar bien. Yo rechazo la duda y la inseguridad. Abrazo tus promesas porque sé que tú eres fiel y verdadero. Reafirmo mi compromiso contigo y sé que nada me apartará de tu amor y de tus propósitos, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Proverbios 29:25",
        "text": "El temor del hombre pondrá lazo; Mas el que confía en Jehová será exaltado."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo puedo fortalecer mi obediencia práctica para asegurar que mi vida esté edificada sobre la Roca ante las tormentas?"
    ],
    "quiz": [
      {
        "q": "¿Qué determina la diferencia en el resultado final entre la casa sobre la roca y la casa sobre la arena?",
        "options": [
          "La fuerza de la tormenta que golpeó a cada una de manera diferente.",
          "Los materiales decorativos que usaron en el techo.",
          "El fundamento: uno oyó y obedeció (roca), el otro oyó pero no actuó (arena)."
        ],
        "correct": 2
      }
    ],
    "aiContext": "Edificar sobre la roca (obediencia) vs. sobre la arena (oír sin hacer) y enfrentar tormentas de fe."
  },
  {
    "id": 3,
    "title": "Decisiones",
    "badge": "Lección 4",
    "description": "Aprende a tomar decisiones sabias y firmes basadas en las Escrituras.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"A los cielos y a la tierra llamo por testigos hoy contra vosotros, que os he puesto delante la vida y la muerte, la bendición y la maldición; escoge, pues, la vida, para que vivas tú y tu descendencia.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Deuteronomio 30:19 (RVR1960)</span>\n                        </div>\n                        <p>Nuestra vida actual es la suma de nuestras decisiones pasadas. Si deseamos resultados diferentes y la bendición de Dios, es indispensable que tomemos decisiones basadas en Su Palabra y no en nuestras emociones pasajeras.</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Claves para Decisiones Sabias</h3>\n                        <div class=\"space-y-4\">\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm\">1. Basadas estrictamente en la Escritura</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600 mt-1\">La Biblia es un manual útil para enseñar, redargüir, corregir e instruir en justicia (2 Timoteo 3:16). Evita unirte en yugo desigual en tus relaciones (2 Corintios 6:14) y cuida con diligencia tus amistades (1 Corintios 15:33).</p>\n                            </div>\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm\">2. Nunca basadas en opiniones humanas sin filtro espiritual</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600 mt-1\"><em>\"Hay camino que al hombre le parece derecho; Pero su fin es camino de muerte\"</em> (Proverbios 14:12). Busca consejo maduro en la iglesia (pastores, líderes celulares, supervisores) sabiendo que a veces te dirán cosas que confrontarán tu ego.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm\">3. Decisiones radicales y firmes</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600 mt-1\"><em>\"Determinarás asimismo una cosa, y te será firme...\"</em> (Job 22:28). El carácter de un discípulo se demuestra en la firmeza de sus decisiones, erradicando por completo el doble ánimo.</p>\n                            </div>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor Jesús entiendo que la vida se trata de decisiones, ayúdame y dame la sabiduría para no seguir errando en mi camino. Dame la fortaleza para tomar decisiones definitivas en mi vida. En el nombre Jesús, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Deuteronomio 30:19",
        "text": "A los cielos y a la tierra llamo por testigos hoy contra vosotros, que os he puesto delante la vida y la muerte, la bendición y la maldición; escoge, pues, la vida, para que vivas tú y tu descendencia."
      }
    ],
    "reflectionQuestions": [
      "¿Cuál es la decisión más importante que debo tomar esta semana y cómo puedo filtrarla a través de la Palabra y el consejo espiritual?"
    ],
    "quiz": [
      {
        "q": "¿Qué regalo divino nos da la responsabilidad completa sobre nuestro destino espiritual según el texto?",
        "options": [
          "El estatus económico y la educación universitaria.",
          "El libre albedrío, que nos permite escoger la bendición o la maldición.",
          "La opinión de las personas que nos rodean en la comunidad."
        ],
        "correct": 1
      }
    ],
    "aiContext": "Tomar decisiones basadas en la Biblia, no dejarse guiar por emociones y buscar consejo sabio."
  },
  {
    "id": 4,
    "title": "Relaciones",
    "badge": "Lección 5",
    "description": "Comprende cómo relacionarte sanamente y proteger tu crecimiento espiritual.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Ninguna palabra corrompida salga de vuestra boca, sino la que sea buena para la necesaria edificación... Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Efesios 4:29, 32 (RVR1960)</span>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La Diversidad Humana</h3>\n                        <p>Dios creó al hombre del polvo y a la mujer a partir del hombre, separando las personalidades para luego unirlas milagrosamente en el matrimonio. Somos diferentes pero dependientes unos de otros. Esta diversidad también se manifiesta en las culturas, géneros, etapas del desarrollo y creencias.</p>\n                        <div class=\"bg-slate-50 p-5 rounded-xl border border-slate-200 text-center font-serif italic text-sm my-4\">\n                            \"Entre los individuos, como entre las naciones, el respeto al derecho ajeno es la paz.\" — Benito Juárez\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Ejemplo de Jesús: Zaqueo (Lucas 19:1-9)</h3>\n                        <p>Jesús se relacionó con pecadores sin comprometer Su santidad. Él no nos llamó a escondernos del mundo, sino a ser luz para el mundo. Sin embargo, para relacionarnos adecuadamente, debemos identificar en qué etapa espiritual nos encontramos:</p>\n                        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                            <div class=\"bg-rose-50 border border-rose-100 p-5 rounded-xl\">\n                                <h4 class=\"font-bold text-rose-900 text-sm mb-1\"><i class=\"fa-solid fa-baby mr-2\"></i>Etapa de Recién Convertido</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600\">Al igual que un bebé, necesitas cuidados especiales. No estás listo para exponerte a ciertas influencias. Tu mejor amigo no puede ser alguien del mundo, debes cuidar quién te aconseja, los lugares que frecuentas y cómo te diviertes para evitar el yugo desigual.</p>\n                            </div>\n                            <div class=\"bg-emerald-50 border border-emerald-100 p-5 rounded-xl\">\n                                <h4 class=\"font-bold text-emerald-900 text-sm mb-1\"><i class=\"fa-solid fa-shield-halved mr-2\"></i>Etapa de Madurez Espiritual</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600\">Una vez maduro espiritualmente, tienes las convicciones firmes para entrar en cualquier entorno con el fin de rescatar y ganar a otros para el Reino, en lugar de que ellos te ganen a ti, tal como hizo Cristo con Zaqueo.</p>\n                            </div>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor ayúdame en cada etapa de mi vida espiritual y natural. No quiero frustrarme en mi caminar y deseo llegar hasta donde tú digas. Ayúdame a ser mejor cada día en el nombre de Jesús, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Efesios 4:29, 32",
        "text": "Ninguna palabra corrompida salga de vuestra boca, sino la que sea buena para la necesaria edificación... Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo."
      }
    ],
    "reflectionQuestions": [
      "¿En qué etapa de mi vida espiritual me encuentro y cómo puedo proteger mis relaciones mientras crezco en la fe?"
    ],
    "quiz": [
      {
        "q": "¿Qué precaución fundamental debe tener un cristiano en la etapa de 'Recién Convertido' al relacionarse con su entorno?",
        "options": [
          "Debe aislarse completamente de toda persona y no hablar con nadie.",
          "Debe cuidar sus amistades, quién le aconseja y los lugares que frecuenta, evitando influencias mundanas mientras madura.",
          "Debe predicar en lugares peligrosos inmediatamente para probar su fe."
        ],
        "correct": 1
      }
    ],
    "aiContext": "Relaciones interpersonales, etapas de crecimiento (recién convertido vs. madurez) y evitar el yugo desigual."
  },
  {
    "id": 5,
    "title": "La Palabra de Dios",
    "badge": "Lección 6",
    "description": "Conoce la estructura e inspiración de las Sagradas Escrituras.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— 2 Timoteo 3:16 (RVR1960)</span>\n                        </div>\n                        <p>La Biblia es el libro más vendido de la historia, pero también el más atacado. Imperios y gobiernos dictatoriales (como el nazi en 1933) intentaron destruirla quemándola públicamente, pero como dijo Jesús: <em>\"El cielo y la tierra pasarán, pero mis palabras no pasarán\"</em> (Mateo 24:35).</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Mandamiento y Promesa</h3>\n                        <p>Al acercarnos a la Escritura debemos entender que por lo general las promesas bíblicas están indisolublemente ligadas a un mandamiento. En el <strong>Salmo 1</strong> se prometen grandes cosas (ser como árbol plantado junto a corrientes de aguas, prosperar en todo), pero esta bendición llega porque la persona se delita en la ley de Jehová y medita en ella de día y de noche.</p>\n                        <div class=\"bg-indigo-900 text-white p-6 rounded-2xl\">\n                            <h4 class=\"font-bold text-amber-400 text-sm uppercase mb-3\"><i class=\"fa-solid fa-book-open mr-2\"></i>Estructura y Composición de la Biblia</h4>\n                            <p class=\"text-xs text-slate-300 mb-4\">La palabra 'Biblia' proviene del griego <em>biblión</em> (libros). Fue escrita en un período aproximado de 1600 años por múltiples autores guiados por el Espíritu Santo. Contiene <strong>66 libros</strong> en total:</p>\n                            <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm\">\n                                <div>\n                                    <h5 class=\"font-bold text-amber-300 border-b border-indigo-800 pb-1 mb-2\">Antiguo Testamento (39 libros)</h5>\n                                    <ul class=\"space-y-1 text-slate-200\">\n                                        <li>• Pentateuco (5 libros): Génesis a Deuteronomio</li>\n                                        <li>• Históricos (12 libros): Josué a Ester</li>\n                                        <li>• Poéticos (5 libros): Job a Cantares</li>\n                                        <li>• Profetas Mayores (5 libros): Isaías a Daniel</li>\n                                        <li>• Profetas Menores (12): Oseas a Malaquías</li>\n                                    </ul>\n                                </div>\n                                <div>\n                                    <h5 class=\"font-bold text-amber-300 border-b border-indigo-800 pb-1 mb-2\">Nuevo Testamento (27 libros)</h5>\n                                    <ul class=\"space-y-1 text-slate-200\">\n                                        <li>• Evangelios (4 libros): Mateo a Juan</li>\n                                        <li>• Históricos (1 libro): Hechos</li>\n                                        <li>• Epístolas Paulinas (14 libros): Romanos a Hebreos</li>\n                                        <li>• Epístolas Generales (7): Santiago a Judas</li>\n                                        <li>• Profético (1 libro): Apocalipsis</li>\n                                    </ul>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3\">\n                            <i class=\"fa-solid fa-circle-info text-blue-600 text-xl\"></i>\n                            <span class=\"text-xs sm:text-sm\"><strong>Dato Clave:</strong> Al apóstol Pablo se le atribuyen 15 libros de la Biblia, siendo el autor con mayor número de escritos individuales en el canon.</span>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Padre amado, en el nombre de Jesús te pido que me ayudes a amar tu palabra, aprender, retener y vivir conforme a ella. A no cambiarla ni cuestionarla, que siempre sea mi guía y mi consejo en todo tiempo y en todo momento. Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "2 Timoteo 3:16",
        "text": "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo estableceré un plan constante y devocional para leer la Palabra de Dios diariamente?"
    ],
    "quiz": [
      {
        "q": "¿Cómo se divide estructuralmente la Biblia y cuántos libros tiene en total?",
        "options": [
          "Se divide en 3 testamentos y contiene un total de 100 libros históricos.",
          "Se divide en Antiguo Testamento (39 libros) y Nuevo Testamento (27 libros), sumando un total de 66 libros.",
          "Se divide en Cartas de Moisés (40 libros) y Evangelios (26 libros), para un total de 66 libros."
        ],
        "correct": 1
      }
    ],
    "aiContext": "Estructura de la Biblia (66 libros, 39 AT y 27 NT), la Palabra de Dios como manual e inspiración divina."
  },
  {
    "id": 6,
    "title": "La Oración",
    "badge": "Lección 7",
    "description": "Desarrolla una comunicación íntima y constante con tu Padre Celestial.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Aconteció que estaba Jesús orando en un lugar, y cuando terminó, uno de sus discípulos le dijo: Señor, enséñanos a orar, como también Juan enseñó a sus discípulos.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Lucas 11:1 (RVR1960)</span>\n                        </div>\n                        <p>Jesús, siendo el Hijo de Dios, basaba Su vida ministerial diaria en la oración. Esto impactó tanto a Sus discípulos que le pidieron que les enseñara a hacerlo. Como discípulos, hoy también clamamos: <em>¡Señor, enséñanos a orar!</em></p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Las Cuatro Dimensiones de la Oración</h3>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-4\">\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-indigo-950 text-sm mb-1\"><i class=\"fa-solid fa-heart text-indigo-600 mr-2\"></i>1. Adoración</h4>\n                                <p class=\"text-xs text-slate-600\">Tiempo de agradecimiento, exaltación, comunión pura y cánticos espontáneos que expresan amor y reconocimiento de la soberanía de Dios sobre nuestras vidas.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-indigo-950 text-sm mb-1\"><i class=\"fa-solid fa-comment-slash text-indigo-600 mr-2\"></i>2. Meditar</h4>\n                                <p class=\"text-xs text-slate-600\">Hacer silencio activo para escuchar la voz de Dios en nuestro interior. En toda verdadera comunicación interactúan ambas partes.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-indigo-950 text-sm mb-1\"><i class=\"fa-solid fa-hands-holding-child text-indigo-600 mr-2\"></i>3. Intercesión</h4>\n                                <p class=\"text-xs text-slate-600\">Levantar ruegos y súplicas constantes a favor de otros, de nuestra familia o pidiendo la misericordia de Dios sobre circunstancias de necesidad.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-indigo-950 text-sm mb-1\"><i class=\"fa-solid fa-shield text-indigo-600 mr-2\"></i>4. Guerra Espiritual</h4>\n                                <p class=\"text-xs text-slate-600\">Tomar la autoridad delegada por Jesucristo para reprender las tinieblas, derribar temores y resistir los ataques del diablo vistiendo la armadura de Dios (Efesios 6).</p>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Oración Congregacional e Individual</h3>\n                        <p><strong>Oración Congregacional (Mateo 18:19):</strong> El poder del acuerdo mutuo. Cuando dos o más nos unimos en la Tierra por una causa común en la iglesia, la promesa de respaldo es inmensa.</p>\n                        <p><strong>Oración Individual (Mateo 6:6):</strong> Tu tiempo íntimo con Dios. Es el equivalente de la alcoba de un matrimonio: un lugar secreto, a puerta cerrada, donde abres tu corazón en total vulnerabilidad y el Padre te recompensa en público.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Amado Jesús, tú eres nuestro Señor y nuestro Salvador, queremos hoy acercarnos a ti a través de esta oración y a la vez pedirte que produzcas en nosotros la necesidad de ti a diario. Conocemos la importancia de la oración enséñanos a amarla y practicarla. Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Lucas 11:1",
        "text": "Aconteció que estaba Jesús orando en un lugar, y cuando terminó, uno de sus discípulos le dijo: Señor, enséñanos a orar, como también Juan enseñó a sus discípulos."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo puedo profundizar mi tiempo de oración individual en lo secreto con el Padre?"
    ],
    "quiz": [
      {
        "q": "¿Qué representa la Oración Individual en el 'aposento secreto' (Mateo 6:6)?",
        "options": [
          "Un castigo por desobedecer al líder de la iglesia.",
          "El tiempo de intimidad espiritual profunda con Dios a solas, comparable a la habitación íntima de un matrimonio.",
          "La oración pública que se hace para que todos admiren nuestra elocuencia."
        ],
        "correct": 1
      }
    ],
    "aiContext": "Las dimensiones de la oración (adoración, meditación, intercesión, guerra espiritual) y la intimidad con Dios."
  },
  {
    "id": 7,
    "title": "El Mundo Espiritual",
    "badge": "Lección 8",
    "description": "Comprende la naturaleza tripartita del hombre y el conflicto espiritual.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Por la fe entendemos haber sido constituido el universo por la palabra de Dios, de modo que lo que se ve fue hecho de lo que no se veía.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">—  Hebreos 11:3 (RVR1960)</span>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Naturaleza Tripartita del Ser Humano</h3>\n                        <p>Dios nos creó como seres espirituales y nos diseñó en tres áreas interconectadas (1 Tesalonicenses 5:23):</p>\n                        <div class=\"space-y-3 pl-4\">\n                            <p>🧬 <strong>Cuerpo (Carne):</strong> El área física por la cual expresamos en el mundo natural todo lo que tenemos internamente.</p>\n                            <p>🧠 <strong>Alma:</strong> El asiento de nuestra personalidad, emociones, intelecto, voluntad y sentimientos.</p>\n                            <p>🕊️ <strong>Espíritu:</strong> La dimensión profunda soplada por Dios que nos permite tener comunión directa con nuestro Creador.</p>\n                        </div>\n                        <div class=\"bg-slate-100 p-5 rounded-xl border border-slate-200\">\n                            <h4 class=\"font-bold text-slate-900 text-sm mb-2\"><i class=\"fa-solid fa-scale-unbalanced mr-2\"></i>La Ley de la Inclinación</h4>\n                            <p class=\"text-xs sm:text-sm text-slate-600\">Tu alma siempre se inclinará hacia la parte que tengas más alimentada y fortalecida. Si alimentas tu espíritu con oración, ayuno y Palabra de Dios, tu alma se deleitará en el Señor. Si fortaleces tu carne, tu alma se someterá a los apetitos destructivos.</p>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Conflicto Espiritual Activo</h3>\n                        <p>En el mundo espiritual operan dos reinos antagónicos: el <strong>Reino de la Luz (Dios)</strong> y el <strong>reino de las tinieblas (satanás y sus demonios)</strong>. Como hijos de Dios, enfrentamos maquinaciones sutiles (ataques de duda, desánimo, culpa o tentaciones a través del internet, la música moderna y las redes sociales).</p>\n                        <p>No luches con tus propias fuerzas físicas: <em>\"Las armas de nuestra milicia no son carnales, sino poderosas en Dios para la destrucción de fortalezas\"</em> (2 Corintios 10:4).</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor Jesús hoy confirmo mi pertenencia a tu reino y desecho toda tiniebla de mí, yo reprendo toda obra de satanás y sus demonios y me cubro con la sangre de Cristo, poniendo un vallado alrededor mío y de mi familia en el nombre de Jesús, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Hebreos 11:3",
        "text": "Por la fe entendemos haber sido constituido el universo por la palabra de Dios, de modo que lo que se ve fue hecho de lo que no se veía."
      }
    ],
    "reflectionQuestions": [
      "¿Qué hábitos espirituales o alimentaciones de la carne debo cambiar para inclinar mi alma hacia el Espíritu?"
    ],
    "quiz": [
      {
        "q": "¿Hacia qué área de nuestro ser tripartito se inclina nuestra Alma?",
        "options": [
          "Siempre se inclina automáticamente al mal sin que podamos hacer nada.",
          "Hacia la parte de nuestro ser que tengamos más alimentada y fortalecida (el espíritu o la carne).",
          "Únicamente se inclina a las opiniones que escuchamos en internet."
        ],
        "correct": 1
      }
    ],
    "aiContext": "Naturaleza tripartita (cuerpo, alma, espíritu), alimentar el espíritu y la lucha en el mundo espiritual."
  },
  {
    "id": 8,
    "title": "Alabanza y Adoración",
    "badge": "Lección 9",
    "description": "Descubre el poder de la adoración sincera y la alabanza en la batalla.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Todo lo que respira alabe a Jehová. Aleluya.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Salmos 150:6 (RVR1960)</span>\n                        </div>\n                        <div class=\"bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-center font-serif italic my-4 text-indigo-950\">\n                            \"Un adorador no siempre es músico, y un músico no siempre es adorador.\"\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Poder Espiritual de la Alabanza</h3>\n                        <p>La alabanza es un arma de guerra ofensiva de gran poder. En las escrituras vemos que cuando el pueblo de Israel salía a batallar físicamente, la alabanza iba siempre delante del ejército armada de instrumentos de júbilo y Dios les entregaba la victoria sin necesidad de pelear (2 Crónicas 20:21-22).</p>\n                        <div class=\"bg-slate-50 border border-slate-200 p-5 rounded-xl my-4 flex items-start gap-3\">\n                            <div class=\"text-indigo-600 text-2xl\"><i class=\"fa-solid fa-lock-open\"></i></div>\n                            <div>\n                                <h4 class=\"font-bold text-slate-900 text-sm\">El Terremoto de Pablo y Silas</h4>\n                                <p class=\"text-xs sm:text-sm text-slate-600 mt-1\">En <strong>Hechos 16:25-26</strong> vemos que a medianoche, azotados y encarcelados, Pablo y Silas oraban y cantaban himnos a Dios. De repente, un terremoto sacudió los cimientos de la cárcel, abriendo las puertas y rompiendo todas las cadenas.</p>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La Ofrenda de nuestro Corazón</h3>\n                        <p>Dios nos ha dado todo lo que poseemos (vida, familia, recursos), pero hay algo que Él no nos dará a la fuerza y que debe brotar voluntariamente de lo profundo de nosotros: <strong>nuestra adoración</strong>.</p>\n                        <p>La adoración verdadera es una expresión sincera de amor, honra y gratitud a Dios, convirtiendo todo lo que hacemos y hablamos en un aroma agradable delante de Él, alejados de la superficialidad artística o el espectáculo.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Padre amado en esta hora me acerco confiadamente al trono de la gracia para adorar y bendecir tu nombre, por tu gran amor para conmigo, agradecido por tu misericordia que es grande para con tus hijos, te alabo por todo lo que has hecho en mi vida hasta este día y lo que aun seguirás haciendo. Te amo, te honro y rindo a ti mi corazón, mi alma te bendice y da la gloria a ti Dios Padre, Hijo y Espíritu Santo, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Salmos 150:6",
        "text": "Todo lo que respira alabe a Jehová. Aleluya."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo puedo usar la alabanza y la adoración como un arma espiritual en momentos de dificultad o desánimo?"
    ],
    "quiz": [
      {
        "q": "¿Qué impacto tuvo la alabanza y la adoración de Pablo y Silas en la prisión a medianoche?",
        "options": [
          "Hizo que los guardias se durmieran para que ellos pudieran escapar en silencio.",
          "Desató un gran terremoto espiritual y físico que sacudió los cimientos, abrió las puertas y soltó las cadenas de todos.",
          "Provocó que el rey los liberara por temor a sus voces afinadas."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La alabanza y adoración como armas de guerra espiritual, romper prisiones y adorar de corazón."
  },
  {
    "id": 9,
    "title": "La Identidad en Cristo",
    "badge": "Lección 10",
    "description": "Afirma tu identidad como hijo de Dios y asume tu posición en el Reino.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— 2 Corintios 5:17 (RVR1960)</span>\n                        </div>\n                        <p>Vivimos en una gran crisis de identidad mundial: la gente busca imitar a otros modelos destructivos o cae en confusión ideológica. Quien no tiene clara su identidad pierde su esencia y entra en conflictos interminables de aceptación.</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Ataque a la Identidad</h3>\n                        <p>La primera tentación que satanás lanzó hacia Jesús en el desierto (Mateo 4:3) comenzó confrontando directamente quién era Él: <em>\"Si eres Hijo de Dios...\"</em>. El diablo buscaba verificar si Jesús dudaba de Su esencia. La lección del Maestro es clave: quien tiene clara su identidad no tiene que probar nada a nadie, simplemente la vive.</p>\n                        <div class=\"bg-emerald-950 text-white p-6 rounded-2xl my-6\">\n                            <h4 class=\"font-bold text-amber-400 text-sm uppercase tracking-wider mb-3\"><i class=\"fa-solid fa-crown mr-2\"></i>¿Quién eres tú en realidad?</h4>\n                            <p class=\"text-xs sm:text-sm text-slate-300 mb-4\">Tú no eres lo que tu estatus económico define, ni lo que los demás murmuran o piensen de ti. Tú eres estrictamente lo que Dios dice que eres en Su Palabra:</p>\n                            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm\">\n                                <div class=\"bg-slate-900/40 p-3 rounded-lg border border-emerald-800 flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Eres apto (Colosenses 1:12-13)</div>\n                                <div class=\"bg-slate-900/40 p-3 rounded-lg border border-emerald-800 flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Eres Hijo de Dios (Juan 1:12)</div>\n                                <div class=\"bg-slate-900/40 p-3 rounded-lg border border-emerald-800 flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Eres heredero (Romanos 8:17)</div>\n                                <div class=\"bg-slate-900/40 p-3 rounded-lg border border-emerald-800 flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Más que vencedor (Romanos 8:37)</div>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Asume tu Posición en Cristo</h3>\n                        <p>Al entender tu nueva identidad y posición en el Reino de Dios, debes comenzar a comportarte de forma coherente. Cambia tu vocabulario, tus lecturas, tus prioridades y tu vestir. Aunque el mundo de tinieblas intente presionarte para que vuelvas a ser lo de antes, recuerda firmemente: <strong>¡Tú ya no eres el mismo!</strong> Dios ha cambiado tu historia para siempre.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Padre amado, mi corazón y todo mi ser está agradecido por lo que tú has hecho en mí. Por el cambio que has traído a mi vida y con ellos todas las bendiciones que me han alcanzado. Hoy tomo mi posición y decido vivir conforme a los designios de tu voluntad y así alcanzar mi propósito de vida. Ayúdame a no desmayar te lo pido en el nombre de tu Hijo Jesucristo, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "2 Corintios 5:17",
        "text": "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas."
      }
    ],
    "reflectionQuestions": [
      "¿Qué significa para mí que mi identidad esté definida por lo que Dios dice de mí en Su Palabra y no por el mundo?"
    ],
    "quiz": [
      {
        "q": "¿Qué lección fundamental nos enseña la respuesta de Jesús al ataque de satanás sobre Su identidad en el desierto?",
        "options": [
          "Que debemos hacer milagros públicos inmediatos para silenciar a los que dudan.",
          "Que quien tiene clara su identidad en Dios no siente la necesidad de probarle nada al enemigo ni al mundo.",
          "Que es correcto usar nuestro poder divino para alimentarnos cuando hay necesidad física."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La verdadera identidad en Cristo, resistir los ataques del diablo y vivir como hijos y herederos de Dios."
  },
  {
    "id": 10,
    "title": "Seamos Luz",
    "badge": "Lección 11",
    "description": "Descubre tu llamado a ser luz del mundo y vivir de forma diferente como pueblo de Dios.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder. Ni se enciende una luz y se pone debajo de un almud, sino sobre el candelero, y alumbra a todos los que están en casa.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Mateo 5:14-15 (RVR1960)</span>\n                        </div>\n                        <p>Una de las grandes alegrías del pastor es recordar la noche en que las lámparas de su pueblo encendieron por primera vez. Había llegado la electricidad y con ella, el fin de la oscuridad. Ese es el impacto que tú y yo estamos llamados a generar en un mundo lleno de tinieblas: <strong>HABÍA LLEGADO LA LUZ.</strong></p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Un Pueblo Diferente, un Pueblo de Luz</h3>\n                        <p>Desde el principio, Dios quiso levantar un pueblo modelo. En <strong>Génesis 12:1-3</strong> vemos cómo llamó a Abram para que por medio de él fuesen bendecidas todas las familias de la tierra. Este pueblo debía expresar en su forma de ser y vivir el carácter y la semejanza de Dios (Éxodo 19:4-6).</p>\n                        <p>En Cristo Jesús tú y yo pasamos a ser parte de ese pueblo, y aun mejor: no solo pueblo, sino <strong>hijos de Dios</strong> (Juan 1:12). No fuimos llamados a una religión, sino a ser parte del <strong>Reino de Dios en la tierra.</strong></p>\n                        <div class=\"bg-slate-900 text-white p-6 rounded-2xl my-6\">\n                            <h4 class=\"font-bold text-amber-400 text-sm uppercase tracking-wider mb-3\"><i class=\"fa-solid fa-star mr-2\"></i>Cómo nos diferenciamos en el Reino</h4>\n                            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm\">\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Servimos a los demás</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Amamos a nuestros enemigos</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Somos pacificadores</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Amamos dar más que recibir</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Vivimos por fe</div>\n                                <div class=\"flex items-center gap-2\"><i class=\"fa-solid fa-check text-amber-400\"></i> Sembramos para cosechar</div>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Actúa diferente: Nada contra la corriente</h3>\n                        <p>Siempre tendrás en el diario vivir la oportunidad de ser diferente. Todos actúan de la misma forma, pero tú y yo somos diferentes. <strong>Romanos 12:2</strong> nos dice: <em>\"No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento.\"</em></p>\n                        <div class=\"bg-indigo-50 border border-indigo-100 p-5 rounded-xl my-4\">\n                            <p class=\"font-bold text-indigo-900 text-sm\"><i class=\"fa-solid fa-lightbulb text-indigo-600 mr-2\"></i>SI TU LUZ NO ILUMINA A OTRO, NO ES LUZ.</p>\n                            <p class=\"text-sm text-slate-600 mt-2\">Somos la sal y la luz de la tierra, y una luz en medio de tinieblas no se puede esconder. Cada cosa que hagas, otros la verán.</p>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor gracias por escogerme para ser luz, para traer esperanza a los demás. Muéstrame siempre la forma en la que me debo conducir y nunca permitas que mi llama se apague y caiga en oscuridad. Permíteme alumbrar a muchos y que todos vean mis obras y glorifiquen a Dios. Te lo pido en el nombre de Jesús, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Mateo 5:16",
        "text": "Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre que está en los cielos."
      }
    ],
    "reflectionQuestions": [
      "¿De qué maneras concretas puedo ser luz en mi entorno familiar, laboral o social esta semana?"
    ],
    "quiz": [
      {
        "q": "¿Qué significa que nuestra luz no se pone debajo de un almud?",
        "options": [
          "Que debemos esconder nuestra fe para no ofender a los demás.",
          "Que nuestra vida cristiana debe ser visible e iluminar a los que están a nuestro alrededor.",
          "Que solo debemos brillar dentro del templo los domingos."
        ],
        "correct": 1
      }
    ],
    "aiContext": "Ser luz del mundo, vivir diferente como pueblo de Dios, el llamado a brillar en medio de las tinieblas."
  },
  {
    "id": 11,
    "title": "La Iglesia",
    "badge": "Lección 12",
    "description": "Conoce qué es la iglesia, tu función en el cuerpo de Cristo y la misión que Dios le encomendó.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Porque de la manera que en un cuerpo tenemos muchos miembros, pero no todos los miembros tienen la misma función, así nosotros, siendo muchos, somos un cuerpo en Cristo, y todos miembros los unos de los otros.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Romanos 12:4-5 (RVR1960)</span>\n                        </div>\n                        <p>La iglesia somos aquellos que hemos recibido a Cristo como nuestro Señor y Salvador, pasando a formar parte de la familia de Dios. <strong>La iglesia no es el lugar donde nos reunimos. ¡Tú y yo somos la iglesia!</strong></p>\n                        <div class=\"bg-blue-50 border border-blue-100 p-5 rounded-xl my-4\">\n                            <h4 class=\"font-bold text-blue-900 text-sm uppercase mb-2\"><i class=\"fa-solid fa-users text-blue-600 mr-2\"></i>Somos el Cuerpo de Cristo</h4>\n                            <p class=\"text-sm text-slate-600\">Al aceptar a Cristo, Dios nos ofrece un refugio donde podemos recibir protección, cuidado, seguridad, orientación, disciplina y propósito. Somos miembros los unos de los otros y nos necesitamos mutuamente, como los miembros de un cuerpo.</p>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Beneficios de ser parte de la Iglesia</h3>\n                        <p>La Biblia nos manda a no dejar de congregarnos (Hebreos 10:25). El congregarnos no es solo un mandato, es una necesidad. Es precisamente la iglesia la encargada de guiarte y alimentarte en esta nueva etapa. Dios levantó líderes para perfeccionar a los santos: <strong>Efesios 4:11-12</strong> habla de apóstoles, profetas, evangelistas, pastores y maestros.</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Las 7 Columnas de la Iglesia</h3>\n                        <p>Proverbios 9:1 habla de sabiduría edificando su casa con siete columnas. Jesús, la sabiduría personificada, edificó su iglesia sobre estas columnas:</p>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 my-4\">\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">1</span><span class=\"text-sm font-semibold\">Adoración</span></div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">2</span><span class=\"text-sm font-semibold\">Liderazgo</span></div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">3</span><span class=\"text-sm font-semibold\">Servicio</span></div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">4</span><span class=\"text-sm font-semibold\">Evangelización</span></div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">5</span><span class=\"text-sm font-semibold\">Discipulado</span></div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">6</span><span class=\"text-sm font-semibold\">Koinonia</span></div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-3 rounded-xl sm:col-span-2 flex items-center gap-3\"><span class=\"bg-indigo-600 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0\">7</span><span class=\"text-sm font-semibold\">Mayordomía</span></div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La Misión: La Gran Comisión</h3>\n                        <p><strong>Mateo 28:19-20</strong> — <em>\"Por tanto, id, y haced discípulos a todas las naciones...\"</em> Es en el cumplimiento de esta misión que encontrarás tu propósito de vida. La iglesia no fue fundada por un hombre común; Dios mismo en la persona de Jesús la estableció.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Padre amado en esta hora te damos gracias por tu iglesia. Te pedimos que se nos sea revelada el poder y la autoridad de ella, así como sus beneficios, que la amemos y nos comprometamos con ella. Espíritu Santo pon el sentir en nosotros, que, como miembros del Cuerpo de Cristo, cumplamos con nuestra función en amor. En el nombre de Jesús, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Mateo 16:18",
        "text": "Y yo también te digo, que tú eres Pedro, y sobre esta roca edificaré mi iglesia; y las puertas del Hades no prevalecerán contra ella."
      }
    ],
    "reflectionQuestions": [
      "¿Cuál es mi función específica dentro del cuerpo de Cristo y cómo puedo comprometerme más con la visión de mi iglesia?"
    ],
    "quiz": [
      {
        "q": "Según la lección, ¿qué es la iglesia?",
        "options": [
          "El edificio o templo donde se reúnen los cristianos los domingos.",
          "Los creyentes que han recibido a Cristo, que forman el cuerpo de Cristo y son miembros los unos de los otros.",
          "Una organización religiosa fundada por líderes humanos con reglas propias."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La iglesia como cuerpo de Cristo, las 7 columnas, la gran comisión y el propósito de vida en la iglesia."
  },
  {
    "id": 12,
    "title": "Sexualidad",
    "badge": "Lección 13",
    "description": "Comprende la perspectiva bíblica de la sexualidad, el diseño de Dios y sus principios para una vida plena.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Génesis 1:27 (RVR1960)</span>\n                        </div>\n                        <p>La sexualidad es un tema controversial en nuestra época, con muchos conceptos y opiniones. Para nosotros, la pauta de vida nos la da la Palabra: Dios nos creó <strong>varón y hembra</strong>, y cada uno tiene características únicas que los distinguen.</p>\n                        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 my-4\">\n                            <div class=\"bg-blue-50 border border-blue-100 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-blue-900 text-sm mb-2\"><i class=\"fa-solid fa-dna text-blue-600 mr-2\"></i>Diferencia Corporal</h4>\n                                <p class=\"text-xs text-slate-600\">Diferencias físicas y en el sistema reproductivo que no se pueden cambiar, diseñadas por Dios para cada género.</p>\n                            </div>\n                            <div class=\"bg-purple-50 border border-purple-100 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-purple-900 text-sm mb-2\"><i class=\"fa-solid fa-microscope text-purple-600 mr-2\"></i>Diferencia Genética</h4>\n                                <p class=\"text-xs text-slate-600\">Cromosomas XX (mujer) y XY (hombre) definen el género desde la semana 12 de gestación.</p>\n                            </div>\n                            <div class=\"bg-rose-50 border border-rose-100 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-rose-900 text-sm mb-2\"><i class=\"fa-solid fa-heart text-rose-600 mr-2\"></i>Diferencias Varias</h4>\n                                <p class=\"text-xs text-slate-600\">Diferencias hormonales, emocionales y sentimentales, cada una con un propósito divino.</p>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La Bendición de Esperar y el Diseño de Dios</h3>\n                        <p><strong>Eclesiastés 3:11</strong> nos dice que Dios hizo todo hermoso en su tiempo. La sexualidad dentro del matrimonio es una <em>bendición y un don de Dios</em>, no algo malo. El problema no está en el don, sino en el abuso de este.</p>\n                        <div class=\"bg-emerald-50 border border-emerald-200 p-5 rounded-xl my-4\">\n                            <h4 class=\"font-bold text-emerald-900 text-sm mb-2\"><i class=\"fa-solid fa-ring text-emerald-600 mr-2\"></i>Dentro del Matrimonio</h4>\n                            <p class=\"text-sm text-slate-600\">Cuando se utiliza como Dios lo quiere, dentro del matrimonio, la intimidad sexual es una bendición de Dios y fuente de gozo. Cuando se practica fuera del matrimonio, siempre es doloroso y alguien resulta herido.</p>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Tu Cuerpo es Templo del Espíritu Santo</h3>\n                        <p><strong>1 Corintios 6:19-20</strong>: <em>\"¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo... y que no sois vuestros? Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo.\"</em></p>\n                        <p>Desde que abrimos nuestro corazón al Señor, el Espíritu Santo viene a morar en nuestras vidas. Practicar pecados sexuales fuera del matrimonio es afrentar el templo del Espíritu Santo. Pero con la confesión viene el perdón y la restauración.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Amado Padre. Vengo a tu presencia en el nombre de JESÚS; yo firmemente creo que su sangre me limpia de toda maldad. PADRE quita de mí toda inmoralidad sexual, toda lascivia, todo adulterio. Declaro y decido hoy que mi cuerpo, mi mente, mi alma y mi espíritu son para TI. Hoy renuncio a todo acto fuera de tus principios. En el nombre de JESÚS, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "1 Corintios 6:19-20",
        "text": "¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo, el cual está en vosotros, el cual tenéis de Dios, y que no sois vuestros? Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu, los cuales son de Dios."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo puedo honrar a Dios con mi cuerpo en el área de la sexualidad, aplicando los principios bíblicos que aprendí hoy?"
    ],
    "quiz": [
      {
        "q": "Según la lección, ¿dónde está el problema con la sexualidad?",
        "options": [
          "En el don mismo, ya que el sexo es inherentemente pecaminoso.",
          "No está en el don sino en el abuso de este: usarlo fuera del matrimonio siempre trae consecuencias dolorosas.",
          "En hablar del tema abiertamente en la iglesia."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La sexualidad desde la perspectiva bíblica, el diseño de Dios varón y hembra, la pureza y el matrimonio."
  },
  {
    "id": 13,
    "title": "Nuestra Doctrina",
    "badge": "Lección 14",
    "description": "Conoce los fundamentos de nuestra fe trinitaria, la declaración de fe y las 5 Solas de la Reforma.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Más os hago saber, hermanos, que el evangelio anunciado por mí, no es según hombre; pues yo ni lo recibí ni lo aprendí de hombre alguno, sino por revelación de Jesucristo.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Gálatas 1:11-12 (RVR1960)</span>\n                        </div>\n                        <p>La doctrina es ese principio inmutable e incambiable que <strong>creemos, vivimos y predicamos</strong>. Lo primero que debes saber es que somos una <strong>doctrina trinitaria</strong>.</p>\n                        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 my-4\">\n                            <div class=\"bg-blue-50 border border-blue-200 p-4 rounded-xl text-center\">\n                                <div class=\"text-3xl mb-2\">✝️</div>\n                                <h4 class=\"font-bold text-blue-900 text-sm\">Dios Padre</h4>\n                                <p class=\"text-xs text-slate-600 mt-1\">El Creador, fuente de todo amor y poder</p>\n                            </div>\n                            <div class=\"bg-amber-50 border border-amber-200 p-4 rounded-xl text-center\">\n                                <div class=\"text-3xl mb-2\">🕊️</div>\n                                <h4 class=\"font-bold text-amber-900 text-sm\">Dios Hijo (Jesucristo)</h4>\n                                <p class=\"text-xs text-slate-600 mt-1\">El Salvador, el único mediador</p>\n                            </div>\n                            <div class=\"bg-purple-50 border border-purple-200 p-4 rounded-xl text-center\">\n                                <div class=\"text-3xl mb-2\">🔥</div>\n                                <h4 class=\"font-bold text-purple-900 text-sm\">Dios Espíritu Santo</h4>\n                                <p class=\"text-xs text-slate-600 mt-1\">El Consolador, guía y poder en nosotros</p>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">Las 5 Solas de la Reforma Protestante</h3>\n                        <p>Martín Lutero inició la Reforma Protestante en el siglo XVI. Las cinco solas expresan creencias fundamentales que nos diferencian de sectas y religiones:</p>\n                        <div class=\"space-y-3 my-4\">\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl\">\n                                <p class=\"font-bold text-slate-900 text-sm\">1. Sola Scriptura — Solo por la Escritura</p>\n                                <p class=\"text-xs text-slate-600 mt-1\">Solo la Biblia es la Palabra de Dios autoritativa e inspirada, fuente única de autoridad.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl\">\n                                <p class=\"font-bold text-slate-900 text-sm\">2. Sola Fide — Solo por la Fe</p>\n                                <p class=\"text-xs text-slate-600 mt-1\">La justificación se recibe solo por la fe, sin mezcla de obras merecidas.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl\">\n                                <p class=\"font-bold text-slate-900 text-sm\">3. Sola Gratia — Solo por la Gracia</p>\n                                <p class=\"text-xs text-slate-600 mt-1\">La salvación viene solo por la gracia divina, un favor inmerecido de Dios.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl\">\n                                <p class=\"font-bold text-slate-900 text-sm\">4. Solus Christus — Solo Cristo</p>\n                                <p class=\"text-xs text-slate-600 mt-1\">Jesucristo es el único mediador entre Dios y el hombre. No hay salvación por otro.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-xl\">\n                                <p class=\"font-bold text-slate-900 text-sm\">5. Soli Deo Gloria — La Gloria Solo a Dios</p>\n                                <p class=\"text-xs text-slate-600 mt-1\">Toda la gloria es solo para Dios, pues la salvación se lleva a cabo a través de su voluntad y acción.</p>\n                            </div>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Padre doy gracias por lo que soy, además gracias por todo hombre que hasta hoy has utilizado para dar guía en mi vida cristiana. Nunca permitas que el error y el engaño se haga parte de mí. Tú me llamaste de tinieblas a luz, por esto y muchas razones más te alabo y te doy gloria hoy mañana y siempre, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Hebreos 11:1",
        "text": "Es pues la Fe la certeza de lo que se espera y la convicción de lo que no se ve."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo las 5 Solas de la Reforma me ayudan a entender y defender mi fe frente a otras religiones o sectas?"
    ],
    "quiz": [
      {
        "q": "¿Qué significa 'Sola Gratia' en nuestra declaración de fe?",
        "options": [
          "Que la salvación se obtiene haciendo buenas obras y siendo una persona moral.",
          "Que la salvación viene solo por la gracia divina, un favor inmerecido de Dios, no algo que el pecador haya conseguido.",
          "Que solo los pastores y líderes reciben la gracia completa de Dios."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La doctrina trinitaria, la declaración de fe de la Iglesia de Dios y las 5 Solas de la Reforma Protestante."
  },
  {
    "id": 14,
    "title": "Conociendo al Padre",
    "badge": "Lección 15",
    "description": "Acércate al Padre celestial, conoce su carácter, su amor infinito y cómo Él siempre ha actuado en favor de sus hijos.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, más tenga vida eterna.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Juan 3:16 (RVR1960)</span>\n                        </div>\n                        <p>Dentro de nuestra doctrina trinitaria, es infinito el conocimiento que podemos encontrar del Padre. En nuestra mente finita jamás lo conoceremos en su totalidad, pero hay una eternidad para ello. Acerquémonos a conocer un poco de lo que la Biblia nos muestra de Él.</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">¿Cómo actúa el Padre?</h3>\n                        <p>Una característica con la que siempre se muestra el Padre es como el <strong>dador</strong>:</p>\n                        <div class=\"space-y-3 my-4\">\n                            <div class=\"flex gap-3\">\n                                <span class=\"bg-amber-500 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5\">1</span>\n                                <p class=\"text-sm\"><strong>En el Edén:</strong> Sacrificó de lo suyo para vestir a Adán y Eva al haber pecado y sentirse desnudos.</p>\n                            </div>\n                            <div class=\"flex gap-3\">\n                                <span class=\"bg-amber-500 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5\">2</span>\n                                <p class=\"text-sm\"><strong>Con Abraham:</strong> Dio el carnero para que no sacrificara a su hijo Isaac.</p>\n                            </div>\n                            <div class=\"flex gap-3\">\n                                <span class=\"bg-amber-500 text-white font-bold h-7 w-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5\">3</span>\n                                <p class=\"text-sm\"><strong>El mayor regalo:</strong> Dio su amado, preciado y único Hijo para nuestra salvación.</p>\n                            </div>\n                        </div>\n                        <div class=\"bg-indigo-50 border border-indigo-100 p-5 rounded-xl my-4\">\n                            <p class=\"text-sm text-indigo-900 font-semibold\">Muchos piensan en un padre lejano, pero siempre ha estado cerca, interesado en que la relación no sea quebrantada. Y al estarlo, siempre se ha interesado en restaurarla — esa es la razón por la que envió a su Hijo.</p>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Infinito del Padre</h3>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-3 my-4\">\n                            <div class=\"bg-rose-50 border border-rose-100 p-4 rounded-xl text-center\">\n                                <div class=\"text-2xl mb-1\">❤️</div>\n                                <p class=\"text-sm font-bold text-rose-900\">Amor infinito</p>\n                            </div>\n                            <div class=\"bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center\">\n                                <div class=\"text-2xl mb-1\">🙏</div>\n                                <p class=\"text-sm font-bold text-emerald-900\">Perdón infinito</p>\n                            </div>\n                            <div class=\"bg-blue-50 border border-blue-100 p-4 rounded-xl text-center\">\n                                <div class=\"text-2xl mb-1\">⚡</div>\n                                <p class=\"text-sm font-bold text-blue-900\">Poder infinito</p>\n                            </div>\n                        </div>\n                        <p>Su santidad es absoluta. <strong>Hebreos 12:14</strong> nos dice: <em>\"Seguid la paz con todos, y la santidad, sin la cual nadie verá al Señor.\"</em> Jesús mismo sintió la espalda del Padre al tomar nuestro pecado — el Padre no negocia su santidad.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Padre hoy me acerco a ti confiadamente. Muestra más de ti; quiero conocer más de tu infinito amor, quiero conocer y sentir tu protección como padre, conocer tu poder creador en mi vida. Sé que tú me creaste y soy tu hijo. Muéstrame más de ti, te lo pido en el nombre de tu hijo amado Jesucristo, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Génesis 1:1",
        "text": "En el principio creó Dios los cielos y la tierra."
      }
    ],
    "reflectionQuestions": [
      "¿Qué imagen tenía del Padre antes de esta lección y cómo ha cambiado al conocer su carácter de dador y su amor infinito?"
    ],
    "quiz": [
      {
        "q": "¿Cuál es la característica principal con la que el Padre se muestra a lo largo de toda la Biblia?",
        "options": [
          "Como un Dios distante y difícil de alcanzar que solo actúa cuando merecemos su atención.",
          "Como el dador: siempre despojándose de lo suyo para proveer y restaurar a sus hijos, culminando con el regalo de su Hijo.",
          "Como un juez severo que castiga inmediatamente cualquier error."
        ],
        "correct": 1
      }
    ],
    "aiContext": "El carácter del Padre como dador, su amor infinito, su santidad y la revelación progresiva de Dios."
  },
  {
    "id": 15,
    "title": "Conociendo al Hijo",
    "badge": "Lección 16",
    "description": "Profundiza en el conocimiento de Jesucristo: quién es, su obra en la cruz y el poder de su sangre.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"El es la imagen del Dios invisible, el primogénito de toda creación. Porque en él fueron creadas todas las cosas, las que hay en los cielos y las que hay en la tierra... todo fue creado por medio de él y para él.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Colosenses 1:15-16 (RVR1960)</span>\n                        </div>\n                        <p>El conocer a Jesús, el Hijo de Dios, es una de las revelaciones más poderosas que un cristiano puede experimentar. Lea con atención todos los textos bíblicos y que sea la Palabra acercándonos y revelándonos la persona de Jesús.</p>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">¿Quién es Jesús?</h3>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 my-4\">\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm mb-2\"><i class=\"fa-solid fa-crown text-amber-500 mr-2\"></i>La imagen del Dios invisible</h4>\n                                <p class=\"text-xs text-slate-600\">Colosenses 1:15 — El primogénito de toda creación, en quien fueron creadas todas las cosas.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm mb-2\"><i class=\"fa-solid fa-church text-indigo-500 mr-2\"></i>Cabeza de la Iglesia</h4>\n                                <p class=\"text-xs text-slate-600\">Colosenses 1:18 — Él es la cabeza del cuerpo que es la iglesia, el principio y primogénito de entre los muertos.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm mb-2\"><i class=\"fa-solid fa-scale-balanced text-emerald-500 mr-2\"></i>Nuestro Reconciliador</h4>\n                                <p class=\"text-xs text-slate-600\">Colosenses 1:20 — Por medio de él reconciliar consigo todas las cosas, haciendo la paz mediante la sangre de su cruz.</p>\n                            </div>\n                            <div class=\"bg-slate-50 border border-slate-200 p-4 rounded-xl\">\n                                <h4 class=\"font-bold text-slate-900 text-sm mb-2\"><i class=\"fa-solid fa-key text-rose-500 mr-2\"></i>Plenitud de la Deidad</h4>\n                                <p class=\"text-xs text-slate-600\">Colosenses 2:9 — En él habita corporalmente toda la plenitud de la Deidad. Estamos completos en Él.</p>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">El Poder de su Sacrificio</h3>\n                        <p><strong>Filipenses 2:5-10</strong> nos narra cómo Jesús, siendo Dios, tomó forma de hombre y se humilló hasta la muerte de cruz. Por eso Dios también lo exaltó hasta lo sumo. Hebreos 9:14 nos dice que la sangre de Cristo limpia nuestra conciencia de obras muertas.</p>\n                        <div class=\"bg-red-50 border border-red-200 p-5 rounded-xl my-4\">\n                            <h4 class=\"font-bold text-red-900 text-sm mb-2\"><i class=\"fa-solid fa-droplet text-red-600 mr-2\"></i>La Sangre lo cubre Todo</h4>\n                            <p class=\"text-sm text-slate-700\">En la sangre del Hijo de Dios encontramos todo lo que usted, yo y todas las generaciones venideras podremos necesitar. Es el más grande y poderoso regalo que hemos recibido los mortales.</p>\n                        </div>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Desde lo más profundo de mi ser bendigo y glorifico a Jesucristo, agradecido por todo lo que hizo por nosotros. Si tú moriste por mí, yo quiero vivir para ti. Yo acepto tu sacrificio y recibo tu sangre para perdón de mis pecados y regeneración de mi vida. Yo creo en mi corazón y confieso con mi boca que Jesús es mi Señor y mi Salvador, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Colosenses 2:9-10",
        "text": "Porque en él habita corporalmente toda la plenitud de la Deidad, y vosotros estáis completos en él, que es la cabeza de todo principado y potestad."
      }
    ],
    "reflectionQuestions": [
      "¿Cómo cambia mi vida diaria el saber que en Jesús habita toda la plenitud de la Deidad y que en Él estoy completo?"
    ],
    "quiz": [
      {
        "q": "¿Qué afirma Colosenses 1:15-16 sobre Jesús y la creación?",
        "options": [
          "Que Jesús fue el primero de los seres creados por Dios Padre.",
          "Que Jesús es la imagen del Dios invisible y en Él fueron creadas todas las cosas, en los cielos y en la tierra.",
          "Que Jesús solo tuvo poder creador después de su resurrección."
        ],
        "correct": 1
      }
    ],
    "aiContext": "La persona de Jesucristo, su preeminencia en la creación, su obra reconciliadora en la cruz y la plenitud de la Deidad."
  },
  {
    "id": 16,
    "title": "Conociendo al Espíritu Santo",
    "badge": "Lección 17",
    "description": "Descubre quién es el Espíritu Santo, su obra en tu vida y cómo recibirlo como tu consolador y guía.",
    "content": "<div class=\"space-y-6\">\n                        <div class=\"bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border-l-4 border-amber-500 font-serif italic text-sm sm:text-base\">\n                            <p class=\"mb-3\">\"Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre: el Espíritu de verdad... pero vosotros le conocéis, porque mora con vosotros, y estará en vosotros.\"</p>\n                            <span class=\"block text-right text-xs text-amber-400 font-semibold\">— Juan 14:16-17 (RVR1960)</span>\n                        </div>\n                        <p>El Espíritu Santo es la <strong>tercera persona de la Trinidad</strong>. Es Dios, no es una fuerza activa ni una energía. Él es una persona que habla, que escucha y aun se entristece. Es la promesa que Jesús nos dejó antes de ascender al Padre.</p>\n                        <div class=\"bg-purple-50 border border-purple-200 p-5 rounded-xl my-4\">\n                            <h4 class=\"font-bold text-purple-900 text-sm mb-3\"><i class=\"fa-solid fa-fire text-purple-600 mr-2\"></i>¿Qué significa Consolador (Parácletos)?</h4>\n                            <p class=\"text-sm text-slate-700\">Proviene de la palabra griega <em>paracletos</em>: alguien que está para ayudar en tiempos de dificultad o necesidad. El Espíritu Santo es nuestro consolador, ayudador y consejero.</p>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La Obra del Espíritu Santo en Nuestra Vida</h3>\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 my-4\">\n                            <div class=\"flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200\">\n                                <i class=\"fa-solid fa-check-circle text-purple-600\"></i>\n                                <span class=\"text-sm\">Santificación</span>\n                            </div>\n                            <div class=\"flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200\">\n                                <i class=\"fa-solid fa-check-circle text-purple-600\"></i>\n                                <span class=\"text-sm\">Convence de pecado</span>\n                            </div>\n                            <div class=\"flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200\">\n                                <i class=\"fa-solid fa-check-circle text-purple-600\"></i>\n                                <span class=\"text-sm\">Nos guía a toda verdad</span>\n                            </div>\n                            <div class=\"flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200\">\n                                <i class=\"fa-solid fa-check-circle text-purple-600\"></i>\n                                <span class=\"text-sm\">Nos hace saber lo por venir</span>\n                            </div>\n                            <div class=\"flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200\">\n                                <i class=\"fa-solid fa-check-circle text-purple-600\"></i>\n                                <span class=\"text-sm\">Glorifica a Jesús</span>\n                            </div>\n                            <div class=\"flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200\">\n                                <i class=\"fa-solid fa-check-circle text-purple-600\"></i>\n                                <span class=\"text-sm\">Nos da poder para testificar</span>\n                            </div>\n                        </div>\n                        <h3 class=\"font-serif font-bold text-xl text-slate-900 border-b pb-2\">La Promesa para Todos</h3>\n                        <p><strong>Hechos 2:38-39</strong>: <em>\"Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo para perdón de los pecados; y recibiréis el don del Espíritu Santo. Porque para vosotros es la promesa, y para vuestros hijos, y para todos los que están lejos...\"</em></p>\n                        <div class=\"bg-indigo-50 border border-indigo-200 p-5 rounded-xl my-4\">\n                            <h4 class=\"font-bold text-indigo-900 text-sm mb-2\"><i class=\"fa-solid fa-bolt text-indigo-600 mr-2\"></i>Hechos 1:8</h4>\n                            <p class=\"text-sm text-slate-700\"><em>\"Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra.\"</em></p>\n                            <p class=\"text-xs text-slate-600 mt-2\">Recibirlo es una necesidad para todo cristiano; sin Él será imposible mantenerse en este caminar.</p>\n                        </div>\n                        <p>En el día de Pentecostés (Hechos 2), todos fueron llenos del Espíritu Santo y comenzaron a hablar en otras lenguas, la señal inicial de su recepción. El mundo no lo puede recibir porque no conoce la santidad; nosotros sí podemos recibirlo.</p>\n                        <div class=\"bg-amber-50/50 border border-amber-200 p-5 rounded-2xl mt-8\">\n                            <h4 class=\"font-bold text-amber-900 text-sm flex items-center gap-2 mb-2\"><i class=\"fa-solid fa-hands-praying\"></i> Oración de la Lección</h4>\n                            <p class=\"text-slate-700 italic font-serif text-sm\">\"Señor Jesús, creo en ti y hoy creo también en tu Santo Espíritu, quiero recibirlo y que sea mi guía, mi consolador y ayudador. El que me muestre por dónde he de caminar, que me revele tu palabra y me redarguya cuando sea necesario. En el nombre de Jesús lo recibo, Amén.\"</p>\n                        </div>\n                    </div>",
    "verses": [
      {
        "ref": "Hechos 1:8",
        "text": "Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra."
      }
    ],
    "reflectionQuestions": [
      "¿He recibido el Espíritu Santo? ¿Cómo puedo relacionarme más con Él como persona y dejarle guiar mi vida diaria?"
    ],
    "quiz": [
      {
        "q": "¿Qué es el Espíritu Santo según la lección?",
        "options": [
          "Una fuerza activa o energía divina que Dios envía según las circunstancias.",
          "La tercera persona de la Trinidad, Dios mismo, que habla, escucha y mora en nosotros como Consolador y guía.",
          "Un ángel especial enviado por Jesús para vigilar a los creyentes."
        ],
        "correct": 1
      }
    ],
    "aiContext": "El Espíritu Santo como tercera persona de la Trinidad, su obra, el Parácletos, el bautismo del Espíritu Santo y hablar en lenguas."
  }
];

export default function DiscipuladoInteractive() {
  const [view, setView] = useState('dashboard'); 
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [unlockedLessons, setUnlockedLessons] = useState([0]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

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
  const courseId = 'discipulado';
  const mentorWhatsApp = "593979183618"; // Número de WhatsApp de prueba provisto por el usuario

  useEffect(() => {
    async function initData() {
      // 1. Obtener sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        setHasAccess(false);
        return;
      }
      setUser(session.user);

      // 2. Obtener progreso de lecciones
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id, lessons(course_id)')
        .eq('user_id', session.user.id);
      
      if (progressData) {
        const completedIds = (progressData as any[]).map(p => p.lesson_id);
        const completedIndices: number[] = [];
        const unlockedIndices: number[] = [0];

        // Recuento de lecciones de Discipulado completadas
        const count = (progressData as any[]).filter(p => 
          p.lesson_id.includes('discipulado') || 
          (p.lessons && (Array.isArray(p.lessons) ? p.lessons[0]?.course_id : (p.lessons as any).course_id) === 'discipulado')
        ).length;
        
        for (let i = 0; i < count; i++) {
          completedIndices.push(i);
          if (i + 1 < LESSONS_DATA.length) unlockedIndices.push(i + 1);
        }

        // Compatibilidad por IDs fijos
        LESSONS_DATA.forEach((_, idx) => {
          const dbId = `${courseId}-leccion-${idx + 1}`;
          if (completedIds.includes(dbId) && !completedIndices.includes(idx)) {
            completedIndices.push(idx);
            if (idx + 1 < LESSONS_DATA.length) {
              unlockedIndices.push(idx + 1);
            }
          }
        });

        setCompletedLessons([...new Set(completedIndices)]);
        setUnlockedLessons([...new Set(unlockedIndices)]);
      }

      // 3. Obtener XP del perfil e is_admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, full_name, is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setPoints(profile.xp || 0);
        setProfileData(profile);

        if (profile.is_admin) {
          setHasAccess(true);
        } else {
          // Check explicit user course access
          const { data: access } = await supabase
            .from('user_course_access')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('course_id', courseId)
            .maybeSingle();

          setHasAccess(!!access);
        }
      } else {
        setHasAccess(false);
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
          return `Mentor Espiritual IA: Por ahora, mantengamos un corazón abierto. Medita en las palabras de fe mientras nos conectamos de nuevo. (Detalle técnico: ${error.message || 'Desconexión momentánea'})`;
        }
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(res => setTimeout(res, delay));
      }
    }
    setAiLoading(false);
    return "Error al conectar con el Mentor IA.";
  };

  const handleAiExplicate = async () => {
    const prompt = `Por favor, explica profundamente y en términos sencillos y pastorales la lección de iniciación "${activeLesson.title}". El contenido es: ${activeLesson.content}`;
    const system = "Eres un mentor espiritual de discipulado cristiano sumamente amoroso, comprensivo y sencillo. No uses tecnicismos teológicos complejos. Tu tono es dulce, inspirador y sumamente de bienvenida.";
    const result = await callGemini(prompt, system);
    setAiExplanation(result);
  };

  const handleAiAnalyzeReflection = async () => {
    const prompt = `El nuevo creyente ha escrito en su diario de fe sobre la lección "${activeLesson.title}": "${reflectionText}". Lee su reflexión, ofrécele un comentario de ánimo pastoral muy dulce, y dale 2 consejos prácticos muy sencillos para su caminar espiritual esta semana.`;
    const system = "Eres un mentor de discipulado de la iglesia local. Tu objetivo principal es afirmar, consolar y animar al nuevo creyente. Háblale con ternura, empatía y mucha compasión paternal/maternal. Sé breve, claro y enfocado en la esperanza.";
    const result = await callGemini(prompt, system);
    setAiReflectionFeedback(result);
  };

  const handleAiGeneratePrayer = async () => {
    const prompt = `Crea una oración de fe hermosa, sencilla y personal para que un nuevo creyente ore hoy basada en la lección de crecimiento "${activeLesson.title}" y en lo que aprendió hoy.`;
    const system = "Eres un consejero pastoral espiritual. Redacta oraciones cortas, sinceras, directas al corazón, en español, que nazcan del deseo de estar más cerca de Jesús.";
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
      const newCompleted = [...completedLessons, activeLessonIdx];
      setCompletedLessons(newCompleted);
      
      if (activeLessonIdx + 1 < LESSONS_DATA.length) {
        setUnlockedLessons(prev => [...new Set([...prev, activeLessonIdx + 1])]);
      }

      // Persistir en Supabase
      if (user) {
        const { data: realLessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });

        let dbId = `${courseId}-leccion-${activeLessonIdx + 1}`;
        if (realLessons && realLessons.length > activeLessonIdx) {
          dbId = realLessons[activeLessonIdx].id;
        }

        await supabase
          .from('user_progress')
          .upsert({ 
            user_id: user.id, 
            lesson_id: dbId,
            status: 'completed'
          });
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
      setQuizError(false);
      addPoints(20);
    } else {
      setQuizError(true);
      setQuizAnswers({});
    }
  };

  const getWhatsAppLink = (lessonTitle: string) => {
    const text = `¡Hola! Acabo de completar la lección "${lessonTitle}" del Curso de Discipulado en MBI Academy. Me gustaría conectarme con un mentor de la iglesia para conversar más sobre mi fe y crecimiento espiritual.`;
    return `https://wa.me/${mentorWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  // --- Componentes UI ---
  const ProgressBar = ({ current, total, color="bg-emerald-600" }: { current: number, total: number, color?: string }) => (
    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
  );

  const AiLoadingOverlay = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-emerald-700 font-bold animate-pulse">Abriendo el corazón del Mentor IA ✨</p>
    </div>
  );

  if (loading || hasAccess === null) {
    return (
      <div className="min-h-screen bg-[#FAFDFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600 font-bold animate-pulse">Cargando tu Semilla de Fe...</p>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-md w-full bg-slate-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl backdrop-blur-xl flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/20 text-amber-500 rounded-3xl flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(245,158,11,0.15)] animate-pulse">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter mb-4">
            Acceso Restringido
          </h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">
            Este programa de formación está restringido. Por favor, solicita el acceso a un mentor o administrador de la iglesia para que sea activado en tu plan de crecimiento personal.
          </p>
          <Link 
            href="/" 
            className="w-full py-4.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center"
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-emerald-100/50 max-w-md">
          <Lock className="w-16 h-16 text-emerald-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4 font-outfit">Comenzar Discipulado</h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">Debes iniciar sesión para que podamos guardar tu crecimiento en tu diario de fe y ver crecer tu hermosa planta espiritual.</p>
          <a href="/auth" className="block w-full bg-emerald-600 text-white font-black py-4 rounded-3xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
            EMPEZAR AHORA
          </a>
        </div>
      </div>
    );
  }

  if (showCertificate) {
    return (
      <CourseCertificate 
        courseTitle="Curso de Iniciación al Discipulado" 
        studentName={profileData?.full_name || user?.email || "Discipulo de Cristo"} 
        onClose={() => setShowCertificate(false)} 
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#F4F9F6] p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:scale-110" />
                  Volver al Catálogo
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] font-outfit flex flex-wrap items-center gap-3">
                  <span className="text-gradient-emerald">Mi Camino de Discipulado</span>
                </h1>
                <p className="text-[#64748B] font-medium mt-1">Descubre la fe cristiana y ve crecer tu semilla espiritual paso a paso 🌳✨</p>
              </div>

              {/* Panel de Puntos / XP */}
              <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-emerald-100/50 min-w-[260px] flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-[#64748B] uppercase tracking-widest">Experiencia</span>
                  <span className="text-emerald-600 font-black font-outfit text-lg">{points} XP</span>
                </div>
                <ProgressBar current={points % 1000} total={1000} color="bg-gradient-to-r from-emerald-500 to-amber-500" />
              </div>
            </div>

            {/* --- SECCIÓN PRINCIPAL: PROGRESO Y CRECIMIENTO VISUAL (SEMILLA A ÁRBOL) --- */}
            <div className="grid lg:grid-cols-12 gap-8 mb-12">
              
              {/* Tarjeta del Crecimiento Visual */}
              <div className="lg:col-span-5 bg-white rounded-[3.5rem] p-8 border border-emerald-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 blur-[60px] rounded-full translate-x-12 -translate-y-12"></div>
                <h3 className="text-xs font-black text-emerald-800 bg-emerald-50 px-5 py-1.5 rounded-full uppercase tracking-widest mb-4 z-10">Crecimiento de tu Planta de Fe</h3>
                
                <PlantGrowth completedCount={completedLessons.length} size={250} />
                
                <p className="text-slate-500 font-medium text-xs max-w-xs mt-2 z-10 leading-relaxed">
                  {completedLessons.length === 0 ? "¡Tu fe ha sido plantada! Completa las lecciones para ver cómo tu planta brota, florece y da hermosos frutos espirituales." :
                   completedLessons.length < 5 ? "¡Tu planta está creciendo con fuerza! Sigue adelante para ver abrir sus primeros capullos de promesa." :
                   completedLessons.length < 10 ? "¡Wow! Se acerca la floración. Sigue profundizando en la palabra de Dios." :
                   "¡Felicidades! Has completado las 10 lecciones y tu planta se ha convertido en un hermoso árbol lleno de ricos frutos espirituales."}
                </p>
              </div>

              {/* Tarjeta Informativa / Bienvenida & Mentor Físico */}
              <div className="lg:col-span-7 bg-gradient-to-tr from-emerald-800 to-emerald-950 rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-700/20 blur-[100px] rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 bg-white/10 px-4 py-1.5 rounded-full w-fit border border-white/10 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Nuevo Creyente Portal</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black mb-4 font-outfit leading-tight">
                    {completedLessons.length === 10 ? "¡Has alcanzado la Madurez de Fe!" : "¡Bienvenido a tu Nuevo Caminar!"}
                  </h2>
                  <p className="text-emerald-100/90 font-medium text-base md:text-lg leading-relaxed max-w-xl mb-8">
                    {completedLessons.length === 10 
                      ? "Has finalizado el temario de 10 lecciones de Discipulado. Tu planta espiritual es fructífera. Te animamos a seguir sirviendo a Dios."
                      : `Has completado ${completedLessons.length} de ${LESSONS_DATA.length} lecciones bíblicas. Cada paso que das renueva tu espíritu y tu paz.`
                    }
                  </p>
                </div>

                {/* BOTÓN CONEXIÓN MENTOR O CERTIFICADO */}
                <div className="relative z-10 flex flex-col md:flex-row gap-4 mt-6">
                  {completedLessons.length === LESSONS_DATA.length ? (
                    <button 
                      onClick={() => setShowCertificate(true)}
                      className="w-full md:w-auto px-8 py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider"
                    >
                      <GraduationCap className="w-5 h-5" />
                      Generar Certificado de Fe
                    </button>
                  ) : (
                    <Link
                      href={completedLessons.length > 0 ? getWhatsAppLink(LESSONS_DATA[Math.min(9, completedLessons.length - 1)].title) : `https://wa.me/${mentorWhatsApp}?text=Hola`}
                      target="_blank"
                      className="px-8 py-5 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest shadow-xl"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-700 animate-bounce" />
                      Conectarme con un Mentor Real (WhatsApp)
                    </Link>
                  )}

                  {completedLessons.length < 10 && (
                    <button 
                      onClick={() => startLesson(completedLessons.length)}
                      className="px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20"
                    >
                      <span>Siguiente Lección ({completedLessons.length + 1}/10)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </header>

          {/* --- CATÁLOGO DE LAS 10 LECCIONES --- */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tighter">Lecciones del Camino</h2>
            <div className="text-xs font-black text-[#64748B] uppercase bg-white border px-4 py-1.5 rounded-xl">{completedLessons.length} / 10 Aprobadas</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LESSONS_DATA.map((lesson, idx) => {
              const isUnlocked = unlockedLessons.includes(idx);
              const isCompleted = completedLessons.includes(idx);
              return (
                <div 
                  key={idx}
                  onClick={() => isUnlocked && startLesson(idx)}
                  className={`relative group bg-white rounded-[2rem] p-6 border-2 transition-all duration-300 flex flex-col justify-between min-h-[220px]
                    ${isUnlocked 
                      ? 'border-transparent shadow-md hover:shadow-xl hover:-translate-y-1.5 cursor-pointer' 
                      : 'border-slate-100 opacity-50 grayscale cursor-not-allowed'}`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{lesson.badge}</span>
                      <div className={`p-2.5 rounded-xl ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-[#F4F9F6] text-emerald-600'}`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : isUnlocked ? <Zap className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-[#1E293B] leading-tight mb-2 font-outfit uppercase tracking-tight">{lesson.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">{lesson.description}</p>
                  </div>
                  
                  {isUnlocked && !isCompleted && (
                    <div className="mt-4 text-emerald-600 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                      Iniciar lección <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
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
      
      {/* MENÚ DE ENCABEZADO DE LECCIÓN */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <button onClick={() => setView('dashboard')} className="p-3 hover:bg-[#F4F9F6] rounded-2xl transition-all">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          
          <div className="flex-1 hidden md:block">
            <ProgressBar current={currentStep + 1} total={5} color="bg-emerald-600" />
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-black text-emerald-700 text-sm font-outfit">{points} XP</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* PASO 0: INTRODUCCIÓN CON EXPLICACIÓN IA ✨ */}
        {currentStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{activeLesson.badge} • Nuevo Crecimiento</span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] font-outfit uppercase tracking-tighter">{activeLesson.title}</h1>
              <div className="h-2.5 w-20 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
            </div>
            <div className="text-lg md:text-xl text-[#334155] leading-relaxed font-medium space-y-4" dangerouslySetInnerHTML={{ __html: activeLesson.content }} />

            <div className="pt-6">
              {!aiExplanation ? (
                <button 
                  onClick={handleAiExplicate}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-black py-5 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                  <BrainCircuit className="w-5 h-5 animate-pulse" /> Preguntar al Mentor Espiritual IA ✨
                </button>
              ) : (
                <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-[2.5rem] p-8 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-3 text-emerald-700 mb-2">
                    <ScrollText className="w-5 h-5" />
                    <span className="font-black uppercase tracking-widest text-xs font-outfit">Consejo de tu Mentor Espiritual ✨</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-base">
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
            <h2 className="text-3xl font-black font-outfit uppercase tracking-tight">Promesas Bíblicas</h2>
            <p className="text-slate-500 font-bold text-sm">Haz clic en cada tarjeta para revelar las promesas y bendiciones de Dios para ti hoy:</p>
            
            <div className="grid gap-6">
              {activeLesson.verses.map((v, i) => (
                <div 
                  key={i} 
                  onClick={() => !unlockedVerses.includes(i) && (setUnlockedVerses([...unlockedVerses, i]), addPoints(10))}
                  className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer 
                  ${unlockedVerses.includes(i) ? 'border-emerald-50 bg-[#F4F9F6]/50 shadow-inner' : 'border-dashed border-emerald-200 bg-[#FCFDFD] hover:bg-emerald-50/20'}`}
                >
                  {!unlockedVerses.includes(i) ? (
                    <div className="flex justify-between items-center text-emerald-600 font-black text-xs uppercase tracking-widest">
                      <span>Revelar Promesa {v.ref}</span>
                      <Lock className="w-4 h-4 animate-bounce" />
                    </div>
                  ) : (
                    <div className="animate-in zoom-in-95">
                      <span className="text-emerald-700 font-black text-[10px] tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{v.ref}</span>
                      <p className="mt-5 text-slate-800 text-lg md:text-xl leading-relaxed italic font-medium">"{v.text}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: DIARIO DE FE Y REFLEXIÓN */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <h2 className="text-3xl font-black font-outfit uppercase tracking-tight">Mi Diario de Fe</h2>
            <p className="text-slate-500 font-bold text-sm">Escribe tus pensamientos o dudas en el diario. Nuestro Mentor IA te leerá y te brindará una retroalimentación de consuelo.</p>
            
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 text-emerald-300 font-outfit leading-relaxed">{activeLesson.reflectionQuestions[0]}</h3>
                <textarea 
                  className="w-full bg-slate-800/60 rounded-2xl p-6 min-h-[160px] text-lg text-white border-2 border-transparent focus:border-emerald-500 outline-none font-medium leading-relaxed"
                  placeholder="Querido Dios, hoy aprendí..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  disabled={reflectionSaved}
                />
                {!reflectionSaved ? (
                  <button 
                    onClick={() => {setReflectionSaved(true); addPoints(30); handleAiAnalyzeReflection();}}
                    disabled={reflectionText.trim().length < 10}
                    className="mt-6 w-full bg-white hover:bg-emerald-50 text-slate-900 font-black py-4 rounded-2xl disabled:opacity-30 transition-all text-xs uppercase tracking-widest"
                  >
                    Guardar y Recibir Palabras de Aliento ✨
                  </button>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-300 font-bold text-sm">
                      <CheckCircle className="w-5 h-5" /> Escrito guardado en tu diario personal.
                    </div>
                    {aiLoading ? <AiLoadingOverlay /> : (
                      aiReflectionFeedback && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl animate-in fade-in duration-500">
                          <div className="flex items-center gap-2 text-emerald-300 mb-3">
                            <Wand2 className="w-4 h-4" />
                            <span className="font-bold text-xs tracking-widest uppercase font-outfit">Retroalimentación del Mentor ✨</span>
                          </div>
                          <div className="text-emerald-50 text-base italic whitespace-pre-wrap leading-relaxed font-medium">
                            {aiReflectionFeedback}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        )}

        {/* PASO 3: CUESTIONARIO */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight">Confirmando mi Fe</h2>
              <div className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-xl">
                {Object.keys(quizAnswers).length} / {activeLesson.quiz.length} Correctas
              </div>
            </div>

            {quizError && (
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl flex items-center gap-4 text-red-700 animate-bounce">
                <AlertCircle className="shrink-0" />
                <div>
                  <p className="font-black text-sm uppercase">¡Vuelve a intentarlo!</p>
                  <p className="text-xs font-bold opacity-80 mt-1">El cuestionario se ha reiniciado. Lee las preguntas con calma y responde correctamente.</p>
                </div>
              </div>
            )}

            {activeLesson.quiz.map((item, qIdx) => (
              <div key={qIdx} className="space-y-6">
                <p className="text-lg font-black text-slate-800 font-outfit leading-tight">{qIdx + 1}. {item.q}</p>
                <div className="grid gap-3">
                  {item.options.map((opt, oIdx) => {
                    const isAnswered = quizAnswers[qIdx] !== undefined;
                    const isCorrect = quizAnswers[qIdx] === oIdx;
                    return (
                      <button 
                        key={oIdx}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(qIdx, oIdx)}
                        className={`p-5 rounded-2xl border-2 text-left font-bold text-sm transition-all 
                          ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 hover:border-emerald-400 opacity-100'}
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

        {/* PASO 4: ORACIÓN, CRECIMIENTO DE PLANTA Y CONEXIÓN MENTOR */}
        {currentStep === 4 && (
          <div className="animate-in zoom-in-95 duration-700 text-center space-y-10">
            <div className="bg-gradient-to-tr from-emerald-800 to-emerald-950 p-8 md:p-12 rounded-[4rem] text-white shadow-3xl overflow-hidden relative">
              <div className="relative z-10 space-y-8">
                
                {/* Ícono animado de éxito */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner mb-4">
                    <Award className="w-10 h-10 text-amber-300" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black font-outfit uppercase tracking-tighter">¡Lección Finalizada!</h2>
                  <p className="text-emerald-100/90 text-sm mt-1">Has obtenido +100 XP. Tu fe se fortalece con constancia.</p>
                </div>

                {/* ORACIÓN GENERADA POR LA IA */}
                <div className="max-w-md mx-auto">
                  {!aiPrayer ? (
                    <button 
                      onClick={handleAiGeneratePrayer}
                      className="bg-white/10 hover:bg-white/20 border border-white/15 p-4 rounded-2xl w-full flex items-center justify-center gap-2 transition-all text-xs font-black uppercase tracking-widest"
                    >
                      <PrayerIcon className="w-4 h-4 text-emerald-200" />
                      <span>Recibir Oración del Mentor IA ✨</span>
                    </button>
                  ) : (
                    <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 animate-in slide-in-from-top-4">
                      <Quote className="w-8 h-8 text-emerald-300 mx-auto mb-4 opacity-40" />
                      <p className="italic text-base md:text-lg leading-relaxed mb-4 font-medium">"{aiPrayer}"</p>
                      <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em]">Amén</p>
                    </div>
                  )}
                  {aiLoading && !aiPrayer && <div className="mt-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-white" /></div>}
                </div>

                {/* PUENTE FÍSICO-DIGITAL: CONEXIÓN CON UN MENTOR REAL */}
                <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm shadow-xl space-y-4">
                  <h3 className="font-black text-amber-300 text-xs uppercase tracking-widest font-outfit">✨ Tu Próximo Gran Paso en Comunidad</h3>
                  <p className="text-emerald-100/80 text-xs leading-relaxed font-medium">
                    Queremos caminar contigo. Puedes conectarte directamente con un maestro o mentor presencial de nuestra iglesia local para conversar sobre esta lección o resolver dudas.
                  </p>
                  
                  <Link 
                    href={getWhatsAppLink(activeLesson.title)}
                    target="_blank"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 duration-200"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Chatear con un Líder Local
                  </Link>
                </div>

                {/* BOTÓN CONTINUAR */}
                <div>
                  <button 
                    onClick={completeLesson}
                    className="bg-white text-emerald-950 hover:bg-emerald-50 font-black px-12 py-4.5 rounded-[2rem] text-sm shadow-2xl hover:scale-105 transition-all uppercase tracking-wider"
                  >
                    Completar Lección
                  </button>
                </div>

              </div>
              
              {/* Fondos */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-950 opacity-40"></div>
            </div>
          </div>
        )}

        {/* NAVEGACIÓN INFERIOR PÁGINAS */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-40">
          <div className="max-w-3xl mx-auto flex justify-between items-center pointer-events-auto">
            <button 
              disabled={currentStep === 0}
              onClick={() => {setCurrentStep(s => s - 1); if (typeof window !== 'undefined') window.scrollTo(0,0);}}
              className="text-slate-400 font-black hover:text-emerald-600 disabled:opacity-0 text-sm uppercase tracking-wider"
            >
              Anterior
            </button>
            
            {currentStep < 4 && (
              <div className="group relative">
                {!canMoveToNext() && (
                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-2.5 px-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">
                    Completa la sección actual para avanzar
                  </div>
                )}
                <button 
                  disabled={!canMoveToNext()}
                  onClick={() => {setCurrentStep(s => s + 1); if (typeof window !== 'undefined') window.scrollTo(0,0);}}
                  className={`px-10 py-4.5 rounded-2xl font-black flex items-center transition-all shadow-xl text-xs uppercase tracking-widest
                    ${canMoveToNext() ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
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
