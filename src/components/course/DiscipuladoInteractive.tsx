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
    id: 0,
    title: "El Amor de Dios y la Gracia",
    badge: "Lección 1",
    description: "El regalo incondicional de la salvación.",
    content: "El punto de partida del caminar cristiano es comprender que Dios te ama incondicionalmente. No necesitas ganar su amor a través de buenas obras ni rituales; es un regalo gratuito conocido como Gracia. La gracia significa recibir el favor inmerecido de Dios. A través de Jesús, somos adoptados como hijos e hijas amados, perdonados de todo nuestro pasado y cimentados sobre una base de amor eterno y paz espiritual.",
    verses: [
      { ref: "Juan 3:16", text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna." },
      { ref: "Efesios 2:8–9", text: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe." }
    ],
    reflectionQuestions: ["¿Cómo cambia mi vida saber que el amor de Dios no depende de mis esfuerzos, sino de su gracia infinita?"],
    quiz: [
      { q: "¿Cómo se define la 'Gracia' de Dios?", options: ["Un premio por ser perfectos", "Un favor inmerecido y gratuito", "Una ley estricta", "Un título académico"], correct: 1 },
      { q: "Según Juan 3:16, ¿cuál fue la mayor muestra de amor de Dios?", options: ["Crear los planetas", "Enviar a su Hijo único", "Dar riquezas", "Predicar en el desierto"], correct: 1 },
      { q: "Según Efesios 2:8-9, la salvación es...", options: ["Por buenas obras", "Por medio de la fe, como un don de Dios", "Por antigüedad", "Por conocimientos teológicos"], correct: 1 },
      { q: "¿Por qué la salvación no es por obras?", options: ["Para que nadie se gloríe o presuma", "Porque es muy difícil hacer buenas obras", "Porque Dios no quiere que hagamos nada", "Porque las obras no agradan a Dios"], correct: 0 },
      { q: "¿Cuál es el cimiento de nuestra fe?", options: ["El esfuerzo personal", "El temor a la ley", "El amor incondicional y gracia de Dios", "La opinión de otros"], correct: 2 }
    ],
    aiContext: "El amor incondicional, la gracia redentora y dejar atrás la culpa por las fallas del pasado."
  },
  {
    id: 1,
    title: "Salvación por Fe",
    badge: "Lección 2",
    description: "Entender la redención por medio de Jesucristo.",
    content: "La salvación consiste en ser restaurado en nuestra relación con Dios. A través del pecado, la humanidad se distanció de su Creador, pero Jesucristo pagó el precio de ese alejamiento al morir en la cruz. Su sacrificio nos limpia y nos declara justos ante el Padre. Para recibir este perdón, solo necesitamos confesar a Jesús como Señor y creer de corazón que resucitó. La fe es la mano que toma la salvación ofrecida.",
    verses: [
      { ref: "Romanos 10:9", text: "Que si confesares con tu boca que Jesús es el Señor, y creyeres en tu corazón que Dios le levantó de los muertos, serás salvo." },
      { ref: "Romanos 5:1", text: "Justificados, pues, por la fe, tenemos paz para con Dios por medio de nuestro Señor Jesucristo." }
    ],
    reflectionQuestions: ["¿Qué significa para mí que Jesús haya cargado con mis errores y me declare justo y en paz con Dios?"],
    quiz: [
      { q: "¿Qué significa ser 'Justificados'?", options: ["Buscar excusas para pecar", "Ser declarados inocentes y justos por Dios", "Tener razón en una discusión", "Ganar mucho dinero"], correct: 1 },
      { q: "Según Romanos 10:9, ¿qué dos cosas se necesitan para ser salvos?", options: ["Confesar con la boca y creer con el corazón", "Tener estudios y saber hebreo", "Pagar ofrendas y servir", "Ir a la iglesia todos los días"], correct: 0 },
      { q: "¿Por qué Jesús murió en la cruz?", options: ["Para dar un ejemplo moral", "Para pagar por el pecado y darnos paz con el Padre", "Para derrotar a los gobernantes de Roma", "Para fundar una religión"], correct: 1 },
      { q: "¿Qué obtenemos de la justificación por fe según Romanos 5:1?", options: ["Fama instantánea", "Ausencia completa de problemas", "Paz para con Dios por medio de Jesucristo", "Dones especiales"], correct: 2 },
      { q: "¿Cómo se describe la fe en este tema?", options: ["Una fuerza mental abstracta", "La confianza de que Dios ya pagó nuestra redención", "Una duda constante", "Una lista de reglas"], correct: 1 }
    ],
    aiContext: "La salvación gratuita a través de la fe, la expiación de pecados en la cruz y el regalo de la justicia divina."
  },
  {
    id: 2,
    title: "Una Nueva Criatura en Cristo",
    badge: "Lección 3",
    description: "Nuestra nueva identidad y dejar atrás el pasado.",
    content: "Cuando aceptas a Jesús, tu vida experimenta un nuevo nacimiento espiritual. Tu pasado es borrado por completo y Dios te ve como si nunca hubieras pecado. Ahora tienes una nueva identidad: eres coheredero con Cristo y posees el Espíritu de Dios en tu interior. Las conductas viejas, rencores y remordimientos van quedando atrás y el carácter de Jesús empieza a brillar en ti de forma natural.",
    verses: [
      { ref: "2 Corintios 5:17", text: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas." },
      { ref: "Gálatas 2:20", text: "Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí." }
    ],
    reflectionQuestions: ["¿Qué hábitos o formas de pensar viejas siento que Dios está transformando hoy en mi nueva vida?"],
    quiz: [
      { q: "Según 2 Corintios 5:17, cuando estamos en Cristo somos...", options: ["Mejores personas que los demás", "Una nueva criatura", "Perfectos al instante sin fallas", "Personas con dudas constantes"], correct: 1 },
      { q: "¿Qué sucede con las 'cosas viejas' del pasado?", options: ["Permanecen para siempre acusándonos", "Pasaron, y he aquí todas son hechas nuevas", "Se ignoran a medias", "Hay que pagarlas con penitencia"], correct: 1 },
      { q: "Según Gálatas 2:20, ¿quién vive ahora en el creyente?", options: ["El pasado", "Cristo por medio de su Espíritu", "Las opiniones de la gente", "La ley antigua"], correct: 1 },
      { q: "¿Qué define nuestra nueva identidad?", options: ["Nuestros logros humanos", "Ser amados y perdonados en Cristo", "Nuestros bienes materiales", "Nuestra antigua conducta"], correct: 1 },
      { q: "El cambio de carácter en el nuevo creyente es...", options: ["Un proceso guiado por el Espíritu de Dios", "Una obligación forzada", "Imposible de lograr", "Innecesario"], correct: 0 }
    ],
    aiContext: "Nuestra nueva identidad, la redención del pasado y el crecimiento en el carácter amoroso de Jesús."
  },
  {
    id: 3,
    title: "La Oración: Conversar con el Padre",
    badge: "Lección 4",
    description: "Cómo desarrollar una relación diaria y sencilla con Dios.",
    content: "La oración no es un rezo repetitivo ni aburrido; es una conversación íntima, sincera y cercana con tu Padre celestial. A Dios le interesa cada aspecto de tu vida: tus alegrías, dudas, temores y necesidades. No necesitas palabras elocuentes; la sencillez y honestidad de tu corazón es lo que más le agrada. Al orar, no solo pedimos, sino que aprendemos a escuchar la paz y la guía del Señor.",
    verses: [
      { ref: "Mateo 6:6", text: "Mas tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en lo secreto; y tu Padre que ve en lo secreto te recompensará en público." },
      { ref: "Filipenses 4:6", text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." }
    ],
    reflectionQuestions: ["¿Cómo puedo organizar un momento especial del día para conversar con Dios de forma privada y honesta?"],
    quiz: [
      { q: "¿Qué es realmente la oración?", options: ["Una fórmula mágica", "Una conversación cercana con Dios como Padre", "Un monólogo para lucirse", "Un deber solo para líderes"], correct: 1 },
      { q: "Según Mateo 6:6, ¿dónde nos invita Jesús a orar preferiblemente?", options: ["En las esquinas de las calles", "En nuestro aposento privado (lo secreto)", "En megáfonos", "Solo en templos"], correct: 1 },
      { q: "¿Cómo debemos presentar nuestras peticiones según Filipenses 4:6?", options: ["Con desesperación y queja", "Con toda oración y ruego, acompañados de acción de gracias", "Solo mentalmente sin hablar", "Por medio de intermediarios"], correct: 1 },
      { q: "¿Cuál es el antídoto contra el afán y la ansiedad según la Biblia?", options: ["Ignorar las responsabilidades", "La oración constante a Dios", "Comprar cosas", "La autoconfianza"], correct: 1 },
      { q: "¿Qué le agrada a Dios cuando oramos?", options: ["La sencillez y sinceridad de corazón", "Palabras teológicas complejas", "Orar muchas horas seguidas", "El tono de voz imponente"], correct: 0 }
    ],
    aiContext: "Desarrollar una vida de oración sencilla, honesta y sin formalismos, conociendo a Dios como un Padre tierno."
  },
  {
    id: 4,
    title: "La Biblia: Nuestra Guía",
    badge: "Lección 5",
    description: "Las Escrituras como lámpara para caminar seguro.",
    content: "La Biblia es la Palabra inspirada de Dios y el alimento para nuestro espíritu. A través de ella, conocemos el carácter del Señor, sus hermosas promesas y los principios prácticos para tomar buenas decisiones. Al leer la Biblia con regularidad, nuestra mente es renovada, aprendemos a diferenciar lo correcto y experimentamos aliento y fortaleza en momentos difíciles.",
    verses: [
      { ref: "Salmo 119:105", text: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." },
      { ref: "2 Timoteo 3:16", text: "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia." }
    ],
    reflectionQuestions: ["Las Escrituras nos guían y alimentan. ¿Cómo incorporaré la lectura bíblica en mi vida diaria?"],
    quiz: [
      { q: "¿Cómo describe el Salmo 119:105 a la Palabra de Dios?", options: ["Un libro histórico complejo", "Lámpara a nuestros pies y lumbrera al camino", "Una recopilación de mitos", "Una ley inalcanzable"], correct: 1 },
      { q: "Según 2 Timoteo 3:16, toda la Escritura es...", options: ["Inspirada por Dios", "Solo escrita por hombres sin guía", "Útil solo para expertos", "Incomprensible"], correct: 0 },
      { q: "¿Para qué es útil la Palabra de Dios?", options: ["Para enseñar, corregir e instruir en justicia", "Para debatir y juzgar a los demás", "Para decoración", "Para ahuyentar problemas mágicamente"], correct: 0 },
      { q: "¿Por qué es importante leer la Biblia habitualmente?", options: ["Para cumplir con un requisito religioso", "Para alimentar el espíritu y guiar nuestras decisiones", "Para sabernos de memoria datos históricos", "Para impresionar a los líderes"], correct: 1 },
      { q: "¿Cómo se debe recibir la Palabra de Dios?", options: ["Con duda", "Con fe, obediencia y un corazón dispuesto", "Con aburrimiento", "Solo en ocasiones especiales"], correct: 1 }
    ],
    aiContext: "La lectura bíblica constante como guía de vida, las promesas divinas y el fortalecimiento de la fe."
  },
  {
    id: 5,
    title: "El Espíritu Santo",
    badge: "Lección 6",
    description: "Nuestro consolador, maestro y fuente de poder.",
    content: "Jesús no nos dejó huérfanos. Al ascender al cielo, envió al Espíritu Santo para que viva dentro de nosotros de forma permanente. Él es tu Consolador, Guía y Maestro Personal. Su presencia te ayuda a comprender las Escrituras, te da el poder necesario para superar el pecado, te consuela en el dolor y produce frutos hermosos en tu carácter como el amor, el gozo, la paz y la paciencia.",
    verses: [
      { ref: "Juan 14:16–17", text: "Y yo rogaré al Padre, y os dará otro Consolador, para que esté con vosotros para siempre: el Espíritu de verdad." },
      { ref: "Gálatas 5:22–23", text: "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza." }
    ],
    reflectionQuestions: ["¿En qué áreas de mi vida siento que necesito la guía y el consuelo del Espíritu Santo hoy?"],
    quiz: [
      { q: "¿Quién es el Espíritu Santo?", options: ["Una energía abstracta impersonal", "Dios mismo habitando en el creyente", "Un ángel del pasado", "Una emoción pasajera"], correct: 1 },
      { q: "Según Juan 14:16, ¿cuál es una de las funciones del Espíritu Santo?", options: ["Ser nuestro Consolador eterno", "Traer acusaciones", "Solo obrar en líderes", "Hacernos perfectos al instante"], correct: 0 },
      { q: "¿Cuál es el fruto que el Espíritu produce en nuestro carácter?", options: ["Orgullo y control", "Amor, gozo, paz, paciencia, bondad, fe", "Elocuencia y fama", "Dinero y lujos"], correct: 1 },
      { q: "¿Cómo nos ayuda el Espíritu Santo en nuestro día a día?", options: ["Nos evita todo problema", "Nos da poder, amor, dominio propio y consuelo", "Hace todo nuestro trabajo", "Nos castiga físicamente"], correct: 1 },
      { q: "¿Cuándo habita el Espíritu Santo en el creyente?", options: ["Solo al finalizar toda la LMS", "Cuando acepta de corazón a Jesús como Salvador", "Solo cuando ora de forma elocuente", "Rara vez"], correct: 1 }
    ],
    aiContext: "El Espíritu Santo como Consolador personal, su fruto en el carácter del creyente y la superación de debilidades."
  },
  {
    id: 6,
    title: "La Vida en Comunidad",
    badge: "Lección 7",
    description: "La importancia de congregarse y crecer en la Iglesia.",
    content: "El crecimiento cristiano nunca está diseñado para ser vivido en soledad. Dios nos hizo para vivir en familia. La Iglesia es el cuerpo de Cristo en la tierra, donde compartimos el amor de Dios, nos apoyamos mutuamente en las dificultades, oramos juntos y nos edificamos. Al congregarnos activamente, nos protegemos de los peligros del aislamiento y multiplicamos nuestras alegrías en la fe.",
    verses: [
      { ref: "Hebreos 10:24–25", text: "Y considerémonos unos a otros para estimularnos al amor y a las buenas obras; no dejando de congregarnos, como algunos tienen por costumbre." },
      { ref: "Hechos 2:42", text: "Y perseveraban en la doctrina de los apóstoles, en la comunión unos con otros, en el partimiento del pan y en las oraciones." }
    ],
    reflectionQuestions: ["¿Por qué es importante compartir mi fe e integrarme en la comunidad física de la iglesia local?"],
    quiz: [
      { q: "¿Por qué el cristiano no debe aislarse?", options: ["Porque es peligroso y debilita la fe", "Porque es aburrido estar solo", "Porque está prohibido por ley", "Porque el líder se enoja"], correct: 0 },
      { q: "Según Hebreos 10:24, ¿para qué nos reunimos?", options: ["Para comparar quién es mejor", "Para estimularnos al amor y a las buenas obras", "Para pasar el tiempo", "Para juzgar a los ausentes"], correct: 1 },
      { q: "¿Qué hacían los primeros cristianos en Hechos 2:42?", options: ["Competían en conocimientos", "Perseveraban en la doctrina, comunión, partimiento del pan y oraciones", "Se reunían solo una vez al año", "Discutían por teología"], correct: 1 },
      { q: "¿Cuál es el rol de la iglesia local?", options: ["Un club social común", "Una familia espiritual donde crecer y servir unidos", "Un requisito opcional", "Un lugar solo de sermones estáticos"], correct: 1 },
      { q: "¿Cómo podemos apoyarnos en comunidad?", options: ["Aislándonos", "Orando unos por otros, sirviendo y compartiendo con amor", "Ignorando las necesidades del prójimo", "Criticando los errores ajenos"], correct: 1 }
    ],
    aiContext: "La importancia de la iglesia local, la comunión espiritual fraternal, vencer la timidez e integrarse físicamente."
  },
  {
    id: 7,
    title: "Obediencia y Fidelidad",
    badge: "Lección 8",
    description: "Los frutos de una fe viva en nuestra conducta.",
    content: "La verdadera fe produce un cambio visible en nuestro comportamiento. Jesús enseñó que demostrar amor hacia Él consiste en obedecer sus sabios mandamientos. La obediencia no nace del temor, sino de un corazón agradecido por la salvación. Ser fieles a Dios en lo cotidiano —en nuestro trabajo, finanzas, familia y palabras— es la forma más poderosa de adorarle y honrarle.",
    verses: [
      { ref: "Juan 14:15", text: "Si me amáis, guardad mis mandamientos." },
      { ref: "Santiago 1:22", text: "Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos." }
    ],
    reflectionQuestions: ["¿Qué área práctica de mi conducta me está pidiendo Dios alinear a su Palabra hoy?"],
    quiz: [
      { q: "¿Cuál es el verdadero motor de la obediencia?", options: ["El miedo al castigo", "El agradecimiento y amor a Dios", "La búsqueda de aprobación ajena", "La obligación moral estricta"], correct: 1 },
      { q: "Según Juan 14:15, ¿cómo demostramos nuestro amor a Jesús?", options: ["Cantando muy fuerte", "Guardando sus mandamientos", "Sabiendo mucha teología", "Diciéndolo solo en palabras"], correct: 1 },
      { q: "Santiago 1:22 nos advierte sobre ser...", options: ["Solo oidores y no hacedores", "Muy estrictos", "Ignorantes", "Líderes de inmediato"], correct: 0 },
      { q: "¿Qué significa ser 'hacedor' de la Palabra?", options: ["Llevar la Biblia siempre", "Poner en práctica las enseñanzas de Jesús en el día a día", "Escribir libros", "Hablar de la Biblia constantemente"], correct: 1 },
      { q: "La fidelidad en las pequeñas decisiones cotidianas...", options: ["No tiene importancia", "Muestra la madurez y realidad de nuestra fe", "Es imposible de mantener", "Solo importa para pastores"], correct: 1 }
    ],
    aiContext: "Obediencia por amor y gratitud, fidelidad financiera, ética laboral y ser luz a través del ejemplo práctico."
  },
  {
    id: 8,
    title: "Superando Pruebas",
    badge: "Lección 9",
    description: "Cómo resistir las tentaciones y madurar en la fe.",
    content: "Tener fe en Jesús no significa que no tendremos problemas o tentaciones. Sin embargo, Dios promete que nunca nos enfrentaremos a una tentación más grande de la que podamos soportar, y siempre nos dará la salida. Las dificultades de la vida no vienen para destruirnos, sino para forjar nuestra paciencia, fortalecer nuestras convicciones y moldear un carácter firme.",
    verses: [
      { ref: "1 Corintios 10:13", text: "No os ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir..." },
      { ref: "Santiago 1:12", text: "Bienaventurado el varón que soporta la tentación; porque cuando haya resistido la prueba, recibirá la corona de vida." }
    ],
    reflectionQuestions: ["¿Qué promesa de Dios puedo recordar en momentos de prueba para no perder la paz?"],
    quiz: [
      { q: "¿Promete Dios una vida libre de dificultades?", options: ["Sí, completamente", "No, pero promete estar con nosotros y darnos la victoria", "Solo a los líderes", "Solo si pagamos"], correct: 1 },
      { q: "Según 1 Corintios 10:13, ¿qué promete Dios en la tentación?", options: ["Que nos quitará de la tierra", "Que es fiel y nos dará junto con la tentación la salida", "Que nos castigará de inmediato", "Nada"], correct: 1 },
      { q: "¿Qué beneficio tiene soportar las pruebas según Santiago 1:12?", options: ["Hacernos famosos", "Recibir la corona de vida y fortalecer la fe", "Evitar el trabajo en la iglesia", "Ninguno"], correct: 1 },
      { q: "¿Cuál debe ser nuestra actitud ante la tentación?", options: ["Resistir en nuestras propias fuerzas humanas", "Confiar en la fidelidad de Dios y usar su Palabra", "Ceder y luego culpar a otros", "Ignorarla a medias"], correct: 1 },
      { q: "Las dificultades en la vida de un creyente sirven para...", options: ["Destruir su fe por completo", "Forjar el carácter, paciencia y convicción en Dios", "Pasar el rato", "Demostrar que Dios está lejos"], correct: 1 }
    ],
    aiContext: "Vencer el pecado cotidiano, resistir la presión social y madurar emocionalmente a través de las tormentas de la vida."
  },
  {
    id: 9,
    title: "Compartiendo tu Nueva Fe",
    badge: "Lección 10",
    description: "La gran comisión y tu testimonio personal.",
    content: "El regalo más hermoso que has recibido —la salvación, la paz y el amor de Dios— no es para guardárselo solo para ti. Jesús nos encomendó compartir esta maravillosa noticia con todas las personas. Tu testimonio (la historia sencilla de cómo era tu vida antes y cómo te transformó Jesús) es una herramienta poderosa para iluminar a tu familia, amigos y compañeros de estudio o trabajo. ¡Eres un embajador de esperanza!",
    verses: [
      { ref: "Mateo 28:19", text: "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo." },
      { ref: "1 Pedro 3:15", text: "Y estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros." }
    ],
    reflectionQuestions: ["¿Quién en mi entorno cercano necesita escuchar sobre el amor de Dios y cómo planeo compartir mi testimonio?"],
    quiz: [
      { q: "¿Qué es la 'Gran Comisión'?", options: ["Una recaudación de fondos", "La orden de Jesús de hacer discípulos compartiendo su amor", "Un comité de la iglesia", "Una penitencia estricta"], correct: 1 },
      { q: "Según 1 Pedro 3:15, ¿cómo debemos compartir nuestra fe?", options: ["Con debates acalorados", "Con mansedumbre, reverencia y amor", "Con imposición y enojo", "Solo si nos obligan"], correct: 1 },
      { q: "¿Qué es nuestro testimonio?", options: ["Un tratado teológico complejo", "La historia de cómo Jesús transformó nuestra vida", "Una lista de los pecados ajenos", "Un requisito administrativo"], correct: 1 },
      { q: "¿A quiénes debemos compartir del amor de Dios?", options: ["Solo a desconocidos", "A nuestra familia, amigos y a todo aquel que lo necesite", "Solo a personas perfectas", "A nadie"], correct: 1 },
      { q: "¿Cómo nos describe la Biblia al compartir la fe?", options: ["Como embajadores de reconciliación y esperanza", "Como jueces del mundo", "Como sabios absolutos", "Como personas aburridas"], correct: 0 }
    ],
    aiContext: "El poder del testimonio personal, compartir a Jesús sin juzgar y conectarse con mentores presenciales de la iglesia local."
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
            <p className="text-lg md:text-xl text-[#334155] leading-relaxed font-medium">{activeLesson.content}</p>

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
