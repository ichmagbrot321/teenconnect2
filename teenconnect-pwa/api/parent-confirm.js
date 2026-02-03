import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Ungültig");

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("parent_token", token)
    .maybeSingle();

  if (!data) return res.status(404).send("Token ungültig");

  await supabase.from("profiles").update({
    parent_verified: true,
    parent_token: null
  }).eq("id", data.id);

  res.send("✅ Zustimmung erteilt. Ihr Kind kann nun chatten.");
}
