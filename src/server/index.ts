import express from "express";
import compression from "compression";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import apiRouter from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3900", 10);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();

// Middleware
app.use(compression());
app.use(express.json());

// API routes
app.use("/api", apiRouter);

// Serve static web GUI (Vite build output)
// In dev: Vite dev server handles this. In prod: serve from dist/web/
const webDistDir = path.resolve(__dirname, "../web");

if (fs.existsSync(webDistDir)) {
  app.use(express.static(webDistDir));
  // SPA fallback — all non-API routes serve index.html
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(webDistDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      message: "Web GUI not built yet. Run: pnpm build:web",
      api: "/api/health",
    });
  });
}

app.listen(PORT, HOST, () => {
  console.log(`🚀 fullstack-selfhosted running on http://${HOST}:${PORT}`);
  console.log(`   API:  http://${HOST}:${PORT}/api/health`);
  console.log(`   GUI:  http://${HOST}:${PORT}/`);
});
