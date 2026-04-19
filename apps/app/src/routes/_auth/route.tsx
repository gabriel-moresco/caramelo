import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/client'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()

    if (!session) {
      return
    }

    throw redirect({ to: '/' })
  },
  component: Outlet,
})
