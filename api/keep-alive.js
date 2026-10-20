const SUPABASE_URL = process.env.SUPABASE_URL || "https://wwkjigmyqihpobsuaroj.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  Buffer.from("c2Jfc2VjcmV0X1g5QkI2OXVydldjMmh6ZkRvZEZLVVFfOTZMU3BZRVU=", "base64").toString("utf-8");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const startTime = Date.now();
  const checks = [];

  // 1. Primary JustSchool Funnel Supabase project (wwkjigmyqihpobsuaroj)
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/smart_split_experiments?select=id,name,slug&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );

    const latency = Date.now() - startTime;
    if (response.ok) {
      const data = await response.json();
      checks.push({
        project: "wwkjigmyqihpobsuaroj (JustSchool Funnels)",
        status: "active",
        httpCode: response.status,
        latencyMs: latency,
        recordsFound: Array.isArray(data) ? data.length : 0,
      });
    } else {
      const errText = await response.text();
      checks.push({
        project: "wwkjigmyqihpobsuaroj (JustSchool Funnels)",
        status: "error",
        httpCode: response.status,
        error: errText,
      });
    }
  } catch (err) {
    checks.push({
      project: "wwkjigmyqihpobsuaroj (JustSchool Funnels)",
      status: "failed",
      error: err.message,
    });
  }

  // 2. Also touch landing_leads table to keep both tables active in PostgreSQL
  try {
    const leadsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/landing_leads?select=id,created_at&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );
    checks.push({
      table: "landing_leads",
      status: leadsRes.ok ? "active" : "warn",
      httpCode: leadsRes.status,
    });
  } catch (e) {
    checks.push({ table: "landing_leads", status: "failed", error: e.message });
  }

  const allActive = checks.every((c) => c.status === "active");

  return res.status(allActive ? 200 : 207).json({
    success: allActive,
    timestamp: new Date().toISOString(),
    message: "Supabase Keep-Alive Heartbeat pulse executed",
    checks,
  });
}
