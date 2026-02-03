const supabaseClient = supabase.createClient(
  "SUPABASE_URL",
  "AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWtqZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtUNON_KEY"
);

const chatId = new URLSearchhttps://xzjhanjcekjebgnjnsbl.supabase.coParams(window.location.search).get("chat");

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

loadMessages();

