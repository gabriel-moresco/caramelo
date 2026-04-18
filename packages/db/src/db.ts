import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as authSchema from './schemas/auth-schema'

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
})

export const db = drizzle({
  schema: {
    ...authSchema,
  },
  client,
  casing: 'snake_case',
})
