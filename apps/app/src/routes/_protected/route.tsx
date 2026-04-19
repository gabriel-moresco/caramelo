import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/client'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession()

    if (session) {
      return
    }

    throw redirect({
      to: '/entrar',
      search: { redirect: location.href },
    })
  },
  component: Outlet,
})
