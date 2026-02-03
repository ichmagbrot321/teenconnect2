import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  const { reportId } = req.body;

  await supabase
    .from("reports")
    .update({ appeal: true, status: "pending" })
    .eq("id", reportId);

  res.status(200).json({ success: true });
}

