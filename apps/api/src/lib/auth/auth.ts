import { i18n } from '@better-auth/i18n'
import { accountsTable, db, sessionsTable, usersTable, verificationsTable } from '@caramelo/db'
import {
  sendNewUserNotificationEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from '@caramelo/email'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, openAPI } from 'better-auth/plugins'

import { translatedErrorMessages } from './error-translations'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: {
      users: usersTable,
      sessions: sessionsTable,
      accounts: accountsTable,
      verifications: verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: ({ user, url }) =>
      sendResetPasswordEmail({
        userEmail: user.email,
        userName: user.name,
        resetPasswordUrl: url,
      }),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: ({ user, url }) =>
      sendVerificationEmail({
        userEmail: user.email,
        userName: user.name,
        verificationUrl: url,
      }),
  },
  baseURL: process.env.VERCEL === '1' ? 'https://api.caramelo.moresco.cc' : 'http://localhost:3001',
  basePath: '/auth',
  trustedOrigins:
    process.env.VERCEL === '1' ? ['https://caramelo.moresco.cc'] : ['http://localhost:3000'],
  appName: 'Caramelo',
  plugins: [
    admin(),
    openAPI(),
    i18n({
      translations: {
        'pt-BR': translatedErrorMessages,
      },
      defaultLocale: 'pt-BR',
      detection: ['callback'],
      getLocale: () => 'pt-BR',
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async user => {
          try {
            await sendNewUserNotificationEmail({
              userEmail: user.email,
              userName: user.name,
            })
          } catch {}
        },
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
    ...(process.env.VERCEL === '1' && {
      crossSubDomainCookies: {
        enabled: true,
        domain: '.caramelo.moresco.cc',
      },
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
        partitioned: true,
      },
    }),
  },
})
