const SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWtqZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =======================
// START
// =======================
(async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();

  // 🔐 Nicht eingeloggt
  if (!user) {
    location.href = "/";
    return;
  }

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 🛡️ Sicherheitshinweise nicht akzeptiert
  if (!profile.safety_accepted) {
    location.href = "/safety.html";
    return;
  }

  // 👨‍👩‍👧 Elternzustimmung fehlt
  if (profile.age_group === "14-15" && !profile.parent_verified) {
    location.href = "/parent.html";
    return;
  }

  // ✅ Alles ok → App laden
  loadChats();
})();

// =======================
// LOGOUT
// =======================
async function logout() {
  await supabaseClient.auth.signOut();
  location.href = "/";
}

// =======================
// CHATS LADEN (PLATZHALTER)
// =======================
function loadChats() {
  document.getElementById("chatList").innerHTML =
    "<p>✅ Zugriff erlaubt. Chats kommen hier rein.</p>";
}
