async function saveAge() {
  const age = document.getElementById("age").value;
  if (!age) return alert("Bitte Alter wählen");

  if (age === "13") {
    alert("Diese App ist ab 14 Jahren");
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();

  const ageGroup = age < 16 ? "14-15" : "16+";

  await supabase.from("profiles")
    .update({ age_group: ageGroup })
    .eq("id", user.id);

  if (ageGroup === "14-15") {
    window.location.href = "/parent.html";
  } else {
    window.location.href = "/safety.html";
  }
}
