import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './lib/auth/auth'
import { authMiddleware } from './middlewares/auth-middleware'
import { createTRPCContext } from './trpc/context'
import { trpcRouter } from './trpc/routers/_app'
import type { ApiContext } from './types'

const api = new Hono<ApiContext>()

api.use(
  '*',
  cors({
    origin: process.env.VERCEL === '1' ? 'https://caramelo.moresco.cc' : 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
)

api.on(['GET', 'POST'], '/auth/*', c => auth.handler(c.req.raw))

api.get('/health', c =>
  c.json({
    status: '🐕 Caramelo API is running!',
  }),
)

api.use('/trpc/*', authMiddleware)

api.use(
  '/trpc/*',
  trpcServer({
    endpoint: '/trpc',
    router: trpcRouter,
    createContext: createTRPCContext,
  }),
)

if (process.env.NODE_ENV !== 'production') {
  serve({ fetch: api.fetch, port: 3001 }, info => {
    console.log(`🐕 Caramelo API is running on http://localhost:${info.port}`)
  })
}

export default api
