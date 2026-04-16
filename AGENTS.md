# Agents Guide

This file is the source of truth for AI agents (Claude Code, Cursor, etc.) working on this codebase. `CLAUDE.md` is a symlink to this file — do not edit `CLAUDE.md` directly.

## Project context

Caramelo is a personal finance web app for Brazilian users. See [`README.md`](./README.md) for the quick pitch.

## Core documentation

Three documents define this project:

- [`SPEC.md`](./SPEC.md) — **product specification.** What the system does: entities, features, business rules, default categories, scope, out-of-scope items.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — **technical architecture.** How the system is built: monorepo layout, tech stack, integration patterns, deployment, conventions.
- [`README.md`](./README.md) — **project overview.** Short pitch and pointers into the other docs.

Read the relevant document(s) before making non-trivial changes.

## Keep the docs in sync with the code

When a change affects product behavior, architecture, or the project overview, **update the corresponding document in the same PR as the code change.** Documentation drift defeats the purpose of these files — an outdated SPEC is worse than no SPEC.

### Update `SPEC.md` when

- Adding, changing, or removing a feature.
- Changing a business rule (e.g., how fatura reconciliation works, how savings are calculated, how transfers are counted).
- Changing the data model at a conceptual level (new entity, new user-visible field).
- Changing the default category set.
- Moving something in or out of scope.
- Renaming a user-facing domain term (Receita, Despesa, Fatura, etc.).

### Update `ARCHITECTURE.md` when

- Adding, removing, or swapping a library or external service (LLM provider, job queue, object storage, ORM, auth library, etc.).
- Changing the monorepo layout or package boundaries.
- Changing how the apps are deployed or how environment variables are configured.
- Changing an integration pattern (auth flow, tRPC context shape, CORS strategy, job-queue signing, etc.).
- Resolving an item listed in `§18 Open / Deferred Decisions`.
- Changing a convention (code style, commit format, testing approach, validation placement).

### Update `README.md` when

- The project's one-line pitch changes.
- A new top-level document is added or an existing one is renamed/removed.
- Quick-start instructions meaningfully change.

If a change touches more than one of these documents, update all of them in the same commit.

## When in doubt

If you are unsure whether a change warrants a doc update, err on the side of updating. A small doc edit costs nothing; a doc that no longer matches the code wastes every future reader's time.
