import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "mugasiracalvin@gmail.com";
const ADMIN_PASSWORD = "@kamanzi@123";

/**
 * One-time bootstrap: ensures the seeded super-admin exists.
 * Safe to call repeatedly — no-ops if user already exists.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" }).handler(async () => {
  try {
    // Check existing user via auth admin API
    const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    let user = list.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    if (!user) {
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
      });
      if (createError) throw createError;
      user = created.user!;
    }

    // Ensure admin role
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!existingRole) {
      await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "admin" });
    }

    return { ok: true };
  } catch (e) {
    console.error("bootstrapAdmin failed:", e);
    return { ok: false, error: (e as Error).message };
  }
});
