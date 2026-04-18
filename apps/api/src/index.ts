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

export default app
