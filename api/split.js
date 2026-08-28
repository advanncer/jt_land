// In-memory persistent state fallback with KV/JSON support
// In a serverless environment, this manages active split tests, links, and real-time stats

let experimentsStore = [
  {
    id: "exp_eng_adult_1",
    name: "English Adult: Main LP vs Pains LP",
    slug: "eng-adult",
    status: "active", // "active" | "paused"
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
  {
    id: "exp_child_quiz_1",
    name: "English Child: Dark Quiz vs White Quiz",
    slug: "child-quiz",
    status: "active",
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    variants: [
      {
        id: "var_a",
        name: "Variant A (Dark Quiz)",
        url: "/eng-child/quiz-bo-v1",
        weight: 50,
        visits: 185,
        leads: 24,
        paid: 3,
      },
      {
        id: "var_b",
        name: "Variant B (White Quiz)",
        url: "/eng-child/quiz-bo-v1-white",
        weight: 50,
        visits: 192,
        leads: 31,
        paid: 5,
      },
    ],
  },
];

// Helper to record conversions
export function recordConversion(splitId, variantId, type = "lead") {
  const exp = experimentsStore.find(
    (e) => e.id === splitId || e.slug === splitId,
  );
  if (!exp) return false;
  const variant = exp.variants.find(
    (v) => v.id === variantId || v.url === variantId,
  );
  if (!variant) return false;

  if (type === "lead") {
    variant.leads = (variant.leads || 0) + 1;
  } else if (type === "paid") {
    variant.paid = (variant.paid || 0) + 1;
  }
  return true;
}

// Helper to record visit
export function recordVisit(splitId, variantId) {
  const exp = experimentsStore.find(
    (e) => e.id === splitId || e.slug === splitId,
  );
  if (!exp) return false;
  const variant = exp.variants.find((v) => v.id === variantId);
  if (!variant) return false;

  variant.visits = (variant.visits || 0) + 1;
  return true;
}

export function getExperiments() {
  return experimentsStore;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method, query } = req;
  const action = query.action;

  try {
    // 1. GET: Return list of all experiments with stats
    if (method === "GET") {
      if (query.slug) {
        const found = experimentsStore.find(
          (e) => e.slug.toLowerCase() === query.slug.toLowerCase(),
        );
        if (!found) {
          return res.status(404).json({ error: "Experiment not found" });
        }
        return res.status(200).json(found);
      }

      return res.status(200).json({
        success: true,
        experiments: experimentsStore,
        totalExperiments: experimentsStore.length,
      });
    }

    // 2. POST: Create or Update an experiment
    if (method === "POST") {
      const body = req.body || {};

      // Handle direct conversion recording from external forms/webhooks
      if (action === "conversion") {
        const { splitId, variantId, type } = body;
        const success = recordConversion(splitId, variantId, type || "lead");
        return res.status(200).json({ success });
      }

      // Handle visit recording
      if (action === "visit") {
        const { splitId, variantId } = body;
        const success = recordVisit(splitId, variantId);
        return res.status(200).json({ success });
      }

      // Create or update experiment
      const { name, slug, variants } = body;

      if (!name || !slug || !variants || variants.length < 2) {
        return res.status(400).json({
          error: "Missing required fields: name, slug, and at least 2 variants",
        });
      }

      const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");

      const existingIndex = experimentsStore.findIndex(
        (e) => e.slug === cleanSlug || (body.id && e.id === body.id),
      );

      const formattedVariants = variants.map((v, i) => ({
        id: v.id || `var_${i === 0 ? "a" : i === 1 ? "b" : i}`,
        name: v.name || `Variant ${i === 0 ? "A" : "B"}`,
        url: v.url,
        weight: parseInt(v.weight, 10) || 50,
        visits: v.visits || 0,
        leads: v.leads || 0,
        paid: v.paid || 0,
      }));

      if (existingIndex >= 0) {
        // Update
        experimentsStore[existingIndex] = {
          ...experimentsStore[existingIndex],
          name: name || experimentsStore[existingIndex].name,
          slug: cleanSlug,
          status: body.status || experimentsStore[existingIndex].status || "active",
          variants: formattedVariants,
          updatedAt: new Date().toISOString(),
        };

        return res.status(200).json({
          success: true,
          experiment: experimentsStore[existingIndex],
          message: "Experiment updated successfully",
        });
      } else {
        // Create
        const newExp = {
          id: `exp_${Date.now()}`,
          name,
          slug: cleanSlug,
          status: "active",
          createdAt: new Date().toISOString(),
          variants: formattedVariants,
        };

        experimentsStore.unshift(newExp);

        return res.status(201).json({
          success: true,
          experiment: newExp,
          message: "Experiment created successfully",
        });
      }
    }

    // 3. DELETE: Remove or Reset an experiment
    if (method === "DELETE") {
      const { id, resetOnly } = query;
      if (!id) {
        return res.status(400).json({ error: "Experiment ID is required" });
      }

      const expIndex = experimentsStore.findIndex((e) => e.id === id);
      if (expIndex === -1) {
        return res.status(404).json({ error: "Experiment not found" });
      }

      if (resetOnly === "true") {
        // Reset stats
        experimentsStore[expIndex].variants.forEach((v) => {
          v.visits = 0;
          v.leads = 0;
          v.paid = 0;
        });
        return res.status(200).json({
          success: true,
          message: "Stats reset successfully",
          experiment: experimentsStore[expIndex],
        });
      }

      experimentsStore.splice(expIndex, 1);
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
