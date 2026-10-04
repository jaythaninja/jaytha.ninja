/* v1.67 (jay 2026.10.03): the shared footer, one component for every subpage (/now/, /song-of-the-day/, /quote-of-the-day/, /snap-of-the-day/, /daily-update/, /confirmed/, 404).
   each page only has <footer class="foot" data-ref="song"></footer> + this script, deferred in the head (it runs after the page's own script, so the copy
   is filled before the first paint; the footer's height is reserved in foot.css, so building it moves nothing). it builds the homepage's whole signup: "drop your email, we promise no 🥫" (the same spam can), the field with the charging line + rocket, the same
   liftoff (gold wave, plume, the typed thank-you) and failed-liftoff (a random flight + crash, the glow, focus back) as the homepage, then the icon row with our
   cartoon ninja (a quiet link to /now/; plain on /now/ itself) + the 8 icons, evenly spaced like the homepage's row. colours follow the page states (--c / --f:
   teal, orange after a speed tap, gold). the art (spam can, rocket, ninja, icons) is copied from the homepage by tools/build_foot.py, so they stay identical.
   buttondown: the same embed form (cors fetch; anything but a 2xx = the native post, so buttondown's own page can show a captcha / typo). tag=site always;
   a ?ref= (JayRain.ref) ADDS a second tag; metadata__ref = the ref, else this page's name (data-ref); metadata__page = the path. GA4 sign_up as the rocket lifts off
   (method email, + ref when there is one), as on the homepage. no email or other PII anywhere */
