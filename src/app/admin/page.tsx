"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Search, 
  MoreVertical,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react';

const STATS = [
  { label: 'Estudiantes Activos', value: '1,284', change: '+12%', icon: <Users /> },
  { label: 'Cursos Publicados', value: '24', change: '+2', icon: <BookOpen /> },
  { label: 'Certificados Emitidos', value: '458', change: '+84', icon: <Award /> },
  { label: 'Ingresos Mensuales', value: '$12,400', change: '+18%', icon: <TrendingUp /> }
];

const RECENT_COURSES = [
  { title: 'Fundamentos del Diaconado', students: 450, status: 'Publicado', color: 'bg-bethel-red' },
  { title: 'Liderazgo Nivel 1', students: 320, status: 'Publicado', color: 'bg-bethel-blue' },
  { title: 'Pedagogía para Maestros', students: 180, status: 'Borrador', color: 'bg-gray-700' }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pb-20 bg-[#0f172a]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black font-outfit text-white mb-2 uppercase tracking-tight">Panel de <span className="text-primary">Control</span></h1>
            <p className="text-gray-500 font-medium">Gestiona tu academia y monitorea el crecimiento espiritual de tus estudiantes.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
            <Plus className="w-5 h-5" /> Nuevo Curso
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, i) => (
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
                <span className="text-xs font-black text-success bg-success/10 px-2 py-1 rounded-lg">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-tight mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white font-outfit">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Courses Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tight">Cursos Recientes</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar curso..." 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="glass rounded-[32px] overflow-hidden border-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Curso</th>
                    <th className="px-8 py-4">Estudiantes</th>
                    <th className="px-8 py-4">Estado</th>
                    <th className="px-8 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_COURSES.map((course, i) => (
                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${course.color} flex items-center justify-center text-white font-black`}>
                            {course.title.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{course.title}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Última edición hace 2 días</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-white font-black text-sm">{course.students}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                          course.status === 'Publicado' ? 'bg-success/10 text-success' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Activity */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-[32px] border-primary/20 bg-primary/5">
              <h3 className="text-xl font-black font-outfit text-white mb-6 uppercase tracking-wider">Actividad <span className="text-primary text-xs">Directo</span></h3>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">👤</div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">Juan Pérez <span className="text-gray-500 font-normal">se inscribió en</span> Diaconado</p>
                      <p className="text-xs text-gray-600 font-bold mt-1">HACE 5 MINUTOS</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 glass border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                Ver Todo el Registro
              </button>
            </div>

            <div className="glass p-8 rounded-[32px] border-white/5">
              <h3 className="text-xl font-black font-outfit text-white mb-6 uppercase tracking-wider">Accesos Rápidos</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reportes</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                  <Settings className="w-6 h-6 text-warning" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ajustes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
