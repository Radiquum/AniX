import app from "./src/index.ts";

Deno.serve(app.fetch);