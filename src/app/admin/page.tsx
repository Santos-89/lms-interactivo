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
  const [stats, setStats] = React.useState({
    students: 0,
    courses: 0,
    totalXp: 0,
    certificates: 0
  });
  const [loading, setLoading] = React.useState(true);

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
        certificates: Math.floor(totalXp / 1000) // Mock logic for certificates
      });

      setLoading(false);
    }

    checkAdminAndLoad();
  }, [router]);

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
              className="glass p-6 rounded-3xl border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                {stat.isTrend && (
                   <span className="text-xs font-black text-success bg-success/10 px-2 py-1 rounded-lg">
                    {stat.value}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-tight mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white font-outfit">{!stat.isTrend ? stat.value : 'Puntuación'}</h3>
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

            <div className="glass rounded-[32px] overflow-hidden border-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Usuario</th>
                    <th className="px-8 py-4">Puntos XP</th>
                    <th className="px-8 py-4">Estado</th>
                    <th className="px-8 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.length > 0 ? profiles.map((profile, i) => (
                    <tr key={profile.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase`}>
                            {profile.first_name ? profile.first_name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm truncate max-w-[150px]">
                              {profile.first_name || 'Nuevo Usuario'} {profile.last_name || ''}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                              {profile.is_admin ? 'Administrador' : 'Estudiante'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-white font-black text-sm">{profile.xp || 0} XP</td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-success/10 text-success`}>
                          Activo
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 outline-none">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">
                        No se encontraron estudiantes registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Activity */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-[32px] border-primary/20 bg-primary/5">
              <h3 className="text-xl font-black font-outfit text-white mb-6 uppercase tracking-wider">Cursos del Sistema</h3>
              <div className="space-y-6">
                {courses.map((course) => (
                  <div key={course.id} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight uppercase tracking-tight">{course.title}</p>
                      <p className="text-[10px] text-gray-500 font-black mt-1">ID: {course.id}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 glass border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                Ver Todos los Cursos
              </button>
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
