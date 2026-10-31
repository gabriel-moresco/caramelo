# Instructions

Caramelo is a personal finance app for Brazilian users to track income and expenses across bank accounts and credit cards and hit monthly savings goals.

## Caramelo's Core documentation

- Check [`SPEC.md`](./SPEC.md) to understand what Caramelo does.
- Check [`ROADMAP.md`](./ROADMAP.md) to understand in what order features are being delivered.

**IMPORTANT:** When a change affects any of these documents, update them in the same PR as the code that changes it. If you notice that `SPEC.md` or `ROADMAP.md` no longer matches the codebase, update the doc proactively — do not wait to be asked. For `ROADMAP.md` specifically, tick the step's checkbox in the PR that ships it.

## General rules

- All user-facing text must be written in Brazilian Portuguese (pt-BR). Code-level strings remain in English.
- All UIs must be responsive and work correctly on both mobile and desktop screen sizes.
- Do not implement dark mode styles or classes (e.g., `dark:`) in UI components, as the application is forced to light mode only.
- When formatting dates and times, always use `dayjs`.
- Do not edit files inside `apps/apps/**/components/ui/` directly. These are the shadcn/ui shared base components for the app; when a component needs visual adjustments, change the `className` where the component is used instead of modifying the base component file.
- Route paths must be in Portuguese (e.g., `/criar-conta`, `/entrar`, `/contas/1`, `/cartoes-de-credito`). This applies to all user-facing routes since the app targets Brazilian users.
