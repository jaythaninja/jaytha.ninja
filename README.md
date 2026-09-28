# jaytha.ninja

Personal site. Dark, minimal, a little terminal. This is the new homepage, built from the approved round 3 mock. Copy placeholders live in [`src/copy.js`](src/copy.js). Jay writes the real lines.

The hello line is locked: `hello, fellow human...`, JetBrains Mono 500, teal `#1AADB3`, typed with `{ speed: 55, window: 4 }`.

## Develop

```bash
npm install
npm run dev
```

The dev server uses the same subpath as the preview, so open `http://localhost:5173/jaytha.ninja/`.

```bash
npm test
npm run preview
```

`npm test` builds the site and checks the locked hello line, the typing settings, the type sizes, and that internal links are not pointed at the live domain.

## Preview

GitHub Actions deploys `main` to GitHub Pages at <https://jaythaninja.github.io/jaytha.ninja/>.

To turn the preview on, in this repo:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Leave the custom domain blank. Do not add a CNAME. The live `jaytha.ninja` domain stays where it is.

## Pages

- `/` homepage
- `/waitlist/` placeholder
- `/camera-roll/` placeholder. Photos will go in `public/camera-roll/<year>/<month>/` and be listed in `src/camera-roll/galleries.js`. The gallery is not built yet.
- `/now/` placeholder
- GitHub goes to <https://github.com/jaythaninja>

## Type

Sans is one variable, `--sans`: `"proxima-nova","Proxima Nova","Montserrat",sans-serif`. Montserrat is self-hosted and stands in until an Adobe Fonts kit is added. JetBrains Mono 500 is self-hosted for the hero, nav, and card titles. Nothing is italic.
