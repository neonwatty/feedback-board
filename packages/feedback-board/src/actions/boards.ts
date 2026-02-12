import type { SupabaseClient } from "@supabase/supabase-js";

export async function createBoardAction(
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
): Promise<{ slug?: string; error?: string }> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { error } = await supabase.from("boards").insert({
    name,
    slug,
    description: description || null,
    created_by: userId,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A board with this name already exists." };
    }
    return { error: "Failed to create board." };
  }

  return { slug };
}
