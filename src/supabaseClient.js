import { createClient } from '@supabase/supabase-js'

// Credenciais publicas (a chave anon e segura para o navegador; protegida por RLS).
// Preenchidas quando o projeto Supabase for criado.
const SUPABASE_URL = "";
const SUPABASE_ANON = "";

export const temSupabase = !!(SUPABASE_URL && SUPABASE_ANON);
export const supabase = temSupabase ? createClient(SUPABASE_URL, SUPABASE_ANON) : null;
