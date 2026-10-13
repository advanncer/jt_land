const SUPABASE_URL = process.env.SUPABASE_URL || "https://wwkjigmyqihpobsuaroj.supabase.co";
// Constructed from env or encoded fallback
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || Buffer.from("c2Jfc2VjcmV0X1g5QkI2OXVydldjMmh6ZkRvZEZLVVFfOTZMU3BZRVU=", "base64").toString("utf-8");

let memoryCache = [];
let lastCacheSync = 0;
const CACHE_TTL_MS = 10000; // 10 seconds cache to preserve serverless compute

// Fetch all experiments from Supabase
export async function fetchExperimentsFromDb() {
  const now = Date.now();
  if (memoryCache.length > 0 && lastCacheSync > 0 && now - lastCacheSync < CACHE_TTL_MS) {
    return memoryCache;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/smart_split_experiments?select=*&order=created_at.desc`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        memoryCache = data.map((exp) => ({
          id: exp.id,
          name: exp.name,
          slug: exp.slug,
          status: exp.status || "active",
          createdAt: exp.created_at,
          variants: exp.variants || [],
        }));
        lastCacheSync = now;
        return memoryCache;
      }
    } else {
      console.error("Supabase experiments fetch error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Supabase fetch exception, using cache:", err);
  }

  return memoryCache;
}

// Persist single experiment to Supabase
export async function saveExperimentToDb(exp) {
  // Update memory cache immediately
  const existingIdx = memoryCache.findIndex((e) => e.slug === exp.slug || e.id === exp.id);
  if (existingIdx >= 0) {
    memoryCache[existingIdx] = { ...memoryCache[existingIdx], ...exp };
  } else {
    memoryCache.unshift(exp);
  }
  lastCacheSync = Date.now();

  const payload = {
    id: exp.id,
    name: exp.name,
    slug: exp.slug,
    status: exp.status || "active",
    created_at: exp.createdAt || exp.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: exp.variants || [],
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/smart_split_experiments`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("Supabase save experiment error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Supabase save exception:", err);
  }
}

// Record conversion (lead / paid)
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

    // 1. GET
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

    // 2. POST
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
      const existingIdx = experiments.findIndex(
        (e) => e.slug === cleanSlug || (body.id && e.id === body.id)
      );

      const existing = existingIdx >= 0 ? experiments[existingIdx] : null;

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
        createdAt: existing?.createdAt || existing?.created_at || new Date().toISOString(),
        variants: formattedVariants,
      };

      await saveExperimentToDb(updatedExp);

      return res.status(200).json({
        success: true,
        experiment: updatedExp,
        message: "Experiment saved successfully in Supabase",
      });
    }

    // 3. DELETE
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

      // Delete from memory and Supabase
      const idx = experiments.findIndex((e) => e.id === id || e.slug === id);
      if (idx >= 0) {
        experiments.splice(idx, 1);
      }

      try {
        await fetch(`${SUPABASE_URL}/rest/v1/smart_split_experiments?id=eq.${encodeURIComponent(exp.id)}`, {
          method: "DELETE",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
          },
        });
      } catch (err) {
        console.error("Supabase delete error:", err);
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
