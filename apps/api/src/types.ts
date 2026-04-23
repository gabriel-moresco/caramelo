import type { AuthContext } from './middlewares/auth-middleware'

export type ApiContext = {
  Variables: AuthContext
}
