// ============================================================
// cookie.js - Cookie Consent Banner & Preferences Management
// ============================================================

(function () {
  const COOKIE_KEY = 'cookie_consent_preferences';

  function getSavedConsent() {
    try {
      const data = localStorage.getItem(COOKIE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consentObj) {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({
        ...consentObj,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to save cookie consent preferences:', e);
    }
  }

  function showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // Trigger smooth slide up transition
    requestAnimationFrame(function () {
      setTimeout(function () {
        banner.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        banner.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
      }, 400);
    });
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // Trigger smooth slide down transition
    banner.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
    banner.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
  }

  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const consent = getSavedConsent();
    if (!consent) {
      showBanner();
    } else {
      hideBanner();
    }
  }

  window.acceptAllCookies = function () {
    saveConsent({
      status: 'accepted',
      analytics: true,
      marketing: true
    });
    hideBanner();
  };

  window.rejectCookies = function () {
    saveConsent({
      status: 'rejected',
      analytics: false,
      marketing: false
    });
    hideBanner();
  };

  window.closeCookieBanner = function () {
    hideBanner();
  };

  window.openCookieSettings = function () {
    const modal = document.getElementById('cookie-settings-modal');
    const modalCard = document.getElementById('cookie-modal-card');
    if (!modal) return;

    const consent = getSavedConsent();
    const analyticsCheckbox = document.getElementById('cookie-opt-analytics');
    const marketingCheckbox = document.getElementById('cookie-opt-marketing');

    if (consent) {
      if (analyticsCheckbox) analyticsCheckbox.checked = !!consent.analytics;
      if (marketingCheckbox) marketingCheckbox.checked = !!consent.marketing;
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto');

    if (modalCard) {
      modalCard.classList.remove('scale-95', 'translate-y-4');
      modalCard.classList.add('scale-100', 'translate-y-0');
    }
  };

  window.closeCookieSettings = function () {
    const modal = document.getElementById('cookie-settings-modal');
    const modalCard = document.getElementById('cookie-modal-card');
    if (!modal) return;

    if (modalCard) {
      modalCard.classList.remove('scale-100', 'translate-y-0');
      modalCard.classList.add('scale-95', 'translate-y-4');
    }

    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
  };

  window.saveCookieSettings = function () {
    const analyticsCheckbox = document.getElementById('cookie-opt-analytics');
    const marketingCheckbox = document.getElementById('cookie-opt-marketing');

    const analytics = analyticsCheckbox ? analyticsCheckbox.checked : false;
    const marketing = marketingCheckbox ? marketingCheckbox.checked : false;

    saveConsent({
      status: 'custom',
      analytics: analytics,
      marketing: marketing
    });

    closeCookieSettings();
    hideBanner();
  };

  window.navigateToPrivacy = function (e) {
    if (e) e.preventDefault();
    if (window.location.hash !== '#privacy') {
      window.location.hash = '#privacy';
    }
  };

  window.resetCookieConsent = function () {
    localStorage.removeItem(COOKIE_KEY);
    showBanner();
  };

  // Initialize banner when components are loaded or DOM is ready
  document.addEventListener('componentsLoaded', initCookieBanner);
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initCookieBanner, 300);
  });
})();
