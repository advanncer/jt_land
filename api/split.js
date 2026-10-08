// Persistent Split Experiments Store backed by NocoDB + in-memory fallback cache
const NOCO_TOKEN = process.env.NOCODB_TOKEN || "xKYg5pA_NAjvwAtnl9IGkJd---0F5BN8MFm992xO";
const SPLIT_TABLE_ID = process.env.NOCODB_SPLIT_TABLE_ID || "mrik5svmgbviy0a";
const NOCO_BASE_URL = "https://app.nocodb.com/api/v2/tables";

// Default seed experiments
const DEFAULT_EXPERIMENTS = [
  {
    id: "exp_justclass_1",
    name: "JustClass: Основной сплиттер трафика",
    slug: "justclass",
    status: "active",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "var_a",
        name: "JustClass LP A",
        url: "/justclass/main",
        weight: 50,
        visits: 0,
        leads: 0,
        paid: 0,
      },
      {
        id: "var_b",
        name: "JustClass LP B (Quiz/Offer)",
        url: "/justclass/quiz",
        weight: 50,
        visits: 0,
        leads: 0,
        paid: 0,
      },
    ],
  },
  {
    id: "exp_eng_adult_1",
    name: "English Adult: Main LP vs Pains LP",
    slug: "eng-adult",
    status: "active",
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    variants: [
      {
        id: "var_a",
        name: "Variant A (Main LP)",
        url: "/eng-adult/lp1",
        weight: 50,
        visits: 420,
        leads: 38,
        paid: 6,
      },
      {
        id: "var_b",
        name: "Variant B (Pains LP)",
        url: "/eng-adult/lp_pains",
        weight: 50,
        visits: 412,
        leads: 49,
        paid: 9,
      },
    ],
  },
];

let memoryCache = [...DEFAULT_EXPERIMENTS];
let lastCacheSync = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

// Fetch all experiments from NocoDB
export async function fetchExperimentsFromDb() {
  const now = Date.now();
  if (memoryCache.length > 0 && now - lastCacheSync < CACHE_TTL_MS) {
    return memoryCache;
  }

  try {
    const res = await fetch(`${NOCO_BASE_URL}/${SPLIT_TABLE_ID}/records?limit=100`, {
      headers: { "xc-token": NOCO_TOKEN },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.list) && data.list.length > 0) {
        memoryCache = data.list.map((row) => {
          let parsedConfig = {};
          let parsedStats = {};
          try {
            parsedConfig = typeof row.Config === "string" ? JSON.parse(row.Config) : (row.config ? JSON.parse(row.config) : {});
          } catch (e) {}
          try {
            parsedStats = typeof row.Stats === "string" ? JSON.parse(row.Stats) : (row.stats ? JSON.parse(row.stats) : {});
          } catch (e) {}

          const variants = (parsedConfig.variants || []).map((v) => {
            const stat = (parsedStats[v.id] || {});
            return {
              ...v,
              visits: stat.visits ?? v.visits ?? 0,
              leads: stat.leads ?? v.leads ?? 0,
              paid: stat.paid ?? v.paid ?? 0,
            };
          });

          return {
            id: String(row.Id || row.id || `exp_${row.Slug || row.slug}`),
            nocoRowId: row.Id || row.id,
            name: row.Name || row.name || "",
            slug: row.Slug || row.slug || "",
            status: row.Status || row.status || "active",
            createdAt: row.CreatedAt || row.created_at || new Date().toISOString(),
            variants,
          };
        });
        lastCacheSync = now;
        return memoryCache;
      }
    }
  } catch (err) {
    console.error("NocoDB fetch error, using memory fallback:", err);
  }

  return memoryCache;
}

