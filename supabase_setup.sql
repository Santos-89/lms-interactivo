-- ==============================================================================
-- 🚀  MBI ACADEMY - SUPABASE DATABASE SETUP SCRIPT
-- ==============================================================================
-- Instrucciones:
-- 1. Copia todo este texto.
-- 2. Ve al panel de Supabase de tu proyecto.
-- 3. Entra a la pestaña "SQL Editor" (icono de consola a la izquierda).
-- 4. Abre un "New Query".
-- 5. Pega este código y dale al botón verde "Run".
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  xp INTEGER DEFAULT 0 NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crear tabla de CURSOS (Programas)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla de LECCIONES
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  xp_value INTEGER DEFAULT 100 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla de PROGRESO (Lecciones completadas por el usuario)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT REFERENCES public.courses(id),
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- 5. Habilitar Seguridad (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 6. Crear Políticas de Seguridad (Quién puede ver/editar qué)
-- Profiles
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins pueden ver todos los perfiles" ON public.profiles FOR SELECT USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE OR auth.uid() = id
);
CREATE POLICY "Usuarios pueden actualizar su XP" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins pueden borrar perfiles" ON public.profiles FOR DELETE USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
);

-- Courses y Lessons (Todos los usuarios logueados pueden ver el catálogo)
CREATE POLICY "Todos pueden ver los cursos" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Todos pueden ver las lecciones" ON public.lessons FOR SELECT USING (true);

-- User Progress
CREATE POLICY "Usuarios ven su propio progreso" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios insertan su progreso" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios actualizan su progreso" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- 7. Trigger Automático: Crear Perfil y 0 XP al Registrarse (Sign Up)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, full_name, email, xp, is_admin)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    new.raw_user_meta_data->>'full_name', 
    new.email, 
    0,
    FALSE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar el trigger si existía antes para no duplicar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Activar el Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Autocompletar los Cursos Base
INSERT INTO public.courses (id, title, description) VALUES
('liderazgo', 'Programa de Liderazgo', 'Desarrolla habilidades directivas basadas en la palabra.'),
('diaconado', 'Programa de Diaconado', 'Aprende los fundamentos del ministerio de ayuda y servicio.'),
('maestros', 'Programa de Maestros', 'Enseña la palabra de forma efectiva.')
ON CONFLICT (id) DO NOTHING;

-- ¡FIN DEL SCRIPT! 🚀
