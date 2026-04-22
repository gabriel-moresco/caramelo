# Caramelo — Roadmap

This document captures **in what order** features land. `SPEC.md` covers what the product does; `ARCHITECTURE.md` covers how it's built; this is the delivery sequence.

## Approach

- **Vertical slices.** Each step ships end-to-end (schema → tRPC → UI), not backend-then-frontend. Keeps the API shape honest and the app demo-able throughout.
- **Incremental dashboard.** Dashboard breakdowns, filters, and polish are not a discrete step. They're layered on continuously once step 5 lands.
- **Deferrals are explicit.** If a sub-feature is intentionally postponed (e.g., LLM batching until OFX), the step that owns it calls it out.

## Steps

- [x] **Autenticação** (SPEC §5.10)

  Sign-up, email verification, sign-in, password reset, sign-out. Shipped.

- [ ] **0. Prep — tRPC bootstrap**

  Wire tRPC into the Hono app (`apps/api`) with a `protectedProcedure`, and add the tRPC-React-Query client in `apps/app`. Every step below assumes this is in place.

- [ ] **1. Contas & Cartões** (SPEC §5.1)

  CRUD for bank accounts and credit cards. No dependencies. Good shake-out for the tRPC + form + UI stack.

- [ ] **2. Categorias** (SPEC §5.2)

  Category and subcategory CRUD, scoped by transaction type (Receita / Despesa). Seed the default tree (SPEC §8) on signup, and backfill the existing dev user.

- [ ] **3. Lançamento manual + fatura-month** (SPEC §5.3 + §5.7)

  Manual transaction create, edit, delete. For credit-card transactions, compute `fatura_month` from purchase date + card closing day. Depends on steps 1 and 2.

- [ ] **4. Categorização por LLM — sync** (SPEC §5.5)

  Hook the Vercel AI SDK categorizer into the manual-create mutation. Synchronous (user waits ~1–2s). The batch / background path is deferred to step 6.

- [ ] **5. Dashboard básico** (SPEC §5.9, subset)

  Monthly navigation, headline summary (income / expenses / savings), filterable transaction list. Category/subcategory breakdowns and further insights land incrementally after this — not tracked as separate steps.

- [ ] **6. Importação de OFX** (SPEC §5.4)

  R2 upload, QStash job, parsing, destructive-for-OFX re-import, LLM categorization in background with a concurrency limit. Requires R2 + QStash + OpenAI provisioning. Largest infra lift.

- [ ] **7. Reconciliação de fatura** (SPEC §5.6)

  Detection heuristics on bank transactions, suggested card, user confirmation, manual-flag fallback. Meaningful once OFX is producing real bank transactions.

- [ ] **8. Metas de economia** (SPEC §5.8)

  Monthly savings goal (fixed amount or % of income). Historical goal records per month. Standalone — only reads the monthly aggregates the dashboard already computes.

## Maintaining this doc

- Tick a box in the same PR that ships the step.
- If the order changes, edit the list here and explain why in the PR description.
- Once v1 is complete, either archive the file or collapse it into a short "v1 shipped" note.
