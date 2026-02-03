const SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWtqZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function acceptSafety() {
  const checks = ["c1", "c2", "c3", "c4"];
  const allChecked = checks.every(id => document.getElementById(id).checked);

  if (!allChecked) {
    alert("Bitte bestätige alle Hinweise");
    return;
  }

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;

  await supabaseClient.from("user_acknowledgements").insert({
    user_id: user.id
  });

  window.location.href = "/app.html";
}

