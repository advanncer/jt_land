/**
 * JustSchool Universal Splitter & Lead Attribution Tracker
 * Automatically tracks conversions and passes split attributes for:
 * - Good Promo quizzes (quiz.justschool.me)
 * - Landing Creator pages (lp.justschool.me)
 * - Custom / React landing pages
 */
(function () {
  function getParam(name) {
    var match = RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
  }

  // 1. Extract Splitter attributes from URL, referrer, or session
  var splitId = getParam("split_id");
  var splitVariant = getParam("split_variant");

  if (!splitId && document.referrer) {
    try {
      var refUrl = new URL(document.referrer);
      splitId = refUrl.searchParams.get("split_id");
      splitVariant = refUrl.searchParams.get("split_variant");
    } catch (e) {}
  }

  // Persist in sessionStorage so it survives multi-step flows and page navigation
  if (splitId && splitVariant) {
    try {
      sessionStorage.setItem("js_split_id", splitId);
      sessionStorage.setItem("js_split_variant", splitVariant);
    } catch (e) {}
  } else {
    try {
      splitId = sessionStorage.getItem("js_split_id") || "";
      splitVariant = sessionStorage.getItem("js_split_variant") || "";
    } catch (e) {}
  }

  // Fallback to cookie (from /s/:slug redirect)
  if (!splitId) {
    try {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf("js_split_") === 0) {
          var eqIdx = c.indexOf("=");
          if (eqIdx > -1) {
            splitId = c.substring(9, eqIdx);
            splitVariant = decodeURIComponent(c.substring(eqIdx + 1));
            break;
          }
        }
      }
    } catch (e) {}
  }

  // Deduplication cache to prevent duplicate conversions on rapid clicks
  var trackedLeads = {};

  // 2. Core conversion tracking function
  function trackConversion(leadData) {
    if (!splitId || !splitVariant) {
      console.log("[JustSchool Tracker] No active split experiment, skipping conversion tracking.");
      return;
    }

    var leadObj = leadData || {};
    var leadKey = leadObj.phone || leadObj.email || leadObj.name || (splitId + "_" + splitVariant);
    var now = Date.now();

    if (trackedLeads[leadKey] && (now - trackedLeads[leadKey] < 15000)) {
      console.log("[JustSchool Tracker] Conversion already tracked within 15s for", leadKey);
      return;
    }
    trackedLeads[leadKey] = now;

    var endpoint = "https://lp.justschool.me/api/track-conversion";
    var payload = {
      split_id: splitId,
      split_variant: splitVariant,
      lead: leadObj,
    };

    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon(endpoint, blob);
      } else if (window.fetch) {
        window.fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(function () {});
      } else {
        var img = new Image();
        img.src = endpoint + "?split_id=" + encodeURIComponent(splitId) + "&split_variant=" + encodeURIComponent(splitVariant);
      }
      console.log("[JustSchool Tracker] Conversion successfully sent for split:", splitId, splitVariant, leadObj);
    } catch (err) {
      console.error("[JustSchool Tracker] Conversion send error:", err);
    }
  }

  // Expose global tracker helper
  window.justSchoolTrackLead = trackConversion;

  // 3. Auto-intercept XMLHttpRequest (Used by Good Promo jQuery AJAX -> n8n webhook)
  (function interceptXHR() {
    var origOpen = XMLHttpRequest.prototype.open;
    var origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      this._method = method;
      return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      var url = this._url || "";
      if (typeof url === "string" && (url.indexOf("n8n.justschool.me") > -1 || url.indexOf("/webhook/") > -1 || url.indexOf("/api/submit") > -1)) {
        try {
          var leadData = null;
          if (typeof body === "string") {
            try { leadData = JSON.parse(body); } catch (e) {}
          }
          if (leadData) {
            // Auto-enrich outgoing payload with split_id if missing
            if (splitId && splitVariant && !leadData.split_id) {
              leadData.split_id = splitId;
              leadData.split_variant = splitVariant;
              body = JSON.stringify(leadData);
            }
            trackConversion(leadData);
          }
        } catch (e) {
          console.error("[JustSchool Tracker] XHR intercept error:", e);
        }
      }
      return origSend.apply(this, [body]);
    };
  })();

  // 4. Auto-intercept fetch (Used by Landing Creator and React funnels -> /api/submit)
  (function interceptFetch() {
    if (!window.fetch) return;
    var origFetch = window.fetch;

    window.fetch = function (resource, init) {
      var url = typeof resource === "string" ? resource : (resource && resource.url) || "";
      if (typeof url === "string" && (url.indexOf("/api/submit") > -1 || url.indexOf("n8n.justschool.me") > -1 || url.indexOf("/webhook/") > -1)) {
        try {
          if (init && init.body && typeof init.body === "string") {
            var parsed = null;
            try { parsed = JSON.parse(init.body); } catch (e) {}
            if (parsed) {
              if (splitId && splitVariant && !parsed.split_id) {
                parsed.split_id = splitId;
                parsed.split_variant = splitVariant;
                init.body = JSON.stringify(parsed);
              }
              trackConversion(parsed);
            }
          }
        } catch (e) {
          console.error("[JustSchool Tracker] Fetch intercept error:", e);
        }
      }
      return origFetch.apply(this, [resource, init]);
    };
  })();

  // 5. Auto-enhance standard HTML forms & listen for submit
  function enhanceForm(form) {
    if (!splitId || !splitVariant) return;
    if (!form.querySelector('input[name="split_id"]')) {
      var inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.name = "split_id";
      inputId.value = splitId;
      form.appendChild(inputId);

      var inputVar = document.createElement("input");
      inputVar.type = "hidden";
      inputVar.name = "split_variant";
      inputVar.value = splitVariant;
      form.appendChild(inputVar);
    }
  }

  function scanForms() {
    var forms = document.querySelectorAll("form");
    for (var i = 0; i < forms.length; i++) {
      enhanceForm(forms[i]);
    }
  }

  // 6. Good Promo button click fallback (captures phone and name on click)
  function setupButtonListeners() {
    document.addEventListener("click", function (e) {
      var target = e.target;
      var btn = target.closest && target.closest(".button-next.b-send-form, .b-send-form, button[type='submit'], .btn-submit");
      if (btn) {
        var phoneEl = document.querySelector("#phone, input[type='tel'], input[name='phone'], input[name='Phone']");
        var nameEl = document.querySelector("#input_name, input[name='name'], input[name='Name']");
        var emailEl = document.querySelector("#input_email, input[type='email'], input[name='email'], input[name='Email']");
        var phone = phoneEl ? (phoneEl.value || phoneEl.innerText) : "";
        var name = nameEl ? (nameEl.value || nameEl.innerText) : "";
        var email = emailEl ? (emailEl.value || emailEl.innerText) : "";

        if (phone && phone.replace(/\D/g, "").length >= 7) {
          trackConversion({ phone: phone, name: name, email: email, trigger: "button_click" });
        }
      }
    }, true);

    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form || form.tagName !== "FORM") return;
      var phoneEl = form.querySelector("input[type='tel'], input[name='phone'], input[name='Phone']");
      var nameEl = form.querySelector("input[name='name'], input[name='Name']");
      var emailEl = form.querySelector("input[type='email'], input[name='email'], input[name='Email']");
      var phone = phoneEl ? phoneEl.value : "";
      var name = nameEl ? nameEl.value : "";
      var email = emailEl ? emailEl.value : "";

      if (phone) {
        trackConversion({ phone: phone, name: name, email: email, formId: form.id || form.name });
      }
    }, true);
  }

  // 7. Initialize DOM enhancements & MutationObserver for single-page apps
  function init() {
    scanForms();
    setupButtonListeners();

    if (window.MutationObserver && document.body) {
      var observer = new MutationObserver(function () {
        scanForms();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
