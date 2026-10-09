# jaytha.ninja

Personal site. The homepage is the single page in `site/`.

Pushes to `main` deploy that folder to GitHub Pages through GitHub Actions. The custom domain is jaytha.ninja. DNS lives at Namecheap.

## daily pages + data flow

The homepage's daily lines (top half) each read one file; the daily pages read the same files. Nothing on the homepage is edited by hand except `COPY.lyric` and `COPY.dayDate` in `site/index.html`.

| homepage line | page | data |
|---|---|---|
| `// yyyy.mm.dd` | (none) | `COPY.dayDate` in `site/index.html` |
| `🎧 <lyric> →` | /song-of-the-day/ | `site/song-of-the-day/songs.json` (+ `COPY.lyric`) |
| `💭 <quote> →` | /quote-of-the-day/ | `site/quote-of-the-day/quotes.json` |
| `📝 <update> →` (only when the newest entry is dated today or yesterday, America/Chicago) | /daily-update/ | `site/daily-update/recaps.json` |
| photo + `📸 snap of the day →` caption, centred (only when the newest entry is dated today or yesterday, America/Chicago) | /snap-of-the-day/ | `site/snap-of-the-day/snaps.json` + `site/snap-of-the-day/snaps/` |

Lyrics have exactly one blank line between every line (v1.69, jay 2026.10.04): no lines touching and no bigger gap at verse breaks. `songs.json` stores the lyric one line per line (no blank lines); `pick.py` (`lyric_lines`, in /home/box/jaytha-songs) does that when the drop stages the song, whatever spacing the paste came with (lyrics sites often double-space). /song-of-the-day/ then shows the non-blank lines with one blank line between each, today's and the archive. The homepage 🎧 line runs the lyric together on one line as before. Only lyrics: daily updates keep exactly the spacing jay pastes.

Every page shows the newest entry dated today or earlier (America/Chicago) at the top and the older ones below it, newest first. Future-dated entries stay hidden until their day.

### snaps.json (v1.56)
`[{"date": "YYYY-MM-DD", "src": "/snap-of-the-day/snaps/snap-YYYY-MM-DD.webp", "w": <src width>, "h": <src height>, "home": "/snap-of-the-day/snaps/snap-YYYY-MM-DD-home.webp", "alt": "<what's in the photo>"}, …]`, newest first, UTF-8, 2-space indent.
Two files per snap: `src` is the full shape (portrait stays portrait; 1600px on the long edge), shown on /snap-of-the-day/ at that shape (w/h reserve the frame); `home` is the homepage's 3:2 landscape crop (1200x800), shown under the daily lines with the caption. Both have all metadata (EXIF/GPS) stripped.
`snap.py` (in /home/box/jaytha-songs) makes both files and the entry: `python3 snap.py add --site <repo>/site --date YYYY-MM-DD --file <photo> --alt "…"` (`--focus 0.3` moves the homepage crop up; `remove --date` takes one out).

