import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { copy, typing } from "../src/copy.js";
import { galleries } from "../src/camera-roll/galleries.js";

assert.equal(copy.hello, "hello, fellow human...");
assert.deepEqual(typing, { speed: 55, window: 4 });
assert.equal(copy.headline, "[headline line 1]\n[headline line 2]\n[headline line 3]");
assert.equal(copy.subline, "[sub-line: one short sentence]");
assert.ok(Array.isArray(galleries));

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
assert.match(css, /--sans:"proxima-nova","Proxima Nova","Montserrat",sans-serif/);
assert.match(css, /--mono:"JetBrains Mono","IBM Plex Mono",ui-monospace,monospace/);
assert.match(css, /\.b1\{[^}]*font-size:21px/);
assert.match(css, /\.b2\{[^}]*font-size:25px/);
assert.match(css, /\.b2\{[^}]*line-height:1\.45/);
assert.match(css, /\.b3\{[^}]*font-size:20px/);
assert.match(css, /\.b1\{font-size:17px\}/);
assert.match(css, /\.b2\{font-size:21px/);
assert.match(css, /\.b3\{font-size:16px/);
assert.match(css, /height:82vh/);
assert.match(css, /min-height:620px/);
assert.match(css, /transition:color \.15s ease,border-color \.15s ease,background-color \.15s ease/);
assert.equal(css.includes("italic"), false);
assert.equal(css.includes("proxima-nova"), true);

const main = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
assert.match(main, /decodeType\(el, text, typing\)/);

assert.equal(existsSync(new URL("../CNAME", import.meta.url)), false);

const dist = new URL("../dist/", import.meta.url);
assert.equal(existsSync(dist), true, "dist/ missing; run vite build first");

function readDist(name) {
  return readFileSync(new URL(name, dist), "utf8");
}

const home = readDist("index.html");
for (const text of [
  "hello, fellow human...",
  "[headline line 1] [headline line 2] [headline line 3]",
  "[sub-line: one short sentence]",
  "[waitlist button]",
  "[waitlist card title]",
  "[waitlist card text, one short line]",
  "[camera roll title]",
  "[camera roll description]",
  "[now description]",
  "[github description]",
  "[contact lead-in]",
  "[footer line]",
  "https://github.com/jaythaninja",
  "/jaytha.ninja/waitlist/",
  "/jaytha.ninja/camera-roll/",
  "/jaytha.ninja/now/",
]) {
  assert.ok(home.includes(text), `homepage missing ${text}`);
}
assert.equal(home.includes("https://jaytha.ninja"), false);
assert.equal(home.includes("italic"), false);
assert.match(home, /href="\/jaytha\.ninja\/assets\//);

for (const [file, text] of [
  ["waitlist/index.html", "[placeholder]"],
  ["camera-roll/index.html", "[placeholder]"],
  ["now/index.html", "[placeholder]"],
]) {
  const html = readDist(file);
  assert.ok(html.includes(text), `${file} missing placeholder`);
  assert.ok(html.includes("https://github.com/jaythaninja"), `${file} missing github`);
  assert.equal(html.includes("https://jaytha.ninja"), false, `${file} points at the live domain`);
}

const cssFile = readdirSync(new URL("assets", dist)).find((name) => name.endsWith(".css"));
assert.ok(cssFile, "built css missing");
const builtCss = readFileSync(new URL(`assets/${cssFile}`, dist), "utf8");
assert.equal(builtCss.includes("italic"), false);
assert.match(builtCss, /JetBrains Mono/);
assert.match(builtCss, /Montserrat/);

console.log("ok");