(() => {
const foot = document.querySelector('footer.foot');
if (!foot || foot.dataset.built) return; foot.dataset.built = '1';
const PAGE = (foot.dataset.ref || 'site').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 40) || 'site';
const PATH = (foot.dataset.page || location.pathname || '/').replace(/[^a-z0-9\/._-]/gi, '').slice(0, 80) || '/';
const ACTION = 'https://buttondown.com/api/emails/embed-subscribe/jaythaninja';
const COPY = {thanks: 'thanks! 💛 check your inbox to confirm', failNote: "that email isn't complete yet, try again (like you@email.com)"};
const TIMING = {speed: 55, window: 4};
const SPAM = "<svg class=\"spamcan\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 26 20\" role=\"img\" aria-label=\"spam\" style=\"height:1.15em;width:1.5em;vertical-align:-0.22em\">\n<defs><linearGradient id=\"spamcan-shade\" x1=\"0\" x2=\"1\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".16\"/><stop offset=\".55\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#000\" stop-opacity=\".22\"/></linearGradient></defs>\n<rect x=\"1.4\" y=\"2\" width=\"23.2\" height=\"16\" rx=\"2.4\" style=\"fill:var(--spam-body,#1AADB3)\"/>\n<rect x=\"1.4\" y=\"2\" width=\"23.2\" height=\"16\" rx=\"2.4\" fill=\"url(#spamcan-shade)\" style=\"stroke:var(--spam-body-edge,#0B5B5E)\" stroke-width=\".7\"/>\n<path style=\"fill:var(--spam-ink,#021213)\" d=\"M6.539 7.970000000000001Q6.063 7.970000000000001 5.7059999999999995 7.819500000000001Q5.348999999999999 7.6690000000000005 5.1495 7.4030000000000005Q4.949999999999999 7.1370000000000005 4.949999999999999 6.78H6.0Q6.0 6.948 6.1505 7.0495Q6.301 7.151000000000001 6.539 7.151000000000001H6.8469999999999995Q7.134 7.151000000000001 7.2844999999999995 7.046000000000001Q7.435 6.941000000000001 7.435 6.752000000000001Q7.435 6.577 7.302 6.4825Q7.169 6.388 6.888999999999999 6.353000000000001L6.441 6.297000000000001Q5.72 6.206 5.391 5.947000000000001Q5.061999999999999 5.688000000000001 5.061999999999999 5.156000000000001Q5.061999999999999 4.596 5.446999999999999 4.288Q5.832 3.9800000000000004 6.574 3.9800000000000004H6.84Q7.547 3.9800000000000004 7.9670000000000005 4.288Q8.387 4.596 8.387 5.114000000000001H7.337Q7.337 4.974 7.2005 4.8865Q7.064 4.799 6.84 4.799H6.574Q6.3149999999999995 4.799 6.196 4.8865Q6.077 4.974 6.077 5.149000000000001Q6.077 5.3100000000000005 6.185499999999999 5.394Q6.294 5.478 6.532 5.513L7.015 5.5760000000000005Q7.743 5.667 8.096499999999999 5.9399999999999995Q8.45 6.213 8.45 6.752000000000001Q8.45 7.34 8.044 7.655Q7.638 7.970000000000001 6.8469999999999995 7.970000000000001ZM9.262 9.16V4.050000000000001H10.277000000000001V4.785H10.522L10.277000000000001 5.03Q10.277000000000001 4.533 10.55 4.256500000000001Q10.823 3.9800000000000004 11.299000000000001 3.9800000000000004Q11.88 3.9800000000000004 12.23 4.3895Q12.580000000000002 4.799 12.580000000000002 5.485V6.465Q12.580000000000002 6.92 12.422500000000001 7.2595Q12.265 7.599 11.978000000000002 7.7845Q11.691 7.970000000000001 11.299000000000001 7.970000000000001Q10.823 7.970000000000001 10.55 7.6935Q10.277000000000001 7.417000000000001 10.277000000000001 6.92L10.522 7.165H10.277000000000001L10.312000000000001 8.110000000000001V9.16ZM10.921000000000001 7.0600000000000005Q11.215 7.0600000000000005 11.3725 6.8955Q11.530000000000001 6.731 11.530000000000001 6.430000000000001V5.5200000000000005Q11.530000000000001 5.212 11.3725 5.051Q11.215 4.890000000000001 10.921000000000001 4.890000000000001Q10.634 4.890000000000001 10.473 5.054500000000001Q10.312000000000001 5.219 10.312000000000001 5.5200000000000005V6.430000000000001Q10.312000000000001 6.731 10.473 6.8955Q10.634 7.0600000000000005 10.921000000000001 7.0600000000000005ZM14.604933852140078 7.970000000000001Q14.022 7.970000000000001 13.682500000000001 7.654724242424242Q13.343 7.339448484848485 13.343 6.801Q13.343 6.220000000000001 13.7455 5.9085Q14.148 5.597 14.904 5.597H15.702V5.3100000000000005Q15.702 5.086 15.5445 4.953Q15.387 4.82 15.121 4.82Q14.879408695652174 4.82 14.716704347826088 4.932Q14.554 5.0440000000000005 14.519 5.24H13.504Q13.567 4.659000000000001 14.0115 4.319500000000001Q14.456 3.9800000000000004 15.156 3.9800000000000004Q15.891 3.9800000000000004 16.3215 4.3405000000000005Q16.752 4.7010000000000005 16.752 5.3100000000000005V7.9H15.737V7.2700000000000005H15.568999999999999L15.744 7.025Q15.744 7.461153846153847 15.432431906614786 7.715576923076924Q15.120863813229573 7.970000000000001 14.604933852140078 7.970000000000001ZM14.995000000000001 7.2Q15.304917808219178 7.2 15.50345890410959 7.035500000000001Q15.702 6.871 15.702 6.605765625V6.192H14.925Q14.687 6.192 14.54 6.3285Q14.393 6.465 14.393 6.687570422535211Q14.393 6.925669014084507 14.552352941176471 7.062834507042254Q14.711705882352941 7.2 14.995000000000001 7.2ZM17.494000000000003 7.9V4.050000000000001H18.320000000000004V4.61H18.488000000000003L18.355000000000004 4.708Q18.355000000000004 4.3790000000000004 18.544000000000004 4.179500000000001Q18.733000000000004 3.9800000000000004 19.013 3.9800000000000004Q19.314000000000004 3.9800000000000004 19.482000000000003 4.239000000000001Q19.650000000000002 4.498 19.650000000000002 4.925000000000001L19.524 4.61H19.720000000000002L19.657000000000004 4.708Q19.657000000000004 4.3790000000000004 19.839000000000006 4.179500000000001Q20.021000000000004 3.9800000000000004 20.329000000000004 3.9800000000000004Q20.679000000000002 3.9800000000000004 20.896 4.242500000000001Q21.113000000000003 4.505000000000001 21.113000000000003 4.960000000000001V7.9H20.210000000000004V5.03Q20.210000000000004 4.869 20.140000000000004 4.7815Q20.070000000000004 4.694000000000001 19.937000000000005 4.694000000000001Q19.804000000000002 4.694000000000001 19.734 4.7815Q19.664 4.869 19.664 5.03V7.9H18.943V5.03Q18.943 4.869 18.873000000000005 4.7815Q18.803000000000004 4.694000000000001 18.67 4.694000000000001Q18.537000000000003 4.694000000000001 18.467000000000002 4.7815Q18.397000000000002 4.869 18.397000000000002 5.03V7.9Z\"/>\n<g class=\"spamcan-burger\">\n<path d=\"M8.2 15.7h9.6a.9.9 0 0 0 .9-.9v-.6H7.3v.6a.9.9 0 0 0 .9.9z\" fill=\"#D98A35\" stroke=\"#2B1405\" stroke-width=\".45\" stroke-linejoin=\"round\"/>\n<rect x=\"7\" y=\"12.6\" width=\"12\" height=\"1.65\" rx=\".5\" fill=\"#F29A9A\" stroke=\"#2B1405\" stroke-width=\".45\" stroke-linejoin=\"round\"/>\n<path d=\"M8.2 13.05h9.6\" stroke=\"#FFC9C4\" stroke-width=\".35\" stroke-linecap=\"round\"/>\n<path d=\"M7.4 12.15h11.2v.55h-3.4l-.6.6-.6-.6H7.4z\" fill=\"#FFC21F\" stroke=\"#2B1405\" stroke-width=\".45\" stroke-linejoin=\"round\"/>\n<path d=\"M7.1 12.2c0-2.3 2.6-3.4 5.9-3.4s5.9 1.1 5.9 3.4z\" fill=\"#EFA046\" stroke=\"#2B1405\" stroke-width=\".45\" stroke-linejoin=\"round\"/>\n<path d=\"M9.4 10.4h.01M12.3 9.8h.01M15.2 10.2h.01M13.9 11h.01M10.9 11.1h.01\" stroke=\"#FFF3D6\" stroke-width=\".7\" stroke-linecap=\"round\"/>\n</g>\n<rect x=\".5\" y=\".8\" width=\"25\" height=\"2.3\" rx=\"1.15\" style=\"fill:var(--spam-rim,#F2B632);stroke:var(--spam-rim-edge,#6E4A06)\" stroke-width=\".6\"/>\n<rect x=\".5\" y=\"16.9\" width=\"25\" height=\"2.3\" rx=\"1.15\" style=\"fill:var(--spam-rim,#F2B632);stroke:var(--spam-rim-edge,#6E4A06)\" stroke-width=\".6\"/>\n<rect x=\".5\" y=\".8\" width=\"25\" height=\"2.3\" rx=\"1.15\" fill=\"url(#spamcan-shade)\"/>\n<rect x=\".5\" y=\"16.9\" width=\"25\" height=\"2.3\" rx=\"1.15\" fill=\"url(#spamcan-shade)\"/>\n<path d=\"M2.4 1.55h21.2\" stroke=\"#fff\" stroke-opacity=\".6\" stroke-width=\".5\" stroke-linecap=\"round\"/>\n</svg>";
const ROCKET = "<svg class=\"rk\" viewBox=\"0 0 256 256\" aria-hidden=\"true\" focusable=\"false\"><defs><linearGradient id=\"rk-b\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#FF8A5E\"/><stop offset=\".45\" stop-color=\"#FF4D1A\"/><stop offset=\"1\" stop-color=\"#B8300A\"/></linearGradient><linearGradient id=\"rk-w\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\"1\" stop-color=\"#c9d3d5\"/></linearGradient><linearGradient id=\"rk-f\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#5FD6DA\"/><stop offset=\".55\" stop-color=\"#1AADB3\"/><stop offset=\"1\" stop-color=\"#0E7C81\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"rk-n\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6b7478\"/><stop offset=\"1\" stop-color=\"#1c2124\"/></linearGradient><radialGradient id=\"rk-g\" cx=\"35%\" cy=\"30%\" r=\"75%\"><stop offset=\"0\" stop-color=\"#2b7e83\"/><stop offset=\".6\" stop-color=\"#0c3b3e\"/><stop offset=\"1\" stop-color=\"#051a1c\"/></radialGradient></defs><g transform=\"rotate(45 128 128) translate(0 6)\"><g class=\"rk-fl\"><path d=\"M112 196 C112 214 120 228 128 244 C136 228 144 214 144 196 Z\" fill=\"url(#rk-f)\"/><path d=\"M121 196 C121 206 124 213 128 222 C132 213 135 206 135 196 Z\" fill=\"#C9F3F4\" opacity=\".85\"/></g><path d=\"M104 180 L152 180 L146 198 L110 198 Z\" fill=\"url(#rk-n)\"/><path d=\"M90 132 L56 170 C52 175 54 186 60 190 L92 176 Z\" fill=\"url(#rk-w)\"/><path d=\"M166 132 L200 170 C204 175 202 186 196 190 L164 176 Z\" fill=\"url(#rk-w)\"/><path d=\"M128 14 C164 40 178 88 176 138 C175 158 170 172 164 184 L92 184 C86 172 81 158 80 138 C78 88 92 40 128 14 Z\" fill=\"url(#rk-b)\"/><path d=\"M128 14 C144 25 156 40 164 56 C142 49 114 49 92 56 C100 40 112 25 128 14 Z\" fill=\"url(#rk-w)\"/><rect x=\"122\" y=\"150\" width=\"12\" height=\"44\" rx=\"6\" fill=\"url(#rk-w)\"/><circle cx=\"128\" cy=\"104\" r=\"24\" fill=\"#fff\"/><circle cx=\"128\" cy=\"104\" r=\"17\" fill=\"url(#rk-g)\"/><path d=\"M117 99 A12 12 0 0 1 127 92\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".8\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M128 15 C163 41 177 88 175 138 C174 158 169 172 163 183 L93 183 C87 172 82 158 81 138 C79 88 93 41 128 15 Z\" fill=\"none\" stroke=\"#FFC2A8\" stroke-opacity=\".45\" stroke-width=\"2.5\"/><path d=\"M100 70 C96 92 95 118 98 146\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".28\" stroke-width=\"7\" stroke-linecap=\"round\"/><circle class=\"rk-port\" cx=\"100\" cy=\"168\" r=\"11\" fill=\"#1c2124\"/><circle class=\"rk-led\" cx=\"100\" cy=\"168\" r=\"7.5\" fill=\"none\" stroke=\"#FF4D1A\" stroke-width=\"3\"/><circle cx=\"100\" cy=\"168\" r=\"3\" fill=\"#0b0f11\"/><rect class=\"rk-flap\" x=\"87\" y=\"155\" width=\"26\" height=\"26\" rx=\"6\" fill=\"url(#rk-b)\" stroke=\"#FFC2A8\" stroke-opacity=\".75\" stroke-width=\"2\"/></g></svg>";
const NJ = "<svg class=\"nj\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"10 14 216 216\" aria-hidden=\"true\" focusable=\"false\"><defs><radialGradient id=\"fnj-suit\" cx=\"38%\" cy=\"25%\" r=\"85%\"><stop offset=\"0\" stop-color=\"#3b4245\"/><stop offset=\".55\" stop-color=\"#1a1e20\"/><stop offset=\"1\" stop-color=\"#07090a\"/></radialGradient><radialGradient id=\"fnj-head\" cx=\"36%\" cy=\"28%\" r=\"75%\"><stop offset=\"0\" stop-color=\"#4a5256\"/><stop offset=\".5\" stop-color=\"#22282b\"/><stop offset=\"1\" stop-color=\"#090b0c\"/></radialGradient><linearGradient id=\"fnj-skin\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#FFD766\"/><stop offset=\"1\" stop-color=\"#F5B835\"/></linearGradient><linearGradient id=\"fnj-teal\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--nj-a-lt)\"/><stop offset=\".5\" style=\"stop-color:var(--nj-a)\"/><stop offset=\"1\" style=\"stop-color:var(--nj-a-dk)\"/></linearGradient><linearGradient id=\"fnj-tealR\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--nj-k-lt)\"/><stop offset=\".5\" style=\"stop-color:var(--nj-k)\"/><stop offset=\"1\" style=\"stop-color:var(--nj-k-dk)\"/></linearGradient><linearGradient id=\"fnj-guard\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6b7478\"/><stop offset=\"1\" stop-color=\"#1c2124\"/></linearGradient><radialGradient id=\"fnj-shine\" cx=\"50%\" cy=\"50%\" r=\"50%\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".35\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></radialGradient><clipPath id=\"fnj-headclip\"><circle cx=\"128\" cy=\"104\" r=\"76\"/></clipPath></defs><g transform=\"rotate(38 190 70)\"><rect x=\"181\" y=\"-8\" width=\"18\" height=\"70\" rx=\"6\" fill=\"url(#fnj-tealR)\"/><g style=\"stroke:var(--nj-k-wrap)\" stroke-width=\"3\" opacity=\".7\"><path d=\"M181 4 L199 16 M199 4 L181 16 M181 22 L199 34 M199 22 L181 34 M181 40 L199 52 M199 40 L181 52\"/></g><rect x=\"179\" y=\"-14\" width=\"22\" height=\"10\" rx=\"4\" fill=\"#0b0d0e\"/><ellipse cx=\"190\" cy=\"66\" rx=\"20\" ry=\"7\" fill=\"url(#fnj-guard)\"/><rect x=\"182\" y=\"70\" width=\"16\" height=\"30\" rx=\"4\" fill=\"#0b0d0e\"/></g><path d=\"M38 256 C38 206 70 178 128 178 C186 178 218 206 218 256 Z\" fill=\"url(#fnj-suit)\"/><path d=\"M96 182 L128 238 L160 182\" fill=\"none\" stroke=\"#0a0c0d\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M96 182 L128 238 L160 182\" fill=\"none\" stroke=\"url(#fnj-teal)\" stroke-width=\"7\" stroke-linejoin=\"round\"/><path d=\"M44 238 C90 228 166 228 212 238 L214 256 L42 256 Z\" fill=\"url(#fnj-teal)\"/><path d=\"M44 238 C90 228 166 228 212 238\" fill=\"none\" style=\"stroke:var(--nj-a-sash)\" stroke-opacity=\".5\" stroke-width=\"2\"/><circle cx=\"128\" cy=\"104\" r=\"76\" fill=\"url(#fnj-head)\"/><g clip-path=\"url(#fnj-headclip)\"><path d=\"M60 150 C95 140 161 140 196 150\" fill=\"none\" stroke=\"#000\" stroke-opacity=\".35\" stroke-width=\"4\"/><path d=\"M66 164 C100 155 156 155 190 164\" fill=\"none\" stroke=\"#000\" stroke-opacity=\".3\" stroke-width=\"4\"/><rect x=\"50\" y=\"98\" width=\"156\" height=\"42\" rx=\"21\" fill=\"url(#fnj-skin)\"/><rect x=\"50\" y=\"98\" width=\"156\" height=\"10\" rx=\"5\" fill=\"#000\" opacity=\".18\"/><rect x=\"48\" y=\"70\" width=\"160\" height=\"20\" rx=\"4\" fill=\"url(#fnj-teal)\"/><rect x=\"48\" y=\"70\" width=\"160\" height=\"4\" style=\"fill:var(--nj-a-hl)\" opacity=\".55\"/></g><path d=\"M58 80 C40 76 26 86 14 104 C30 100 40 96 52 92 Z\" fill=\"url(#fnj-teal)\"/><path d=\"M58 84 C44 92 34 108 30 128 C44 116 52 104 60 92 Z\" style=\"fill:var(--nj-a-tail)\"/><circle cx=\"58\" cy=\"82\" r=\"9\" fill=\"url(#fnj-teal)\"/><ellipse cx=\"100\" cy=\"121\" rx=\"10\" ry=\"12\" fill=\"#3a2410\"/><ellipse cx=\"156\" cy=\"121\" rx=\"10\" ry=\"12\" fill=\"#3a2410\"/><circle cx=\"103.5\" cy=\"116.5\" r=\"3.4\" fill=\"#fff\" opacity=\".9\"/><circle cx=\"159.5\" cy=\"116.5\" r=\"3.4\" fill=\"#fff\" opacity=\".9\"/><path d=\"M84 106 Q100 100 114 106\" fill=\"none\" stroke=\"#3a2410\" stroke-width=\"4.5\" stroke-linecap=\"round\"/><path d=\"M142 106 Q156 100 172 106\" fill=\"none\" stroke=\"#3a2410\" stroke-width=\"4.5\" stroke-linecap=\"round\"/><circle cx=\"128\" cy=\"104\" r=\"75\" fill=\"none\" style=\"stroke:var(--nj-a)\" stroke-opacity=\".45\" stroke-width=\"2.5\"/><path d=\"M40 256 C40 208 72 180 128 180 C184 180 216 208 216 256\" fill=\"none\" style=\"stroke:var(--nj-a)\" stroke-opacity=\".35\" stroke-width=\"2.5\"/><ellipse cx=\"98\" cy=\"54\" rx=\"34\" ry=\"18\" fill=\"url(#fnj-shine)\" transform=\"rotate(-20 98 54)\"/></svg>";
const ICONS = {"x": "<svg class=\"ic\" style=\"--s:17.4;--k:var(--kx)\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-0.05 0 17.4 17.4\" ><path d=\"M10.4 7.4 16.9 0h-1.5L9.7 6.4 5.2 0H0l6.8 9.7L0 17.4h1.5l5.9-6.8 4.7 6.8h5.2l-6.9-10ZM8.3 9.8l-.7-1-5.5-7.6h2.4l4.4 6.2.7 1 5.7 8h-2.4L8.3 9.8Z\"/></svg>", "linkedin": "<svg class=\"ic\" style=\"--s:16\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"7 3 16 16\" > <path d=\"M19.6,19v-5.8c0-1.4-0.5-2.4-1.7-2.4c-1,0-1.5,0.7-1.8,1.3C16,12.3,16,12.6,16,13v6h-3.4 c0,0,0.1-9.8,0-10.8H16v1.5c0,0,0,0,0,0h0v0C16.4,9,17.2,7.9,19,7.9c2.3,0,4,1.5,4,4.9V19H19.6z M8.9,6.7L8.9,6.7 C7.7,6.7,7,5.9,7,4.9C7,3.8,7.8,3,8.9,3s1.9,0.8,1.9,1.9C10.9,5.9,10.1,6.7,8.9,6.7z M10.6,19H7.2V8.2h3.4V19z\"/> </svg>", "instagram": "<svg class=\"ic\" style=\"--s:15.9\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"6.95 4 15.9 15.9\" > <g> <path d=\"M15,5.4c2.1,0,2.4,0,3.2,0c0.8,0,1.2,0.2,1.5,0.3c0.4,0.1,0.6,0.3,0.9,0.6c0.3,0.3,0.5,0.5,0.6,0.9 c0.1,0.3,0.2,0.7,0.3,1.5c0,0.8,0,1.1,0,3.2s0,2.4,0,3.2c0,0.8-0.2,1.2-0.3,1.5c-0.1,0.4-0.3,0.6-0.6,0.9c-0.3,0.3-0.5,0.5-0.9,0.6 c-0.3,0.1-0.7,0.2-1.5,0.3c-0.8,0-1.1,0-3.2,0s-2.4,0-3.2,0c-0.8,0-1.2-0.2-1.5-0.3c-0.4-0.1-0.6-0.3-0.9-0.6 c-0.3-0.3-0.5-0.5-0.6-0.9c-0.1-0.3-0.2-0.7-0.3-1.5c0-0.8,0-1.1,0-3.2s0-2.4,0-3.2c0-0.8,0.2-1.2,0.3-1.5c0.1-0.4,0.3-0.6,0.6-0.9 c0.3-0.3,0.5-0.5,0.9-0.6c0.3-0.1,0.7-0.2,1.5-0.3C12.6,5.4,12.9,5.4,15,5.4 M15,4c-2.2,0-2.4,0-3.3,0c-0.9,0-1.4,0.2-1.9,0.4 c-0.5,0.2-1,0.5-1.4,0.9C7.9,5.8,7.6,6.2,7.4,6.8C7.2,7.3,7.1,7.9,7,8.7C7,9.6,7,9.8,7,12s0,2.4,0,3.3c0,0.9,0.2,1.4,0.4,1.9 c0.2,0.5,0.5,1,0.9,1.4c0.4,0.4,0.9,0.7,1.4,0.9c0.5,0.2,1.1,0.3,1.9,0.4c0.9,0,1.1,0,3.3,0s2.4,0,3.3,0c0.9,0,1.4-0.2,1.9-0.4 c0.5-0.2,1-0.5,1.4-0.9c0.4-0.4,0.7-0.9,0.9-1.4c0.2-0.5,0.3-1.1,0.4-1.9c0-0.9,0-1.1,0-3.3s0-2.4,0-3.3c0-0.9-0.2-1.4-0.4-1.9 c-0.2-0.5-0.5-1-0.9-1.4c-0.4-0.4-0.9-0.7-1.4-0.9c-0.5-0.2-1.1-0.3-1.9-0.4C17.4,4,17.2,4,15,4L15,4L15,4z\"/> <path d=\"M15,7.9c-2.3,0-4.1,1.8-4.1,4.1s1.8,4.1,4.1,4.1s4.1-1.8,4.1-4.1S17.3,7.9,15,7.9L15,7.9z M15,14.7c-1.5,0-2.7-1.2-2.7-2.7 c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7C17.7,13.5,16.5,14.7,15,14.7L15,14.7z\"/> <path d=\"M20.2,7.7c0,0.5-0.4,1-1,1s-1-0.4-1-1s0.4-1,1-1S20.2,7.2,20.2,7.7L20.2,7.7z\"/> </g> </svg>", "threads": "<svg class=\"ic\" style=\"--s:17.14\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"6.43 3.4 17.14 17.14\" > <path d=\"M19.1722 11.3454C19.0971 11.31 19.0208 11.2759 18.9435 11.2433C18.8089 8.80519 17.454 7.40937 15.1789 7.39508C15.1686 7.39502 15.1583 7.39502 15.148 7.39502C13.7872 7.39502 12.6554 7.96615 11.9588 9.00541L13.2101 9.84935C13.7305 9.07306 14.5472 8.90756 15.1486 8.90756C15.1556 8.90756 15.1625 8.90757 15.1694 8.90763C15.9185 8.91232 16.4838 9.12648 16.8497 9.5441C17.1159 9.84815 17.294 10.2683 17.3822 10.7985C16.718 10.6876 15.9997 10.6534 15.2318 10.6967C13.0688 10.8192 11.6782 12.0596 11.7716 13.7832C11.819 14.6575 12.2619 15.4096 13.0188 15.901C13.6588 16.3163 14.483 16.5195 15.3396 16.4735C16.4709 16.4125 17.3584 15.9881 17.9775 15.2121C18.4477 14.6229 18.7451 13.8592 18.8764 12.897C19.4155 13.2169 19.8151 13.6379 20.0357 14.1439C20.411 15.0042 20.4329 16.4178 19.2597 17.5703C18.2319 18.58 16.9963 19.0168 15.1291 19.0303C13.0578 19.0152 11.4913 18.362 10.4729 17.089C9.51916 15.897 9.02627 14.1752 9.00788 11.9714C9.02627 9.76765 9.51916 8.04585 10.4729 6.85381C11.4913 5.58079 13.0578 4.92767 15.1291 4.91254C17.2153 4.92779 18.8091 5.58405 19.8666 6.86321C20.3851 7.49049 20.776 8.27935 21.0337 9.19913L22.5 8.81448C22.1876 7.68233 21.6961 6.70675 21.0272 5.89767C19.6715 4.25773 17.6888 3.41742 15.1342 3.39999H15.1239C12.5745 3.41736 10.614 4.26087 9.29693 5.90707C8.12493 7.37199 7.52038 9.41032 7.50006 11.9654L7.5 11.9714L7.50006 11.9774C7.52038 14.5325 8.12493 16.5709 9.29693 18.0358C10.614 19.682 12.5745 20.5255 15.1239 20.5429H15.1342C17.4008 20.5274 18.9984 19.9439 20.3146 18.651C22.0366 16.9595 21.9848 14.8392 21.4172 13.5376C21.01 12.6042 20.2337 11.8461 19.1722 11.3454ZM15.2587 14.9631C14.3106 15.0156 13.3257 14.5972 13.2772 13.7011C13.2412 13.0366 13.7581 12.2952 15.3168 12.2069C15.4954 12.1967 15.6705 12.1918 15.8426 12.1918C16.4088 12.1918 16.9385 12.2459 17.42 12.3494C17.2404 14.5549 16.1869 14.913 15.2587 14.9631Z\" /> </svg>", "github": "<svg class=\"ic\" style=\"--s:16.6\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"6.8 3.76 16.6 16.6\" > <g> <path d=\"M15,4c-4.5,0-8.2,3.7-8.2,8.2c0,3.6,2.4,6.7,5.6,7.8c0.4,0.1,0.6-0.2,0.6-0.4c0-0.2,0-0.8,0-1.5 c-2.3,0.5-2.8-1-2.8-1c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5c0.8,0.1,1.3,0.8,1.3,0.8c0.7,1.3,1.9,0.9,2.4,0.7 c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.7-0.9-3.7-4.1c0-0.9,0.3-1.6,0.8-2.2c-0.1-0.2-0.4-1,0.1-2.2c0,0,0.7-0.2,2.3,0.8 C13.6,8.1,14.3,8,15,8c0.7,0,1.4,0.1,2.1,0.3c1.6-1.1,2.3-0.8,2.3-0.8c0.4,1.1,0.2,2,0.1,2.2c0.5,0.6,0.8,1.3,0.8,2.2 c0,3.2-1.9,3.8-3.7,4c0.3,0.3,0.6,0.8,0.6,1.5c0,1.1,0,2,0,2.3c0,0.2,0.1,0.5,0.6,0.4c3.3-1.1,5.6-4.2,5.6-7.8 C23.2,7.7,19.5,4,15,4z\"/> <path d=\"M9.9,15.8c0,0-0.1,0.1-0.1,0c-0.1,0-0.1-0.1-0.1-0.1c0,0,0.1-0.1,0.1,0C9.9,15.7,9.9,15.7,9.9,15.8L9.9,15.8z M9.8,15.7\"/> <path d=\"M10.2,16.1c0,0-0.1,0-0.2,0C10,16.1,10,16,10,15.9c0,0,0.1,0,0.2,0C10.3,16,10.3,16.1,10.2,16.1L10.2,16.1z M10.2,16.1\"/> <path d=\"M10.6,16.6c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.2c0.1,0,0.1,0,0.2,0.1C10.6,16.5,10.6,16.6,10.6,16.6 L10.6,16.6z M10.6,16.6\"/> <path d=\"M11,17.1c0,0-0.1,0-0.2,0c-0.1-0.1-0.1-0.2,0-0.2c0,0,0.1,0,0.2,0C11,16.9,11.1,17,11,17.1L11,17.1z M11,17.1\" /> <path d=\"M11.6,17.3c0,0.1-0.1,0.1-0.2,0.1c-0.1,0-0.2-0.1-0.1-0.2c0-0.1,0.1-0.1,0.2-0.1 C11.6,17.2,11.6,17.3,11.6,17.3L11.6,17.3z M11.6,17.3\"/> <path d=\"M12.3,17.4c0,0.1-0.1,0.1-0.2,0.1c-0.1,0-0.2-0.1-0.2-0.1c0-0.1,0.1-0.1,0.2-0.1 C12.2,17.3,12.3,17.3,12.3,17.4L12.3,17.4z M12.3,17.4\"/> <path d=\"M12.9,17.3c0,0.1-0.1,0.1-0.2,0.2c-0.1,0-0.2,0-0.2-0.1c0-0.1,0.1-0.1,0.2-0.2C12.8,17.2,12.9,17.2,12.9,17.3 L12.9,17.3z M12.9,17.3\"/> </g> </svg>", "spotify": "<svg class=\"ic\" style=\"--s:16.6\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"6.4 3.6 16.6 16.6\" > <path d=\"M14.7,3.6c-4.6,0-8.3,3.7-8.3,8.3c0,4.6,3.7,8.3,8.3,8.3c4.6,0,8.3-3.7,8.3-8.3C23,7.3,19.3,3.6,14.7,3.6 C14.7,3.6,14.7,3.6,14.7,3.6z M18.5,15.6c-0.1,0.2-0.5,0.3-0.7,0.2c-2-1.2-4.4-1.5-7.3-0.8c-0.3,0.1-0.6-0.1-0.6-0.4 C9.8,14.3,10,14,10.3,14c3.2-0.7,5.9-0.4,8.1,0.9C18.6,15,18.7,15.4,18.5,15.6z M19.6,13.3c-0.2,0.3-0.6,0.4-0.9,0.2 c-2.2-1.4-5.6-1.8-8.3-1c-0.3,0.1-0.7-0.1-0.8-0.4c-0.1-0.3,0.1-0.7,0.4-0.8c3-0.9,6.8-0.5,9.3,1.1C19.6,12.6,19.7,13,19.6,13.3 L19.6,13.3z M19.6,11C17,9.4,12.5,9.2,10,10c-0.4,0.1-0.8-0.1-1-0.5c-0.1-0.4,0.1-0.8,0.5-1c2.9-0.9,7.8-0.7,10.9,1.1 c0.4,0.2,0.5,0.7,0.3,1.1C20.5,11.1,20,11.2,19.6,11L19.6,11z\"/> </svg>", "email": "<svg class=\"ic\" style=\"--s:17\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0.5 17 17\"><path d=\"M1.5 3h14c.6 0 1 .3 1.2.8L8.5 9.6.3 3.8C.5 3.3.9 3 1.5 3Z\"/><path d=\"M0 5.6v8c0 .8.7 1.4 1.5 1.4h14c.8 0 1.5-.6 1.5-1.4v-8l-8.5 6-8.5-6Z\"/></svg>", "strava": "<svg class=\"ic\" style=\"--s:17\" aria-hidden=\"true\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"2 3 17 17\"><path d=\"M8 3 14 15h-4l-2-4-2 4H2L8 3Zm7 9 4 8h-3l-1-3-2 3h-3l4-8h1Z\"/></svg>"};
const SOCIALS = [{"label": "𝕏", "icon": "x", "href": "https://x.com/jaythaninja"}, {"label": "instagram", "icon": "instagram", "href": "https://www.instagram.com/jaythaninja"}, {"label": "threads", "icon": "threads", "href": "https://www.threads.com/jaythaninja"}, {"label": "github", "icon": "github", "href": "https://github.com/jaythaninja"}, {"label": "strava", "icon": "strava", "href": "https://www.strava.com/athletes/64153021"}, {"label": "spotify playlist", "icon": "spotify", "href": "https://open.spotify.com/playlist/4agJs1yW7WQcFx1Lg5VVZq?si=5117b6d947e84f1f"}, {"label": "linkedin", "icon": "linkedin", "href": "https://www.linkedin.com/in/jaythaninja"}, {"label": "email", "icon": "email", "href": "mailto:jay@jaytha.ninja"}];

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RAIN_GLYPHS = '0123456789{}[]<>/\\=+*:;.-_#$%&@abcdefhjknrstuvxyz'.split('');
const rg = () => RAIN_GLYPHS[Math.floor(Math.random()*RAIN_GLYPHS.length)];
const ALNUM = RAIN_GLYPHS.filter(c => /[a-z0-9]/.test(c)), scrambleOf = c => /^[a-z0-9]$/i.test(c) ? ALNUM[Math.floor(Math.random()*ALNUM.length)] : c;
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', {granularity: 'grapheme'}) : null;
const graphemes = t => seg ? Array.from(seg.segment(t), x => x.segment) : Array.from(t);
const mk = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const state = window.__foot = {page: PAGE};

/* ---- the markup (same classes as the homepage's .cta / .signup / .social, so foot.css is the homepage's css) ---- */
const onNow = /^\/now\/?$/.test(location.pathname);
const njItem = onNow ? `<li class="who"><span class="who-t">${NJ}</span></li>` : `<li class="who"><a class="who-t" href="/now/" aria-label="now">${NJ}</a></li>`;
const icon = s => `<li><a href="${esc(s.href)}" aria-label="${esc(s.label)}" title="${esc(s.label)}"${/^https?:/.test(s.href) ? ' target="_blank" rel="noopener"' : ''}>${ICONS[s.icon] || ''}</a></li>`;
foot.innerHTML =
  `<div class="cta"><p class="prompt">drop your email, <span class="teal">we promise no ${SPAM}</span></p>` +
  `<div class="signup"><form class="notify" action="${ACTION}" method="post" novalidate>` +
  `<label class="sr" for="foot-email">your email</label>` +
  `<input id="foot-email" type="email" name="email" required placeholder="you@email.com" autocomplete="email" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send">` +
  `<input type="hidden" name="embed" value="1"><input type="hidden" name="tag" value="site">` +
  `<input type="hidden" name="metadata__ref" value="${esc(PAGE)}"><input type="hidden" name="metadata__page" value="${esc(PATH)}">` +
  `<button type="submit" class="rkb" aria-label="liftoff" title="liftoff">${ROCKET}</button></form>` +
  `<p class="status" role="status" aria-live="polite"></p></div></div>` +
  `<nav class="elsewhere" aria-label="elsewhere"><ul class="social">${njItem}${SOCIALS.map(icon).join('')}</ul></nav>`;

const form = foot.querySelector('.notify'), statusEl = foot.querySelector('.status'), ul = foot.querySelector('.social');
const emailIn = form.querySelector('input[type=email]');
const nativeOk = v => !(v.valueMissing || v.typeMismatch || v.patternMismatch || v.tooLong || v.tooShort || v.badInput);
const looksDone = () => nativeOk(emailIn.validity) && /@[^@\s]+\.[^@\s.]{2,}$/.test(emailIn.value.trim());
const rkBtn = form.querySelector('.rkb'), SVGNS = 'http://www.w3.org/2000/svg';

/* ---- the charging line (the homepage's cable: one track, one fill, the white flow; one colour, see foot.css) ---- */
const PORT = (() => { const dx = 100 - 128, dy = 168 + 6 - 128, c = Math.SQRT1_2; return [(128 + (dx - dy)*c)/256, (128 + (dx + dy)*c)/256]; })();
const svgEl = (tag, attrs) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const cblSvg = k => svgEl('svg', {class: 'cbl ' + k, 'aria-hidden': 'true', focusable: 'false'});
/* v1.67 (jay 2026.10.03): one track path + one fill path (was 3 abutting segments each, which left faint joins at 1/3 and 2/3); the fill is one dash that grows along the whole line */
const cblT = cblSvg('cbl-t'), cblF = [cblSvg('cbl-f cbl-f1')], cblW = cblSvg('cbl-w');
const segT = [svgEl('path', {class: 's1'})], segF = [svgEl('path', {class: 'fill', pathLength: 100})], flowP = svgEl('path', {class: 'flow', pathLength: 100});
cblT.append(...segT); cblF.forEach((sv, i) => sv.appendChild(segF[i])); cblW.appendChild(flowP);
form.append(cblT, ...cblF, cblW); form.classList.add('cabled');
const cblAll = [cblT, ...cblF, cblW];
const placeCable = () => {
  if (!emailIn.offsetWidth) return;
  const x0 = emailIn.offsetLeft, yb = emailIn.offsetTop + emailIn.offsetHeight - .5, bw = rkBtn.offsetWidth, bh = rkBtn.offsetHeight;
  const xp = rkBtn.offsetLeft + bw*PORT[0], yp = Math.min(yb, rkBtn.offsetTop + bh*PORT[1]), pad = 12, run = bw*.6, xs = Math.max(x0, xp - run), d = Math.min(8, (yb - yp)*.5);
  const L = x0 - pad, T = yp - pad, X = v => (v - L).toFixed(2), Y = v => (v - T).toFixed(2);
  const curve = `C${X(xs + (xp - xs)*.55)} ${Y(yb)} ${X(xp - d)} ${Y(yp + d)} ${X(xp)} ${Y(yp)}`, a = x0 + (xs - x0)/3, b = x0 + (xs - x0)*2/3;
  const seg = [`M${X(x0)} ${Y(yb)}H${X(xs)}${curve}`];
  for (const sv of cblAll){ sv.style.left = L + 'px'; sv.style.top = T + 'px'; sv.setAttribute('width', (xp - x0 + 2*pad).toFixed(2)); sv.setAttribute('height', (yb - yp + 2*pad).toFixed(2)); }
  seg.forEach((d, i) => { segT[i].setAttribute('d', d); segF[i].setAttribute('d', d); });
  flowP.setAttribute('d', `M${X(x0)} ${Y(yb)}H${X(xs)}${curve}`);
  const len = flowP.getTotalLength && flowP.getTotalLength(); if (len) form.style.setProperty('--cbl-s', (100*(xs - x0)/len).toFixed(2));
};
/* ---- the icon row, evenly spaced like the homepage's: phones = the full screen width, equal gaps at both ends; wider = from the field's start to its end ---- */
const fitRow = () => { const W = emailIn.getBoundingClientRect().width; if (!W) return;
  const items = [...ul.children], n = items.length;
  const gw = items.reduce((t, li) => { const e = li.querySelector('svg.ic') || li.querySelector('svg.nj'); return t + (e ? parseFloat(getComputedStyle(e).width) || 0 : 0); }, 0);
  if (matchMedia('(max-width:760px)').matches){ const V = document.documentElement.clientWidth, s = Math.max(2, (V - gw)/(n + 1)); ul.style.marginLeft = '0px'; const x0 = ul.getBoundingClientRect().left;
    ul.style.setProperty('--igap', s.toFixed(2) + 'px'); ul.style.marginLeft = (s - x0).toFixed(2) + 'px'; return; }
  ul.style.marginLeft = ''; ul.style.setProperty('--igap', Math.max(2, (W - gw)/Math.max(1, n - 1)).toFixed(2) + 'px'); };
const fit = () => { fitRow(); placeCable(); };
fit(); addEventListener('resize', fit); if (window.ResizeObserver) new ResizeObserver(fit).observe(form); if (document.fonts) document.fonts.ready.then(fit);
const chgStep = () => { const v = emailIn.value, n = String(looksDone() ? 3 : v.includes('@') ? 2 : v.length ? 1 : 0); if (form.dataset.chg !== n) form.dataset.chg = n; };
const syncOk = () => { const ok = looksDone(); form.classList.toggle('ok', ok); form.classList.toggle('gold-ok', ok); chgStep(); };
['input', 'change', 'keyup'].forEach(ev => emailIn.addEventListener(ev, syncOk)); addEventListener('pageshow', syncOk); syncOk();

/* ---- the typed thank-you (the homepage's typer: a scrambling window, the rest held invisibly so the line never reflows) ---- */
const cursor = mk('span', 'cursor');
const prepare = (el, text) => { el.textContent = ''; const node = mk('span'), res = mk('span', 'res'), scr = mk('span', 'scr'), ghost = mk('span', 'ghost');
  ghost.textContent = text; node.append(res, scr, ghost); el.appendChild(node); const g = graphemes(text); return {node, res, scr, ghost, g, n: g.length}; };
const render = (t, head, win) => { const a = Math.min(t.n, Math.max(0, head - win)), b = Math.min(t.n, head);
  t.res.textContent = t.g.slice(0, a).join(''); t.scr.textContent = t.g.slice(a, b).map(scrambleOf).join(''); t.ghost.textContent = t.g.slice(b).join(''); t.node.insertBefore(cursor, t.ghost); };
const pace = () => document.documentElement.dataset.mode === 'fast' ? 4 : 2;
const type = (t, win) => new Promise(done => { let head = 0;
  const tick = () => { head++; render(t, head, win); if (head - win >= t.n) return done(); const c = t.g[Math.min(head, t.n) - 1];
    const base = TIMING.speed, delay = head > t.n ? base*.7 : c === '.' ? base*3.2 : c === ',' ? base*3 : base*(.75 + Math.random()*.6); setTimeout(tick, reduced ? 0 : delay/pace()); };
  tick(); });

/* ---- liftoff (= the homepage's launchRocket) ---- */
const LIFTOFF = {turn: 180, climbMin: 820, climbMax: 1100, perPx: 1, wakeEvery: 26, puff: 650, goldPer: 4, goldHot: .35, burn: 420, plume: 16, plumeMs: 1500};
const launchRocket = () => new Promise(done => {
  const btn = form.querySelector('.rkb'), svg = btn && btn.querySelector('.rk');
  state.rocket = {phase: 'turn', t0: performance.now()};
  if (!svg) return done();
  if (reduced || !svg.animate){
    state.rocket.phase = 'fade';
    const f = svg.animate ? svg.animate([{opacity: 1}, {opacity: 0}], {duration: 220, fill: 'forwards'}) : null;
    return f ? f.finished.then(() => { state.rocket.phase = 'gone'; done(); }) : done();
  }
  const r = btn.getBoundingClientRect(), sky = mk('div', 'rk-sky gold'); sky.setAttribute('aria-hidden', 'true'); document.body.appendChild(sky);
  Object.assign(svg.style, {left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px'});
  sky.appendChild(svg);
  if (window.JayRain && JayRain.gold) JayRain.gold({lock: true, track: () => { if (!svg.isConnected || svg.style.visibility === 'hidden') return -Infinity; const b = svg.getBoundingClientRect(); return (b.top + b.bottom)/2; }});
  const dist = r.bottom + r.height*2.5 + 40;
  const climb = Math.round(Math.min(LIFTOFF.climbMax, Math.max(LIFTOFF.climbMin, dist*LIFTOFF.perPx)));
  const puff = mk('span', 'puff'), ps = r.width*2.2;
  Object.assign(puff.style, {left: (r.left + r.width/2 - ps/2) + 'px', top: (r.top + r.height*.7 - ps/2) + 'px', width: ps + 'px', height: ps + 'px'});
  sky.insertBefore(puff, svg);
  puff.animate([{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'scale(.8)', offset: .25}, {opacity: 0, transform: 'scale(1.6)'}], {duration: LIFTOFF.puff, delay: LIFTOFF.turn*.6, easing: 'ease-out', fill: 'both'});
  const AU = {'rk-b': ['#FFF3B0', '#FFD700', '#B8860B'], 'rk-w': ['#FFFFFF', '#FFF1C4'], 'rk-f': ['#FFFBE0', '#FFE066', '#FFB800'], 'rk-n': ['#E8C860', '#7A5A10'], 'rk-g': ['#FFF0A0', '#C99A00', '#5A4200']};
  const goldCopy = (cls, band) => { const c = svg.cloneNode(true); c.classList.add(cls); c.style.opacity = ''; c.style.transform = '';
    c.querySelectorAll('[id]').forEach(g => { const cols = AU[g.id]; g.id = g.id + '-' + cls; if (cols) g.querySelectorAll('stop').forEach((s, i) => s.setAttribute('stop-color', band ? '#FFF8DC' : cols[Math.min(i, cols.length - 1)])); });
    c.querySelectorAll('[fill^="url(#"]').forEach(e => e.setAttribute('fill', e.getAttribute('fill').replace(/\)$/, '-' + cls + ')')));
    if (band) c.querySelectorAll('[fill="#fff"], [fill="#C9F3F4"]').forEach(e => e.setAttribute('fill', '#FFF8DC'));
    else c.querySelectorAll('[fill="#C9F3F4"]').forEach(e => e.setAttribute('fill', '#FFFBE0'));
    c.querySelectorAll('[stroke="#FFC2A8"]').forEach(e => e.setAttribute('stroke', '#FFF3B0'));
    sky.appendChild(c); return c; };
  const au = goldCopy('au', false), band = goldCopy('au-band', true);
  const cut = u => `polygon(-200% ${-200 - u}%, 300% ${300 - u}%, 300% 400%, -200% 400%)`;
  const strip = u => `polygon(-200% ${-200 - u}%, 300% ${300 - u}%, 300% ${314 - u}%, -200% ${-186 - u}%)`;
  const burnOpt = {duration: LIFTOFF.burn, easing: 'cubic-bezier(.35,.1,.5,1)', fill: 'both'};
  au.animate([{clipPath: cut(-100)}, {clipPath: cut(100)}], burnOpt);
  band.animate([{clipPath: strip(-100), opacity: 0}, {opacity: 1, offset: .12}, {opacity: 1, offset: .8}, {clipPath: strip(114), opacity: 0}], burnOpt);
  state.rocket.gold = 'burning';
  setTimeout(() => { svg.style.opacity = '0'; band.remove(); state.rocket.gold = 'gold'; }, LIFTOFF.burn + 20);
  const both = (kf, o) => [svg, au, band].map(e => e.isConnected ? e.animate(kf, o) : null)[0];
  const plume = () => { const px = r.left + r.width/2, py = r.bottom + r.height*.15, base = r.width;
    for (let i = 0; i < LIFTOFF.plume; i++){
      const side = i % 2 ? 1 : -1, k = (i >> 1)/(LIFTOFF.plume/2), s = base*(.9 + Math.random()*.9), e = mk('span', i < 3 ? 'plm au' : Math.random() < .35 ? 'plm g' : 'plm');
      const x0 = px - s/2 + side*base*.1, y0 = py - s/2, dx = side*base*(.6 + k*2.4 + Math.random()*.6), dy = -base*(.1 + Math.random()*.45) - k*base*.2;
      Object.assign(e.style, {width: s + 'px', height: s + 'px'}); e.style.transform = `translate(${x0}px,${y0}px) scale(.3)`; sky.insertBefore(e, svg);
      e.animate([{transform: `translate(${x0}px,${y0}px) scale(.3)`, opacity: 0}, {opacity: .9, offset: .18}, {transform: `translate(${x0 + dx}px,${y0 + dy}px) scale(${1.8 + k*1.4})`, opacity: 0}],
        {duration: LIFTOFF.plumeMs*(.75 + Math.random()*.4), delay: LIFTOFF.turn*.7 + k*140, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both'}).finished.then(() => e.remove(), () => {});
    } };
  plume();
  const turn = both([{transform: 'rotate(0deg)'}, {transform: 'rotate(-45deg)'}], {duration: LIFTOFF.turn, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards'});
  turn.finished.then(() => {
    state.rocket.phase = 'climb'; state.rocket.climb = climb; state.rocket.dist = Math.round(dist);
    form.inert = true; form.classList.add('gone');
    const fly = both([{transform: 'translateY(0) rotate(-45deg)'}, {transform: `translateY(${-dist}px) rotate(-45deg)`}], {duration: climb, easing: 'cubic-bezier(.5,0,.85,.35)', fill: 'forwards'});
    let lastWake = 0, raf = 0;
    const wake = now => {
      if (now - lastWake >= LIFTOFF.wakeEvery){
        lastWake = now;
        const b = svg.getBoundingClientRect();
        if (b.bottom > -40) for (let g = 0; g < LIFTOFF.goldPer; g++){
          const w = mk('span', Math.random() < LIFTOFF.goldHot ? 'wk hot' : 'wk'); w.textContent = rg();
          const x = b.left + b.width/2 + (Math.random() - .5)*b.width*.35, y = b.bottom + b.height*.35;
          w.style.transform = `translate(${x}px,${y}px)`; sky.appendChild(w);
          const dx = (Math.random() - .5)*34, dy = 26 + Math.random()*46;
          w.animate([{transform: `translate(${x}px,${y}px) scale(1)`, opacity: .95}, {transform: `translate(${x + dx}px,${y + dy}px) scale(.7)`, opacity: 0}], {duration: 640 + Math.random()*420, easing: 'ease-out', fill: 'forwards'}).finished.then(() => w.remove());
        }
      }
      raf = requestAnimationFrame(wake);
    };
    raf = requestAnimationFrame(wake);
    fly.finished.then(() => {
      cancelAnimationFrame(raf); svg.style.visibility = 'hidden'; au.style.visibility = 'hidden'; state.rocket.phase = 'gone'; state.rocket.took = Math.round(performance.now() - state.rocket.t0);
      setTimeout(() => sky.remove(), 1600);
      done();
    });
  });
});

/* ---- the failed liftoff for an incomplete email (= the homepage's failLiftoff: a random flight that never crosses the field, a crash in a corner, the glow, focus back) ---- */
const FAIL = {reducedMs: 360, turn: 180, swirlMin: 1150, swirlMax: 1450, swirlPerPx: .7, dive: 700, crash: 340, back: 280, wakeEvery: 34, smokeEvery: 22};
function failLiftoff(){
  const btn = form.querySelector('.rkb'), svg = btn && btn.querySelector('.rk'), fl = svg && svg.querySelector('.rk-fl');
  if (!fl || !svg.animate || form.classList.contains('gone') || btn.disabled) return;
  const f = state.fail = state.fail || {count: 0, ignored: 0};
  if (f.playing){ f.ignored++; return; }
  f.playing = true; f.count++; f.t0 = performance.now(); f.phase = 'turn';
  failAnnounce();
  if (reduced){
    failGlow(0, true);
    const end = () => { f.playing = false; f.phase = 'idle'; f.took = Math.round(performance.now() - f.t0); };
    fl.animate([{opacity: .85}, {opacity: .25, offset: .3}, {opacity: 1, offset: .6}, {opacity: .85}], {duration: FAIL.reducedMs, easing: 'linear'}).finished.then(end, end);
    return;
  }
  const r = btn.getBoundingClientRect(), W = innerWidth, H = innerHeight, sz = r.width, S = [r.left + sz/2, r.top + r.height/2];
  const sky = mk('div', 'rk-sky fake'); sky.setAttribute('aria-hidden', 'true'); document.body.appendChild(sky);
  const ghost = svg.cloneNode(true); ghost.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
  Object.assign(ghost.style, {left: r.left + 'px', top: r.top + 'px', width: sz + 'px', height: r.height + 'px', transformOrigin: '50% 50%'}); sky.appendChild(ghost);
  svg.style.transition = 'none'; svg.style.opacity = '0';
  const Lx = Math.max(sz, S[0] - .8*Math.min(W, 700)), Rx = Math.min(W - sz, S[0] + .35*Math.min(W, 700)), Ty = .12*H, By = .56*H;
  const at = (u, v) => [Lx + u*(Rx - Lx), Ty + v*(By - Ty)];
  const lift = [S[0], S[1] - Math.min(.2*H, 170)];
  const P0 = [S, lift, at(.8, .05), at(.2, .12), at(.05, .6), at(.5, .85), at(.85, .45), at(.55, .15), [W*.78, H*.6], [W - sz*.35, H - sz*.35]];
  const cr = (p0, p1, p2, p3, t) => { const t2 = t*t, t3 = t2*t; return [0, 1].map(k => .5*((2*p1[k]) + (-p0[k] + p2[k])*t + (2*p0[k] - 5*p1[k] + 4*p2[k] - p3[k])*t2 + (-p0[k] + 3*p1[k] - 3*p2[k] + p3[k])*t3)); };
  const sample = P => {
    const pts = [], seg = [];
    for (let i = 0; i < P.length - 1; i++){ const p0 = P[Math.max(0, i - 1)], p3 = P[Math.min(P.length - 1, i + 2)]; seg[i] = pts.length; for (let j = 0; j < 40; j++) pts.push(cr(p0, P[i], P[i + 1], p3, j/40)); }
    pts.push(P[P.length - 1]);
    const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return {P, pts, seg, len};
  };
  const clock = sample(P0);
  const swirl = Math.round(Math.min(FAIL.swirlMax, Math.max(FAIL.swirlMin, clock.len[clock.seg[7]]*FAIL.swirlPerPx)));
  const R = (a, b) => a + Math.random()*(b - a), m = sz*.6;
  const box = emailIn.getBoundingClientRect(), bp = sz*.75;
  let last = null; try { last = sessionStorage.getItem('jtn.failCorner'); } catch (e) {}
  const top = /^[tb][lr]$/.test(last || '') ? last[0] === 'b' : Math.random() < .5, left = Math.random() < .5, corner = (top ? 't' : 'b') + (left ? 'l' : 'r');
  const zw = Math.min(360, Math.max(2.5*sz, .3*W)), zh = Math.min(320, Math.max(2.5*sz, .35*H)), off = sz*1.1;
  const inZone = (x, y) => (left ? x < zw : x > W - zw) || (top ? y < zh : y > H - zh);
  const ex = a => left ? a : W - a, ey = a => top ? a : H - a;
  const exitAt = () => Math.random() < .5
    ? {T: [ex(R(-off*.3, zw - sz)), ey(-off)], edge: top ? 'top' : 'bottom'}
    : {T: [ex(-off), ey(R(-off*.3, zh - sz*.5))], edge: left ? 'left' : 'right'};
  const onScr = (x, y) => x >= sz*.3 && x <= W - sz*.3 && y >= sz*.3 && y <= H - sz*.3;
  const nearBox = (x, y) => x > box.left - bp && x < box.right + bp && y > box.top - bp && y < box.bottom + bp;
  const randomFlight = (T, edge) => {
    const lf = [S[0], S[1] - Math.min(R(.12, .3)*H, R(110, 230))];
    const loops = R(1, 2.5), dir = Math.random() < .5 ? 1 : -1, wob = R(.04, .16), k = Math.min(1, 1.6/(loops + .4));
    const rx = Math.min(R(.16, .3)*Math.min(W, 700)*k, (W - 2*m)/2 - 1), ry = Math.min(R(.09, .17)*H*k, (H - 2*m)/2 - 1);
    if (rx < sz || ry < sz) return null;
    const cx = R(m + rx, W - m - rx), cy = R(m + ry, H - m - ry);
    const a0 = Math.atan2((lf[1] - cy)/ry, (lf[0] - cx)/rx), n = Math.max(6, Math.round(loops*8)), L = [];
    for (let i = 0; i <= n; i++){ const a = a0 + dir*2*Math.PI*loops*i/n, q = 1 + (Math.random() - .5)*2*wob; L.push([cx + Math.cos(a)*rx*q, cy + Math.sin(a)*ry*q]); }
    const E = L[L.length - 1], dx = T[0] - E[0], dy = T[1] - E[1], bend = R(-.35, .35), at2 = R(.35, .7);
    const mid = [Math.min(W - m, Math.max(m, E[0] + dx*at2 - dy*bend)), Math.min(H - m, Math.max(m, E[1] + dy*at2 + dx*bend))];
    const c = sample([S, lf, ...L, mid, T]), d0 = c.seg[2 + n];
    for (let i = 0; i < c.pts.length; i++){ const [x, y] = c.pts[i];
      if (i < c.seg[1]){ if (x < S[0] - 2 && nearBox(x, y)) return null; continue; }
      if (nearBox(x, y) || (!onScr(x, y) && (i < d0 || !inZone(x, y)))) return null; }
    return Object.assign(c, {loops: +loops.toFixed(2), dir: dir > 0 ? 'cw' : 'ccw', edge, swirlEnd: 2 + n, wobAmp: R(2, 8), wobRate: R(26, 52)});
  };
  let fly = null, tries = 0;
  while (!fly && tries < 400){ tries++; const e = exitAt(); fly = randomFlight(e.T, e.edge); }
  if (!fly){
    fly = Object.assign(sample([...P0.slice(0, -2), [left ? W*.22 : W*.78, top ? H*.25 : H*.6], [ex(-off), ey(sz)]]), {loops: 1.5, dir: 'fixed', edge: left ? 'left' : 'right', swirlEnd: 7, wobAmp: 0, wobRate: 40});
  }
  try { sessionStorage.setItem('jtn.failCorner', corner); } catch (e) {}
  { const T = fly.pts[fly.pts.length - 1]; f.exit = {corner, last, edge: fly.edge, x: Math.round(T[0]), y: Math.round(T[1]), tries, fallback: fly.dir === 'fixed'}; }
  const {P, pts, len} = fly;
  const L7 = len[fly.seg[fly.swirlEnd]], Lend = len[len.length - 1];
  const tSwirl = FAIL.turn, tDive = tSwirl + swirl, tCrash = tDive + FAIL.dive, tBack = tCrash + FAIL.crash, tEnd = tBack + FAIL.back;
  const posAt = s => { let lo = 0, hi = len.length - 1; while (lo < hi){ const m = (lo + hi) >> 1; if (len[m] < s) lo = m + 1; else hi = m; } const i = Math.max(1, lo), k = (s - len[i - 1])/Math.max(1e-6, len[i] - len[i - 1]);
    return {x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0])*k, y: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1])*k, a: Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])*180/Math.PI}; };
  const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;
  let rot = 0, lastWake = 0, lastSmoke = 0, raf = 0, crashed = false, done = false; const t0 = performance.now();
  const bit = (cls, x, y, size, kf, dur) => { const e = mk('span', cls); if (size) Object.assign(e.style, {width: size + 'px', height: size + 'px'}); e.style.transform = `translate(${x}px,${y}px)`; sky.appendChild(e);
    e.animate(kf, {duration: dur, easing: 'ease-out', fill: 'forwards'}).finished.then(() => e.remove(), () => {}); return e; };
  const finish = () => { if (done) return; done = true; cancelAnimationFrame(raf); f.playing = false; f.phase = 'idle'; f.abort = null; f.took = Math.round(performance.now() - f.t0); };
  const restore = () => { svg.style.transition = ''; svg.style.opacity = ''; };
  f.abort = () => { cancelAnimationFrame(raf); sky.remove(); restore(); svg.getAnimations().forEach(a => a.cancel()); glowStop(); finish(); f.aborted = (f.aborted || 0) + 1; };
  const frame = now => {
    const t = now - t0;
    let x = S[0], y = S[1], target = rot;
    if (t < tSwirl){ target = -45*ease(t/FAIL.turn); f.phase = 'turn'; }
    else if (t < tCrash){
      const diving = t >= tDive; f.phase = diving ? 'dive' : 'swirl';
      const s = diving ? L7 + (Lend - L7)*Math.pow((t - tDive)/FAIL.dive, 1.7) : L7*ease((t - tSwirl)/swirl);
      const p = posAt(Math.min(Lend, s)); x = p.x; y = p.y;
      let a = p.a + 45; while (a - rot > 180) a -= 360; while (a - rot < -180) a += 360;
      target = a + (diving ? Math.sin(t/38)*7 : Math.sin(t/fly.wobRate)*fly.wobAmp);
      if (diving && !ghost.classList.contains('sput')) ghost.classList.add('sput');
      const hd = (rot - 45)*Math.PI/180, tx = x - Math.cos(hd)*sz*.42, ty = y - Math.sin(hd)*sz*.42;
      if (!diving && now - lastWake >= FAIL.wakeEvery){ lastWake = now;
        const dx = -Math.cos(hd)*30 + (Math.random() - .5)*20, dy = -Math.sin(hd)*30 + (Math.random() - .5)*20;
        const w = bit(Math.random() < .22 ? 'wk hot' : 'wk', tx, ty, 0, [{transform: `translate(${tx}px,${ty}px) scale(1)`, opacity: .95}, {transform: `translate(${tx + dx}px,${ty + dy}px) scale(.7)`, opacity: 0}], 560 + Math.random()*300); w.textContent = rg(); }
      if (diving && now - lastSmoke >= FAIL.smokeEvery){ lastSmoke = now;
        const k = sz*(.45 + Math.random()*.35);
        bit(Math.random() < .3 ? 'smk grey' : 'smk', tx - k/2, ty - k/2, k, [{transform: `translate(${tx - k/2}px,${ty - k/2}px) scale(.35)`, opacity: .9}, {transform: `translate(${tx - k/2 + (Math.random() - .5)*16}px,${ty - k/2 - 10 - Math.random()*14}px) scale(1.7)`, opacity: 0}], 700 + Math.random()*350); }
    } else {
      const p = posAt(Lend); x = p.x; y = p.y;
      if (!crashed){ crashed = true; f.phase = 'crash';
        const cx = Math.max(18, Math.min(W - 18, x)), cy = Math.max(18, Math.min(H - 18, y)), ai = Math.atan2(H/2 - cy, W/2 - cx);
        ghost.animate([{opacity: 1}, {opacity: 0}], {duration: 110, fill: 'forwards'});
        const fb = sz*1.6; bit('smk hot', cx - fb/2, cy - fb/2, fb, [{transform: `translate(${cx - fb/2}px,${cy - fb/2}px) scale(.3)`, opacity: 1}, {transform: `translate(${cx - fb/2}px,${cy - fb/2}px) scale(1.2)`, opacity: 0}], 380);
        for (let i = 0; i < 6; i++){ const a = ai - Math.PI/4 + Math.PI*.5*i/5 + (Math.random() - .5)*.3, d = sz*(.5 + Math.random()*.5), k = sz*(.7 + Math.random()*.5);
          bit(i % 3 ? 'smk' : 'smk grey', cx - k/2, cy - k/2, k, [{transform: `translate(${cx - k/2}px,${cy - k/2}px) scale(.3)`, opacity: .95}, {transform: `translate(${cx - k/2 + Math.cos(a)*d}px,${cy - k/2 + Math.sin(a)*d}px) scale(1.5)`, opacity: 0}], 620 + Math.random()*260); }
        for (let i = 0; i < 5; i++){ const a = ai + Math.PI*(.4*Math.random() - .2), d = sz*(.8 + Math.random()*.9);
          const e = bit('spk', cx, cy, 0, [{transform: `translate(${cx}px,${cy}px)`, opacity: 1}, {transform: `translate(${cx + Math.cos(a)*d}px,${cy + Math.sin(a)*d}px)`, opacity: 0}], 420 + Math.random()*200); e.textContent = rg(); }
      }
      if (t >= tBack && svg.style.opacity === '0'){ f.phase = 'back'; restore();
        svg.animate([{transform: 'scale(.55)', opacity: 0}, {transform: 'scale(1.08)', opacity: 1, offset: .7}, {transform: 'none'}], {duration: FAIL.back, easing: 'ease-out'}); }
      if (t >= tEnd){ finish(); setTimeout(() => sky.remove(), 900); return; }
    }
    rot += (target - rot)*(t < tSwirl ? 1 : .35);
    ghost.style.transform = `translate(${x - S[0]}px,${y - S[1]}px) rotate(${rot}deg)`;
    raf = requestAnimationFrame(frame);
  };
  f.plan = {swirl, total: tEnd, pathPx: Math.round(Lend), crash: P[P.length - 1].map(Math.round), loops: fly.loops, dir: fly.dir, edge: fly.edge, tries, crashAt: tCrash};
  failGlow(tCrash - GLOW.lead*GLOW.pulseMs, true);
  raf = requestAnimationFrame(frame);
}
const GLOW = {pulses: 7, lead: 1.5, pulseMs: 500, reducedMs: 700, reducedPeak: .55};
let glowRaf = 0, glowFocusing = false;
const glowSet = g => {
  if (g <= 0){ ['--eg-c', '--eg-pc', '--eg-s'].forEach(p => emailIn.style.removeProperty(p)); if (!emailIn.style.length) emailIn.removeAttribute('style'); return; }
  const cs = getComputedStyle(form), TR = cs.getPropertyValue('--c-rgb').split(',').map(Number), TS = TR.join(',');
  const mix = a => a.map((v, i) => Math.round(v + (TR[i] - v)*g)).join(',');
  const FG = cs.getPropertyValue('--fg-rgb').split(',').map(Number), INK = cs.getPropertyValue('--ink-rgb').split(',').map(Number);
  emailIn.style.setProperty('--eg-c', `rgb(${mix(FG)})`);
  emailIn.style.setProperty('--eg-pc', `rgba(${mix(INK)},${(.34 + .66*g).toFixed(3)})`);
  emailIn.style.setProperty('--eg-s', `0 0 ${(3 + 7*g).toFixed(1)}px rgba(${TS},${(.95*g).toFixed(3)}),0 0 ${(10 + 12*g).toFixed(1)}px rgba(${TS},${(.6*g).toFixed(3)})`);
};
const glowStop = () => { if (glowRaf){ cancelAnimationFrame(glowRaf); glowRaf = 0; if (state.fail) state.fail.glow = 'stopped'; } glowSet(0); };
let failPointer = '';
rkBtn.addEventListener('pointerdown', e => { failPointer = e.pointerType || ''; }, {passive: true});
emailIn.addEventListener('keydown', e => { if (e.key === 'Enter') failPointer = ''; });
const touchish = () => failPointer === 'touch' || failPointer === 'pen' || matchMedia('(pointer: coarse)').matches || matchMedia('(hover: none)').matches;
const glowFocus = () => {
  if (touchish()) return;
  const a = document.activeElement;
  if (form.classList.contains('gone') || (a && a !== document.body && a !== rkBtn)) return;
  glowFocusing = true; emailIn.focus({preventScroll: true}); glowFocusing = false;
};
function failGlow(startIn, focusAfter){
  glowStop(); const f = state.fail, t0 = performance.now() + Math.max(0, startIn), dur = reduced ? GLOW.reducedMs : GLOW.pulses*GLOW.pulseMs;
  f.glow = 'wait';
  const step = now => {
    const t = now - t0;
    if (t >= dur){ glowRaf = 0; glowSet(0); f.glow = 'done'; if (focusAfter) glowFocus(); return; }
    if (t >= 0){ f.glow = 'on'; glowSet(reduced ? GLOW.reducedPeak*Math.sin(Math.PI*t/dur) : Math.pow(Math.sin(Math.PI*(t % GLOW.pulseMs)/GLOW.pulseMs), 2)); }
    glowRaf = requestAnimationFrame(step);
  };
  glowRaf = requestAnimationFrame(step);
}
emailIn.addEventListener('input', glowStop);
emailIn.addEventListener('pointerdown', glowStop);
emailIn.addEventListener('focus', () => { if (!glowFocusing) glowStop(); });
const failNoteEl = mk('span', 'sr'); failNoteEl.setAttribute('aria-live', 'polite'); form.appendChild(failNoteEl);
const failAnnounce = () => { emailIn.setAttribute('aria-invalid', 'true'); failNoteEl.textContent = ''; requestAnimationFrame(() => { failNoteEl.textContent = COPY.failNote; }); };
const failClear = () => { emailIn.removeAttribute('aria-invalid'); failNoteEl.textContent = ''; };
emailIn.addEventListener('input', () => { if (emailIn.hasAttribute('aria-invalid')) failClear(); });
const kbSettle = () => new Promise(res => {
  const had = document.activeElement === emailIn; if (had) emailIn.blur();
  if (!had || !touchish()) return res();
  const vv = window.visualViewport; let seen = false, quiet = 0, done = false;
  const fin = () => { if (done) return; done = true; clearTimeout(quiet); clearTimeout(first); clearTimeout(cap); if (vv){ vv.removeEventListener('resize', ev); vv.removeEventListener('scroll', ev); } requestAnimationFrame(() => res()); };
  const ev = () => { seen = true; clearTimeout(quiet); quiet = setTimeout(fin, 90); };
  const first = setTimeout(() => { if (!seen) fin(); }, 300), cap = setTimeout(fin, 700);
  if (vv){ vv.addEventListener('resize', ev); vv.addEventListener('scroll', ev); }
});
/* the buttondown fields at send time: tag=site stays, a ref ADDS its own tag; metadata__ref = the ref (else this page's name), metadata__page = the path */
const setFields = () => {
  const r = (window.JayRain && JayRain.ref && JayRain.ref()) || '', tg = form.querySelector('input[name=tag]');
  tg.value = 'site'; form.querySelectorAll('input[data-ref-tag]').forEach(x => x.remove());
  if (r && r !== 'site'){ const x = mk('input'); x.type = 'hidden'; x.name = 'tag'; x.value = r; x.dataset.refTag = ''; tg.after(x); }
  form.querySelector('input[name=metadata__ref]').value = r || PAGE; form.querySelector('input[name=metadata__page]').value = PATH;
  return r;
};
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form.classList.contains('gone')) return;
  if (!looksDone()){ syncOk(); if (touchish() && document.activeElement === emailIn){ kbSettle().then(failLiftoff); return; } failLiftoff(); return; }
  if (state.fail && state.fail.abort) state.fail.abort(); glowStop(); failClear();
  rkBtn.disabled = true;
  form.classList.add('ign');
  ul.classList.add('gld');
  const settled = kbSettle();
  const r = setFields();
  try { const res = await fetch(form.action, {method: 'POST', mode: 'cors', body: new FormData(form)}); if (!res.ok) throw new Error(res.status); }
  catch (err) { form.classList.remove('ign'); ul.classList.remove('gld'); rkBtn.disabled = false; HTMLFormElement.prototype.submit.call(form); return; }
  await settled;
  if (typeof gtag === 'function') gtag('event', 'sign_up', r ? {method: 'email', ref: r} : {method: 'email'});   // v1.65: GA4 sign_up as the rocket lifts off (no email, only the ?ref= tag)
  window.__footSent = true;
  await launchRocket();
  form.inert = true; form.classList.add('gone');
  statusEl.innerHTML = '<span class="sr"></span><span class="typed" aria-hidden="true"></span>';
  statusEl.firstChild.textContent = COPY.thanks;
  const t = prepare(statusEl.lastChild, COPY.thanks); render(t, 0, TIMING.window);
  statusEl.tabIndex = -1; statusEl.style.outline = 'none'; statusEl.focus({preventScroll: true});
  await type(t, TIMING.window);
  { const b = statusEl.getBoundingClientRect(); if (window.JayRain && JayRain.gold) JayRain.gold({ms: 1700, y: (b.top + b.bottom)/2, lock: true}); }
  state.sent = true;
});
})();
