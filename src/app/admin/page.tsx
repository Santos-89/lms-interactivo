"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  MoreVertical,
  TrendingUp,
  Award,
  Settings,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [courses, setCourses] = React.useState<any[]>([]);
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<string>('liderazgo');
  const [newLessonTitle, setNewLessonTitle] = React.useState('');
  const [stats, setStats] = React.useState({
    students: 0,
    courses: 0,
    totalXp: 0,
    certificates: 0
  });
  const [loading, setLoading] = React.useState(true);

  const loadLessons = React.useCallback(async (courseId: string) => {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    setLessons(data || []);
  }, []);

  const handleAddLesson = async () => {
    if (!newLessonTitle) return;
    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order_index || 0)) + 1 : 1;
    
    const { error } = await supabase
      .from('lessons')
      .insert([{
        id: newLessonTitle.toLowerCase().replace(/\s+/g, '-'),
        course_id: selectedCourse,
        title: newLessonTitle,
        xp_value: 100,
        order_index: nextOrder
      }]);

    if (!error) {
      setNewLessonTitle('');
      loadLessons(selectedCourse);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (!error) {
      loadLessons(selectedCourse);
    }
  };

  React.useEffect(() => {
    async function checkAdminAndLoad() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile?.is_admin) {
        console.error('Acceso denegado: No eres administrador');
        setIsAdmin(false);
        router.push('/');
        return;
      }

      setIsAdmin(true);
      await loadData();
      await loadLessons('liderazgo');
    }

    async function loadData() {
      // Fetch all profiles
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false });
      
      setProfiles(allProfiles || []);

      // Fetch all courses
      const { data: allCourses } = await supabase
        .from('courses')
        .select('*');
      
      setCourses(allCourses || []);

      // Calculate stats
      const totalXp = allProfiles?.reduce((acc, p) => acc + (p.xp || 0), 0) || 0;
      
      setStats({
        students: allProfiles?.length || 0,
        courses: allCourses?.length || 0,
        totalXp: totalXp,
        certificates: Math.floor(totalXp / 1000)
      });

      setLoading(false);
    }

    checkAdminAndLoad();
  }, [router, loadLessons]);

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#0f172a]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-primary font-black text-[10px] uppercase tracking-widest">Admin Mode</span>
            </div>
            <h1 className="text-4xl font-black font-outfit text-white mb-2 uppercase tracking-tight">Panel de <span className="text-primary">Control</span></h1>
            <p className="text-gray-500 font-medium">Gestiona tu academia y monitorea el crecimiento espiritual de tus estudiantes.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
              <Settings className="w-5 h-5" /> Configuración
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
              <Plus className="w-5 h-5" /> Nuevo Curso
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Estudiantes Totales', value: stats.students.toLocaleString(), icon: <Users /> },
            { label: 'Cursos Activos', value: stats.courses.toString(), icon: <BookOpen /> },
            { label: 'XP Acumulado', value: stats.totalXp.toLocaleString(), icon: <Award /> },
            { label: 'Crecimiento Hoy', value: '+12%', icon: <TrendingUp />, isTrend: true }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1e293b]/40 backdrop-blur-3xl p-8 rounded-[36px] border border-white/10 hover:border-primary/30 transition-all shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  {React.cloneElement(stat.icon as React.ReactElement<any>, { className: "w-7 h-7" })}
                </div>
                {stat.isTrend && (
                   <span className="text-xs font-black text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-xl border border-[#10b981]/20">
                    {stat.value}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.1em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-white font-outfit tracking-tighter">
                {!stat.isTrend ? stat.value : 'Puntuación'}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Students Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tight">Estudiantes Registrados</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar alumno..." 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-3xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                    <th className="px-10 py-6">Usuario</th>
                    <th className="px-10 py-6">Progreso</th>
                    <th className="px-10 py-6">Estado</th>
                    <th className="px-10 py-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.length > 0 ? profiles.map((profile, i) => (
                    <tr key={profile.id} className="group hover:bg-white/[0.03] transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[#818cf8] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20`}>
                            {profile.first_name ? profile.first_name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="text-white font-black text-base mb-1">
                              {profile.first_name || 'Nuevo Usuario'} {profile.last_name || ''}
                            </p>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
                                {profile.is_admin ? (
                                    <span className="text-primary flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Administrador</span>
                                ) : 'Estudiante Activo'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-2">
                           <span className="text-white font-black text-sm">{profile.xp || 0} XP</span>
                           <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${Math.min((profile.xp || 0) / 10, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20`}>
                          ONLINE
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-300 hover:text-white transition-all border border-white/5 hover:border-white/10 shadow-sm">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-red-500/5 hover:bg-red-500/10 rounded-2xl text-red-400 hover:text-red-500 transition-all border border-red-500/10 shadow-sm">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-24 text-center text-slate-500 font-black uppercase text-xs tracking-[0.3em]">
                        No hay estudiantes para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Management */}
          <div className="space-y-8">
            <div className="bg-[#1e293b]/60 backdrop-blur-3xl p-10 rounded-[40px] border border-primary/20 shadow-2xl">
              <h3 className="text-2xl font-black font-outfit text-white mb-2 uppercase tracking-tighter">Gestión de Contenido</h3>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-10">Añade o quita clases de los programas</p>
              
              <div className="flex gap-2.5 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                {['liderazgo', 'diaconado', 'maestros'].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                        setSelectedCourse(id);
                        loadLessons(id);
                    }}
                    className={`flex-1 min-w-[90px] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-md ${
                      selectedCourse === id ? 'bg-primary text-white shadow-primary/20 scale-[1.02]' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                {lessons.map((lesson) => (
                  <motion.div 
                    layout
                    key={lesson.id} 
                    className="flex items-center justify-between p-5 bg-[#0f172a]/50 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-black text-white leading-[1.3] mb-1">{lesson.title}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">ID: {lesson.id}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-3 bg-red-500/0 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-[28px] border border-white/5">
                <input 
                  type="text" 
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Título de la nueva lección..."
                  className="w-full bg-[#0f172a]/80 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:outline-none focus:border-primary transition-all font-bold placeholder:text-slate-600"
                />
                <button 
                  onClick={handleAddLesson}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary-hover hover:shadow-[0_15px_40px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5" /> Añadir Lección
                </button>
              </div>
            </div>

            <div className="glass p-8 rounded-[32px] border-white/5">
              <h3 className="text-xl font-black font-outfit text-white mb-6 uppercase tracking-wider">Seguridad</h3>
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-6">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Nota de Seguridad</p>
                <p className="text-[10px] text-gray-400">Eres el administrador principal. Asegúrate de cerrar sesión al terminar.</p>
              </div>
              <button 
                onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/auth');
                }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
              >
                <LogOut className="w-4 h-4" /> Desconectarse
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
