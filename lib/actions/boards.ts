"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBoard(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A board with this name already exists." };
    }
    return { error: "Failed to create board." };
  }

  revalidatePath("/");
  return { slug };
}
