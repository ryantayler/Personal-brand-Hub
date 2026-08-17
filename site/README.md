# Ryan Tayler · personal site

A six page static site. No build step, no framework, no CMS. Open `index.html`
in a browser and it works, including from the filesystem.

```
site/
  index.html            Home
  about.html            The story
  headliner-group.html  The group
  work.html             Photo led proof
  ideas.html            The CRAFT Method™, point of view, follow and sign up
  contact.html          One founder, one email
  assets/
    css/site.css        The whole design system. Tokens at the top.
    js/site.js          Nav drawer, photo slots, reveal, signup.
    fonts/              Anton, Inter 400 and 600, Caveat 700. Self hosted.
    signature.svg       The mark. Inlined into the two pages that sign.
    img/                Photo drop in folder. See img/README.md.
    img/craft/          The eight published CRAFT Method™ slides.
```

## The four rulings this was built against

| Decision | Ruling |
|---|---|
| The firewall | Partial lift. Invest, investor, ownership and holding company are used plainly. The words private equity, acquisition, acquire, roll up and PE appear nowhere. |
| Structure | Six pages. |
| Colour | Pink is the spine. Purple is the rare accent kept for Ryan and his IP. Aqua carries Headliner Group and the ventures. |
| Light and dark | Alternating section by section. Dark is still the ground the site sits on. |
| Headliner Group | Written in present tense as a group that operates today. |
| Secondary audience | Ideas page, inline email signup, and social follow links. |

## How the system is applied

Pink took over as the spine, so purple stopped being the default and became the
rarest thing on the site. It appears in exactly three places, all of them the
mission statement card and the CRAFT Method™ block, which is what purple means.
That was the cleanest way to honour the meaning system while inverting the
hierarchy.

One accent per section holds throughout. Every coloured card still carries its
word, Own, Build or Teach, as a tag. One Caveat moment per section, never two.
The signature appears twice across the whole site, on the Home contact section
and on the Contact page, in ink on a clean white panel, never on a colour.

Light and dark alternate by putting `class="light"` on a `<section>`. Every
colour reads from a token, so a section flips completely with that one class.

**Purple as text on dark.** The brand doc notes hero purple sits below the AA
reading threshold on the dark base, at 2.79:1. On this build `--purple-text`
lifts to `#8B5CF6` on dark, which clears AA at 4.68:1, and stays at `#5B20B7`
on light at 8.99:1. Same meaning, readable in both themes.

**Contrast.** Every token pair used on the site clears WCAG AA. Body and mute
text, all three accents as text on both themes, and all three fills with their
fixed text colour.

## The ghosted letterform

The huge Anton word sunk behind a section is the motif from the CRAFT
carousels. It is decorative, marked `aria-hidden`, and deliberately dim enough
that the copy on top of it clears AA. Add one with
`<span class="ghost" aria-hidden="true">WORD</span>` inside a
`<section class="ghosted">`. Modifiers `.left` and `.right` shift the bleed.

## Photos

Thirty named slots. Drop a file into `assets/img/` with the slot name and it
appears. Until then the frame shows a hatched placeholder naming the slot and
the shot it wants, so a half filled site still looks deliberate. The full table
of slots, crops and shot notes is in `assets/img/README.md`.

## New copy, flagged for approval

Everything from the locked library is reproduced word for word. The banner
headline, the official statement, the keeper line, the emergency line, the
mission sentence, the short bio, and the long bio are all verbatim.

Per section 10.6 of the brand doc, the following is **new and needs a ruling.**

- Every page title and meta description
- All nav labels, and the button labels `Get in touch`, `See the group`,
  `Read the full story`, `The full story`, `See the work`, `Sign up`
- All section eyebrow labels
- All Anton section headings that are not locked copy, including
  `A group of the best at each piece`, `Four steps, and no surprises`,
  `Straight out of uni to General Manager by year five`,
  `Every area of live events and production`, `Load in, show, load out`,
  `Nobody delivers one of these on their own`,
  `The group runs on time actually spent in the room`,
  `Frameworks, and what I've worked out so far`, `Start a conversation`,
  `Founders and owners`, `Follow along instead`, `Where this gets published`
- Every Caveat kicker, one per section
- The four cards under `Where the growth comes from` on Home
- All eight mandate cards and all four `How it works` steps on Headliner Group
- The About page connective narrative and the five timeline entries
- The CRAFT Method™ card descriptions on Ideas
- The signup copy, `New pieces as they go out. Nothing else.`

Two things were deliberately **not** written.

- **No portfolio.** The Headliner Group page is present tense throughout, but
  it names no holdings. A founder can check a portfolio in thirty seconds, and
  a fabricated one would cost exactly the credibility the site exists to earn.
  The section is coded and commented out at the bottom of
  `headliner-group.html`. Uncomment it and add real businesses when there is
  one to name.
- **No writing index.** The brand doc says do not build it under five long form
  pieces, because an empty room is worse than no room. The Ideas page carries
  The CRAFT Method™ and the point of view instead, which is real content today.
  The index is coded and commented out in `ideas.html`.

## The signup form

`assets/js/site.js` has `SIGNUP_ENDPOINT = null` at the top. While it is null
the form falls back to opening an email to Info@RTayler.com, so it never looks
broken. Set it to a Mailchimp, ConvertKit or Formspree endpoint to go live.

## Social links

LinkedIn and Instagram URLs in the footer and on Ideas and Contact are best
guesses from the handle in the brand doc. Check them before this ships.

## Deploying

Any static host. GitHub Pages, Netlify, Cloudflare Pages, or an S3 bucket.
Point the host at this `site/` directory. There is nothing to build.

## Checks worth rerunning after an edit

Both were run against this build and both pass.

- **Copy rules.** No dashes in prose, no colon outside a list, Australian
  spelling, no ban list words, no firewall words, no exclamation marks.
- **Contrast.** Every token pair against WCAG AA.
