// =======================
// SUPABASE SETUP
// =======================
const SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =======================
// CHAT ID
// =======================
const chatId = new URLSearchParams(window.location.search).get("chat");
if (!chatId) {
  alert("Chat-ID fehlt");
  location.href = "/app.html";
}

// =======================
// JUGENDSCHUTZ CHECK
// =======================
async function checkPermission() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    location.href = "/";
    return;
  }

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("age_group, parent_verified")
    .eq("id", user.id)
    .single();

  if (profile.age_group === "14-15" && !profile.parent_verified) {
    alert("Chat gesperrt – Elternzustimmung fehlt");
    location.href = "/parent.html";
    return;
  }
}

// =======================
// NACHRICHTEN LADEN
// =======================
async function loadMessages() {
  const { data } = await supabaseClient
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at");

  const box = document.getElementById("messages");
  box.innerHTML = "";

  data.forEach(msg => {
    const div = document.createElement("div");
    div.innerText = msg.content;
    box.appendChild(div);
  });
}

// =======================
// NACHRICHT SENDEN
// =======================
async function sendMessage() {
  const text = document.getElementById("msgInput").value;
  if (!text) return;

  const { data: { user } } = await supabaseClient.auth.getUser();

  await supabaseClient.from("messages").insert({
    chat_id: chatId,
    sender: user.id,
    content: text
  });

  document.getElementById("msgInput").value = "";
}

// =======================
// REALTIME
// =======================
supabaseClient
  .channel("chat:" + chatId)
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `chat_id=eq.${chatId}`
    },
    () => loadMessages()
  )
  .subscribe();

// =======================
// MELDEN
// =======================
async function reportMessage(id) {
  await supabaseClient
    .from("messages")
    .update({ reported: true })
    .eq("id", id);

  alert("Nachricht gemeldet");
}

// =======================
// START
// =======================
(async () => {
  await checkPermission();
  await loadMessages();
})();
