const SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6amhhbmpjZWtqZWJnbmpuc2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjI4MDAsImV4cCI6MjA4NTY5ODgwMH0.kq8Mtz5xyikiE7_lE1w_564EcAI3rLeN3iSfplxHNtU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =======================
// ZUGRIFF PRÜFEN
// =======================
async function checkAccess() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) location.href = "/";

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!["moderator", "admin", "owner"].includes(profile.role)) {
    alert("Kein Zugriff");
    location.href = "/";
  }
}

// =======================
// REPORTS LADEN
// =======================
async function loadReports() {
  const { data } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  const box = document.getElementById("reports");
  box.innerHTML = "";

  data.forEach(r => {
    const div = document.createElement("div");
    div.className = "report";
    div.innerHTML = `
      <b>Grund:</b> ${r.reason}<br>
      <b>Status:</b> ${r.status}<br>
      ${r.appeal ? "⚠️ WIDERSPRUCH!" : ""}
      <br><br>
      <button onclick="acceptReport('${r.id}')">Akzeptieren</button>
      <button onclick="rejectReport('${r.id}')">Ablehnen</button>
    `;
    box.appendChild(div);
  });
}

// =======================
// REPORT AKZEPTIEREN
// =======================
async function acceptReport(id) {
  await supabaseClient
    .from("reports")
    .update({ status: "accepted" })
    .eq("id", id);

  alert("Report akzeptiert");
  loadReports();
}

// =======================
// REPORT ABLEHNEN
// =======================
async function rejectReport(id) {
  await supabaseClient
    .from("reports")
    .update({ status: "rejected" })
    .eq("id", id);

  alert("Report abgelehnt");
  loadReports();
}

(async () => {
  await checkAccess();
  await loadReports();
})();

