import type { Context as HonoContext } from 'hono'

import type { ApiContext } from '../types'

export const createTRPCContext = (_opts: unknown, c: HonoContext<ApiContext>) => {
  return {
    user: c.get('user'),
  }
}

export type TRPCContext = ReturnType<typeof createTRPCContext>
