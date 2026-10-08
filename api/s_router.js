import { getExperiments, recordVisit } from "./split.js";

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    const value = parts.slice(1).join("=").trim();
    if (name) cookies[name] = decodeURIComponent(value);
  });
  return cookies;
}

export default async function handler(req, res) {
  try {
    let slug = req.query.slug;
    if (!slug) {
      const match = req.url.match(/\/s\/([^/?#]+)/);
      if (match) slug = match[1];
    }

    if (!slug) {
      return res.redirect(307, "/splitter");
    }

    const cleanSlug = (Array.isArray(slug) ? slug[0] : slug).toLowerCase().trim();
    const experiments = await getExperiments();
    const experiment = experiments.find(
      (e) => e.slug.toLowerCase() === cleanSlug && e.status === "active",
    );

    if (!experiment || !experiment.variants || experiment.variants.length === 0) {
      return res.status(404).json({
        error: `Split experiment '/s/${cleanSlug}' not found or paused`,
        availableExperiments: experiments.map((e) => e.slug),
      });
    }

    // 1. Sticky Sessions: Check if user already visited this split
    const cookies = parseCookies(req.headers.cookie);
    const cookieKey = `js_split_${cleanSlug}`;
    let selectedVariant = null;

    if (cookies[cookieKey]) {
      selectedVariant = experiment.variants.find((v) => v.id === cookies[cookieKey]);
    }

    // 2. Pick variant based on configured weights
    let isNewVisit = false;
    if (!selectedVariant) {
      isNewVisit = true;
      const totalWeight = experiment.variants.reduce((sum, v) => sum + (v.weight || 0), 0);
      let random = Math.random() * (totalWeight || 100);
      selectedVariant = experiment.variants[0];

      for (const variant of experiment.variants) {
        if (random < variant.weight) {
          selectedVariant = variant;
          break;
        }
        random -= variant.weight;
      }
    }

    // 3. Track visit
    if (isNewVisit) {
      try {
        recordVisit(experiment.id, selectedVariant.id);
      } catch (err) {
        console.error("Error recording visit:", err);
      }
    }

    // 4. Build destination URL
    const targetBase = selectedVariant.url.startsWith("http")
      ? selectedVariant.url
      : `https://lp.justschool.me${selectedVariant.url.startsWith("/") ? "" : "/"}${selectedVariant.url}`;

    const destinationUrl = new URL(targetBase);

    // Forward original query parameters
    Object.keys(req.query).forEach((key) => {
      if (key !== "slug") {
        destinationUrl.searchParams.set(key, req.query[key]);
      }
    });

    destinationUrl.searchParams.set("split_id", experiment.slug);
    destinationUrl.searchParams.set("split_variant", selectedVariant.id);

    // 5. Sticky session cookie
    const cookieValue = `${cookieKey}=${encodeURIComponent(selectedVariant.id)}; Path=/; Max-Age=2592000; SameSite=Lax`;
    res.setHeader("Set-Cookie", cookieValue);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    return res.redirect(307, destinationUrl.toString());
  } catch (err) {
    console.error("Router error:", err);
    return res.status(500).json({ error: err.message });
  }
}
