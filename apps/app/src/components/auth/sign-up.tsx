import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/client'

const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe seu nome'),
    email: z.email('Informe um e-mail válido'),
    password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine(values => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  })

type SignUpValues = z.infer<typeof signUpSchema>

export const SignUp = () => {
  const [formError, setFormError] = useState<string | null | undefined>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: SignUpValues) => {
    setFormError(null)

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: `${window.location.origin}/`,
    })

    if (error) {
      setFormError(error.message)
      return
    }

    setSubmittedEmail(values.email)
  }

  if (submittedEmail) {
    return (
      <main className='bg-muted/30 flex min-h-svh items-center justify-center p-6'>
        <Card className='w-full max-w-sm'>
          <CardHeader className='items-center text-center'>
            <img src='/assets/logo.png' alt='Caramelo' className='mx-auto mb-3 h-7 w-auto' />
            <CardTitle>Verifique seu e-mail</CardTitle>
            <CardDescription>
              Enviamos um link de verificação para <strong>{submittedEmail}</strong>. Clique no link
              para ativar sua conta e entrar automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-muted-foreground text-center text-xs'>
            Não recebeu o e-mail? Verifique sua caixa de spam ou tente entrar novamente para
            reenviar.
          </CardContent>
          <CardFooter className='justify-center text-xs'>
            <Link to='/entrar' className='font-medium underline-offset-4 hover:underline'>
              Voltar para entrar
            </Link>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className='bg-muted/30 flex min-h-svh items-center justify-center p-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader className='items-center text-center'>
          <img src='/assets/logo.png' alt='Caramelo' className='mx-auto mb-3 h-7 w-auto' />
          <CardTitle>Criar conta no Caramelo</CardTitle>
          <CardDescription>Comece a organizar suas finanças em minutos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name='name'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='sign-up-name'>Nome</FieldLabel>
                    <Input
                      {...field}
                      id='sign-up-name'
                      type='text'
                      autoComplete='name'
                      placeholder='Steve Jobs'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='sign-up-email'>E-mail</FieldLabel>
                    <Input
                      {...field}
                      id='sign-up-email'
                      type='email'
                      autoComplete='email'
                      placeholder='sjobs@apple.com'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='sign-up-password'>Senha</FieldLabel>
                    <Input
                      {...field}
                      id='sign-up-password'
                      type='password'
                      autoComplete='new-password'
                      placeholder='••••••••'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name='confirmPassword'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='sign-up-confirm-password'>Confirmar senha</FieldLabel>
                    <Input
                      {...field}
                      id='sign-up-confirm-password'
                      type='password'
                      autoComplete='new-password'
                      placeholder='••••••••'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {formError && <FieldError>{formError}</FieldError>}

              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Criando conta…' : 'Criar conta'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className='justify-center text-xs'>
          <span className='text-muted-foreground'>Já tem conta?&nbsp;</span>
          <Link to='/entrar' className='font-medium underline-offset-4 hover:underline'>
            Entrar
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
