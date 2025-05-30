import { env } from "@/env/client";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
