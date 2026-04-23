import type { Context as HonoContext } from 'hono'

import type { ApiContext } from '../types'

export const createTRPCContext = (_opts: unknown, c: HonoContext<ApiContext>) => {
  return {
    user: c.get('user'),
    session: c.get('session'),
  }
}

export type TRPCContext = ReturnType<typeof createTRPCContext>