// Sync one experiment to NocoDB
export async function saveExperimentToDb(exp) {
  // Update memory first
  const existingIdx = memoryCache.findIndex((e) => e.slug === exp.slug || e.id === exp.id);
  if (existingIdx >= 0) {
    memoryCache[existingIdx] = { ...memoryCache[existingIdx], ...exp };
  } else {
    memoryCache.unshift(exp);
  }

  // Extract config & stats
  const config = {
    variants: exp.variants.map((v) => ({
      id: v.id,
      name: v.name,
      url: v.url,
      weight: v.weight,
    })),
  };
  const stats = {};
  exp.variants.forEach((v) => {
    stats[v.id] = {
      visits: v.visits || 0,
      leads: v.leads || 0,
      paid: v.paid || 0,
    };
  });

  const payload = {
    Slug: exp.slug,
    Name: exp.name,
    Status: exp.status || "active",
    Config: JSON.stringify(config),
    Stats: JSON.stringify(stats),
  };

  try {
    // Check if record exists in NocoDB
    const checkRes = await fetch(
      `${NOCO_BASE_URL}/${SPLIT_TABLE_ID}/records?where=(Slug,eq,${encodeURIComponent(exp.slug)})&limit=1`,
      { headers: { "xc-token": NOCO_TOKEN } }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      if (data.list && data.list.length > 0) {
        const rowId = data.list[0].Id || data.list[0].id;
        await fetch(`${NOCO_BASE_URL}/${SPLIT_TABLE_ID}/records`, {
          method: "PATCH",
          headers: {
            "xc-token": NOCO_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Id: rowId, ...payload }),
        });
        return;
      }
    }

    // Insert new
    await fetch(`${NOCO_BASE_URL}/${SPLIT_TABLE_ID}/records`, {
      method: "POST",
      headers: {
        "xc-token": NOCO_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("NocoDB save error:", err);
  }
}

// Record conversion (Lead or Paid)
export async function recordConversion(splitId, variantId, type = "lead") {
  const experiments = await fetchExperimentsFromDb();
  const exp = experiments.find((e) => e.id === splitId || e.slug === splitId);
  if (!exp) return false;

  const variant = exp.variants.find((v) => v.id === variantId || v.url === variantId);
  if (!variant) return false;

  if (type === "lead") {
    variant.leads = (variant.leads || 0) + 1;
  } else if (type === "paid") {
    variant.paid = (variant.paid || 0) + 1;
  }

  // Asynchronously sync stats to NocoDB
  saveExperimentToDb(exp).catch((e) => console.error("Async conversion save error:", e));
  return true;
}

// Record visit
export async function recordVisit(splitId, variantId) {
  const experiments = await fetchExperimentsFromDb();
  const exp = experiments.find((e) => e.id === splitId || e.slug === splitId);
  if (!exp) return false;

  const variant = exp.variants.find((v) => v.id === variantId);
  if (!variant) return false;

  variant.visits = (variant.visits || 0) + 1;

  // Asynchronously sync stats to NocoDB
  saveExperimentToDb(exp).catch((e) => console.error("Async visit save error:", e));
  return true;
}

export async function getExperiments() {
  return await fetchExperimentsFromDb();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method, query } = req;
  const action = query.action;

  try {
    const experiments = await fetchExperimentsFromDb();

    // 1. GET: Return experiments
    if (method === "GET") {
      if (query.slug) {
        const found = experiments.find(
          (e) => e.slug.toLowerCase() === query.slug.toLowerCase(),
        );
        if (!found) {
          return res.status(404).json({ error: "Experiment not found" });
        }
        return res.status(200).json(found);
      }

      return res.status(200).json({
        success: true,
        experiments,
        totalExperiments: experiments.length,
      });
    }

    // 2. POST: Create, Update or Track
    if (method === "POST") {
      const body = req.body || {};

      if (action === "conversion") {
        const { splitId, variantId, type } = body;
        const success = await recordConversion(splitId, variantId, type || "lead");
        return res.status(200).json({ success });
      }

      if (action === "visit") {
        const { splitId, variantId } = body;
        const success = await recordVisit(splitId, variantId);
        return res.status(200).json({ success });
      }

      const { name, slug, variants } = body;
      if (!name || !slug || !variants || variants.length < 2) {
        return res.status(400).json({
          error: "Missing required fields: name, slug, and at least 2 variants",
        });
      }

      const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      const existing = experiments.find((e) => e.slug === cleanSlug || (body.id && e.id === body.id));

      const formattedVariants = variants.map((v, i) => {
        const oldV = existing?.variants?.find((ov) => ov.id === v.id);
        return {
          id: v.id || `var_${i === 0 ? "a" : i === 1 ? "b" : i}`,
          name: v.name || `Variant ${i === 0 ? "A" : "B"}`,
          url: v.url,
          weight: parseInt(v.weight, 10) || 50,
          visits: oldV?.visits || v.visits || 0,
          leads: oldV?.leads || v.leads || 0,
          paid: oldV?.paid || v.paid || 0,
        };
      });

      const updatedExp = {
        id: existing?.id || `exp_${Date.now()}`,
        name,
        slug: cleanSlug,
        status: body.status || existing?.status || "active",
        createdAt: existing?.createdAt || new Date().toISOString(),
        variants: formattedVariants,
      };

      await saveExperimentToDb(updatedExp);

      return res.status(200).json({
        success: true,
        experiment: updatedExp,
        message: "Experiment saved successfully in NocoDB",
      });
    }

    // 3. DELETE: Remove or Reset
    if (method === "DELETE") {
      const { id, resetOnly } = query;
      if (!id) {
        return res.status(400).json({ error: "Experiment ID is required" });
      }

      const exp = experiments.find((e) => e.id === id || e.slug === id);
      if (!exp) {
        return res.status(404).json({ error: "Experiment not found" });
      }

      if (resetOnly === "true") {
        exp.variants.forEach((v) => {
          v.visits = 0;
          v.leads = 0;
          v.paid = 0;
        });
        await saveExperimentToDb(exp);
        return res.status(200).json({
          success: true,
          message: "Stats reset successfully",
          experiment: exp,
        });
      }

      // Delete from memory and NocoDB
      const idx = memoryCache.findIndex((e) => e.id === id || e.slug === id);
      if (idx >= 0) memoryCache.splice(idx, 1);

      try {
        const checkRes = await fetch(
          `${NOCO_BASE_URL}/${SPLIT_TABLE_ID}/records?where=(Slug,eq,${encodeURIComponent(exp.slug)})&limit=1`,
          { headers: { "xc-token": NOCO_TOKEN } }
        );
        if (checkRes.ok) {
          const data = await checkRes.json();
          if (data.list && data.list.length > 0) {
            const rowId = data.list[0].Id || data.list[0].id;
            await fetch(`${NOCO_BASE_URL}/${SPLIT_TABLE_ID}/records`, {
              method: "DELETE",
              headers: {
                "xc-token": NOCO_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Id: rowId }),
            });
          }
        }
      } catch (err) {
        console.error("NocoDB delete error:", err);
      }

      return res.status(200).json({
        success: true,
        message: "Experiment deleted successfully",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Split API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
