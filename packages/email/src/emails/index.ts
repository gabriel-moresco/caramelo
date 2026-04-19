import dedent from 'dedent'

import { client } from '../client'

type SendResetPasswordEmailProps = {
  userEmail: string
  userName: string
  resetPasswordUrl: string
}

export const sendResetPasswordEmail = async ({
  userEmail,
  userName,
  resetPasswordUrl,
}: SendResetPasswordEmailProps) => {
  await client.send({
    to: userEmail,
    subject: 'Redefina sua senha | Caramelo',
    text: dedent`
    Olá ${userName.split(' ')[0]},

    Recebemos uma solicitação para redefinir a senha da sua conta. Para criar uma nova senha, acesse o link abaixo:

    ${resetPasswordUrl}

    Se precisar de ajuda, responda a este e-mail para falar com nosso suporte.

    Atenciosamente,
    Gabriel Moresco`,
  })
}

type SendVerificationEmailProps = {
  userEmail: string
  userName: string
  verificationUrl: string
}

export const sendVerificationEmail = async ({
  userEmail,
  userName,
  verificationUrl,
}: SendVerificationEmailProps) => {
  await client.send({
    to: userEmail,
    subject: 'Confirme seu e-mail | Caramelo',
    text: dedent`
    Olá ${userName.split(' ')[0]},

    Para concluir seu cadastro no Caramelo, confirme seu e-mail acessando o link abaixo:

    ${verificationUrl}

    Se você não criou esta conta, pode ignorar este e-mail.

    Atenciosamente,
    Gabriel Moresco`,
  })
}

type SendNewUserNotificationEmailProps = {
  userEmail: string
  userName: string
}

export const sendNewUserNotificationEmail = async ({
  userEmail,
  userName,
}: SendNewUserNotificationEmailProps) => {
  await client.send({
    to: 'gabriel@moresco.cc',
    subject: 'Novo usuário criado | Caramelo',
    text: dedent`
      Um usuário criou uma conta no Caramelo.

      E-mail: ${userEmail}
      Nome: ${userName}
      Data e hora: ${new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })} às ${new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}
      `,
  })
}
