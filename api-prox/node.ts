import { serve } from '@hono/node-server'
import app from "./src/index.ts"

serve({
  fetch: app.fetch,
  port: 7001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
