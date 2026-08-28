import { getExperiments, recordVisit } from "../split.js";

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.redirect(307, "/");
  }

  const cleanSlug = Array.isArray(slug) ? slug[0] : slug;
  const experiments = getExperiments();
  const experiment = experiments.find(
    (e) => e.slug.toLowerCase() === cleanSlug.toLowerCase() && e.status === "active",
  );

  if (!experiment || !experiment.variants || experiment.variants.length === 0) {
    // Fallback: If no experiment found, redirect to home or 404
    return res.redirect(307, "/");
  }

  // 1. Pick variant based on weighted random selection or user cookie
  const totalWeight = experiment.variants.reduce((sum, v) => sum + (v.weight || 0), 0);
  let random = Math.random() * (totalWeight || 100);
  let selectedVariant = experiment.variants[0];

  for (const variant of experiment.variants) {
    if (random < variant.weight) {
      selectedVariant = variant;
      break;
    }
    random -= variant.weight;
  }

  // 2. Track visit in the background
  try {
    recordVisit(experiment.id, selectedVariant.id);
  } catch (err) {
    console.error("Error recording visit:", err);
  }

  // 3. Build destination URL preserving all query params (UTMs, fbclid, etc.)
  const targetBase = selectedVariant.url.startsWith("http")
    ? selectedVariant.url
    : `https://lp.justschool.me${selectedVariant.url.startsWith("/") ? "" : "/"}${selectedVariant.url}`;

  const destinationUrl = new URL(targetBase);

  // Copy over all original query params
  Object.keys(req.query).forEach((key) => {
    if (key !== "slug") {
      destinationUrl.searchParams.set(key, req.query[key]);
    }
  });

  // Attach split metadata for attribution and tracking in lead forms
  destinationUrl.searchParams.set("split_id", experiment.slug);
  destinationUrl.searchParams.set("split_variant", selectedVariant.id);

  // 4. Send 307 Temporary Redirect (prevent CDN/Browser aggressive caching of random splits)
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  return res.redirect(307, destinationUrl.toString());
}
