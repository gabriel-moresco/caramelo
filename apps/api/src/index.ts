import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { authMiddleware, type AuthVariables } from './middlewares/auth-middleware'
import { authRouter } from './routes/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.use(
  '*',
  cors({
    origin: process.env.VERCEL === '1' ? 'https://caramelo.moresco.cc' : 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
)

app.use('*', authMiddleware)

app.route('/auth', authRouter)

app.get('/health', c =>
  c.json({
    status: '🐕 Caramelo API is running!',
  }),
)

if (process.env.NODE_ENV !== 'production') {
  serve({ fetch: app.fetch, port: 3001 }, info => {
    console.log(`🐕 Caramelo API is running on http://localhost:${info.port}`)
  })
}

export default app
