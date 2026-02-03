import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { user_id, parent_email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");

  await supabase.from("profiles").update({
    parent_email,
    parent_token: token,
    parent_requested_at: new Date().toISOString(),
    parent_verified: false
  }).eq("id", user_id);

  const link = `${process.env.APP_URL}/api/parent-confirm?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    to: parent_email,
    subject: "Zustimmung für TeenConnect",
    html: `
      <p>Ihr Kind möchte TeenConnect nutzen.</p>
      <p>Bitte bestätigen Sie die Nutzung:</p>
      <a href="${link}">Zustimmung erteilen</a>
      <p>Ohne Zustimmung kein Chat-Zugriff.</p>
    `
  });

  res.json({ ok: true });
}