## 11:31pm drop: snap of the day (v1.56) + share cards (v1.61)
The nightly drop runs at 11:31pm America/Chicago and ships the next day's song + quote (+ update) (+ snap), all dated that next day. The site holds them until 12:00am CT and flips everything at midnight (v1.59), and the share cards flip with them (see share cards below).
Jay sends a photo at night; it is saved as `/home/box/jaytha-songs/pending-snap.jpg` (one at a time; a newer photo replaces it). At the 11:31pm drop, alongside the song + quote (+ update):
0. Only once `site/snap-of-the-day/` is on main (v1.56 live). Until then leave pending-snap.jpg where it is.
1. No `pending-snap.jpg` = no snap today; ship the rest as usual. If snaps.json already has that date's entry (2026-09-28 … 2026-10-03 shipped with v1.56 itself), don't publish it again: just do step 6.
2. The snap's date is the drop's date: tomorrow's America/Chicago date (it shows from 12:00am CT), unless jay gave a date.
3. Run `python3 /home/box/jaytha-songs/snap.py add --site <repo>/site --date YYYY-MM-DD --file /home/box/jaytha-songs/pending-snap.jpg --alt "<short plain description, lowercase>"`. It writes `site/snap-of-the-day/snaps/snap-YYYY-MM-DD-home.webp` (3:2, 1200x800, centre-cropped) and `snap-YYYY-MM-DD.webp` (full shape, 1600px long edge), strips all metadata (EXIF/GPS) from both, keeps them small (≤ 300 KB / ≤ 180 KB), and adds `{date, src, w, h, home, alt}` to the top of snaps.json (an entry with the same date is replaced, with its old files).
4. Check the homepage crop (`-home.webp`): if the subject is cut off, rerun with `--focus` (0 = keep the top, 1 = keep the bottom).
5. Ship both photos + snaps.json in the same nightly PR as songs.json / quotes.json (COPY.dayDate is updated with that drop as usual).
6. Move the original to `/home/box/jaytha-songs/snaps/YYYY-MM-DD.jpg` (kept off the site) so pending-snap.jpg is cleared.
7. Last, once the entries are in: `python3 scripts/make_cards.py stage --date <the drop's date, YYYY-MM-DD>` and commit `og-next/` + `site/og/` + any html it touched in the same PR (see share cards).
If the photo can't be read, leave snaps.json alone and tell jay (the song + quote + cards still ship). Never publish the original jpg (it can carry GPS).

## share cards (v1.61)
Link previews use `/og/home.png` (the intro + `// yyyy.mm.dd`), `/og/song.png`, `/og/quote.png` and `/og/snap.png` (the newest entry dated that day or earlier, like the pages), rendered from capri's templates in `scripts/cards/`. Every other page uses the static `/og-image.png`. Every og:image / twitter:image pointing at a card ends in `?d=YYYY-MM-DD` (the cards' date) so social apps refetch when the cards change.
- **11:31pm, with the drop:** `python3 scripts/make_cards.py stage --date YYYY-MM-DD` (needs node + playwright-core and chrome; `NODE_PATH` / `CHROME` override the box defaults). It first catches the repo up with the cards that went live at the last midnight, then renders that date's cards into `og-next/` (outside `site/`, so never deployed) with `og-next/date.txt`.
- **12:00am CT, no commit needed:** the Pages workflow also runs just after midnight (cron `2,32 5,6 * * *` UTC covers CDT + CST) and on every push. Before uploading `site/` it runs `python3 scripts/make_cards.py flip`, which copies `og-next/` into `site/og/` and rewrites `?d=` once that date has started in Chicago. Before then, or if the cards are already live, it does nothing. It never fails the deploy.
- By hand: `make_cards.py now --date YYYY-MM-DD` renders straight into `site/og/` and rewrites `?d=` (`--generic` also redoes `og-image.png`). `make_cards.py stamp --date YYYY-MM-DD` only rewrites `?d=`. `make_cards.py flip --today YYYY-MM-DD` runs the flip as if it were that day (try it on a scratch checkout).

## konami (v1.74)
The homepage rocket still fails on a normal tap. Under the social icons, a quiet row (up, down, left, right, b, a, start) is the liftoff that makes it: up up down down left right left right b a start. On the keyboard the same arrows, then b a, then Enter, work when focus is outside a text field. Enter is start: the sequence succeeds only after that full run, Enter lights start, and a different key on that step is a miss. Enter inside the email field stays with the field. The view follows the gold rocket (the same one a successful launch flies) into a starfield, the cartoon ninja turns gold for the rest of the visit, and `+30 lives` shows (lowercase, no period). A reload clears it. Nothing is stored. The row sits in the dim gray until the code starts, then pulses the launch-hold gold, and hides while the page is gold. iOS haptics use the iOS 18 switch-input workaround.

