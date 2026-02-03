import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  // =======================
  // LINK GEKLICKT (GET)
  // =======================
  if (req.method === "GET") {
    const { token } = req.query;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        parent_verified: true,
        parent_verified_at: new Date().toISOString()
      })
      .eq("id", token);

    if (error) {
      return res.status(400).send("Ungültiger Link");
    }

    return res.send(
      "<h1>✅ Zustimmung bestätigt</h1><p>Das Kind darf TeenConnect jetzt nutzen.</p>"
    );
  }

  // =======================
  // MAIL SENDEN (POST)
  // =======================
  if (req.method === "POST") {
    const { parentEmail, childId } = req.body;

    const verifyLink = `${process.env.APP_URL}/api/parent-verify?token=${childId}`;

    // ⛔ Hier KEIN externer Maildienst → Supabase Auth SMTP nutzen
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: parentEmail,
      options: {
        redirectTo: verifyLink
      }
    });

    return res.status(200).json({ sent: true });
  }

  res.status(405).end();
}
