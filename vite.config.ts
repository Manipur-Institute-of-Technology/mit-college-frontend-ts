import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Handles Chrome DevTools' automatic request for:
 *
 * /.well-known/appspecific/com.chrome.devtools.json
 *
 * Chrome may request this file during development.
 * Without handling it, React Router tries to treat it
 * as an application route and logs:
 *
 * No routes matched location
 * "/.well-known/appspecific/com.chrome.devtools.json"
 */
function chromeDevToolsWellKnown(): Plugin {
  return {
    name: "chrome-devtools-well-known",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          req.url ===
          "/.well-known/appspecific/com.chrome.devtools.json"
        ) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end("{}");
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    chromeDevToolsWellKnown(),

    tailwindcss(),

    reactRouter(),

    tsconfigPaths(),
  ],
});