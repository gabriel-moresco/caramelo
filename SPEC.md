# Caramelo — Product Specification

## 1. Overview

Caramelo is a personal finance application for Brazilian users. It helps users track income and expenses across bank accounts and credit cards, understand where their money goes each month, and measure progress against monthly savings goals.

- **Language:** Brazilian Portuguese (pt-BR) for all user-facing copy.
- **Currency:** Brazilian Real (BRL) only.
- **Platform:** Web application in v1. CLI and MCP server interfaces are planned for future releases.
- **Users:** Multi-user, self-serve. Each user's data is strictly isolated from other users.

This document describes **what** the product does. Technical architecture and implementation decisions are documented separately in `ARCHITECTURE.md`.

---

## 2. Glossary

| Term                         | Meaning                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Receita**                  | A transaction that represents money coming in (e.g., salary, freelance payment, cashback).                            |
| **Despesa**                  | A transaction that represents money going out (e.g., groceries, rent, restaurant).                                    |
| **Transferência**            | A transaction that moves money between the user's own accounts/cards. Does not count as income or expense.            |
| **Conta**                    | A bank account (Conta Corrente, Conta Poupança, Conta Salário, etc.).                                                 |
| **Cartão de Crédito**        | A credit card. Has its own transactions; its bill (fatura) is paid from a bank account.                               |
| **Fatura**                   | The monthly bill of a credit card — a group of purchases between two closing dates, due on the card's due date.       |
| **Fechamento**               | The day of the month when a credit card's billing cycle closes.                                                       |
| **Vencimento**               | The day of the month when a credit card's fatura must be paid.                                                        |
| **Categoria / Subcategoria** | A two-level classification applied to income and expense transactions.                                                |
| **Meta de Economia**         | A user-defined monthly savings goal, expressed as a fixed amount or a percentage of income.                           |
| **Reconciliação de Fatura**  | The process of identifying a bank transaction as a credit card bill payment and linking it to the corresponding card. |

---

## 3. Users & Authentication

- **Registration:** Users sign up with email and password.
- **Email verification:** Required before sign-in. On sign-up, a verification link is emailed to the user; clicking it activates the account and signs the user in automatically. Attempting to sign in before verifying triggers a fresh verification email. A resend action is available from the sign-in screen.
- **Password reset:** Available via email.
- **Roles:** Single role — `user`. No admin, viewer, or editor variants in v1.
- **Data isolation:** Each user sees only their own accounts, cards, transactions, categories, and goals. There is no sharing, household mode, or group access in v1.
- **Transactional emails:** Only authentication-related messages (email verification, password reset). No product or marketing emails in v1.
- **Owner notifications:** On every new signup, an internal notification email is sent to the product owner. This is not user-facing.

---

## 4. Core Entities (Conceptual Model)

This section describes the domain entities at a conceptual level. Field types, indexes, and relations are left to the architecture document.

### 4.1. User

Represents a person using the app. Owns all other entities described below. Fully isolated from other users.

### 4.2. Conta (Bank Account)

Represents a Brazilian bank account. Supported types include:

- Conta Corrente
- Conta Poupança
- Conta Salário
- Any other bank account type the user wants to register (free-form type or a predefined list — UX decision, not spec-binding).

**Stored attributes:**

- Nickname (user-chosen, e.g., "Itaú Principal")
- Bank (e.g., "Itaú", "Nubank", "Santander")
- Account type

**Out of scope:** investments, cryptocurrency, loans (empréstimos/dívidas), and receivables are not represented as accounts in v1.

### 4.3. Cartão de Crédito (Credit Card)

Represents a credit card issued to the user.

**Stored attributes:**

- Nickname (user-chosen, e.g., "Nubank Roxinho")
- Bank / issuer
- Closing day of the month (dia de fechamento)
- Due day of the month (dia de vencimento)

**Out of scope:** credit limit is not tracked in v1.

### 4.4. Categoria (Category)

A user-scoped, two-level taxonomy used to classify income and expense transactions.

- Each category has one or more subcategories (the hierarchy is exactly two levels deep).
- Categories are **scoped by transaction type**: expense categories are a distinct set from income categories. Transferência transactions do not use categories.
- A default set of categories (see §8) is created for every new user at signup.
- Users can create, rename, and delete their own categories and subcategories.

### 4.5. Transação (Transaction)

A single financial movement. Each transaction belongs to exactly one account **or** one credit card.

**Transaction types:**

- **Receita** (income) — counts as income in all reports.
- **Despesa** (expense) — counts as expense in all reports.
- **Transferência** (transfer) — excluded from income and expense totals.

**Stored attributes:**

- Date
- Amount (positive number; direction is implied by type)
- Description
- Category and subcategory (required for Receita and Despesa; not applicable to Transferência)
- Source: manual or OFX import
- For credit card transactions: the fatura (billing cycle) the transaction belongs to
- For reconciled bank transactions: a link to the credit card whose fatura this payment covers

