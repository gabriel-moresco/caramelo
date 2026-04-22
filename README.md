<div>
  <h1 align="center"><b>🐕 Caramelo</b></h1>
  <p align="center">
    Open Source personal finance app for Brazilian users.
    <br />
    <br />
    <a href="https://caramelo.moresco.cc">Website</a>
    ·
    <a href="./SPEC.md">SPEC.md</a>
  </p>
</div>

## About Caramelo

Caramelo is an Open Source personal finance app for Brazilian users. Track income and expenses across bank accounts and credit cards, understand where your money goes each month, and hit your monthly savings goals.

Contributions, issues, and feedback are welcome.

- **Supported Language:** Brazilian Portuguese (pt-BR)
- **Supported Currency:** Brazilian Real (BRL)

The [`SPEC.md`](./SPEC.md) file contains the product specification.

## Features

- **Accounts & Cards**: Register Brazilian bank accounts (Conta Corrente, Poupança, Salário) and credit cards, with custom closing and due dates per card.
- **Categories**: Classify income and expenses with a two-level taxonomy. A default set of Brazilian categories is seeded for every new user.
- **Manual Entry**: Record Receitas, Despesas, and Transferências between your own accounts and cards.
- **Statement Import (OFX)**: Import bank and credit card statements via OFX files, with duplicate detection.
- **Automatic Categorization (LLM)**: Uncategorized transactions are classified automatically using a language model, with user review and override.
- **Bill Reconciliation**: Match bank transactions to credit card bill payments and link them to the corresponding card.
- **Savings Goals**: Set monthly savings goals as a fixed amount or a percentage of income, and track progress over time.
- **Dashboard & Insights**: Monthly overview of income, expenses, savings, and spending breakdown by category.

## Architecture

- Monorepo (pnpm workspaces)
- TypeScript
- React 19
- TanStack Router / TanStack Query
- Vite
- TailwindCSS
- shadcn/ui
- Hono
- tRPC
- Better Auth
- Drizzle ORM
- PostgreSQL
- Resend
- Vercel AI SDK

### Structure

- `apps/app` — Web application (React + Vite + TanStack Router)
- `apps/api` — HTTP API (Hono + tRPC)
- `packages/db` — Database schema and client (Drizzle + Postgres)
- `packages/email` — Transactional email client (Resend)
- `packages/shared` — Shared types and utilities
- `packages/eslint-config` — Shared ESLint and Prettier configuration
- `packages/typescript-config` — Shared TypeScript configuration

## License

Caramelo is licensed under the [GNU Affero General Public License v3.0](./LICENSE).
