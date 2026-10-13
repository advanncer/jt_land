import { recordConversion } from "./split.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Accept split_id and split_variant from query (GET image beacon) or JSON body (POST)
  const splitId = req.query.split_id || req.body?.split_id;
  const splitVariant = req.query.split_variant || req.body?.split_variant;

  if (!splitId || !splitVariant) {
    return res.status(400).json({ error: "Missing split_id or split_variant" });
  }

  try {
    const success = await recordConversion(splitId, splitVariant, "lead");
    return res.status(200).json({ success, splitId, splitVariant });
  } catch (err) {
    console.error("Error tracking external conversion:", err);
    return res.status(500).json({ error: err.message });
  }
}
