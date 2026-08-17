# Photo drop in folder · version 2

Every image is a named slot. Drop a file in here with the slot name as the
filename and it appears. Until then the frame shows a hatched placeholder
naming the slot and the shot it wants.

## The cutouts come first

Version 2 is built around a cut out figure that the headline passes behind
and in front of. Those five slots are the ones that make the design work, so
they matter more than everything else on this list.

How to get them.

- Shoot against a plain wall, evenly lit, with clear space around the head
  and shoulders. A busy background makes a clean cut much harder.
- Cut the background out and export a **transparent PNG**. No white box.
- Frame head and upper body, roughly 4:5. Keep the top of the head well
  inside the frame, since the type runs behind it.
- Export around 1400px wide, then compress.
- A slightly angled or moving pose reads better against the type than a
  straight on studio shot.

| Page | Slot filename | What it is |
|---|---|---|
| about.html | `about-cutout.png` | Cutout portrait, transparent PNG |
| contact.html | `contact-cutout.png` | Cutout portrait, transparent PNG |
| headliner-group.html | `group-cutout.png` | Cutout portrait, transparent PNG |
| ideas.html | `ideas-cutout.png` | Cutout portrait, transparent PNG |
| index.html | `hero-cutout.png` | Cutout portrait, transparent PNG |
| work.html | `work-cutout.png` | Cutout portrait, transparent PNG |

## Everything else

| Page | Slot filename | Crop | What the shot is |
|---|---|---|---|
| about.html | `about-early.jpg` | 4:5 | Early career or edit suite, 4:5 |
| about.html | `about-climb.jpg` | 16:9 | On site, headset or comms, 16:9 |
| about.html | `about-stage.jpg` | 3:2 | Stage or set at load in, 3:2 |
| contact.html | `contact-portrait.jpg` | 4:5 | Portrait, 4:5, light ground |
| headliner-group.html | `group-thesis.jpg` | 4:5 | Meeting or site walk, 4:5, light ground |
| ideas.html | `ideas-note.jpg` | 4:5 | Notes, phone or desk detail, 4:5 |
| index.html | `home-belief.jpg` | 3:2 | Crew mid build, 3:2 |
| index.html | `home-group.jpg` | 16:9 | Full room or stage wide, 16:9 |
| index.html | `home-record.jpg` | 4:5 | Portrait working, 4:5, light ground |
| index.html | `home-network.jpg` | 3:2 | Crew or backstage candid, 3:2 |
| index.html | `home-contact.jpg` | 4:5 | Portrait, 4:5 |
| work.html | `work-01.jpg` | 3:2 | Main stage wide, 3:2 |
| work.html | `work-02.jpg` | 3:4 | Crew at load in, tall |
| work.html | `work-03.jpg` | 1:1 mosaic | Audience from stage |
| work.html | `work-04.jpg` | 1:1 mosaic | LED wall detail |
| work.html | `work-05.jpg` | 1:1 mosaic | Lighting rig |
| work.html | `work-06.jpg` | 3:2 | Venue full wide, 3:2 |
| work.html | `work-07.jpg` | 1:1 mosaic | Front of house desk |
| work.html | `work-08.jpg` | 3:4 | Ryan on site, tall |
| work.html | `work-09.jpg` | 1:1 mosaic | Backstage candid |
| work.html | `work-10.jpg` | 1:1 mosaic | Speaker on stage |
| work.html | `work-11.jpg` | 3:2 | Truss and staging build, 3:2 |
| work.html | `work-12.jpg` | 1:1 mosaic | Room set before doors |

Total slots: 29, of which 6 are cutouts.

## Sizing

Export at roughly 2x display size then compress. Portrait and tall slots
1200px wide, mosaic tiles 1200px, wide and cinema 1800px.

## Alt text

Every slot carries alt text in the HTML already. If a photo shows something
different from what the slot describes, update the `alt` to match the real
image.

## The CRAFT carousel

`craft/` holds the eight published CRAFT Method slides. Those are real
assets, not placeholders, and they render on the Ideas page today.
