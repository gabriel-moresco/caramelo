import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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

const forgotPasswordSchema = z.object({
  email: z.email('Informe um e-mail válido'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPassword = () => {
  const [formError, setFormError] = useState<string | null | undefined>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(seconds => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const requestReset = async (email: string) => {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    if (error) {
      setFormError(error.message)
      return false
    }

    setFormError(null)
    setResendCooldown(60)
    return true
  }

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null)
    const ok = await requestReset(values.email)
    if (ok) setSubmittedEmail(values.email)
  }

  const handleResend = async () => {
    if (!submittedEmail || resendCooldown > 0) return
    await requestReset(submittedEmail)
  }

  if (submittedEmail) {
    return (
      <main className='bg-muted/30 flex min-h-svh items-center justify-center p-6'>
        <Card className='w-full max-w-sm'>
          <CardHeader className='items-center text-center'>
            <img src='/assets/logo.png' alt='Caramelo' className='mx-auto mb-3 h-7 w-auto' />
            <CardTitle>Verifique seu e-mail</CardTitle>
            <CardDescription>
              Se houver uma conta vinculada a <strong>{submittedEmail}</strong>, enviamos um link
              para redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3'>
            <Button onClick={handleResend} disabled={resendCooldown > 0} variant='outline'>
              {resendCooldown > 0
                ? `Reenviar em ${resendCooldown}s`
                : 'Reenviar link de redefinição'}
            </Button>
            {formError && (
              <p role='alert' className='text-destructive text-center text-xs'>
                {formError}
              </p>
            )}
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
          <CardTitle>Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='forgot-password-email'>E-mail</FieldLabel>
                    <Input
                      {...field}
                      id='forgot-password-email'
                      type='email'
                      autoComplete='email'
                      placeholder='sjobs@apple.com'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {formError && <FieldError>{formError}</FieldError>}

              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Enviando…' : 'Enviar link de redefinição'}
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
