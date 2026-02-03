
async function reportMessage(messageId, reportedUserId) {
  const reason = prompt("Warum meldest du diese Nachricht?");
  if (!reason) return;

  const { data: { user } } = await supabaseClient.auth.getUser();

  await supabaseClient.from("reports").insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    message_id: messageId,
    reason
  });

  alert("Meldung abgeschickt. Danke!");
}
