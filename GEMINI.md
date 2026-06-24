# funnel-landings Repository Standards

This document establishes the repository-wide engineering mandates and UI/UX standards for all current and future funnel landing pages and quizzes in the `/Users/admin/Project/justschool-funnel` workspace.

## 1. CRM Lead Delivery & Reliability Mandates (Creatio / NocoDB)

To prevent lead loss due to CORS, adblockers, and API validation failures:
* **Unified API Route:** NEVER fetch external API/webhooks (e.g. `n8n.justschool.me`) directly from the browser. All forms MUST POST their payloads to the local serverless `/api/submit` endpoint.
* **Double Submission Protection:** Every lead form and button submission handler MUST implement state tracking to disable inputs and submission buttons during active requests:
  * Maintain an `isSubmitting` boolean state.
  * Disable all text/tel/email inputs (`disabled={isSubmitting}`) with visual feedback (`disabled:opacity-50`).
  * Disable the submission button (`disabled={isSubmitting}`) and change its text to `"Надсилаємо заявку..."` while sending.
  * In the parent navigation handler, add a guard: `if (isSubmitting) return;` at the absolute beginning.
* **Strict Phone Sanitization:** All phone numbers saved to databases or CRM MUST be formatted on the backend as raw flat strings consisting of `+` followed strictly by digits (e.g. `+380952150831` or `+420777259700`). The `/api/submit.js` serverless function automatically enforces this sanitization to ensure compatibility with Creatio API validators.

---

## 2. Multi-Country Phone Masking & Dynamic GEO Flags

All lead capture forms MUST support global users, particularly Ukrainians living in other countries:
* **IP-based GEO Detection:** On page mount, fetch user geo-location metadata using `https://ipinfo.io/json` to determine the user's current country code (e.g., `"UA"`, `"PL"`, `"RO"`, `"DE"`).
* **Clickable Country Dropdown (Dropdown Selector):**
  * Render a clickable flag button on the left inside the phone input field displaying the active country's flag emoji (`getFlagEmoji(country)`) and a dropdown indicator (`▼`).
  * Clicking the flag opens a dropdown listing popular countries (Ukraine 🇺🇦, Poland 🇵🇱, Germany 🇩🇪, Romania 🇷🇴, Slovakia 🇸🇰, Czech Republic 🇨🇿, UK 🇬🇧, USA 🇺🇸).
  * Selecting a country instantly switches the active flag, placeholder, input mask prefix, and length validation.
* **Keystroke Auto-Detection ("Magic on the Fly"):**
  * If a user types or pastes country dial codes (like starting with `380` or `48` or `0...` on the fly), the phone formatter MUST automatically detect this dial code and switch the active flag, mask template, and validation to match that country on the fly without manual selection.
* **Unified Masking Template:**
  * **Ukraine (`+380`):** Format as `+380 (XX) XXX-XX-XX` (strict length check of 12 digits).
  * **Poland (`+48`):** Format as `+48 (XXX) XXX-XXX` (strict length check of 11 digits).
  * **USA/Canada (`+1`):** Format as `+1 (XXX) XXX-XXXX` (strict length check of 11 digits).
  * **Other Countries:** Format as `+DialCode XXX XXX XXX...` (dynamic length validation of 9 to 15 digits).
* **Pre-fill on Focus:** On focusing an empty field, pre-populate the input with the active country's prefix (e.g., `+380 (`). On blur, if the field contains only the prefix or code, clear it out.
