import app from "./src/index.ts";

Deno.serve({ port: 7001 }, app.fetch);
