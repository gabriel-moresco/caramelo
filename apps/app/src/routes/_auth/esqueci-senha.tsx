import { createFileRoute } from '@tanstack/react-router'

import { ForgotPassword } from '@/components/auth/forgot-password'

export const Route = createFileRoute('/_auth/esqueci-senha')({ component: ForgotPassword })
