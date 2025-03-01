import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
      this.instance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      if (process.env.NODE_ENV !== "production") {
        console.log("[Supabase] ✅ Client initialized in development mode.");
      }
    }
    return this.instance;
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
}

export const supabase = SupabaseService.getInstance();