### 4.6. Meta de Economia (Savings Goal)

A monthly savings target defined globally (not per account).

**Goal types:**

- **Fixed amount** — e.g., "save R$ 5.000 per month".
- **Percentage of income** — e.g., "save 30% of my income per month".

**Rules:**

- The user has at most one active goal at any given moment.
- Changing the goal takes effect from the current month onward. Past months retain the goal that was active during that month, together with whether the user met it.
- Historical goal records are preserved so the user can view past performance over time.

---

## 5. Features

Features will be delivered incrementally (one section at a time). The list below defines the v1 scope in total.

### 5.1. Cadastro de Contas e Cartões

- Users can register, edit, and delete bank accounts.
- Users can register, edit, and delete credit cards (including fechamento and vencimento days).
- A user can have multiple accounts and multiple cards.

### 5.2. Gestão de Categorias

- On signup, the user's category tree is seeded with the default set in §8.
- Users can create new categories and subcategories.
- Users can rename categories and subcategories.
- Users can delete categories and subcategories.
- Category operations are scoped to transaction type (Receita vs. Despesa). A subcategory belongs to exactly one parent category.

### 5.3. Lançamento Manual de Transações

- Users can create a transaction manually against any of their accounts or credit cards.
- Users can edit and delete any transaction, regardless of whether it was created manually or via OFX import.
- Required fields at creation: account or card, date, amount, description, type (Receita / Despesa / Transferência), and — for Receita/Despesa — category and subcategory. If the user does not pick a category, auto-categorization (§5.5) populates it.

### 5.4. Importação de Extratos (OFX)

- Users upload a single OFX file, choosing the account or credit card it belongs to and the reference month.
- One OFX import is allowed per account-or-card per month.
- On re-import for the same account-or-card and month:
  - All transactions previously imported from OFX for that account-or-card and month are deleted.
  - The uploaded file is ingested and its transactions are created fresh.
  - **Manually created transactions for the same month are preserved** — they are not affected by OFX re-imports.
- Auto-categorization (§5.5) runs on all newly imported transactions.
- Imported transactions are tagged with `source = OFX` so the system can distinguish them from manual entries.

### 5.5. Categorização Automática (LLM)

- Every newly created transaction — whether from OFX import or manual entry — is automatically classified using an LLM.
- The LLM receives the transaction description and amount and returns a `(categoria, subcategoria)` pair from the user's current category tree.
- The user can override the suggestion at any time by editing the transaction.
- Transferência transactions are not categorized.
- The LLM integration uses a provider-agnostic wrapper so the underlying model/provider can be swapped without impacting the rest of the app. Provider selection is an architecture concern.
- No batching is required in v1. If cost becomes an issue, batching can be introduced later.

### 5.6. Reconciliação de Fatura (Credit Card Bill Matching)

Prevents credit card bill payments from being double-counted as expenses.

