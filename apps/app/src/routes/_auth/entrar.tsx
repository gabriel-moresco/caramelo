import { createFileRoute } from '@tanstack/react-router'

import { SignIn } from '@/components/auth/sign-in'

type SignInSearch = {
  redirect?: string
}

export const Route = createFileRoute('/_auth/entrar')({
  validateSearch: (search: Record<string, unknown>): SignInSearch => ({
    redirect:
      typeof search.redirect === 'string' &&
      search.redirect.startsWith('/') &&
      !search.redirect.startsWith('//')
        ? search.redirect
        : undefined,
  }),
  component: SignInPage,
})

function SignInPage() {
  const { redirect } = Route.useSearch()

  return <SignIn redirectTo={redirect} />
}
