import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const NewAdminSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
});

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Not authorized");
}

export const listAdmins = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      await assertAdmin(context.userId);
      const { data: roles, error } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "admin");
      if (error) throw error;

      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const map = new Map(list.users.map((u) => [u.id, u]));
      const admins = (roles ?? []).map((r) => {
        const u = map.get(r.user_id);
        return {
          id: r.user_id,
          email: u?.email ?? "(unknown)",
          name: (u?.user_metadata as any)?.name ?? "",
          created_at: r.created_at,
        };
      });
      return { ok: true as const, admins };
    } catch (e) {
      console.error("listAdmins failed:", e);
      return { ok: false as const, error: (e as Error).message, admins: [] };
    }
  });

export const createAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => NewAdminSchema.parse(input))
  .handler(async ({ data, context }) => {
    try {
      await assertAdmin(context.userId);
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { name: data.name },
      });
      if (error) throw new Error(error.message);
      const userId = created.user!.id;
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (roleError) throw new Error(roleError.message);
      return { ok: true as const, id: userId };
    } catch (e) {
      console.error("createAdmin failed:", e);
      return { ok: false as const, error: (e as Error).message };
    }
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    try {
      await assertAdmin(context.userId);
      if (data.userId === context.userId) throw new Error("You cannot remove yourself");
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
      await supabaseAdmin.auth.admin.deleteUser(data.userId);
      return { ok: true as const };
    } catch (e) {
      console.error("removeAdmin failed:", e);
      return { ok: false as const, error: (e as Error).message };
    }
  });
