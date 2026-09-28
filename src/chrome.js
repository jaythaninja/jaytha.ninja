// Shared page chrome. Injected into each HTML file by the Vite plugin
// so the nav, backdrop, and footer stay in one place.

const GITHUB_URL = "https://github.com/jaythaninja";

export function renderNav(base, current) {
  const logoHref = current === "home" ? "#top" : base;
  const items = [
    ["waitlist", `${base}waitlist/`, "waitlist"],
    ["camera-roll", `${base}camera-roll/`, "camera roll"],
    ["now", `${base}now/`, "now"],
    ["github", GITHUB_URL, "github"],
  ];
  const lis = items
    .map(([key, href, label]) => {
      const currentAttr = key === current ? ' aria-current="page"' : "";
      return `<li><a href="${href}"${currentAttr}>${label}</a></li>`;
    })
    .join("");
  return `<a class="logo" href="${logoHref}">jaytha<b>.</b>ninja</a>
  <nav aria-label="pages"><ul data-part>${lis}</ul></nav>`;
}

export const BACKDROP = `<div class="glows" aria-hidden="true">
  <div class="glow" style="right:-260px;top:calc(50vh - 460px);width:1100px;height:900px;background:radial-gradient(closest-side,rgba(255,77,26,.16),rgba(255,77,26,.05) 55%,rgba(255,77,26,0))"></div>
  <div class="glow" style="left:-340px;top:calc(100vh - 380px);width:1000px;height:700px;background:radial-gradient(closest-side,rgba(26,173,179,.12),rgba(26,173,179,0))"></div>
  <div class="glow" style="right:10%;top:calc(100vh + 300px);width:900px;height:700px;background:radial-gradient(closest-side,rgba(255,77,26,.08),rgba(255,77,26,0))"></div>
</div>
<div class="scan" aria-hidden="true"></div>`;

export function renderFooter() {
  return `<footer>
  <div class="links">
    <span class="hi">{{copy.contactLeadIn}} →</span>
    <a class="mail" href="mailto:jay@jaytha.ninja">jay@jaytha.ninja</a>
    <a href="https://x.com/jaythaninja">𝕏 @jaythaninja</a>
    <a href="https://www.instagram.com/jaythaninja">instagram</a>
    <a href="https://www.threads.com/jaythaninja">threads</a>
    <a href="https://www.linkedin.com/in/jaythaninja">linkedin</a>
  </div>
  <span class="c">{{copy.footerLine}}</span>
</footer>`;
}
