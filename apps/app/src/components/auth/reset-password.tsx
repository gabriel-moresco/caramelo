import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
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

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine(values => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

type ResetPasswordProps = {
  token?: string
  error?: string
}

export const ResetPassword = ({ token, error }: ResetPasswordProps) => {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null | undefined>(null)

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) return
    setFormError(null)

    const { error: resetError } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    })

    if (resetError) {
      setFormError(resetError.message)
      return
    }

    await navigate({ to: '/entrar' })
  }

  if (error || !token) {
    return (
      <main className='bg-muted/30 flex min-h-svh items-center justify-center p-6'>
        <Card className='w-full max-w-sm'>
          <CardHeader className='items-center text-center'>
            <img src='/assets/logo.png' alt='Caramelo' className='mx-auto mb-3 h-7 w-auto' />
            <CardTitle>Link inválido ou expirado</CardTitle>
            <CardDescription>
              Este link de redefinição não é mais válido. Solicite um novo para continuar.
            </CardDescription>
          </CardHeader>
          <CardFooter className='justify-center text-xs'>
            <Link to='/esqueci-senha' className='font-medium underline-offset-4 hover:underline'>
              Solicitar novo link
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
          <CardTitle>Redefinir senha</CardTitle>
          <CardDescription>Escolha uma nova senha para acessar sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='reset-password-password'>Nova senha</FieldLabel>
                    <Input
                      {...field}
                      id='reset-password-password'
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
                    <FieldLabel htmlFor='reset-password-confirm-password'>
                      Confirmar nova senha
                    </FieldLabel>
                    <Input
                      {...field}
                      id='reset-password-confirm-password'
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
                {form.formState.isSubmitting ? 'Salvando…' : 'Redefinir senha'}
              </Button>
            </FieldGroup>
          </form>
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
