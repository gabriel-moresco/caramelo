import { createFileRoute } from '@tanstack/react-router'

import { SignUp } from '@/components/auth/sign-up'

export const Route = createFileRoute('/criar-conta')({ component: SignUp })
