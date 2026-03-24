"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const TRANSLATIONS: any = {
  es: {
    home: "Inicio",
    courses: "Cursos",
    resources: "Recursos",
    enter: "Entrar",
    exit: "Salir",
    logoSub: "Formando una nueva generación"
  },
  en: {
    home: "Home",
    courses: "Courses",
    resources: "Resources",
    enter: "Log in",
    exit: "Log out",
    logoSub: "Shaping a new generation"
  }
};

const Header = ({ language = 'es' }: { language?: string }) => {
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();
  const t = TRANSLATIONS[language];

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="glass sticky top-0 z-50 py-4 px-6 mb-8 border-b border-white/40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12">
            <Image 
              src="/mbi-logo.png" 
              alt="Ministerio Bethel Internacional" 
              fill
              className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              unoptimized
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black font-outfit tracking-tighter text-[#1E293B] leading-none uppercase">Ministerio Bethel Internacional</span>
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] leading-none uppercase">{t.logoSub}</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-[#64748B] hover:text-primary transition-colors font-outfit uppercase tracking-wider">{t.home}</Link>
          <Link href="/#programas" className="text-sm font-bold text-[#64748B] hover:text-primary transition-colors font-outfit uppercase tracking-wider">{t.courses}</Link>
          <Link href="/recursos" className="text-sm font-bold text-[#64748B] hover:text-primary transition-colors font-outfit uppercase tracking-wider">{t.resources}</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-white/40 p-1.5 pr-4 rounded-full border border-white/60 backdrop-blur-md shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user.email?.substring(0, 2).toUpperCase()}
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 bg-white/60 border border-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                {t.exit}
              </button>
            </div>
          ) : (
            <Link 
              href="/auth"
              className="px-6 py-2.5 bg-white/40 border border-white/60 text-primary rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm backdrop-blur-sm"
            >
              {t.enter}
            </Link>
          )}

          <div className="relative w-14 h-14 bg-white/40 rounded-xl p-1 backdrop-blur-sm border border-white/60 shadow-sm">
            <Image 
              src="/id-logo.png" 
              alt="ID Logo" 
              fill
              className="object-contain opacity-80"
              unoptimized={true}
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
