const SUPABASE_URL = "https://xzjhanjcekjebgnjnsbl.supabase.co";
const SUPABASE_ANON_KEY = "DEIN_ANON_KEY"; // ist okay im Frontend

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function login() {
  const email = document.getElementById("email").value;
  if (!email) return alert("E-Mail fehlt");

  const { error } = await supabaseClient.auth.signInWithOtp({ email });

  if (error) {
    alert(error.message);
  } else {
    alert("Check deine E-Mails");
  }
}

supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event !== "SIGNED_IN") return;

  const user = session.user;

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

    window.location.href = "/age.html";
  } else {
    window.location.href = "/safety.html";
  }
});
