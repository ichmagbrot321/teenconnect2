const SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWtqZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function requestParentApproval() {
  const email = document.getElementById("parentEmail").value;
  if (!email) return alert("Eltern-E-Mail fehlt");

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;

  await fetch("/api/parent-verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      parent_email: email
    })
  });

  document.getElementById("status").innerText =
    "📧 E-Mail an Eltern gesendet. Warte auf Bestätigung.";
}
