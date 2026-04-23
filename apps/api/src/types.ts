import type { AuthVariables } from './middlewares/auth-middleware'

export type ApiContext = {
  Variables: AuthVariables
}
