import { createFileRoute } from '@tanstack/react-router'

import { SignUp } from '@/components/auth/sign-up'

export const Route = createFileRoute('/_auth/criar-conta')({ component: SignUp })
