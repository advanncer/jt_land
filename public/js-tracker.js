/**
 * JustSchool Universal Splitter & Lead Attribution Tracker
 * Embed on external platforms (Good Promo, Landing Creator, custom quiz pages)
 */
(function() {
  function getParam(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  // 1. Extract Splitter attributes from URL
  var splitId = getParam('split_id');
  var splitVariant = getParam('split_variant');

  // Persist in localStorage/sessionStorage so it survives multi-step flows
  if (splitId) {
    try {
      sessionStorage.setItem('js_split_id', splitId);
      sessionStorage.setItem('js_split_variant', splitVariant);
    } catch(e) {}
  } else {
    try {
      splitId = sessionStorage.getItem('js_split_id');
      splitVariant = sessionStorage.getItem('js_split_variant');
    } catch(e) {}
  }

  // 2. Global helper for external pages to track registration/lead
  window.justSchoolTrackLead = function(leadData) {
    if (!splitId || !splitVariant) {
      console.log('[JustSchool Tracker] No active split_id, skipping splitter attribution');
      return;
    }

    var endpoint = 'https://lp.justschool.me/api/track-conversion';
    var payload = {
      split_id: splitId,
      split_variant: splitVariant,
      lead: leadData || {}
    };

    // Use sendBeacon if available for 100% delivery during page navigation
    if (navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function(err) {
        console.error('[JustSchool Tracker] Track error:', err);
      });
    }
    console.log('[JustSchool Tracker] Lead tracked for split:', splitId, splitVariant);
  };

  // 3. Auto-populate hidden input fields in Good Promo / Landing Creator forms
  function injectHiddenInputs() {
    if (!splitId || !splitVariant) return;
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      if (!form.querySelector('input[name="split_id"]')) {
        var inputId = document.createElement('input');
        inputId.type = 'hidden';
        inputId.name = 'split_id';
        inputId.value = splitId;
        form.appendChild(inputId);

        var inputVar = document.createElement('input');
        inputVar.type = 'hidden';
        inputVar.name = 'split_variant';
        inputVar.value = splitVariant;
        form.appendChild(inputVar);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHiddenInputs);
  } else {
    injectHiddenInputs();
  }
})();
