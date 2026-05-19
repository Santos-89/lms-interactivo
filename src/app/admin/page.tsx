"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, BookOpen, GraduationCap, TrendingUp, Search, 
  ChevronRight, Calendar, Mail, Shield, Award, 
  Clock, Plus, Trash2, Edit2, ShieldCheck, X, 
  Settings, Database, CheckCircle, AlertCircle, Printer,
  Heart, Trophy, Sparkles, Star, UserCheck, BarChart3
} from "lucide-react";
import Link from "next/link";
import CourseCertificate from "@/components/course/CourseCertificate";

interface Profile {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  xp: number;
  is_admin: boolean;
  created_at: string;
}

interface Lesson {
  id: string;
  title: string;
  course_id: string;
  order_index: number;
}

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allAccess, setAllAccess] = useState<any[]>([]);
  const [allProgress, setAllProgress] = useState<any[]>([]);

  const [showCertificate, setShowCertificate] = useState(false);
  const [certCourse, setCertCourse] = useState("Programa de Diaconado");
  const [authorizedCourses, setAuthorizedCourses] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  useEffect(() => {
    checkAdmin();
    fetchData();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    setIsAdmin(!!profile?.is_admin);
  };

  const fetchData = async () => {
    setLoading(true);
    // Cargar alumnos ordenados por XP
    const { data: profilesData } = await supabase.from('profiles').select('*').order('xp', { ascending: false });
    if (profilesData) setProfiles(profilesData);
    
    // Cargar lecciones
    const { data: lessonsData } = await supabase.from('lessons').select('*').order('course_id', { ascending: true }).order('order_index', { ascending: true });
    if (lessonsData) setLessons(lessonsData);

    // Cargar todas las autorizaciones globales para métricas
    const { data: accessData } = await supabase.from('user_course_access').select('*');
    if (accessData) setAllAccess(accessData);

    // Cargar todos los progresos de lecciones para métricas
    const { data: progressData } = await supabase.from('user_progress').select('*, lessons(course_id)');
    if (progressData) setAllProgress(progressData);

    setLoading(false);
  };

  const loadStudentProgress = async (student: Profile) => {
    setSelectedStudent(student);
    setLoadingProgress(true);
    
    // Cargar progreso
    const { data: progress } = await supabase.from('user_progress').select('*, lessons(title, course_id)').eq('user_id', student.id);
    if (progress) setStudentProgress(progress);
    
    // Cargar cursos autorizados
    const { data: access } = await supabase.from('user_course_access').select('course_id').eq('user_id', student.id);
    if (access) {
      setAuthorizedCourses(access.map((a: any) => a.course_id));
    } else {
      setAuthorizedCourses([]);
    }
    
    setLoadingProgress(false);
  };

  const toggleCourseAccess = async (courseId: string) => {
    if (!selectedStudent) return;
    const isGranted = authorizedCourses.includes(courseId);
    
    const courseNames: Record<string, string> = {
      discipulado: 'Discipulado 🌱',
      diaconado: 'Diaconado 🤝',
      liderazgo: 'Liderazgo 👑',
      maestros: 'Maestros 📖'
    };
    const courseName = courseNames[courseId] || courseId;

    if (isGranted) {
      // Revocar acceso
      const { error } = await supabase
        .from('user_course_access')
        .delete()
        .eq('user_id', selectedStudent.id)
        .eq('course_id', courseId);
      
      if (!error) {
        setAuthorizedCourses(prev => prev.filter(id => id !== courseId));
        setAllAccess(prev => prev.filter(a => !(a.user_id === selectedStudent.id && a.course_id === courseId)));
        
        // Mostrar toast
        setToast({ message: `¡Acceso restringido para ${courseName}!`, type: 'warning' });
        setTimeout(() => setToast(null), 3000);
      } else {
        console.error('Error al revocar acceso al curso:', error);
        alert(`No se pudo revocar el acceso: ${error.message}`);
      }
    } else {
      // Conceder acceso
      const { error } = await supabase
        .from('user_course_access')
        .insert({
          user_id: selectedStudent.id,
          course_id: courseId
        });
      
      if (!error) {
        setAuthorizedCourses(prev => [...prev, courseId]);
        setAllAccess(prev => [...prev, { user_id: selectedStudent.id, course_id: courseId }]);
        
        // Mostrar toast
        setToast({ message: `¡Acceso autorizado para ${courseName}!`, type: 'success' });
        setTimeout(() => setToast(null), 3000);
      } else {
        console.error('Error al conceder acceso al curso:', error);
        alert(`No se pudo conceder el acceso: ${error.message}`);
      }
    }
  };

  const promoteToAdmin = async (id: string, currentStatus: boolean) => {
    if (!confirm(`¿Estás seguro de cambiar los privilegios de administrador para este estudiante?`)) return;
    const { error } = await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', id);
    if (!error) {
      fetchData();
      if (selectedStudent?.id === id) {
        setSelectedStudent(prev => prev ? { ...prev, is_admin: !currentStatus } : null);
      }
    } else {
      console.error('Error al cambiar rol administrativo:', error);
      alert(`No se pudo cambiar el rol administrativo: ${error.message}`);
    }
  };

  // --- CÁLCULO DE MÉTRICAS EN TIEMPO REAL ---
  const courseStats = [
    { id: 'discipulado', name: 'Discipulado', desc: 'Camino de Fe 🌱', color: 'from-emerald-500 to-teal-600', icon: BookOpen },
    { id: 'diaconado', name: 'Diaconado', desc: 'Servicio y Ayuda 🤝', color: 'from-orange-500 to-amber-600', icon: Heart },
    { id: 'liderazgo', name: 'Liderazgo', desc: 'Habilidades Directivas 👑', color: 'from-blue-500 to-indigo-600', icon: Shield },
    { id: 'maestros', name: 'Maestros', desc: 'Enseñanza Bíblica 📖', color: 'from-purple-500 to-pink-600', icon: GraduationCap }
  ].map(c => {
    // Contar usuarios únicos con acceso o progreso en este curso
    const accessUsers = new Set(allAccess.filter(a => a.course_id === c.id).map(a => a.user_id));
    const progressUsers = new Set(allProgress.filter(p => p.lessons?.course_id === c.id || p.lesson_id.includes(c.id)).map(p => p.user_id));
    const totalParticipants = new Set([...accessUsers, ...progressUsers]).size;
    return { ...c, count: totalParticipants };
  });

  const maxParticipantsCount = Math.max(...courseStats.map(c => c.count), 0);
  const popularCourse = maxParticipantsCount > 0 ? courseStats.find(c => c.count === maxParticipantsCount) : null;

  // Estudiante MVP: Alumno con mayor número de lecciones completadas
  const studentMetrics = profiles.map(p => {
    const completedLessonsCount = allProgress.filter(pr => pr.user_id === p.id && pr.status === 'completed').length;
    return {
      profile: p,
      completedCount: completedLessonsCount
    };
  });

  const sortedStudentMetrics = [...studentMetrics].sort((a, b) => {
    if (b.completedCount !== a.completedCount) return b.completedCount - a.completedCount;
    return b.profile.xp - a.profile.xp;
  });

  const topStudent = sortedStudentMetrics.length > 0 && sortedStudentMetrics[0].completedCount > 0 ? sortedStudentMetrics[0] : null;

  const filteredProfiles = profiles.filter(p => {
    const searchStr = `${p.first_name || ''} ${p.last_name || ''} ${p.full_name || ''} ${p.email || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <div className="relative z-10 max-w-md w-full bg-slate-900/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl backdrop-blur-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter mb-4">Acceso Restringido</h1>
          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">No posees privilegios de administrador para ingresar al centro de mando.</p>
          <Link href="/" className="w-full py-4.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-center">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative font-outfit">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none translate-y-1/3"></div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-slate-900/60 backdrop-blur-xl border-b border-white/5 z-40 px-6 md:px-10 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-tr from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black text-white uppercase tracking-wider">Centro de Control</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Iglesia Camino de Altar</p>
          </div>
        </div>
        <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:scale-105 active:scale-95 transition-all">
          <X className="w-5 h-5 text-slate-400" />
        </Link>
      </div>

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Alumnos", val: profiles.length, icon: Users, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
            { label: "Experiencia Global", val: profiles.reduce((a, b) => a + (b.xp || 0), 0).toLocaleString() + " XP", icon: Star, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
            { label: "Lecciones Activas", val: lessons.length, icon: BookOpen, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
            { label: "Administradores", val: profiles.filter(p => p.is_admin).length, icon: Shield, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md shadow-xl hover:translate-y-[-4px] hover:border-white/10 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                <div className={`p-2.5 rounded-xl border ${s.color}`}><s.icon className="w-5 h-5" /></div>
              </div>
              <p className="text-3xl font-black text-white leading-none tracking-tight">{s.val}</p>
            </div>
          ))}
        </div>

        {/* METRICS & LEADERBOARD BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: COURSE ENROLLMENT DYNAMIC BAR CHART */}
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Popularidad de Cursos</h3>
                  <p className="text-xs text-slate-500">Métricas de alumnos con acceso o avance activo</p>
                </div>
              </div>
              {popularCourse && (
                <span className="text-[9px] font-black px-3 py-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl uppercase tracking-widest animate-pulse">
                  MAYOR FLUJO 🔥
                </span>
              )}
            </div>

            <div className="space-y-5 pt-2">
              {courseStats.map((c) => {
                const percent = profiles.length > 0 ? (c.count / profiles.length) * 100 : 0;
                const isPopular = popularCourse?.id === c.id;
                return (
                  <div key={c.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          {c.name}
                          {isPopular && <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-spin" />}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{c.desc}</span>
                      </div>
                      <span className="text-xs font-black text-white bg-slate-950/60 py-1 px-2.5 rounded-lg border border-white/5">
                        {c.count} Alumnos
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(percent, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: STUDENT SPOTLIGHT / MVP BANNER */}
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            {/* Absolute Glowing Circle */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full group-hover:scale-110 transition-all pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Líder de Crecimiento</h3>
                <p className="text-xs text-slate-500">Estudiante con mayor número de lecciones aprobadas</p>
              </div>
            </div>

            {topStudent ? (
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-950/40 border border-white/5 rounded-3xl relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-amber-500 to-yellow-600 p-0.5 shadow-xl shadow-amber-500/15 flex items-center justify-center">
                  <div className="w-full h-full bg-[#020617] rounded-[1.9rem] flex flex-col items-center justify-center text-white">
                    <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-2xl font-black text-white tracking-tight">{topStudent.profile.full_name || topStudent.profile.first_name}</h4>
                  <p className="text-slate-400 font-medium text-xs mb-3">{topStudent.profile.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="text-[10px] font-black px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                      🏆 {topStudent.completedCount} Clases Aprobadas
                    </span>
                    <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">
                      ⚡ {topStudent.profile.xp} XP acumulados
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 font-medium border border-dashed border-white/10 rounded-3xl relative z-10">
                Aún no hay alumnos con lecciones completadas registradas en el sistema.
              </div>
            )}

            <div className="mt-6 md:mt-0 text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2 relative z-10">
              <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" /> Actualizado en tiempo real con Supabase Engine
            </div>
          </div>

        </div>

        {/* STUDENT DIRECTORY CARD */}
        <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white">Directorio de Alumnos</h3>
              <p className="text-xs text-slate-500">Administra privilegios y asigna accesos curso por curso</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar alumno por nombre o email..." 
                className="bg-slate-950/80 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full transition-all"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950/40 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-8 py-5">Estudiante</th>
                  <th className="px-8 py-5">Nivel de Crecimiento</th>
                  <th className="px-8 py-5">Rol del Sistema</th>
                  <th className="px-8 py-5 text-right">Misiones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((p) => {
                    const studentCompleted = allProgress.filter(pr => pr.user_id === p.id && pr.status === 'completed').length;
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white tracking-tighter text-sm uppercase group-hover:scale-105 transition-all">
                              {p.full_name?.charAt(0) || p.email?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white tracking-tight">{p.full_name || 'Estudiante Sin Nombre'}</p>
                              <p className="text-[11px] text-slate-500 font-medium">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-black text-white">{p.xp || 0} XP</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {p.is_admin ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black uppercase">
                              <ShieldCheck className="w-3.5 h-3.5" /> Administrador
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-slate-400 border border-white/5 rounded-lg text-[10px] font-black uppercase">
                              Alumno
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            type="button"
                            onClick={() => loadStudentProgress(p)} 
                            className="inline-flex items-center gap-2 px-5 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all"
                          >
                            <TrendingUp className="w-4 h-4" /> Gestionar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center text-slate-500 font-medium">
                      No se encontraron alumnos que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* STUDENT DETAIL MODAL DRAWER */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* FLOATING TOAST NOTIFICATION */}
          {toast && (
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 rounded-[1.5rem] shadow-2xl border flex items-center gap-3 backdrop-blur-xl animate-in slide-in-from-top-10 fade-in duration-300 ${
              toast.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' 
                : 'bg-red-950/90 border-red-500/30 text-red-400 shadow-red-500/10'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-xs font-black uppercase tracking-wider">{toast.message}</span>
            </div>
          )}

          <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 relative">
            {/* Header Modal */}
            <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 relative border-b border-white/5">
              <button 
                type="button"
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-lg shadow-primary/10">
                  {selectedStudent.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white leading-none tracking-tight mb-2">
                    {selectedStudent.full_name || selectedStudent.first_name}
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/40 p-4 rounded-2xl text-center border border-white/5">
                  <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Experiencia</p>
                  <p className="text-lg font-black text-white">{selectedStudent.xp || 0} XP</p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-2xl text-center border border-white/5">
                  <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Clases Aprobadas</p>
                  <p className="text-lg font-black text-white">{studentProgress.length}</p>
                </div>
                
                {selectedStudent.is_admin ? (
                  <button 
                    type="button"
                    onClick={() => promoteToAdmin(selectedStudent.id, true)}
                    className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 p-4 rounded-2xl text-center flex flex-col items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300"
                  >
                    <Shield className="w-5 h-5 mb-1" />
                    <p className="text-[8px] font-black uppercase">Quitar Admin</p>
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => promoteToAdmin(selectedStudent.id, false)}
                    className="bg-slate-950/40 border border-white/5 text-slate-400 p-4 rounded-2xl text-center flex flex-col items-center justify-center hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    <UserCheck className="w-5 h-5 mb-1" />
                    <p className="text-[8px] font-black uppercase">Hacer Admin</p>
                  </button>
                )}
              </div>

              {/* COURSE ACCESS ASSIGNMENTS */}
              <div className="mt-8 bg-slate-950/40 p-6 rounded-[2rem] border border-white/5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Permisos de Acceso a Cursos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'discipulado', name: 'Discipulado', desc: 'Camino de Fe 🌱', color: 'border-emerald-500/10 hover:border-emerald-500/30' },
                    { id: 'diaconado', name: 'Diaconado', desc: 'Servicio y Ayuda 🤝', color: 'border-orange-500/10 hover:border-orange-500/30' },
                    { id: 'liderazgo', name: 'Liderazgo', desc: 'Habilidades Directivas 👑', color: 'border-blue-500/10 hover:border-blue-500/30' },
                    { id: 'maestros', name: 'Maestros', desc: 'Enseñanza Bíblica 📖', color: 'border-purple-500/10 hover:border-purple-500/30' }
                  ].map((course) => {
                    const hasAccess = authorizedCourses.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 ${
                          hasAccess 
                            ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_4px_25px_rgba(16,185,129,0.05)] scale-[1.02]' 
                            : 'bg-slate-900/60 border-white/5'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-black text-white">{course.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{course.desc}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => toggleCourseAccess(course.id)}
                          className="flex items-center gap-2 cursor-pointer focus:outline-none"
                        >
                          <span className={`text-[8px] font-black uppercase tracking-widest transition-colors duration-300 ${
                            hasAccess ? 'text-emerald-400' : 'text-slate-500'
                          }`}>
                            {hasAccess ? 'Acceso' : 'Restringido'}
                          </span>
                          <div className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 flex items-center ${
                            hasAccess 
                              ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                              : 'bg-slate-950 border border-white/10'
                          }`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
                              hasAccess ? 'translate-x-5' : 'translate-x-0'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                                hasAccess ? 'bg-emerald-500' : 'bg-slate-600'
                              }`}></div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CLASS PROGRESS HISTORY TIMELINE */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-900">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Historial de Clases
                </h4>
                {studentProgress.length >= 3 && (
                  <button 
                    type="button"
                    onClick={() => {
                      setCertCourse(studentProgress[0]?.lessons?.course_id === 'liderazgo' ? "Programa de Liderazgo" : "Programa de Diaconado");
                      setShowCertificate(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/10 hover:scale-105 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" /> Certificado
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {studentProgress.length > 0 ? (
                  studentProgress.map((p: any, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-white mb-1.5">{p.lessons?.title || 'Lección Realizada'}</p>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg tracking-wider ${
                          p.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {p.status === 'completed' ? 'COMPLETADA' : 'EN CURSO'}
                        </span>
                      </div>
                      <CheckCircle className={`w-5 h-5 ${p.status === 'completed' ? 'text-green-400' : 'text-slate-700'}`} />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs font-medium border border-dashed border-white/10 rounded-2xl">
                    Este estudiante no posee registros de clases activas o completadas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCertificate && selectedStudent && (
        <CourseCertificate 
          studentName={selectedStudent.full_name || selectedStudent.first_name || 'Estudiante'}
          courseTitle={certCourse}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
