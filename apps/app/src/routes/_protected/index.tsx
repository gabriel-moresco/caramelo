import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({ component: Home })

function Home() {
  return (
    <main className='flex min-h-svh items-center justify-center p-6'>
      <p className='text-center text-lg font-medium'>Rota protegida: /</p>
    </main>
  )
}
