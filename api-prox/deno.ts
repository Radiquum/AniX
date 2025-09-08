import app from "./src/index.js";

Deno.serve({ port: 7001 }, app.fetch);
