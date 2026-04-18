import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', c => {
  return c.json({
    message: 'Hello World!',
  })
})

app.get('/health', c => {
  return c.json({
    status: '🐕 Caramelo API is running!',
  })
})

app.get('/status', c => {
  return c.json({
    status: '🐕 Caramelo API is running!',
  })
})

if (process.env.NODE_ENV !== 'production') {
  serve({ fetch: app.fetch, port: 3001 }, info => {
    console.log(`🐕 Caramelo API is running on http://localhost:${info.port}`)
  })
}

export default app
