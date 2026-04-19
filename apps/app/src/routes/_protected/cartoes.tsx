import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/cartoes')({
  component: Cards,
})

function Cards() {
  return (
    <main className='flex min-h-svh items-center justify-center p-6'>
      <p className='text-center text-lg font-medium'>Rota protegida: /cartoes</p>
    </main>
  )
}
