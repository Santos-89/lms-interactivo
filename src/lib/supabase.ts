import { createClient } from '@/utils/supabase/client';

/**
 * Cliente de Supabase adaptado para Componentes de Cliente (Client Components).
 * Este archivo actúa como un "puente" o "wrapper" para mantener la compatibilidad
 * con los componentes existentes de la aplicación que importan 'supabase' directamente,
 * pero utilizando por debajo el nuevo sistema SSR de @supabase/ssr.
 */
export const supabase = createClient();
