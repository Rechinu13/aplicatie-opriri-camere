import { supabase } from "./supabase";

export const getUserWithRole = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          email: user.email,
          role: "operator",
        },
      ])
      .select()
      .single();

    return { user, role: newProfile?.role };
  }

  return { user, role: profile.role };
};