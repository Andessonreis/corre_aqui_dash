import { createClient, SupabaseClient } from "@supabase/supabase-js";

class SupabaseService {
  private static instance: SupabaseClient;

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
}

export const supabase = SupabaseService.getInstance();
