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
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState({ title: "", course_id: "liderazgo", order_index: 0 });
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const [showCertificate, setShowCertificate] = useState(false);
  const [certCourse, setCertCourse] = useState("Programa de Diaconado");

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
    const { data: profilesData } = await supabase.from('profiles').select('*').order('xp', { ascending: false });
    if (profilesData) setProfiles(profilesData);
    const { data: lessonsData } = await supabase.from('lessons').select('*').order('course_id', { ascending: true }).order('order_index', { ascending: true });
    if (lessonsData) setLessons(lessonsData);
    setLoading(false);
  };

  const loadStudentProgress = async (student: Profile) => {
    setSelectedStudent(student);
    setLoadingProgress(true);
    const { data: progress } = await supabase.from('user_progress').select('*, lessons(title, course_id)').eq('user_id', student.id);
    if (progress) setStudentProgress(progress);
    setLoadingProgress(false);
  };

  const promoteToAdmin = async (id: string, currentStatus: boolean) => {
    if (!confirm(`¿Estás seguro?`)) return;
    const { error } = await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', id);
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
        <Link href="/" className="bg-primary text-white font-black px-8 py-3 rounded-xl">Volver</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-40 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-sm font-black text-white uppercase tracking-tight">Admin MBI</h1>
        </div>
        <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-all"><X className="w-5 h-5 text-slate-500" /></Link>
      </div>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Alumnos", val: profiles.length, icon: Users, color: "bg-blue-500" },
            { label: "XP Total", val: profiles.reduce((a, b) => a + (b.xp || 0), 0).toLocaleString(), icon: TrendingUp, color: "bg-amber-500" },
            { label: "Lecciones", val: lessons.length, icon: BookOpen, color: "bg-emerald-500" },
            { label: "Admins", val: profiles.filter(p => p.is_admin).length, icon: Shield, color: "bg-primary" },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900/40 p-4 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`${s.color} p-2 rounded-xl`}><s.icon className="w-4 h-4 text-white" /></div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase">{s.label}</p>
                  <p className="text-lg font-black text-white">{s.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-black text-white">Directorio</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" placeholder="Buscar..." 
                        className="bg-slate-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-primary w-full md:w-64"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.02] text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Estudiante</th>
                            <th className="px-6 py-4">Progreso</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProfiles.map((p) => (
                            <tr key={p.id} className="hover:bg-white/[0.01]">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-white">{p.full_name || p.email}</p>
                                    <p className="text-[10px] text-slate-500">{p.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-amber-500 font-black text-xs">{p.xp || 0} XP</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => loadStudentProgress(p)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                                        <TrendingUp className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>

      {/* MODAL RESPONSIVO */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 w-full max-w-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 md:p-8 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                    <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-black text-primary border-2 border-primary/20">
                            {selectedStudent.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white leading-tight">{selectedStudent.full_name || selectedStudent.first_name}</h2>
                            <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">XP</p>
                            <p className="text-sm font-black text-white">{selectedStudent.xp || 0}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Clases</p>
                            <p className="text-sm font-black text-white">{studentProgress.length}</p>
                        </div>
                        {studentProgress.length >= 3 && (
                            <button 
                                onClick={() => {
                                    setCertCourse(studentProgress[0]?.lessons?.course_id === 'liderazgo' ? "Programa de Liderazgo" : "Programa de Diaconado");
                                    setShowCertificate(true);
                                }}
                                className="bg-amber-500 p-3 rounded-xl text-center border border-amber-400/50 flex flex-col items-center justify-center"
                            >
                                <Printer className="w-4 h-4 text-white mb-1" />
                                <p className="text-[7px] font-black text-white uppercase">Certificado</p>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-900">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BookOpen className="w-3 h-3 text-primary" /> Historial de Clases
                    </h4>
                    <div className="space-y-2">
                        {studentProgress.map((p: any, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                <div>
                                    <p className="text-[11px] font-bold text-white mb-1">{p.lessons?.title || 'Lección'}</p>
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                                        p.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {p.status === 'completed' ? 'COMPLETADA' : 'EN CURSO'}
                                    </span>
                                </div>
                                <CheckCircle className={`w-4 h-4 ${p.status === 'completed' ? 'text-green-500' : 'text-slate-700'}`} />
                            </div>
                        ))}
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
