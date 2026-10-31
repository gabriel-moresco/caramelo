import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
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

const signInSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})

type SignInValues = z.infer<typeof signInSchema>

type SignInProps = {
  redirectTo?: string
}

export const SignIn = ({ redirectTo }: SignInProps) => {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null | undefined>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resentAt, setResentAt] = useState<number | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(seconds => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: SignInValues) => {
    setFormError(null)
    setUnverifiedEmail(null)
    setResentAt(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: `${window.location.origin}${redirectTo ?? '/'}`,
    })

    if (error) {
      if (error.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(values.email)
        setResendCooldown(60)
        return
      }
      setFormError(error.message)
      return
    }

    await navigate({ href: redirectTo ?? '/' })
  }

  const handleResend = async () => {
    if (!unverifiedEmail || resendCooldown > 0) return
    setIsResending(true)
    const { error } = await authClient.sendVerificationEmail({
      email: unverifiedEmail,
      callbackURL: `${window.location.origin}/`,
    })
    setIsResending(false)
    if (error) {
      setFormError(error.message)
      return
    }
    setResentAt(Date.now())
    setResendCooldown(60)
  }

  if (unverifiedEmail) {
    return (
      <main className='bg-muted/30 flex min-h-svh items-center justify-center p-6'>
        <Card className='w-full max-w-sm'>
          <CardHeader className='items-center text-center'>
            <img src='/assets/logo.png' alt='Caramelo' className='mx-auto mb-3 h-7 w-auto' />
            <CardTitle>Verifique seu e-mail</CardTitle>
            <CardDescription>
              Enviamos um link de verificação para <strong>{unverifiedEmail}</strong>. Confirme sua
              conta para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3'>
            <Button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              variant='outline'
            >
              {isResending
                ? 'Reenviando…'
                : resendCooldown > 0
                  ? `Reenviar em ${resendCooldown}s`
                  : 'Reenviar e-mail de verificação'}
            </Button>
            {resentAt && (
              <p className='text-muted-foreground text-center text-xs'>
                Novo e-mail enviado. Verifique sua caixa de entrada.
              </p>
            )}
            {formError && (
              <p role='alert' className='text-destructive text-center text-xs'>
                {formError}
              </p>
            )}
          </CardContent>
          <CardFooter className='justify-center text-xs'>
            <button
              type='button'
              onClick={() => {
                setUnverifiedEmail(null)
                setResentAt(null)
                setFormError(null)
              }}
              className='font-medium underline-offset-4 hover:underline'
            >
              Voltar
            </button>
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
          <CardTitle>Entrar no Caramelo</CardTitle>
          <CardDescription>Acompanhe suas finanças pessoais.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='sign-in-email'>E-mail</FieldLabel>
                    <Input
                      {...field}
                      id='sign-in-email'
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
                    <div className='flex items-center justify-between'>
                      <FieldLabel htmlFor='sign-in-password'>Senha</FieldLabel>
                      <Link
                        to='/esqueci-senha'
                        className='text-muted-foreground text-xs underline-offset-4 hover:underline'
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      id='sign-in-password'
                      type='password'
                      autoComplete='current-password'
                      placeholder='••••••••'
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {formError && <FieldError>{formError}</FieldError>}

              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
              </Button>
            </FieldGroup>
          </form>
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
