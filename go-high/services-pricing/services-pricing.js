<script>
/* ==========================================================
   BusinessOS — Additional services pricing page
   Standalone script. Independent of the homepage's footer.js and
   the main pricing page's script — do not import or share logic
   between pages.
   ========================================================== */
(function () {
  var slashedFees = document.querySelectorAll('.fee--slashed');
  if (!slashedFees.length) return;

  // One-shot replay of the main pricing page's discounted-price
  // reveal: a beat after load, the red slash draws across the old
  // $50 setup fee while "Free" slides out from behind it. Delayed
  // (rather than fired instantly) so the visitor actually sees the
  // fee get slashed instead of loading in already-crossed-out —
  // the CSS transitions on .is-discounted do all the drawing.
  window.setTimeout(function () {
    Array.prototype.forEach.call(slashedFees, function (fee) {
      fee.classList.add('is-discounted');
    });
  }, 700);
})();
</script>
