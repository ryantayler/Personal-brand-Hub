# Photo drop in folder

Every image on the site is a named slot. Drop a file in here with the slot
name as the filename and it appears. Until a file is there the frame shows a
hatched placeholder with the slot name and the shot it wants, so a half filled
site still reads as deliberate rather than broken.

Filenames are `<slot>.jpg`. Swap the extension in the HTML if you use webp.

Sizing. Export at roughly 2x the display size, then compress.
Portrait and tall slots, 1200px wide. Square gallery slots, 1000px.
Wide and cinema slots, 1800px. The banner slot, 2400px.

| Page | Slot filename | Crop | What the shot is |
|---|---|---|---|
| about.html | `about-hero.jpg` | 3:4 tall | Portrait, 3:4, dark ground |
| about.html | `about-early.jpg` | 4:5 portrait | Early career or edit suite, 4:5 |
| about.html | `about-climb.jpg` | 3:4 tall | On site, headset or comms, 3:4 |
| about.html | `about-stage.jpg` | 3:2 wide | Stage or set at load in, 3:2 |
| about.html | `about-now.jpg` | 4:5 portrait | Portrait, 4:5, light ground |
| contact.html | `contact-portrait.jpg` | 4:5 portrait | Portrait, 4:5, light ground |
| headliner-group.html | `group-hero.jpg` | 3:4 tall | Portrait or venue wide, 3:4, dark ground |
| headliner-group.html | `group-thesis.jpg` | 4:5 portrait | Meeting or site walk, 4:5, light ground |
| headliner-group.html | `group-partnership.jpg` | 3:4 tall | Two people talking on site, 3:4 |
| ideas.html | `ideas-hero.jpg` | 3:4 tall | Portrait working or filming, 3:4 |
| ideas.html | `ideas-note.jpg` | 4:5 portrait | Notes, phone or desk detail, 4:5 |
| index.html | `home-hero.jpg` | 3:4 tall | Portrait, 3:4, dark ground |
| index.html | `home-belief.jpg` | 3:2 wide | Crew mid build, 3:2 |
| index.html | `home-group.jpg` | 16:9 | Full room or stage wide, 16:9 |
| index.html | `home-record.jpg` | 4:5 portrait | Portrait working, 4:5, light ground |
| index.html | `home-network.jpg` | 3:2 wide | Crew or backstage candid, 3:2 |
| index.html | `home-contact.jpg` | 4:5 portrait | Portrait, 4:5, light ground |
| work.html | `work-hero.jpg` | 21:9 banner | Hero event wide, 21:9, full room |
| work.html | `work-01.jpg` | 1:1 square | Main stage wide, 2:1 crop |
| work.html | `work-02.jpg` | 1:1 square | Audience from stage |
| work.html | `work-03.jpg` | 1:1 square | LED wall detail |
| work.html | `work-04.jpg` | 1:1 square | Crew at load in |
| work.html | `work-05.jpg` | 1:1 square | Lighting rig |
| work.html | `work-06.jpg` | 1:1 square | Ryan on site |
| work.html | `work-07.jpg` | 1:1 square | Front of house desk |
| work.html | `work-08.jpg` | 1:1 square | Venue full wide, 2:1 crop |
| work.html | `work-09.jpg` | 1:1 square | Backstage candid |
| work.html | `work-10.jpg` | 1:1 square | Speaker on stage |
| work.html | `work-11.jpg` | 1:1 square | Truss and staging build |
| work.html | `work-12.jpg` | 1:1 square | Room set before doors |

Total slots: 30.

## Alt text

Every slot already carries alt text in the HTML. If a photo shows something
different from what the slot describes, update the `alt` attribute to match
the real image. Accessibility is not optional on this build.

## The CRAFT carousel

`craft/` holds the eight published CRAFT Method slides. Those are real
assets, not placeholders, and they render on the Ideas page already.
