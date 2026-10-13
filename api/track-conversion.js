import { recordConversion } from "./split.js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://wwkjigmyqihpobsuaroj.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  Buffer.from("c2Jfc2VjcmV0X1g5QkI2OXVydldjMmh6ZkRvZEZLVVFfOTZMU3BZRVU=", "base64").toString("utf-8");

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

    // If lead details were passed (e.g. from Good Promo or form interception), save to Supabase landing_leads
    const lead = req.body?.lead;
    if (lead && (lead.phone || lead.email || lead.name)) {
      try {
        let phone = lead.phone || "";
        if (phone && typeof phone === "string") {
          const digits = phone.replace(/\D/g, "");
          if (digits) phone = "+" + digits;
        }

        const leadPayload = {
          id: Date.now(),
          title: lead.name || "GoodPromo Lead",
          name: lead.name || "",
          phone: phone,
          email: lead.email || "",
          qa: lead.qa || "",
          ip: lead.ip || "",
          country: lead.country || "",
          dialogue_url: lead.dialogueUrl || lead.url || "",
          split_id: splitId,
          split_variant: splitVariant,
        };

        await fetch(`${SUPABASE_URL}/rest/v1/landing_leads`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify(leadPayload),
        });
        console.log("[Track-Conversion] Saved lead to Supabase landing_leads:", leadPayload.phone);
      } catch (dbErr) {
        console.error("[Track-Conversion] Error saving lead to Supabase:", dbErr);
      }
    }

    return res.status(200).json({ success, splitId, splitVariant });
  } catch (err) {
    console.error("Error tracking external conversion:", err);
    return res.status(500).json({ error: err.message });
  }
}
