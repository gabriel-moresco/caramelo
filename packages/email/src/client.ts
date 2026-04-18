import { CreateEmailResponse, Resend } from 'resend'

import { RequireAtLeastOne } from './utils'

type SendProps = {
  to: string
  subject: string
} & RequireAtLeastOne<{ text: string; html: string; react: React.ReactNode }>

const send = async ({
  to,
  subject,
  text,
  html,
  react,
}: SendProps): Promise<CreateEmailResponse> => {
  const resend = new Resend(process.env.RESEND_API_KEY)

  return await resend.emails.send({
    from: 'Gabriel Moresco <gabriel@mail.moresco.cc>',
    replyTo: 'gabriel@moresco.cc',
    to,
    subject,
    text,
    html,
    react,
  })
}

export const client = {
  send,
}