v1.71: the gap above the row is `--pgap`, the same token as the other homepage rows. `b`, `a` and `start` are weight 400 at about the arrows' height, the arrow stroke is thinned to that same weight, and each glyph's ink sits on one center line. The row's box (glyph height, gap) is in the stylesheet, so it is reserved before first paint; gold hides it with visibility instead of removing it, and the glyph size is not measured off the icons' scale-in, so the page does not jump on a teal, orange, or gold load. After liftoff the gold ninja and `+30 lives` hold for 4.5s and pulse gold three times (one steady glow when motion is reduced).

v1.72: correct presses use that same gold pulse, building by one eleventh, instead of teal or orange. The liftoff rocket is the successful-launch gold rocket; the flight path is the same.

v1.73: each correct press (tap or key) bumps that glyph, about 1.15 scale and a bright gold flash for 250ms, then it settles back into the row pulse. The bump is transform only. Reduced motion flashes brightness and does not scale. A touch presses in immediately, with no 300ms tap delay. A miss still blinks the row red.

v1.74: a konami win recolors the page with the same gold pass as a successful email launch. Each text element and icon turns gold as the rocket's centre passes it, including while the page rides down past the rocket, over the same fade. Nothing snaps gold at once. Reduced motion still goes gold immediately.

## habits (v1.78)

`/habits/` is a test bed for a later app. The homepage daily lines include `🗓️ daily habits i'm currently tracking →` directly under the daily update and above the snap, linking to `/habits/`. It is not in the sitemap. The five year graphs stack in one column (code, workouts, journal, sleep, caffeine) and the page scrolls on every screen. On a desktop each graph is the two-graph size (75ch, 10px cells). On a phone each graph is the two-graph phone size (the full column, a 1px cell gap). The squares update in place. Nothing is pushed down when a new day starts.

On a wide screen each graph's title is the daily-page kicker (21px, teal, the state colour). On a phone the titles are 17px. The caffeine title is that same word with a line through the middle, in the heading colour. Its accessible name stays zero caffeine. Every graph's legend is less → more, plus a single gold cursor rectangle for a run of 10 or more active days. Cell colour is the site's state colour (`--c`: teal, orange after a speed tap, the light-theme shade). A streak day is solid `#FFD700` in both themes, every level. A speed tap leaves those cells gold. Journal counts notes created that day: 1, 2–4, 5–9, 10 or more. Zero caffeine covers every displayed day from 2025-10-05 through today. A zero-caffeine day is one solid `--c` cell. A caffeine day, and any day with no record, is the same empty gray cell as the other graphs. Sleep shades that same colour by score: under 50, 50–69, 70–84, 85 or more. A night with no record is the empty gray cell, and a past night with no record is named `oct 3: no record`. A cell shows the date and the quantity (journal is `sep 24: 18 notes`, sleep is `oct 8: score 99 · 5h 09m`). It does not open a day page. An old `/habits/YYYY-MM-DD/` address redirects to `/habits/`.

