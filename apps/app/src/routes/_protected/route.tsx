import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession()

    if (session) {
      return
    }

    throw redirect({
      to: '/entrar',
      search: location.href === '/' ? {} : { redirect: location.href },
    })
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut()
    await navigate({ to: '/entrar', search: {} })
  }

  return (
    <>
      <div className='fixed top-4 left-4 z-50'>
        <Button variant='outline' size='sm' onClick={handleSignOut}>
          Sair
        </Button>
      </div>
      <Outlet />
    </>
  )
}