- When bank account transactions are imported or entered, the system detects candidates that look like credit card fatura payments (by description patterns, amount, and date proximity to the fatura of one of the user's cards).
- For each candidate, the system suggests a matching credit card and asks the user to confirm.
- On user confirmation:
  - The transaction's type becomes **Transferência**.
  - The transaction is linked to the target credit card (and, conceptually, to the specific fatura it pays).
  - The transaction no longer contributes to expense totals.
- The user can manually mark any bank transaction as a fatura payment and link it to a card, even without an auto-suggestion.
- The user can unlink a reconciliation if it was incorrect; the transaction reverts to its previous type (or to Despesa/Receita as the user edits).

### 5.7. Faturas de Cartão de Crédito

- Each credit card transaction is assigned to a fatura (billing cycle) based on the transaction date and the card's closing day.
- A fatura spans from the day after the previous closing day up to the current closing day.
- In monthly reports and the dashboard, credit card transactions are attributed to **the month of the fatura they belong to**, not the purchase date. This aligns expenses with the month when the user actually pays for them.

### 5.8. Metas de Economia

- Users can create or update their monthly savings goal (fixed amount or percentage of income).
- Changes apply from the current month forward; they do not retroactively alter past months.
- For each month, the system computes:
  - **Income:** sum of all Receita-type transactions in the month.
  - **Expenses:** sum of all Despesa-type transactions in the month. (Transferência transactions are excluded.)
  - **Savings:** income − expenses.
  - **Target:** fixed amount (for fixed goals) or `percentage × income` (for percentage goals) — computed against the goal that was active for that month.
  - **Achievement:** `savings ≥ target`.
- The user can view historical months to see which goal was active, the target, the actual savings, and whether the goal was met.

### 5.9. Dashboard e Insights

The dashboard is **monthly-centric**: the user navigates month by month.

Target insights (built incrementally, one at a time):

- **Monthly summary:** income, expenses, savings (the three headline numbers for the selected month).
- **Expense breakdown:** spending grouped by category with drill-down into subcategory.
- **Income breakdown:** income grouped by category with drill-down into subcategory.
- **Savings goal progress:** target, actual, and whether the month's goal was met.
- **Transaction list:** filterable by account/card, type, category, subcategory, and date range.

Weekly, yearly, and trend-over-time views are out of scope for v1.

### 5.10. Autenticação

- Email + password registration.
- Email verification required before sign-in (link-based, with resend and auto sign-in after verification).
- Login with email + password.
- Password reset flow via email.
- Account self-service (change password, update email) — details to be refined in UX design.

---

## 6. Business Rules

These rules apply globally and are the authority for any ambiguity elsewhere:

1. **Transfers are neutral.** Transferência transactions are never counted as income or expense in any report or metric.
2. **No double-counting of credit cards.** Once a bank transaction is reconciled as a credit card fatura payment, it becomes Transferência. The individual credit card purchases are the source of truth for expenses.
3. **Fatura-month attribution.** Credit card expenses are attributed to the month of their fatura (closing-date-based), not the month of purchase.
4. **OFX re-import is destructive only for OFX-originated rows.** Manual transactions in the same account-and-month survive a re-import.
5. **Categories are per-user and per-type.** Two users may have categories with the same name, but they are separate records. A Despesa category cannot be used on a Receita transaction.
6. **Savings goals are forward-looking when changed.** Editing the active goal does not rewrite history.
7. **Data isolation is absolute.** Under no circumstances does one user's data appear in another user's views, reports, or exports.

---

## 7. Out of Scope (v1)

The following are explicitly **not** part of v1. They may or may not be revisited later:

**Account types:** investments (stocks, FIIs, ETFs), cryptocurrency, loans/debts (empréstimos e dívidas), receivables (recebíveis), cash-in-hand as a distinct account type.

**Features:** budgets, recurring/scheduled transactions, debt payoff tracking, net-worth-over-time reporting, investment P&L, tax-ready reports, forecasting and projections, bill reminders, push notifications, product/marketing emails, monthly summary emails, credit card limit tracking, receipt attachments, tagging beyond the two-level category hierarchy.

**Platforms:** mobile native app, CLI, MCP server.

**Other:** multi-currency, shared/household accounts, user roles beyond `user`, admin console, data export, open-finance/Pluggy/Belvo integrations.

---

## 8. Default Categories (pt-BR)

Every user's category tree is seeded with the following on signup. Users can modify freely afterwards.

### 8.1. Categorias de Despesa

| Categoria             | Subcategorias                                                                |
| --------------------- | ---------------------------------------------------------------------------- |
| **Alimentação**       | Supermercado, Restaurante, Delivery, Padaria/Café                            |
| **Moradia**           | Aluguel, Condomínio, Energia, Água, Gás, Internet, Manutenção                |
| **Transporte**        | Combustível, Transporte público, Uber/99, Estacionamento, Manutenção veículo |
| **Saúde**             | Plano de saúde, Farmácia, Consultas, Exames                                  |
| **Educação**          | Mensalidade, Cursos, Livros, Material                                        |
| **Lazer**             | Streaming, Jogos, Viagem, Cultura, Esporte                                   |
| **Vestuário**         | Roupas, Calçados, Acessórios                                                 |
| **Serviços**          | Assinaturas, Telefone/Celular, Seguros, Serviços diversos                    |
| **Cuidados pessoais** | Beleza, Higiene                                                              |
| **Pets**              | Ração, Veterinário, Petshop                                                  |
| **Impostos e taxas**  | IRPF, IPTU, IPVA, Taxas bancárias                                            |
| **Outros**            | Não categorizado                                                             |

### 8.2. Categorias de Receita

| Categoria       | Subcategorias                            |
| --------------- | ---------------------------------------- |
| **Salário**     | Salário, Adiantamento, 13º, Férias       |
| **Freelance**   | Serviços prestados, Consultoria          |
| **Rendimentos** | Rendimento poupança, Cashback, Reembolso |
| **Outros**      | Outros recebimentos                      |

---

## 9. Future Considerations

Items flagged for later phases, not committed to any timeline:

- **Additional interfaces:** CLI client and MCP server to expose user data to AI agents and the terminal.
- **Richer dashboards:** weekly and yearly views; multi-month trend charts for income, expenses, and categories.
- **Proactive notifications:** email or in-app alerts for savings goal status, unusual spending, upcoming fatura due dates.
- **Integrations:** direct bank connectivity via Open Finance providers (Pluggy, Belvo) to reduce OFX upload friction.
- **Batching / cost controls** for LLM categorization if per-transaction API calls become prohibitive.
- **Expanded account coverage:** investments, crypto, loans, receivables — pending product validation.
