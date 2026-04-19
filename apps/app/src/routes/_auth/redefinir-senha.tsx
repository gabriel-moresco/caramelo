import { createFileRoute } from '@tanstack/react-router'

import { ResetPassword } from '@/components/auth/reset-password'

type ResetPasswordSearch = {
  token?: string
  error?: string
}

export const Route = createFileRoute('/_auth/redefinir-senha')({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token, error } = Route.useSearch()
  return <ResetPassword token={token} error={error} />
}
