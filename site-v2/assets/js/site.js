/* Ryan Tayler · personal site v2
   The show controller. Six jobs, all of them gated behind reduced motion
   where they involve movement.
     1. The set list takeover.
     2. Reveals. Line rises, stage light wipes, fades.
     3. The cue rail, which reports the section you are standing in.
     4. Ghost letterform drift, tied to scroll position.
     5. Count up on the proof numbers.
     6. Photo slots and the signup, carried over from v1. */

(function () {
  'use strict';

  var SIGNUP_ENDPOINT = null;   // see README. null falls back to an email.

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. the set list --------------------------------------------------- */

  var setlist = document.querySelector('.setlist');
  var openBtn = document.querySelector('.menu-btn');
  var closeBtn = document.querySelector('.setlist-close');
  var lastFocus = null;

  function openList() {
    if (!setlist) return;
    lastFocus = document.activeElement;
    setlist.classList.add('open');
    setlist.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = setlist.querySelector('a');
    if (first) first.focus();
  }
  function closeList() {
    if (!setlist) return;
    setlist.classList.remove('open');
    setlist.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  if (openBtn) openBtn.addEventListener('click', openList);
  if (closeBtn) closeBtn.addEventListener('click', closeList);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && setlist && setlist.classList.contains('open')) closeList();
  });

  /* --- 2. reveals -------------------------------------------------------- */

  var revealables = document.querySelectorAll('.rise, .wipe, .fade, .bill-head, .bill-front, .cutout');
  var pending = Array.prototype.slice.call(revealables);

  /* Reveals are driven from scroll geometry, not IntersectionObserver, and
     that is deliberate. A .wipe element hides itself with
     clip-path:inset(0 0 100% 0), and the observer computes intersection
     after the target's own clip is applied, so a clipped element reports
     zero area forever and never fires. getBoundingClientRect returns the
     unclipped border box, so it always tells the truth. */
  function checkReveals() {
    if (!pending.length) return;
    var line = window.innerHeight * 0.92;
    var i = pending.length;
    while (i--) {
      // no bottom test, so anything already scrolled past is revealed too
      if (pending[i].getBoundingClientRect().top < line) {
        pending[i].classList.add('in');
        pending.splice(i, 1);
      }
    }
  }

  if (reduce) {
    pending.forEach(function (el) { el.classList.add('in'); });
    pending = [];
  }

  /* --- 3. the cue rail --------------------------------------------------- */

  var railNum = document.querySelector('.rail-now .n');
  var railName = document.querySelector('.rail-now .nm');
  var cued = Array.prototype.slice.call(document.querySelectorAll('[data-cue]'));

  if (railNum && cued.length && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        railNum.textContent = entry.target.getAttribute('data-cue');
        if (railName) railName.textContent = entry.target.getAttribute('data-cue-name') || '';
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    cued.forEach(function (s) { rio.observe(s); });
  }

  /* --- 4. ghost drift ---------------------------------------------------- */

  var ghosts = Array.prototype.slice.call(document.querySelectorAll('.ghost'));

  function drift() {
    if (reduce) return;
    var vh = window.innerHeight;
    ghosts.forEach(function (g) {
      var host = g.parentNode.getBoundingClientRect();
      // -1 when the section is below the fold, 1 when it is above
      var progress = (vh / 2 - (host.top + host.height / 2)) / (vh / 2 + host.height / 2);
      var shift = Math.max(-1, Math.min(1, progress)) * 9;
      g.style.transform = 'translate(-50%,-50%) translate3d(' + shift.toFixed(2) + '%,0,0)';
    });
  }

  /* one scroll handler drives both the reveals and the drift */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      checkReveals();
      drift();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
  checkReveals();
  drift();

  /* --- 5. count up ------------------------------------------------------- */

  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (reduce || !('IntersectionObserver' in window)) {
      el.textContent = target.toLocaleString('en-AU') + suffix;
      return;
    }
    el.textContent = '0' + suffix;

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        var start = null, dur = 1400;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-AU') + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    cio.observe(el);
  });

  /* --- 6a. photo slots --------------------------------------------------- */

  document.querySelectorAll('.photo').forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    function fill() { fig.classList.add('is-filled'); }
    if (img.complete) { if (img.naturalWidth > 0) fill(); }
    else img.addEventListener('load', fill);
    img.addEventListener('error', function () { fig.classList.remove('is-filled'); });
  });

  /* --- 6b. signup -------------------------------------------------------- */

  document.querySelectorAll('form[data-signup]').forEach(function (form) {
    var msg = form.parentNode.querySelector('.form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      if (!SIGNUP_ENDPOINT) {
        window.location.href = 'mailto:Info@RTayler.com?subject=' +
          encodeURIComponent('Add me to the list') + '&body=' + encodeURIComponent(email);
        return;
      }
      fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email })
      }).then(function (res) {
        if (msg) msg.textContent = res.ok
          ? 'You are on the list.'
          : 'That did not go through. Try Info@RTayler.com.';
        if (res.ok) form.reset();
      }).catch(function () {
        if (msg) msg.textContent = 'That did not go through. Try Info@RTayler.com.';
      });
    });
  });
})();
