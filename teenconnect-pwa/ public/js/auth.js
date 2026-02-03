erconst SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWtqZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =======================
// LOGIN
// =======================
async function login() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("E-Mail fehlt");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOtp({ email });

  if (error) {
    alert(error.message);
  } else {
    alert("Check deine E-Mails und klicke den Login-Link");
  }
}

// =======================
// AUTH STATE CHANGE
// =======================
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event !== "SIGNED_IN" || !session) return;

  const user = session.user;

  // 1️⃣ Profil prüfen / erstellen
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabaseClient.from("profiles").insert({
      id: user.id,
      email: user.email
    });

    // Erstlogin → Alter abfragen
    window.location.href = "/age.html";
    return;
  }

  // 2️⃣ Sicherheits-Hinweise prüfen
  const { data: ack } = await supabaseClient
    .from("user_acknowledgements")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!ack) {
    // Noch nicht akzeptiert
    window.location.href = "/safety.html";
    return;
  }

  // 3️⃣ Alles okay → App
  window.location.href = "/app.html";
});
