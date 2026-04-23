import type { AppRouter } from '@caramelo/api'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { queryClient } from './react-query'

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_API_URL}/trpc`,
        fetch: (url, options) => fetch(url, { ...options, credentials: 'include' }),
      }),
    ],
  }),
  queryClient,
})
