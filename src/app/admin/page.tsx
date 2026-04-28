"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, BookOpen, GraduationCap, TrendingUp, Search, 
  ChevronRight, Calendar, Mail, Shield, Award, 
  Clock, Plus, Trash2, Edit2, ShieldCheck, X, 
  Settings, Database, CheckCircle, AlertCircle, Printer
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
  
  // Gestión de Lecciones
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState({ title: "", course_id: "liderazgo", order_index: 0 });
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Certificado
  const [showCertificate, setShowCertificate] = useState(false);
  const [certCourse, setCertCourse] = useState("Programa de Diaconado");

  useEffect(() => {
    checkAdmin();
    fetchData();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    setIsAdmin(!!profile?.is_admin);
  };

  const fetchData = async () => {
    setLoading(true);
    
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .order('xp', { ascending: false });
    
    if (profilesData) setProfiles(profilesData);

    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .order('course_id', { ascending: true })
      .order('order_index', { ascending: true });
    
    if (lessonsData) setLessons(lessonsData);
    
    setLoading(false);
  };

  const loadStudentProgress = async (student: Profile) => {
    setSelectedStudent(student);
    setLoadingProgress(true);
    
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*, lessons(title, course_id)')
      .eq('user_id', student.id);
    
    if (progress) setStudentProgress(progress);
    setLoadingProgress(false);
  };

  const promoteToAdmin = async (id: string, currentStatus: boolean) => {
    if (!confirm(`¿Estás seguro de que quieres ${currentStatus ? 'quitar' : 'dar'} permisos de administrador?`)) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', id);
    
    if (!error) fetchData();
  };

  const handleAddLesson = async () => {
    const { error } = await supabase
      .from('lessons')
      .insert([newLesson]);
    
    if (!error) {
      setNewLesson({ title: "", course_id: "liderazgo", order_index: 0 });
      setIsAddingLesson(false);
      fetchData();
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm("¿Eliminar esta lección?")) return;
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) fetchData();
  };

  const filteredProfiles = profiles.filter(p => {
    const searchStr = `${p.first_name} ${p.last_name} ${p.full_name} ${p.email || ''}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Shield className="w-16 h-16 text-slate-800 mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">Acceso Restringido</h1>
        <p className="text-slate-500 mb-8">Esta área es solo para personal autorizado del ministerio.</p>
        <Link href="/" className="bg-primary text-white font-black px-8 py-3 rounded-xl">Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Sidebar / Header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight uppercase">Panel Administrativo</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Gestión Ministerial v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-black text-white uppercase">MBI Internacional</span>
            <span className="text-[10px] text-primary font-bold uppercase">Sincronizado</span>
          </div>
          <div className="w-px h-8 bg-white/5"></div>
          <Link href="/" className="p-3 hover:bg-white/5 rounded-xl transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </Link>
        </div>
      </div>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Estudiantes", val: profiles.length, icon: Users, color: "bg-blue-500" },
            { label: "XP Generado", val: profiles.reduce((a, b) => a + (b.xp || 0), 0).toLocaleString(), icon: TrendingUp, color: "bg-amber-500" },
            { label: "Lecciones", val: lessons.length, icon: BookOpen, color: "bg-emerald-500" },
            { label: "Admins", val: profiles.filter(p => p.is_admin).length, icon: Shield, color: "bg-primary" },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="flex items-center gap-4 relative z-10">
                <div className={`${s.color} p-3 rounded-2xl shadow-lg`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                </div>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${s.color} opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Alumnos List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Users className="text-primary w-6 h-6" /> Directorio de Estudiantes
              </h3>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar alumno..." 
                  className="bg-slate-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-primary/50 w-[240px] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estudiante</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Puntos XP</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="group hover:bg-white/[0.02] transition-all">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-black text-slate-400 group-hover:text-primary transition-colors shadow-inner border border-white/5">
                            {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-black text-white group-hover:text-primary transition-colors">{profile.full_name || profile.first_name || 'Sin nombre'}</span>
                                {profile.is_admin && (
                                    <span className="text-primary flex items-center gap-1.5 font-black uppercase tracking-widest text-[8px] bg-primary/10 px-2 py-0.5 rounded-md"><ShieldCheck className="w-3 h-3" /> ADMIN</span>
                                )}
                            </div>
                            <span className="opacity-20">•</span>
                            <span className={profile.email ? "lowercase text-slate-400 text-[10px]" : "text-amber-500/80 italic text-[9px]"}>{profile.email || '⚠️ correo no sincronizado'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className="font-black text-amber-500">{profile.xp || 0} XP</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => loadStudentProgress(profile)}
                            className="p-2.5 bg-white/5 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                            title="Ver Progreso"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => promoteToAdmin(profile.id, profile.is_admin)}
                            className={`p-2.5 rounded-xl transition-all shadow-sm ${profile.is_admin ? 'bg-primary/20 text-primary' : 'bg-white/5 hover:bg-white/10 text-slate-500'}`}
                            title={profile.is_admin ? "Quitar Admin" : "Hacer Admin"}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar: Gestión de Lecciones */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-white flex items-center gap-3">
                    <Database className="text-primary w-5 h-5" /> Contenido
                  </h3>
                  <button 
                    onClick={() => setIsAddingLesson(true)}
                    className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {isAddingLesson && (
                  <div className="mb-8 p-6 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4 animate-in zoom-in-95 duration-300">
                    <input 
                      type="text" placeholder="Título de lección"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    />
                    <select 
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm"
                      value={newLesson.course_id}
                      onChange={(e) => setNewLesson({...newLesson, course_id: e.target.value})}
                    >
                      <option value="liderazgo">Liderazgo</option>
                      <option value="diaconado">Diaconado</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={handleAddLesson} className="flex-1 bg-primary text-white font-black py-2 rounded-xl text-sm">Guardar</button>
                      <button onClick={() => setIsAddingLesson(false)} className="flex-1 bg-white/5 text-slate-500 font-black py-2 rounded-xl text-sm">Cerrar</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${lesson.course_id === 'liderazgo' ? 'bg-primary' : 'bg-amber-500'}`}></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lesson.course_id}</p>
                          <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{lesson.title}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteLesson(lesson.id)} className="p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-[0.02] rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </main>

      {/* Modal Detalles Alumno */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="p-10 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/5 relative">
                    <button 
                        onClick={() => setSelectedStudent(null)}
                        className="absolute top-8 right-8 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                    
                    <div className="flex items-center gap-8 mb-10">
                        <div className="w-24 h-24 rounded-[2rem] bg-primary/20 flex items-center justify-center text-4xl font-black text-primary shadow-2xl shadow-primary/20 border-4 border-primary/20">
                            {selectedStudent.full_name?.charAt(0) || selectedStudent.email?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-2">{selectedStudent.full_name || selectedStudent.first_name}</h2>
                            <p className="text-slate-500 font-medium">{selectedStudent.email}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Puntos XP</p>
                            <p className="text-xl font-black text-white">{selectedStudent.xp || 0}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Clases Completas</p>
                            <p className="text-xl font-black text-white">{studentProgress.filter(p => p.status === 'completed').length}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Rango</p>
                            <p className="text-xl font-black text-primary">Estudiante</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" /> Historial de Progreso
                        </h4>
                        <div className="flex items-center gap-3">
                            {/* BOTÓN DE CERTIFICADO DINÁMICO */}
                            {studentProgress.filter(p => p.status === 'completed').length >= 3 && (
                                <button 
                                    onClick={() => {
                                        setCertCourse(studentProgress[0]?.lessons?.course_id === 'liderazgo' ? "Programa de Liderazgo" : "Programa de Diaconado");
                                        setShowCertificate(true);
                                    }}
                                    className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20"
                                >
                                    <Printer className="w-4 h-4" /> IMPRIMIR CERTIFICADO
                                </button>
                            )}
                            <span className="text-[10px] font-black text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-lg">
                                {studentProgress.length} Lecciones
                            </span>
                        </div>
                    </div>
                    
                    {loadingProgress ? (
                        <div className="py-10 flex justify-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : studentProgress.length > 0 ? (
                        <div className="space-y-3">
                            {Array.from(new Set(studentProgress.map(p => p.lessons?.course_id || 'Curso Desconocido'))).map((courseId, cIdx) => (
                                <div key={cIdx} className="mb-6 last:mb-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-px flex-1 bg-white/5"></div>
                                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{courseId === 'liderazgo' ? 'Programa de Liderazgo' : courseId === 'diaconado' ? 'Programa de Diaconado' : courseId}</span>
                                        <div className="h-px flex-1 bg-white/5"></div>
                                    </div>
                                    <div className="space-y-2">
                                        {studentProgress
                                            .filter(p => (p.lessons?.course_id || 'Curso Desconocido') === courseId)
                                            .map((p: any, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                                                    <div>
                                                        <p className="text-xs font-black text-white mb-0.5 uppercase tracking-tight">{p.lessons?.title || 'Lección antigua o no sincronizada'}</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{new Date(p.completed_at).toLocaleDateString()}</p>
                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                                                                p.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                                                            }`}>
                                                                {p.status === 'completed' ? 'COMPLETADA' : 'EN CURSO'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                                                        <CheckCircle className={`w-4 h-4 ${p.status === 'completed' ? 'text-green-500' : 'text-slate-700'}`} />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <AlertCircle className="w-12 h-12 text-slate-800 mb-4" />
                            <p className="text-slate-500 font-medium">El estudiante aún no ha completado ninguna lección.</p>
                        </div>
                    )}
                </div>

                <div className="p-10 bg-white/[0.02] border-t border-white/5">
                    <button 
                        onClick={() => setSelectedStudent(null)}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                        Cerrar Detalle
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Modal de Certificado */}
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
