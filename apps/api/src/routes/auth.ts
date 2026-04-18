import { auth } from '@caramelo/auth/server'
import { Hono } from 'hono'

export const authRouter = new Hono().on(['GET', 'POST'], '/*', c => auth.handler(c.req.raw))
