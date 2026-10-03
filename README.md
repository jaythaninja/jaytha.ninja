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
