import { authClient } from '@caramelo/auth/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const signInSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})

type SignInValues = z.infer<typeof signInSchema>

export const SignIn = () => {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null | undefined>(null)

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: SignInValues) => {
    setFormError(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setFormError(error.message)
      return
    }

    await navigate({ to: '/' })
  }

  return (
    <main className='bg-muted/30 flex min-h-svh items-center justify-center p-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='items-center text-center'>
          <img src='/assets/logo.png' alt='Caramelo' className='mx-auto mb-3 h-7 w-auto' />
          <CardTitle>Entrar no Caramelo</CardTitle>
          <CardDescription>Acompanhe suas finanças pessoais.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        autoComplete='email'
                        placeholder='sjobs@apple.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        autoComplete='current-password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formError && (
                <p role='alert' className='text-destructive text-xs'>
                  {formError}
                </p>
              )}

              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='justify-center text-xs'>
          <span className='text-muted-foreground'>Ainda não tem conta?&nbsp;</span>
          <Link to='/criar-conta' className='font-medium underline-offset-4 hover:underline'>
            Criar conta
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
