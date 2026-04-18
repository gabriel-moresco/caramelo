# AGENTS.md

Caramelo is a personal finance app for Brazilian users to track income and expenses across bank accounts and credit cards and hit monthly savings goals.

## Caramelo's Core documentation

- Check [`SPEC.md`](./SPEC.md) to understand what Caramelo does.
- Check [`ARCHITECTURE.md`](./ARCHITECTURE.md) to understand how Caramelo is built.

**IMPORTANT:** When a change affects any of these documents, update them in the same PR as the code that changes it. If you notice that `SPEC.md` or `ARCHITECTURE.md` no longer matches the codebase, update the doc proactively — do not wait to be asked.

## General rules

Rules that always apply across the entire project:

- All user-facing text must be written in Brazilian Portuguese (pt-BR). Code-level strings remain in English.
- Prefer using arrow functions (`const myFunction = ({ arg1, arg2 }: MyType) => { ... }`)
- Prefer using `type` instead of `interface` when applicable.
- For monorepo packages in `package.json`, use `workspace:*` (not `workspace:^`). Example: `"@caramelo/auth": "workspace:*"`.
- Never run dev commands or start dev servers (e.g., `pnpm dev`). The app and api dev servers are always running — just use them: app at `http://localhost:3000`, api at `http://localhost:3001`.

## UI rules

Specific rules for React components development (applies to `apps/app/**/*.tsx`):

- Do not implement dark mode styles or classes (e.g., `dark:`) in UI components, as the application is forced to light mode only.
- When defining the size of an element with Tailwind classes, use `size-{n}` instead of `w-{n} h-{n}` (e.g., `size-4` instead of `w-4 h-4`).
- When formatting dates and times, always use `dayjs`.
- Do not edit files inside `apps/apps/**/components/ui/` directly. These are the shadcn/ui shared base components for the app; when a component needs visual adjustments, change the `className` where the component is used instead of modifying the base component file.
- Route paths must be in Portuguese (e.g., `/criar-conta`, `/entrar`, `/contas/1`, `/cartoes-de-credito`). This applies to all user-facing routes since the app targets Brazilian users.

## Database rules

Specific rules for database development (applies to `packages/db/**`):

- When making changes to Drizzle schema files, do not create migration files. Migrations will be generated manually later.
