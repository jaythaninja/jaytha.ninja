import { defineConfig } from "vite";
import { resolve } from "node:path";
import { copy } from "./src/copy.js";
import { BACKDROP, renderFooter, renderNav } from "./src/chrome.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Fills {{nav:page}}, {{backdrop}}, {{footer}}, and {{copy.key}} in HTML.
// One copy file, one nav, and asset URLs that include the Pages subpath.
function pageTemplate() {
  let base = "/jaytha.ninja/";
  return {
    name: "page-template",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml(html) {
      let out = html.replace(/\{\{nav:([a-z0-9-]+)\}\}/g, (_, page) => renderNav(base, page));
      out = out.replaceAll("{{backdrop}}", BACKDROP);
      out = out.replaceAll("{{footer}}", renderFooter());
      out = out.replace(/\{\{copy\.([A-Za-z0-9_]+)\}\}/g, (match, key) => {
        if (!Object.prototype.hasOwnProperty.call(copy, key)) {
          throw new Error(`Unknown copy key "${key}"`);
        }
        return escapeHtml(copy[key]);
      });
      if (out.includes("{{")) {
        throw new Error("Unresolved template token in HTML");
      }
      return out;
    },
  };
}

export default defineConfig({
  // Project-site subpath: https://jaythaninja.github.io/jaytha.ninja/
  base: "/jaytha.ninja/",
  plugins: [pageTemplate()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        waitlist: resolve(import.meta.dirname, "waitlist/index.html"),
        cameraRoll: resolve(import.meta.dirname, "camera-roll/index.html"),
        now: resolve(import.meta.dirname, "now/index.html"),
      },
    },
  },
});
