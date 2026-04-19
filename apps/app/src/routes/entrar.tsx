import { createFileRoute } from '@tanstack/react-router'

import { SignIn } from '@/components/auth/sign-in'

export const Route = createFileRoute('/entrar')({ component: SignIn })
