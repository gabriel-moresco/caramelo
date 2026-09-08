import type { AuthContext } from './middlewares/auth-middleware.js'

export type ApiContext = {
  Variables: AuthContext
}