v1.79: the board column is the song and daily-update measure (their `60ch` at 20px, this page's 16px type, so `75ch`) with the same side margin. The graphs scale to that width and the stats stay inside it. Each graph's box is `aspect-ratio: weeks / 7`, so the reserved height is the squares' height at every width and the legend sits under the graph. The two sections are one block, centered between the home link and the footer, on a desktop as well as a phone.

| tracker | data | what counts |
|---|---|---|
| code | `site/habits/cursor.json` | commits + pull requests opened + pull requests merged + AI line edits + bike rides. A cycling workout on or after 2026-01-01 is one coding session (`rides`). Two rides on a day count as two. The ride still counts on the workouts graph. |
| workouts | `site/habits/workouts.json` | Apple Health + Strava. Every type counts, including walks. A record with `exclude: true` is left out. Several workouts on one day add up. The cell colour is that day's active minutes, not the count: under 45, 45–89, 90–149, 150 or more. Oct–Dec 2025 and Apr–May 2026 are empty on purpose. |
| journal | `site/habits/journal.json` | Notes created that day, including bot-written notes. The file is a date-to-count map and omits zero days. Colour steps are 1, 2–4, 5–9, and 10 or more. |
| sleep | `site/habits/sleep.json` | Our own 0–100 sleep score (duration 50, bedtime consistency 30, interruptions 20), plus minutes asleep. The score is computed before it reaches the site. Days with no record are absent. 2025-08-16 through 2026-01-24 is a real gap. Colour steps are under 50, 50–69, 70–84, and 85 or more. A streak is consecutive nights scoring 70 or more. A past night with no record keeps the empty gray cell and is named `oct 3: no record`. |
| caffeine | `site/habits/caffeine.json` | Starts 2025-10-05, the first day the grid shows. The heading is the word caffeine with a strikethrough. `true` is a caffeine-free day (one solid speed colour). `false` is the same empty gray cell as an unrecorded day on the other graphs. Every displayed day through 2026-10-08 is `false`, so the stats stay 0. Days after today stay empty. |

The workouts file stores a day's workout count, active minutes, and, when that day has a bike ride, how many of the workouts were cycling. The per-workout list (type, time, heart rate, zones, a Strava link) is not published. `cursor.json` keeps the day's totals (commits, pull requests, AI line edits, rides) and leaves out commit titles and pull-request lists. Rebuild workouts with `python3 scripts/habits.py workouts <merged.json>` (that file stays off the site). The longest workout streak in this export is 8 days, so the workouts graph has no gold cells. The code graph and the journal graph do.

`python3 scripts/habits.py all` rebuilds `cursor.json`. Day-page HTML stays a redirect to `/habits/`. Commit dates are author dates in America/Chicago. Merge commits are skipped. A pull request counts on the day it was opened and, if it merged, again on the day it merged, so a day's total can be higher than GitHub's own calendar (the calendar counts a pull request once). AI line edits are not fetched: put them in `site/habits/cursor-lines.json` (`{"days": {"YYYY-MM-DD": 120}}`) and rerun the script. An empty `days` object means no AI edits.

Repos are listed in `site/habits/trackers.json`. `jaythaninja/mideeyah` is private. The Actions token cannot see it, so those commits stay out until a `HABITS_GITHUB_TOKEN` secret (repo scope) is set. A repo the token cannot see is named in `cursor.json` under `skipped_repos`. The Pages workflow runs `scripts/habits.py all` before upload and still deploys if the fetch fails (the committed json ships).

Adding another tracker later is a block in `trackers.json`, a json file, and a `<section class="tracker">` on `/habits/` with the same graph, legend, and stats. The label is the section title. `--habit-gap` (16px) is the only vertical step on that page: the same gap above each title, between a graph and its stats, and between sections. A fifth habit needs no layout change. The page scrolls as habits are added.

v1.78: the homepage line uses a small tear-off calendar instead of an emoji, in the same column as the other daily icons, directly under the notes line and above the snap. The box is reserved in the stylesheet, and the day number (America/Chicago) is written into it in the browser, so nothing shifts and no daily rebuild is involved. The band, rings, and outline use the speed colour (`--c`). The corner hint on every page reads `tap screen for speed +`, with no chevrons, in that same speed colour, and its box is 22ch before the words are written.

v1.80: the homepage habits line uses the calendar emoji (🗓️), the same way the other daily lines use theirs, directly under the notes line. The drawn calendar and the day-number script are gone. `/habits/` requests `habits.css` and `habits.js` at `?v=1.80` (the stylesheet was `?v=1.79` after the column fit; the script was still `?v=1.77`). Day pages request that same stylesheet, and their shared version token, at `?v=1.80` (they were still `?v=1.76`).

v1.81: gold streak cells use the same intensity steps as the speed-colour cells, mixed from `#FFD700` in both themes. The legend keeps the gold cursor rectangle for "10-day streak" and shows the four gold steps next to those words. The hover line is still the count and the date. The first graph is titled `code` (the day page heading uses that same word). The file stays `cursor.json`. `/habits/` and the day pages request `habits.css` at `?v=1.81`. The shared day-page token moved with it, so `day.js` is requested at `?v=1.81` too.

v1.82: on a phone the corner hint is 11px and sits 6px under the safe area (it was 13px and 11px), so it clears the homepage date. The 22ch box is unchanged. Desktop is unchanged. `rain.css` and `rain.js` are `?v=1.82`.

v1.87: the phone speed hint paints above the scan-line fade. That fade stays on the rain, the glows, and the scan lines, and on a phone the hint is solid, without the text shadow. The email signup stays on the homepage. Every other page's footer is the icon row only. A 10-day streak cell is solid `#FFD700` in both themes, and the legend keeps the single gold cursor. `/habits/` stacks four graphs (code, workouts, journal, zero caffeine) at the two-graph size and scrolls on every screen. `--habit-gap` (16px) is the only vertical step, so a fifth habit needs no layout change. `rain.css`, `rain.js`, `foot.css`, `foot.js`, `habits.css`, `habits.js`, and `day.js` are `?v=1.87`.

v1.88: caffeine misses are a lighter coral red (`#F0625A` dark, `#E8574E` light), and every displayed day from 2025-10-05 through 2026-10-08 is a miss. Day pages cover that same span, including `/habits/2026-10-08/`. `habits.css`, `habits.js`, and `day.js` are `?v=1.88`.

v1.89: a cycling workout on or after 2026-01-01 counts as one coding session on the code grid (`rides` on the day, shown as `🚵 ride (thinking time)`). `habits.css`, `habits.js`, and `day.js` are `?v=1.89`.

v1.90: a caffeine day, and any day with no zero-caffeine record, is the plain empty gray cell, the same as an empty day on the other graphs. A zero-caffeine day stays a solid `--c` cell, and a 10-day streak stays gold. The legend is the same less → more row plus the gold cursor. `habits.css`, `habits.js`, and `day.js` are `?v=1.90`.

v1.91: the caffeine heading is the one word caffeine with a strikethrough in the heading colour, on `/habits/` and on each day page. The line sits in the middle and does not change the heading box. The accessible name stays zero caffeine. `habits.css`, `habits.js`, and `day.js` are `?v=1.91`.

v1.92: grid cells are not links. Hover or tap still shows the date and the quantity. Old `/habits/YYYY-MM-DD/` addresses redirect to `/habits/`. The public code and workout files keep per-day counts and leave out commit titles, pull-request lists, and workout details. Day pages stay off unless `HABITS_DAY_PAGES=1`. `habits.css` and `habits.js` are `?v=1.92`.

v1.93: sleep is the fifth graph, under caffeine. The cell is the 0–100 score in the speed colour (under 50, 50–69, 70–84, 85+). A night with no record is the empty gray cell. Hover is the date, the score, and the time asleep (`oct 8: score 99 · 5h 09m`). The stats are the year average, the best month (highest average among months with at least 7 nights), the best night (score and date), and streaks of nights scoring 70 or more. Ten in a row is gold. Past cells carry `role="img"` and an accessible name. `habits.css` and `habits.js` are `?v=1.93`.

v1.94: sleep sits above caffeine. The column is code, workouts, journal, sleep, caffeine, with the same `--habit-gap` between them. A past night with no sleep record keeps the empty gray cell and is named `oct 3: no record`. `habits.css` and `habits.js` are `?v=1.94`.

v1.95: workouts include 2026-10-07 (one 32-minute row) and 2026-10-08 (one 64-minute ride). The ride is one code session on that day. The public files stay per-day counts. `habits.css` and `habits.js` are `?v=1.95`.
