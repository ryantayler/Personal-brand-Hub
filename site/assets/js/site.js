/* Ryan Tayler · personal site
   Three small jobs. Nothing here is decorative motion.
   1. Mobile nav drawer.
   2. Photo slots. A slot shows its label until a real file loads into it.
   3. A light reveal on scroll, switched off for reduced motion.
   Plus the signup handler, which posts to SIGNUP_ENDPOINT once one is set. */

(function () {
  'use strict';

  /* Set this to your form endpoint (Mailchimp, ConvertKit, Formspree, or your
     own). While it is null the form falls back to an email link so the page
     never looks broken. */
  var SIGNUP_ENDPOINT = null;

  /* --- nav drawer -------------------------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.nav-drawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- photo slots ------------------------------------------------------- */

  document.querySelectorAll('.photo').forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;

    function fill() { fig.classList.add('is-filled'); }
    function empty() { fig.classList.remove('is-filled'); }

    if (img.complete) {
      if (img.naturalWidth > 0) fill();
    } else {
      img.addEventListener('load', fill);
    }
    img.addEventListener('error', empty);
  });

  /* --- reveal ------------------------------------------------------------ */

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.rev');

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* --- signup ------------------------------------------------------------ */

  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    var msg = form.parentNode.querySelector('.form-msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;

      if (!SIGNUP_ENDPOINT) {
        window.location.href =
          'mailto:Info@RTayler.com?subject=' + encodeURIComponent('Add me to the list') +
          '&body=' + encodeURIComponent(email);
        return;
      }

      fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email })
      }).then(function (res) {
        if (msg) {
          msg.textContent = res.ok
            ? 'You are on the list.'
            : 'That did not go through. Try Info@RTayler.com.';
          msg.className = 'form-msg' + (res.ok ? ' ok' : '');
        }
        if (res.ok) form.reset();
      }).catch(function () {
        if (msg) msg.textContent = 'That did not go through. Try Info@RTayler.com.';
      });
    });
  });
})();
