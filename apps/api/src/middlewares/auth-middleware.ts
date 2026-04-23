import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import { auth } from '../lib/auth/auth'

export type AuthContext = {
  user: {
    id: string
    email: string
  }
}

export const authMiddleware = createMiddleware<{ Variables: AuthContext }>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    throw new HTTPException(401, {
      message: 'Você precisa fazer login para continuar',
    })
  }

  c.set('user', {
    id: session.user.id,
    email: session.user.email,
  })

  await next()
})
