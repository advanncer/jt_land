# CLAUDE.md / AGENTS.md — JustSchool Funnel Engineering Standards

You are working in the `justschool-funnel` repository (`https://lp.justschool.me`), a Multi-Page React 19 + TypeScript + Tailwind CSS v4 + Vite application deployed on Vercel (`git@github.com:advanncer/jt_land.git`).

For the full master documentation, catalog of funnels, prompt templates, B2B architecture, and Constructor specification, read [`PLAYBOOK_AND_CONSTRUCTOR_SPEC.md`](./PLAYBOOK_AND_CONSTRUCTOR_SPEC.md).

---

## 1. Architecture & Routing Rules
1. **Multi-Page Vite App:** Every landing page lives in its own folder with an `index.html`, `src/main.tsx`, and `src/App.tsx`.
2. **Registration:** Every new landing MUST be registered in TWO places:
   - `vite.config.ts` -> `build.rollupOptions.input`
   - `vercel.json` -> `rewrites` (always use clean dedicated routes such as `/black-friday` and `/bf-v1` rather than relying on GET-parameter variant toggles).
3. **Design System (`ds/`):** Always use the JustSchool Design System tokens and components located in `eng-adult/quiz-plan-v2/src/ds/` and `eng-adult/black-friday/src/ds/`.
   - Primary font: `Montserrat` (`--font-core`).
   - Page background: `var(--surface-page-warm)` (`#FFF5EB`).
   - Brand color: `var(--brand)` (`#F56600`), hover `var(--brand-hover)` (`#D95B00`).
4. **Banner Optimization:** Always compress hero banners into optimized JPEGs (`< 300 KB`) with separate desktop (`1920px`) and mobile (`1100px`) assets rendered via `<picture>`. Never leave baked-in non-clickable buttons inside banner images on V1 single-screen funnels; crop them out and render a real interactive button right underneath.

---

## 2. CRM Lead Delivery & Reliability Mandates
1. **Unified API Route:** NEVER call external webhooks (`n8n.justschool.me`, `esputnik`, `nocodb`, `supabase`) directly from the browser. Always `POST` JSON payloads to `/api/submit`.
2. **Double Submission Protection:**
   - Maintain `const [isSubmitting, setIsSubmitting] = useState(false);`.
   - Guard the submit handler with `if (isSubmitting) return;` on line 1.
   - Disable all inputs (`disabled={isSubmitting}`) with `disabled:opacity-50` and change the submit button text to `"Надсилаємо заявку..."`.
3. **Safe Onboarding Redirects (Zero 404s):**
   - Never redirect to `https://justschool.me/uk/onboarding` (returns 404).
   - Use `result.redirectUri` from `/api/submit`, and if empty or pointing to `/uk/onboarding`, fallback to:
     `email ? "https://id.justschool.me/login?email=" + encodeURIComponent(email) : "https://student.justschool.me/onboarding"`.
   - Always include a 7000ms `setTimeout` fallback so the user is redirected even if the network hangs.
4. **B2B Isolation:** Corporate B2B funnels (`b2b_ukrsib`, `b2b_metinvest`, `b2b_brsm`, `b2b_calc`) MUST NOT create retail deals in Creatio CRM (`skipCreatio: true`) and MUST NOT trigger retail eSputnik campaigns (`skipEsputnik: true`). Route them to Supabase and directly to Google Sheets via `api/googleSheets.js` using Service Account `adsoulx@silken-eye-503718-k1.iam.gserviceaccount.com`.

---

## 3. Multi-Country Phone Input (`PhoneInput.tsx`)
1. Detect user country on mount via `fetch('https://ipinfo.io/json')`.
2. Render a clickable flag dropdown inside the left side of the phone field supporting UA 🇺🇦 (`+380`, 12 digits + operator code check), PL 🇵🇱 (`+48`, 11 digits), DE 🇩🇪 (`+49`), RO 🇷🇴 (`+40`), SK 🇸🇰 (`+421`), CZ 🇨🇿 (`+420`), GB 🇬🇧 (`+44`), US 🇺🇸 (`+1`, 11 digits).
3. Support "Magic on the Fly" keystroke auto-detection when typing or pasting dial codes (`380`, `48`, `0...`).
4. Pre-fill country prefix on focus; clear on blur if only the prefix remains.
5. Output phone numbers strictly as `+` followed by digits (e.g. `+380952150831`).

---

## 4. Mandatory Analytics & Tracking (`index.html` + `App.tsx`)
1. Include Google Tag Manager (`GTM-P6BDRT25`), Facebook Pixel (`9067851526565677`), and `<script src="https://lp.justschool.me/js-tracker.js" async></script>` in every `index.html`.
2. Push `quiz_step_reach` to `window.dataLayer` on every step change, and `form_success` + `fbq('track', 'Lead')` on lead submission.
3. Preserve and forward `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `leadType` (`english-for-adults`, `english-for-children`, etc.).
