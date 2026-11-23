# Portfolio copy

Each project on `/work` is one file here. Edit the text, save, and the site picks it up on the next build. A Vercel preview on your PR shows the result before it goes live.

## Order and hiding

`order.txt` lists project file names (without `.md`), one per line, in display order. Move a line to move a project. Put `#` in front of a line to hide that project without deleting its file.

## File format

```markdown
---
title: The World's Biggest Asshole
client: Donate Life
year: 2016
role: Copywriter / ACD, The Martin Agency
summary: Even the worst guy you've ever met can still save a life.
featured: true
stats:
  - 80M+ | views in 76 countries
  - ~700% | jump in daily donor registrations
awards:
  - Cannes Lions 2017: 3 Gold, 2 Silver, 5 Bronze
tech:
  - Arduino
links:
  - registerme.org | https://registerme.org
---

First paragraph of the write-up.

Second paragraph. Leave a blank line between paragraphs.
```

Between the `---` lines:

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Project name |
| `client` | no | Shown before the year, e.g. `DONATE LIFE · 2016` |
| `year` | yes | Any text: `2016`, `2012-2014` |
| `role` | no | Your role, shown under the summary |
| `summary` | yes | The one-liner on cards and at the top of the project page |
| `video` | no | A Vimeo link (`https://vimeo.com/123456`). The film plays at the top of the project page, and any photos move to the gallery below |
| `featured` | yes | `true`: full scroll section with its own particle shape. `false`: the "More work" grid |
| `stats` | no | Big numbers. Each item is `value | label`. Cards show the first three |
| `awards` | no | One line per award. Cards show the show names (the text before the year) |
| `tech` | no | Tags under "Built with" |
| `links` | no | Each item is `label | URL`. URLs start with `https://`, or `/` for pages on this site |

List items go on their own lines, indented, starting with `- `. Everything after the closing `---` is the write-up.

If something is off (a missing field, a stat without the `|`, a name in `order.txt` with no matching file), the build stops and names the file and line.

## Adding a project

1. Copy an existing file and rename it, e.g. `new-thing.md`. The file name becomes the URL: `/work/new-thing`.
2. Add `new-thing` to `order.txt`.
3. Photos and clips: add an entry to `scripts/work-media/plan.json` and run `python3 -I scripts/work-media/process.py`.
4. A new featured project also needs a particle shape in `components/work/shapes.ts`. Until it has one, it uses the "11".
