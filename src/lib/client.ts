import { createClient, SupabaseClient } from "@supabase/supabase-js";
import React from 'react';

class SupabaseService {
  private static instance: SupabaseClient;
  private static cache: Map<string, any> = new Map();
  
  private constructor() {}
  
  private static validateEnv() {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("[Supabase] ❌ Missing environment variables!");
      throw new Error("Supabase environment variables are not set.");
    }
    return { SUPABASE_URL, SUPABASE_ANON_KEY };
  }
  
  public static getInstance(): SupabaseClient {
    if (!this.instance) {
      const { SUPABASE_URL, SUPABASE_ANON_KEY } = this.validateEnv();
      
      // Opções aprimoradas para persistência de sessão
      const supabaseOptions = {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'supabase_auth_token',
          storage: {
            getItem: (key: string) => {
              if (typeof window !== 'undefined') {
                // No navegador
                const value = localStorage.getItem(key);
                try {
                  return value ? JSON.parse(value) : null;
                } catch (error) {
                  return value;
                }
              }
              return null;
            },
            setItem: (key: string, value: any) => {
              if (typeof window !== 'undefined') {
                const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
                localStorage.setItem(key, stringValue);
                // Definir cookie com expiração longa (90 dias)
                document.cookie = `${key}=${encodeURIComponent(stringValue)};path=/;max-age=7776000;SameSite=Lax`;
              }
            },
            removeItem: (key: string) => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
                // Remover cookie
                document.cookie = `${key}=;path=/;max-age=0;SameSite=Lax`;
              }
            }
          }
        }
      };
      
      this.instance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, supabaseOptions);
  
      // Monitor de eventos de autenticação para debug e recuperação de sessão
      this.instance.auth.onAuthStateChange((event, session) => {
        console.log('[Supabase] Auth event:', event, 'Session:', !!session);
        
        // Restaurar sessão em caso de mudança de aba ou reinicialização
        if (event === 'SIGNED_IN' && session) {
          this.instance.auth.setSession(session);
        }
      });
      
      // Tentativa de recuperar sessão ao inicializar
      this.tryRecoverSession();
    }
    return this.instance;
  }
  
  // Método para tentar recuperar a sessão de múltiplas fontes
  private static async tryRecoverSession() {
    if (typeof window !== 'undefined') {
      try {
        // Verificar se já existe uma sessão ativa
        const { data: { session } } = await this.instance.auth.getSession();
        if (session) return;
        
        // Tentar recuperar do localStorage
        const storedSession = localStorage.getItem('supabase_auth_token');
        if (storedSession) {
          try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession?.access_token && parsedSession?.refresh_token) {
              await this.instance.auth.setSession({
                access_token: parsedSession.access_token,
                refresh_token: parsedSession.refresh_token
              });
              console.log('[Supabase] Session restored from localStorage');
              return;
            }
          } catch (error) {
            console.error('[Supabase] Failed to parse stored session', error);
          }
        }
        
        // Tentar recuperar do cookie se localStorage falhar
        const getCookieValue = (name: string): string | null => {
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? decodeURIComponent(match[2]) : null;
        };
        
        const cookieSession = getCookieValue('supabase_auth_token');
        if (cookieSession) {
          try {
            const parsedCookieSession = JSON.parse(cookieSession);
            if (parsedCookieSession?.access_token && parsedCookieSession?.refresh_token) {
              await this.instance.auth.setSession({
                access_token: parsedCookieSession.access_token,
                refresh_token: parsedCookieSession.refresh_token
              });
              console.log('[Supabase] Session restored from cookie');
            }
          } catch (error) {
            console.error('[Supabase] Failed to parse cookie session', error);
          }
        }
      } catch (error) {
        console.error('[Supabase] Session recovery failed', error);
      }
    }
  }
  
  public static async fetchWithCache<T>(key: string, fetcher: () => Promise<T>, ttl = 60000): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);
    if (cached && now - cached.timestamp < ttl) {
      return cached.data;
    }
    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }
  
  // Método utilitário para verificar o estado da autenticação
  public static async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await this.instance.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('[Supabase] Auth check failed', error);
      return false;
    }
  }
}

export const supabase = SupabaseService.getInstance();

// Hook para verificar autenticação em componentes React
export const useSupabaseAuth = () => {
  if (typeof window !== 'undefined') {
    const [isAuth, setIsAuth] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
      const checkAuth = async () => {
        setLoading(true);
        const authenticated = await SupabaseService.isAuthenticated();
        setIsAuth(authenticated);
        setLoading(false);
      };
      
      checkAuth();
      
      const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') setIsAuth(true);
        if (event === 'SIGNED_OUT') setIsAuth(false);
      });
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }, []);
    
    return { isAuthenticated: isAuth, loading };
  }
  
  return { isAuthenticated: false, loading: false };
};