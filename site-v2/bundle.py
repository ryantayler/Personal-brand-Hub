#!/usr/bin/env python3
"""
Bundle the six page site into one self contained HTML file.

Used to publish a shareable preview. Fonts and the CRAFT slides are embedded
as data URIs, the six <main> blocks become switchable panels, and the photo
slots keep their placeholders since no photography has landed yet.

The published preview is a view of the real site, not a second copy of it.
Everything here is derived from the page files, so the preview cannot drift.
"""

import base64
import pathlib
import re

HERE = pathlib.Path(__file__).parent

PAGES = [
    ("home",    "index.html",           "Home"),
    ("about",   "about.html",           "About"),
    ("group",   "headliner-group.html", "Headliner Group"),
    ("work",    "work.html",            "Work"),
    ("ideas",   "ideas.html",           "Ideas"),
    ("contact", "contact.html",         "Contact"),
]
SLUG_BY_FILE = {f: s for s, f, _ in PAGES}


def data_uri(path: pathlib.Path, mime: str) -> str:
    return "data:%s;base64,%s" % (mime, base64.b64encode(path.read_bytes()).decode())


def build_css() -> str:
    css = (HERE / "assets/css/site.css").read_text(encoding="utf-8")
    for name, weight in [("anton-400", None), ("inter-400", None),
                         ("inter-600", None), ("caveat-700", None)]:
        uri = data_uri(HERE / "assets/fonts" / (name + ".woff2"), "font/woff2")
        css = css.replace("url('../fonts/%s.woff2')" % name, "url(%s)" % uri)
    # the preview lives inside a host page, so the panel switch needs to own
    # the scroll container rather than the document
    css += """
/* preview shell. one page at a time, switched by the nav. */
.page{display:none}
.page.on{display:block}
"""
    return css


def strip_photo_images(html: str) -> str:
    """Drop the <img> from photo slots so the placeholders show without
    firing requests for files that do not exist yet. Keep the alt text on the
    figure so the slot is still announced."""
    def repl(m):
        fig_open, inner = m.group(1), m.group(2)
        alt = re.search(r'alt="([^"]*)"', inner)
        label = alt.group(1) if alt else "Photograph"
        if "role=" not in fig_open:
            fig_open = fig_open[:-1] + ' role="img" aria-label="%s (photo pending)">' % label
        return fig_open + m.group(3)
    return re.sub(r'(<(?:figure|span) class="photo[^>]*>)(\s*<img[^>]*>\s*)(</(?:figure|span)>)',
                  repl, html)


def embed_craft(html: str) -> str:
    for img in sorted((HERE / "assets/img/craft").glob("*.webp")):
        html = html.replace("assets/img/craft/%s" % img.name,
                            data_uri(img, "image/webp"))
    return html


def rewrite_links(html: str) -> str:
    for filename, slug in SLUG_BY_FILE.items():
        html = html.replace('href="%s"' % filename, 'href="#%s" data-page="%s"' % (slug, slug))
    return html


def main() -> None:
    index = (HERE / "index.html").read_text(encoding="utf-8")

    nav = re.search(r"<div class=\"rail\".*?</nav>", index, re.S).group(0)
    footer = re.search(r"<footer class=\"foot\">.*?</footer>", index, re.S).group(0)
    nav = rewrite_links(re.sub(r'\s*aria-current="page"', "", nav))
    footer = rewrite_links(footer)

    panels = []
    for slug, filename, _ in PAGES:
        src = (HERE / filename).read_text(encoding="utf-8")
        main_html = re.search(r"<main id=\"main\">(.*?)</main>", src, re.S).group(1)
        main_html = rewrite_links(strip_photo_images(main_html))
        panels.append('<div class="page%s" id="%s" role="tabpanel" aria-label="%s">%s</div>'
                      % (" on" if slug == "home" else "", slug, filename, main_html))

    site_js = (HERE / "assets/js/site.js").read_text(encoding="utf-8")

    router = """
(function () {
  'use strict';
  var SLUGS = %s;
  function show(slug) {
    if (SLUGS.indexOf(slug) === -1) slug = 'home';
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.toggle('on', p.id === slug);
    });
    document.querySelectorAll('[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === slug) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    // reveals are per panel, so re-arm the ones now on screen
    document.querySelectorAll(
      '#' + slug + ' .wipe, #' + slug + ' .rise, #' + slug + ' .fade, ' +
      '#' + slug + ' .bill-head, #' + slug + ' .bill-front, #' + slug + ' .cutout'
    ).forEach(function (el) { el.classList.add('in'); });
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-page]');
    if (!a) return;
    e.preventDefault();
    var slug = a.getAttribute('data-page');
    if (history.replaceState) history.replaceState(null, '', '#' + slug);
    show(slug);
    var d = document.querySelector('.nav-drawer');
    if (d) d.classList.remove('open');
  });
  show((location.hash || '#home').slice(1));
})();
""" % str([s for s, _, _ in PAGES]).replace("'", '"')

    out = "\n".join([
        "<title>Ryan Tayler V2</title>",
        "<script>document.documentElement.classList.add('js')</script>",
        "<style>\n%s\n</style>" % build_css(),
        nav,
        '<main id="main">',
        embed_craft("\n".join(panels)),
        "</main>",
        footer,
        "<script>\n%s\n%s\n</script>" % (site_js, router),
    ])

    dest = HERE / "preview.html"
    dest.write_text(out, encoding="utf-8")
    print("wrote %s  (%.2f MB)" % (dest, len(out.encode()) / 1024 / 1024))


if __name__ == "__main__":
    main()
