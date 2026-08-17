# Ryan Tayler · personal site, version 2

Version 1 lives in `../site/` and is unchanged. This is the editorial rebuild.
Same brand system, same locked copy, a completely different point of view.

## Why it looks like this

Version 1 was correct and dull. It followed every rule and ended up looking
like a competent brochure for any consultancy, which is the opposite of what a
live events brand should feel like.

The concept here is **the bill.** Headliner Group takes its name from top
billing on a poster, so the site is built like a tour poster crossed with a
production run sheet. That is Ryan's actual world and nobody else's, which is
what stops it reading as a template.

What that means concretely.

- **The hero is a three layer sandwich.** The headline sits behind, the cut out
  figure sits on top of it, and the payoff word sits in front of the figure. The
  type genuinely passes behind the head and in front of the chest.
- **Sections are cues.** Every section is numbered on a running order, with a
  fixed rail down the left edge that reports which cue you are standing in.
- **The nav is a set list**, not a header. A full screen takeover with the
  pages numbered 01 to 06.
- **Marquees are venue LED strips.** The proof numbers and the discipline list
  run past horizontally the way a foyer screen does.
- **Type collides with photography.** Headlines overhang images, and big
  numerals hang off image corners, instead of sitting politely above them.
- **Reveals wipe up from the floor** like a stage light coming in, rather than
  fading like a generic scroll animation.

## The brand rules, and the one Ryan overrode

Held exactly as written. Pink is the spine, purple stays rare and carries only
the mission and the CRAFT Method™, aqua carries the group and the ventures. One
accent per cue. Every coloured card keeps its Own, Build or Teach word. One
Caveat moment per cue. The signature is ink on a clean panel, twice across the
site. All locked copy is word for word. No dashes in prose, no colon outside a
list, Australian spelling.

**Overridden on Ryan's instruction.** The brand doc says no parallax, no
motion, and that restraint is the whole trick. Version 2 has scroll driven
drift on the ghost letterforms, line reveals, stage light wipes, counting
numbers and running marquees. Every one of them collapses to nothing under
`prefers-reduced-motion`.

**Worth a decision.** The proof numbers count up from zero, which means for
about 1.4 seconds the page displays a number that is not 115 or 56,000. It
reads as a counter rather than a claim, but the brand doc is strict about proof
figures. To turn it off, delete the `data-count` and `data-suffix` attributes
and the static text stays.

## Photography

29 slots, and 6 of them are cutouts. **The cutouts are the design.** Without a
transparent PNG of Ryan the hero is just big type, and the whole concept goes
with it. Shooting and cutting guidance is in `assets/img/README.md`.

## Files

```
site-v2/
  index.html · about.html · headliner-group.html · work.html · ideas.html · contact.html
  assets/css/site.css   the whole system. the design plan is in the header comment.
  assets/js/site.js     set list, reveals, cue rail, ghost drift, count up, slots, signup.
  assets/fonts/         Anton, Inter 400 and 600, Caveat 700, self hosted.
  assets/signature.svg  inlined into the two pages that sign.
  assets/img/           photo drop in folder, see its README.
```

No build step. Open `index.html` and it works, including from the filesystem.

## One implementation note worth keeping

Reveals are driven by scroll geometry, not IntersectionObserver, and that is
deliberate. A `.wipe` element hides itself with `clip-path:inset(0 0 100% 0)`,
and the observer computes intersection **after** the target's own clip is
applied, so a clipped element reports zero area forever and never fires.
`getBoundingClientRect` returns the unclipped border box, so it always tells the
truth. If you refactor the reveals back onto IntersectionObserver, every wipe on
the site will silently vanish.

## Still needs you

- **Cutouts and photography.** Nothing else matters as much.
- **Copy approval.** All new copy is the same set listed in `../site/README.md`,
  plus the cue names on the running order.
- **Signup endpoint.** `SIGNUP_ENDPOINT` at the top of `site.js` is null, so the
  form opens an email instead of breaking.
- **Social URLs.** Inferred from the handle in the brand doc. Check them.
- **Portfolio and writing index.** Both coded and commented out, same as version
  one, waiting on real entries.

## Checks that pass on this build

- Copy rules, all six pages. No dashes, no stray colons, Australian spelling,
  no ban list or firewall words.
- No horizontal overflow at 1440px or 390px.
- No JavaScript errors, and every reveal fires on every page.
- Contrast, every token pair against WCAG AA.
