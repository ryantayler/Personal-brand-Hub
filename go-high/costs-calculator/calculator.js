<script>
/* ==========================================================
   BusinessOS — Pricing page
   Standalone script. Independent of the homepage's footer.js —
   do not import or share logic between the two pages.
   ========================================================== */
(function () {
  var toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;

  var indicator = toggle.querySelector('.pricing-toggle-indicator');
  var options = Array.prototype.slice.call(toggle.querySelectorAll('.toggle-option'));

  var calcToggle = document.querySelector('.price-calc-toggle');
  var calcInput = document.getElementById('calc-input');
  var calcPercent = document.getElementById('calc-percent');

  // Shared state — the single source of truth for every "our price"
  // display on the page (both pricing cards and the features table's
  // summary row read from this, keyed by data-tier). The calculator
  // mutates it; the monthly/yearly toggle reads it. Nothing here
  // keeps its own separate copy, so there's nothing that can drift
  // out of sync.
  var DEFAULTS = { essentials: 49, growth: 189, intelligence: 329 };
  var basePrices = { essentials: 49, growth: 189, intelligence: 329 };
  var currentPeriod = 'monthly';

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Counts a price figure from its current value to `to` over `duration`ms,
  // rather than a hard text swap — mirrors the reference's animated
  // NumberFlow transition without pulling in a dependency for it.
  function animateValue(el, to, duration) {
    var from = parseInt(el.textContent, 10) || 0;
    if (from === to) return;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.round(from + (to - from) * easeOutCubic(progress));
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // "10 months of 12" annual discount (pay for 10, billed once,
  // 2 months free) — same formula that produced the original
  // hardcoded yearly figures: floor(189 * 10/12) = 157,
  // floor(329 * 10/12) = 274, floor(49 * 10/12) = 40. Applying it live
  // here means a custom-calculated monthly price gets the exact same
  // annual treatment as the defaults, with nothing hardcoded.
  function yearlyEquivalent(monthly) {
    return Math.floor((monthly * 10) / 12);
  }

  // Updates every price display on the page (cards + table) from the
  // current basePrices/currentPeriod — the one function anything that
  // changes either of those calls afterward.
  function updateAllPrices() {
    var isYearly = currentPeriod === 'yearly';

    // Every price display on the page — the three cards AND the
    // table's "Our price" row — shares one structure and one set of
    // rules. The slashed figure always shows the tier's DEFAULT
    // monthly price and never ticks. The slide-out figure shows the
    // effective price — the calculated monthly amount, or its annual
    // equivalent on yearly billing — and is revealed (red slash +
    // slide, CSS .is-discounted) whenever that effective price is
    // below the default: on yearly billing, on a calculator discount,
    // or both. When it's already revealed, a change just re-ticks the
    // number in place with no extra animation.
    document.querySelectorAll('.pricing-card-price, .pricing-table-price').forEach(function (priceWrap) {
      var originalEl = priceWrap.querySelector('.price-figure[data-tier]');
      if (!originalEl) return;
      var tier = originalEl.dataset.tier;
      var base = basePrices[tier];
      if (base === undefined) return;

      var defMonthly = DEFAULTS[tier];
      var discounted = base < defMonthly;
      var revealed = isYearly || discounted;
      var wasRevealed = priceWrap.classList.contains('is-discounted');
      var effectiveEl = priceWrap.querySelector('[data-effective-tier]');

      originalEl.textContent = String(defMonthly);

      if (effectiveEl && revealed) {
        // Freshly revealed: seed the tick from the default price so
        // the number counts down while the slide-out runs.
        if (!wasRevealed) effectiveEl.textContent = String(defMonthly);
        priceWrap.classList.add('is-updating');
        animateValue(effectiveEl, isYearly ? yearlyEquivalent(base) : base, 450);
        setTimeout(function () {
          priceWrap.classList.remove('is-updating');
        }, 450);
      }

      priceWrap.classList.toggle('is-discounted', revealed);

      // Card-only extras (the table row has neither element).
      // Badge above "/mo": every dollar of savings vs the default,
      // measured in the figures currently on screen (annual view
      // compares annual-equivalent amounts). Annual always mentions
      // the 2 free months; a $0 calculator saving shows no "$X off".
      var card = priceWrap.closest('.pricing-card');
      if (!card) return;

      // Each CTA carries both payment links; the billing toggle
      // decides which one is live.
      var cta = card.querySelector('.pricing-card-cta');
      if (cta) {
        var href = isYearly ? cta.dataset.hrefYearly : cta.dataset.hrefMonthly;
        if (href) cta.href = href;
      }

      var saved = isYearly
        ? yearlyEquivalent(defMonthly) - yearlyEquivalent(base)
        : defMonthly - base;
      var badgeText = isYearly
        ? '2 months free' + (saved > 0 ? ' + $' + saved + ' off' : '')
        : (saved > 0 ? '$' + saved + ' off' : '');

      var badge = card.querySelector('[data-price-badge]');
      if (badge) {
        badge.textContent = badgeText;
        badge.hidden = badgeText === '';
      }

      var billedNote = card.querySelector('[data-billed-label]');
      if (billedNote) billedNote.textContent = 'billed ' + (isYearly ? 'annually' : 'monthly');
    });
  }

  function setPeriod(period) {
    var changed = currentPeriod !== period;
    currentPeriod = period;
    var isYearly = period === 'yearly';

    // Re-wiggle the "2 months free" tag on every actual switch (not on
    // the initial page-load call): pulling the class off and forcing a
    // reflow restarts the CSS animation from frame one.
    var tag = toggle.querySelector('.toggle-annual-tag');
    if (tag && changed) {
      tag.classList.remove('is-wiggling');
      void tag.offsetWidth;
      tag.classList.add('is-wiggling');
    }

    options.forEach(function (btn) {
      var active = btn.dataset.period === period;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    if (indicator) {
      indicator.style.transform = isYearly ? 'translateX(100%)' : 'translateX(0)';
    }

    updateAllPrices();
  }

  options.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setPeriod(btn.dataset.period);
    });
  });

  // ---------- Custom price calculator ----------
  if (calcToggle && calcInput) {
    var calcIndicator = calcToggle.querySelector('.price-calc-toggle-indicator');
    var calcOptions = Array.prototype.slice.call(calcToggle.querySelectorAll('.calc-tier-option'));
    var TIER_ORDER = ['essentials', 'growth', 'intelligence'];

    // The three option labels are different lengths, so a fixed
    // third-of-the-track indicator both overshoots and undershoots.
    // Instead the pill is sized and placed from the active button's
    // actual rendered box every time the selection changes.
    function syncCalcIndicator() {
      if (!calcIndicator) return;
      var activeBtn = calcToggle.querySelector('.calc-tier-option.is-active');
      if (!activeBtn) return;
      var trackRect = calcToggle.getBoundingClientRect();
      var btnRect = activeBtn.getBoundingClientRect();
      calcIndicator.style.width = btnRect.width + 'px';
      calcIndicator.style.transform =
        'translateX(' + (btnRect.left - trackRect.left - calcToggle.clientLeft) + 'px)';
    }

    function getActiveCalcTier() {
      var active = calcToggle.querySelector('.calc-tier-option.is-active');
      return active ? active.dataset.tier : 'essentials';
    }

    // The selected tier is the anchor: its price becomes half the
    // entered spend, capped at its default (it can only ever go
    // DOWN from the default, never up). Every tier above the anchor
    // scales from it by the exact default-price ratios (e.g.
    // Intelligence = Growth * 329/189), so an anchor sitting at its
    // cap lands the higher tiers exactly on their own defaults — no
    // separate caps needed. Tiers below the anchor never move.
    function applySpend() {
      var raw = calcInput.value.trim();

      // Empty input: full reset to defaults.
      if (raw === '') {
        TIER_ORDER.forEach(function (t) {
          basePrices[t] = DEFAULTS[t];
        });
        if (calcPercent) {
          calcPercent.textContent = '% off';
          calcPercent.classList.add('is-placeholder');
        }
        updateAllPrices();
        return;
      }

      var entered = parseFloat(raw);
      if (isNaN(entered) || entered < 0) return;

      var tier = getActiveCalcTier();
      // Floored for display — every price on this page is a whole
      // dollar, entered/2 alone can land on a fraction (e.g. 101/2).
      var anchor = Math.min(Math.floor(entered / 2), DEFAULTS[tier]);

      basePrices[tier] = anchor;
      TIER_ORDER.slice(TIER_ORDER.indexOf(tier) + 1).forEach(function (t) {
        basePrices[t] = Math.floor((anchor * DEFAULTS[t]) / DEFAULTS[tier]);
      });

      // Percent-off readout beside the input: the anchor's saving vs
      // its default, which is the same percentage every cascaded
      // tier gets. Falls back to the dimmed "% off" label when
      // there's nothing off (capped spend).
      if (calcPercent) {
        var pct = ((DEFAULTS[tier] - anchor) / DEFAULTS[tier]) * 100;
        calcPercent.textContent = pct > 0 ? pct.toFixed(2) + '% off' : '% off';
        calcPercent.classList.toggle('is-placeholder', pct <= 0);
      }

      updateAllPrices();
    }

    function setCalcTier(tier) {
      calcOptions.forEach(function (btn) {
        var active = btn.dataset.tier === tier;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      syncCalcIndicator();
      // With a spend already entered, switching the anchor tier
      // re-runs the calculation immediately — there's no Calculate
      // button to press anymore.
      if (calcInput.value.trim() !== '') applySpend();
    }

    // The measured widths go stale if the layout shifts under the
    // pill — most notably when the mono webfont finishes loading
    // after init and re-flows the labels — so re-measure then and on
    // window resizes.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncCalcIndicator);
    }
    window.addEventListener('resize', syncCalcIndicator);

    calcOptions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setCalcTier(btn.dataset.tier);
      });
    });

    // Sync the indicator pill to whichever option the HTML marks
    // active on load (Growth) — its resting CSS position is slot one.
    setCalcTier(getActiveCalcTier());

    // No Calculate button: recalc fires on its own once typing has
    // paused for a second (so a 3-digit number entered digit by digit
    // updates once, not three times).
    var spendDebounce;
    calcInput.addEventListener('input', function () {
      clearTimeout(spendDebounce);
      spendDebounce = setTimeout(applySpend, 1000);
    });
  }

  // Red annotation notes above the controls: the first time the
  // pointer touches a control, its note fades out for good — it only
  // comes back with a page refresh ({ once: true } drops the
  // listener after it fires).
  [
    ['.price-calc-toggle', '.controls-callout--left'],
    ['.price-input-row', '.controls-callout--right']
  ].forEach(function (pair) {
    var target = document.querySelector(pair[0]);
    var note = document.querySelector(pair[1]);
    if (target && note) {
      target.addEventListener('mouseenter', function () {
        note.classList.add('is-dismissed');
      }, { once: true });
    }
  });

  var initialActive = toggle.querySelector('.toggle-option.is-active');
  setPeriod(initialActive ? initialActive.dataset.period : 'monthly');
})();
</script>