import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const all = cookieStore.getAll();
          console.log("[supabase/server getAll] cookies count:", all.length, "names:", all.map(c => c.name));
          return all;
        },
        setAll(cookiesToSet) {
          try {
            console.log("[supabase/server setAll] setting", cookiesToSet.length, "cookies");
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log("[supabase/server setAll] set cookie", name, "value length:", value?.length);
              cookieStore.set(name, value, options);
            });
          } catch (err: any) {
            console.error("[supabase/server setAll] error:", err?.message || err);
          }
        },
      },
    }
  );
}

export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );
}
