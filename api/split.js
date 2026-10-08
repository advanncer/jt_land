// Persistent Split Experiments Store backed by NocoDB System Record (Id: 2)
const NOCO_TOKEN = process.env.NOCODB_TOKEN || "xKYg5pA_NAjvwAtnl9IGkJd---0F5BN8MFm992xO";
const MAIN_TABLE_ID = process.env.NOCODB_TABLE_ID || "mwyhw2a79xopbef";
const NOCO_BASE_URL = "https://app.nocodb.com/api/v2/tables";
const CONFIG_ROW_ID = 2; // System record storing split config & analytics in QA column

// Default seed experiments
const DEFAULT_EXPERIMENTS = [
  {
    id: "exp_1791461996672",
    name: "JustClass GoodPromo VS SiteLP",
    slug: "gp-stlp",
    status: "active",
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: "var_a",
        name: "JustClass: Main Landing",
        url: "https://justclass.com.ua/vseukrainski-olimpiady/?utm_source=facebook&utm_medium=paid&utm_campaign=Julia_10-07-2026_JustClass_Platform_Purchase_UA_Wide_FB-INST_AllGender_25-65_LC_Olympiad_Ad_Y26_W41_Static_JustClass_LesyaUkrainka_var1_4&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}",
        weight: 50,
        visits: 0,
        leads: 0,
        paid: 0,
      },
      {
        id: "var_b",
        name: "JustClass: Interactive Quiz / Offer",
        url: "https://quiz.justschool.me/justclass_olymp/",
        weight: 50,
        visits: 0,
        leads: 0,
        paid: 0,
      },
    ],
  },
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

let memoryCache = [];
let lastCacheSync = 0;
const CACHE_TTL_MS = 10000; // 10 seconds

// Fetch all experiments from NocoDB system record
export async function fetchExperimentsFromDb() {
  const now = Date.now();
  if (memoryCache.length > 0 && lastCacheSync > 0 && now - lastCacheSync < CACHE_TTL_MS) {
    return memoryCache;
  }

  try {
    const res = await fetch(`${NOCO_BASE_URL}/${MAIN_TABLE_ID}/records/${CONFIG_ROW_ID}`, {
      headers: { "xc-token": NOCO_TOKEN },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.QA) {
        const parsed = JSON.parse(data.QA);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryCache = parsed;
          lastCacheSync = now;
          return memoryCache;
        }
    } else {
      console.error("NocoDB response not ok:", res.status);
    }
  } catch (err) {
    console.error("NocoDB fetch error, using memory cache:", err);
  }

  if (memoryCache.length === 0) {
    memoryCache = [...DEFAULT_EXPERIMENTS];
  }

  return memoryCache;
}

// Persist all experiments to NocoDB
export async function saveExperimentsToDb(experimentsList) {
  memoryCache = experimentsList;
  lastCacheSync = Date.now();

  try {
    await fetch(`${NOCO_BASE_URL}/${MAIN_TABLE_ID}/records`, {
      method: "PATCH",
      headers: {
        "xc-token": NOCO_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: CONFIG_ROW_ID,
        Title: "_SYSTEM_SPLIT_CONFIG_",
        QA: JSON.stringify(experimentsList),
      }),
    });
  } catch (err) {
    console.error("NocoDB save error:", err);
  }
}

// Record conversion
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

  saveExperimentsToDb(experiments).catch((e) => console.error("Async conversion save error:", e));
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

  saveExperimentsToDb(experiments).catch((e) => console.error("Async visit save error:", e));
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
        createdAt: existing?.createdAt || new Date().toISOString(),
        variants: formattedVariants,
      };

      if (existingIdx >= 0) {
        experiments[existingIdx] = updatedExp;
      } else {
        experiments.unshift(updatedExp);
      }

      await saveExperimentsToDb(experiments);

      return res.status(200).json({
        success: true,
        experiment: updatedExp,
        message: "Experiment saved successfully in NocoDB",
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
        await saveExperimentsToDb(experiments);
        return res.status(200).json({
          success: true,
          message: "Stats reset successfully",
          experiment: exp,
        });
      }

      const idx = experiments.findIndex((e) => e.id === id || e.slug === id);
      if (idx >= 0) {
        experiments.splice(idx, 1);
        await saveExperimentsToDb(experiments);
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
