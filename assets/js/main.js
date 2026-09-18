(function () {
  'use strict';

  var KEY = 'theme';

  function nearest(node, selector) {
    return node && node.closest ? node.closest(selector) : null;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }

  function storedTheme() {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
    } catch (err) {
      return 'light';
    }
  }

  applyTheme(storedTheme());

  document.addEventListener('click', function (e) {
    var t = e.target;

    if (nearest(t, '[data-theme-toggle]')) {
      var html = document.documentElement;
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (err) {}
      return;
    }

    var copyEl = nearest(t, '[data-copy]');
    if (copyEl) {
      copyText(copyEl.getAttribute('data-copy'));
      return;
    }

    var lbClose = nearest(t, '[data-lightbox-close]');
    var dialog = lbClose ? nearest(lbClose, 'dialog') : null;
    if (dialog && dialog.close) {
      dialog.close();
      return;
    }

    if (t.tagName === 'DIALOG' && t.close) {
      t.close();
      return;
    }

    var trigger = nearest(t, '[data-lightbox]');
    if (trigger) {
      var target = document.querySelector(trigger.getAttribute('data-lightbox'));
      if (target && target.showModal && !target.open) {
        target.showModal();
      }
    }
  });

  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = 'Copied!';
  document.body.appendChild(toast);

  var toastTimer = null;
  function showToast() {
    toast.setAttribute('data-visible', 'true');
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      toast.setAttribute('data-visible', 'false');
    }, 2000);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.className = 'copy-fallback';
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(ta);
    if (ok) {
      showToast();
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showToast, function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

})();