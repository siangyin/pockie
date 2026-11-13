# Personal Finance Manager

> A private, mobile-friendly web application for tracking income, expenses, accounts, budgets and savings goals — designed to make everyday money management simple.

**Project status:** Planning / not yet implemented  
**Primary currency:** SGD (S$)  
**Target platform:** Responsive web app, with optional Progressive Web App (PWA) support  
**Initial audience:** Single user; multi-user and household features are future possibilities

> [!NOTE]
> This README describes the proposed product and implementation plan. Features, integrations, screenshots and deployment are **not** yet available unless marked complete. Costs and timelines are indicative estimates, not quotations.

## Table of contents

- [1. Project overview](#1-project-overview)
- [2. Goals and principles](#2-goals-and-principles)
- [3. Product scope](#3-product-scope)
- [4. MVP feature checklist](#4-mvp-feature-checklist)
- [5. Advanced feature backlog](#5-advanced-feature-backlog)
- [6. Core user journeys](#6-core-user-journeys)
- [7. Technology stack](#7-technology-stack)
- [8. Proposed architecture](#8-proposed-architecture)
- [9. Data model](#9-data-model)
- [10. Business rules and calculations](#10-business-rules-and-calculations)
- [11. Security and privacy](#11-security-and-privacy)
- [12. Development roadmap](#12-development-roadmap)
- [13. Estimated costs and effort](#13-estimated-costs-and-effort)
- [14. Proposed repository structure](#14-proposed-repository-structure)
- [15. Local development plan](#15-local-development-plan)
- [16. Testing and acceptance criteria](#16-testing-and-acceptance-criteria)
- [17. Open decisions](#17-open-decisions)
- [18. Project log](#18-project-log)

## 1. Project overview

### Problem

Without a consistent way to record spending, it is difficult to know where money goes, whether monthly budgets are realistic, and how much is available for savings.

### Solution

Build a simple, reliable personal finance application that brings financial records and insights into one dashboard. Start with fast manual entry and CSV import, then progressively add automation and forecasting.

### Main navigation

1. **Dashboard** — income, expenses, available balance and budget status.
2. **Transactions** — record, edit, search and import income/expenses.
3. **Budgets** — monthly spending limits and category progress.
4. **Savings** — savings goals and progress (post-MVP).
5. **Reports** — trends, breakdowns and comparisons.
6. **Settings** — accounts, categories, preferences and data export.

## 2. Goals and principles

### Goals

- Understand monthly income and spending at a glance.
- Reduce the effort needed to record transactions.
- Control spending with category-level budgets.
- Review historical spending patterns and trends.
- Preserve ownership and portability of financial data.
- Keep operating costs low for a solo developer.

### Product principles

- **Simple first:** Prioritise a usable daily workflow over feature volume.
- **Accurate by design:** Avoid duplicate transactions and double-counted transfers.
- **Private by default:** No public sharing of financial records.
- **Mobile friendly:** Support quick entry on a phone.
- **Portable:** Support CSV export and documented data formats.
- **Progressive enhancement:** Add AI, OCR and bank integrations only when useful.

### Non-goals for the MVP

- Direct bank account connections or automatic bank synchronisation.
- Investment trading or payment initiation.
- Tax filing, regulated financial advice or credit scoring.
- Household collaboration, advanced AI recommendations or multi-currency accounting.

## 3. Product scope

### Release strategy

| Release | Focus | Expected outcome |
| --- | --- | --- |
| **MVP / v0.1** | Accounts, transactions, budgets, dashboard, basic reports | A working personal spending tracker |
| **v0.2** | Recurring transactions, CSV import/export, improved reports | Less manual effort and better historical visibility |
| **v1.0** | Savings goals, notifications, stronger mobile/PWA experience | A polished personal finance tool |
| **Future** | OCR, AI insights, forecasts, debt/net worth, household sharing | Advanced personal financial planning |

Release names and sequencing are proposals and may change.

## 4. MVP feature checklist

All items below are **planned** until checked off after implementation and testing.

### Dashboard

- [ ] Display total monthly income.
- [ ] Display total monthly expenses.
- [ ] Display net cash flow (income minus expenses).
- [ ] Display monthly budget used and remaining.
- [ ] Display category spending breakdown.
- [ ] Filter the dashboard by month.
- [ ] Provide clear empty states when no transactions exist.

### Income and expenses

- [ ] Create, view, edit and delete transactions.
- [ ] Record date, amount, type, category, account and optional note.
- [ ] Support income and expense categories.
- [ ] Search and filter by date, amount, category, account and type.
- [ ] Confirm destructive actions where appropriate.
- [ ] Validate inputs and prevent invalid amounts.

### Accounts

- [ ] Create cash, bank, e-wallet and credit-card accounts.
- [ ] Set an opening balance and opening date.
- [ ] Record transfers between owned accounts without counting them as income or expenses.
- [ ] Display account balances with clear liability treatment for credit cards.
- [ ] Support account archival without deleting transaction history.

### Budgets

- [ ] Set an overall monthly expense budget.
- [ ] Set individual monthly category budgets.
- [ ] Show actual spending, remaining allowance and percentage used.
- [ ] Visually distinguish approaching and exceeded budgets.
- [ ] Define behaviour for categories without a budget.

### Categories and settings

- [ ] Provide sensible starter categories (e.g. salary, groceries, dining, transport, shopping, housing, utilities, healthcare, subscriptions and other).
- [ ] Add, rename and archive custom categories.
- [ ] Use SGD as the default currency.
- [ ] Use a consistent date format and Singapore time zone for display.

### Reports

- [ ] Display monthly income versus expenses.
- [ ] Display spending by category.
- [ ] Compare spending across months.
- [ ] Make charts readable on mobile.

### Access and data protection

- [ ] Implement secure sign-in and sign-out.
- [ ] Enforce per-user data access at the database level.
- [ ] Use HTTPS in production.
- [ ] Support export of personal transaction data.
- [ ] Test core financial calculations and authorisation rules.

## 5. Advanced feature backlog

| Feature | Description | Proposed release | Priority |
| --- | --- | --- | --- |
| Recurring transactions | Generate or remind about salary, bills and subscriptions | v0.2 | High |
| CSV import | Map statement columns and preview before import | v0.2 | High |
| Duplicate detection | Detect repeated imported transactions | v0.2 | High |
| CSV export | Export selected transactions and full records | v0.2 | High |
| Savings goals | Target amount, deadline and progress | v1.0 | High |
| Budget notifications | Alerts for approaching or exceeding limits | v1.0 | Medium |
| PWA support | Installable mobile-friendly experience | v1.0 | Medium |
| Smart categorisation | Merchant/category rules and suggestions | Future | Medium |
| Receipt scanning | Extract merchant, date and total from images | Future | Medium |
| Cash-flow forecasting | Estimate future balances using scheduled transactions | Future | Medium |
| Subscription tracking | Identify recurring services and renewals | Future | Medium |
| Debt tracking | Track loans, credit-card balances and repayments | Future | Medium |
| Net-worth tracking | Assets minus liabilities over time | Future | Medium |
| AI financial insights | Explain patterns and propose spending improvements | Future | Low |
| Multi-currency | Track accounts and transactions in other currencies | Future | Low |
| Household sharing | Shared accounts, roles and budgets | Future | Low |
| Bank integrations | Connect supported providers, subject to availability and cost | Future | Low |

**Bank connectivity note:** Direct access to Singapore bank data may require commercial providers, consent flows, additional security work and/or regulatory review. It is not assumed to be available.

## 6. Core user journeys

### A. Record an expense

1. Open **Transactions** and select **Add expense**.
2. Enter amount, date, account and category; optionally add a note.
3. Save and see updated account balance, budget usage and reports.

### B. Plan a monthly budget

1. Open **Budgets** and choose a month.
2. Set an overall spending limit and category limits.
3. Review spending against each limit throughout the month.

### C. Review monthly finances

1. Open **Dashboard** and select the month.
2. Compare income, expenses and net cash flow.
3. Inspect top spending categories and transactions.
4. Adjust next month's budget based on actual spending.

### D. Import bank statements (v0.2)

1. Upload a supported CSV file.
2. Map date, description, amount, transaction direction and account.
3. Preview records and suggested categories.
4. Flag duplicates and resolve ambiguous entries.
5. Confirm import and review results.

## 7. Technology stack

| Layer | Proposed choice | Purpose |
| --- | --- | --- |
| Language | **TypeScript** | Type-safe application development |
| Web framework | **Next.js + React** | UI, routing and server-side functionality |
| Styling | **Tailwind CSS** | Responsive styling |
| UI components | **shadcn/ui** | Accessible, customisable components |
| Charts | **Recharts** | Dashboard and report visualisations |
| Database | **Supabase PostgreSQL** | Relational finance records |
| Authentication | **Supabase Auth** | User authentication |
| Data access | **Supabase client/server libraries** | Database queries and authenticated operations |
| Hosting | **Vercel** | Application deployment |
| CSV handling | **Papa Parse** or equivalent | Statement import/export |
| Excel support | **ExcelJS** or equivalent, if needed | Spreadsheet support |
| Unit tests | **Vitest** | Financial calculations and business rules |
| End-to-end tests | **Playwright** | User journeys and regression tests |
| Source control | **GitHub** | Version history and project management |

**Architecture decision:** Keep the MVP as a single Next.js application. Avoid microservices, Kubernetes and a separate backend until there is a demonstrated need.

## 8. Proposed architecture

```text
Browser (desktop/mobile)
         |
         v
Next.js application (React + TypeScript)
  |             |
  |             +--> Server-side actions / route handlers
  |                         |
  v                         v
UI / charts           Supabase Auth + PostgreSQL
                            |
                            +--> Row-level security policies
                            +--> User-scoped financial data

Optional future integrations:
CSV imports | OCR | AI insights | email notifications | bank data providers
```

### Implementation conventions

- Prefer server-side handling for privileged operations and secrets.
- Use schema validation for all user input, including server-side input.
- Keep finance calculation functions separate from UI components.
- Use migrations for database schema changes.
- Use environment variables for configuration; never commit secrets.
- Keep an audit-friendly record of import sources and changes where practical.

## 9. Data model

The following is a **conceptual schema**, not a final migration.

| Entity | Example fields | Notes |
| --- | --- | --- |
| `profiles` | `user_id`, `display_name`, `default_currency`, `timezone` | Links to authenticated user |
| `accounts` | `id`, `user_id`, `name`, `type`, `currency`, `opening_balance_minor`, `archived_at` | Cash, bank, e-wallet, credit card |
| `categories` | `id`, `user_id`, `name`, `type`, `parent_id`, `archived_at` | Income or expense categories |
| `transactions` | `id`, `user_id`, `account_id`, `category_id`, `type`, `amount_minor`, `occurred_on`, `note`, `transfer_group_id` | Income, expense and transfer records |
| `budgets` | `id`, `user_id`, `month`, `category_id`, `limit_minor` | One category budget per month; overall budget may use a separate field/table |
| `recurring_rules` | `id`, `user_id`, `amount_minor`, `frequency`, `next_date`, `status` | Post-MVP |
| `savings_goals` | `id`, `user_id`, `name`, `target_minor`, `target_date` | Post-MVP |
| `imports` | `id`, `user_id`, `filename`, `imported_at`, `status` | Post-MVP import history |

### Relationships and constraints

- All user-owned records include `user_id` and are protected by row-level security (RLS).
- Transactions reference an account; income/expense transactions reference an appropriate category.
- Transfers are represented by linked account movements or another explicitly balanced model; decide this before writing migrations.
- Use database constraints for valid transaction types, positive amounts and unique budget keys.
- Use UUIDs for primary keys where appropriate.
- Preserve historical data when categories/accounts are archived.
- Plan how to store credit-card liabilities and payment transfers consistently.

## 10. Business rules and calculations

### Money and dates

- Store SGD amounts as **integer cents** (e.g. S$12.34 = `1234`) or use exact `NUMERIC` columns; do not use binary floating-point for money.
- Treat negative balances and liabilities consistently across UI and reports.
- Use ISO dates for date-only transaction fields; use timestamps for events such as record creation.
- Display dates in the user's configured time zone (initially `Asia/Singapore`).

### Calculations

```text
Monthly income      = sum(income transactions within selected month)
Monthly expenses    = sum(expense transactions within selected month)
Net cash flow       = monthly income - monthly expenses
Budget remaining    = budget limit - eligible category expenses
Budget used (%)     = expenses / budget limit * 100 (when budget > 0)
Savings rate (%)    = net cash flow / income * 100 (when income > 0)
```

**Important:** Net cash flow and its percentage are **not** necessarily actual savings. Moving money between owned accounts is not new income or spending. Savings transfers should be tracked separately if the product needs an actual savings-contribution metric.

### Accounting safeguards

- Transfers between owned accounts must not inflate income or expenses.
- Credit-card purchases are expenses when purchased; paying the credit-card bill is a transfer/payment of a liability, not a second expense.
- Account balances should be reproducible from opening balances and recorded movements.
- Imported transactions need idempotent handling and duplicate review.
- Define whether refunds reverse expenses or appear as income; recommended: link refunds to original spending where possible.
- Define how category budgets handle refunds, split transactions and rollover amounts before implementing those features.

## 11. Security and privacy

Financial records are sensitive. Treat security as a release requirement, not a later enhancement.

- [ ] Require authentication for private pages and server operations.
- [ ] Enable RLS on every user-owned database table; test that one user cannot read or modify another user's records.
- [ ] Never expose service-role keys or other privileged secrets in browser code.
- [ ] Validate all inputs and restrict file upload types/sizes.
- [ ] Use HTTPS and secure session/cookie practices in production.
- [ ] Avoid logging account details, transaction descriptions and other sensitive information unnecessarily.
- [ ] Establish backup and recovery procedures and test restores.
- [ ] Provide data export and a clear deletion process.
- [ ] Keep dependencies patched and review authentication changes.
- [ ] Obtain explicit user consent before sending financial information to AI or third-party integrations.
- [ ] Do not commit `.env` files, credentials or real bank statements to GitHub.

For a future public or multi-user product, assess applicable privacy, security, compliance and regulatory obligations before launch.

## 12. Development roadmap

These are **illustrative milestones**, not committed deadlines.

| Phase | Target | Deliverables | Status |
| --- | --- | --- | --- |
| 1. Foundation | Weeks 1–2 | Requirements, UI direction, Next.js setup, Supabase schema/auth | Planned |
| 2. Core tracking | Weeks 3–6 | Accounts, categories, income/expenses, budgets, dashboard | Planned |
| 3. Reports and import | Weeks 7–9 | Charts, recurring records, CSV import/export, reconciliation | Planned |
| 4. Quality and release | Weeks 10–12 | Tests, security review, responsive QA, backups, deployment | Planned |
| 5. Enhancements | After initial release | Savings, forecasts, PWA, AI/OCR experiments | Backlog |

The schedule assumes consistent development time and prior familiarity with web development. Use the effort estimate below for more realistic personal planning.

## 13. Estimated costs and effort

All figures are **rough planning estimates** in SGD unless stated otherwise. Provider prices, quotas, currency conversion and tax may change; verify current pricing before committing.

### Operating costs

| Scenario | Estimated recurring cost | Assumptions |
| --- | --- | --- |
| Personal MVP | **S$0–10/month** | Eligible free hosting/database tiers; minimal usage; optional domain |
| Advanced personal app | **S$15–80/month** | Some paid hosting/database, storage or AI/OCR usage |
| Small public app | **S$70–200+/month** | Paid infrastructure and greater traffic; integrations may cost extra |

Potential additional costs:

- Custom domain: approximately **S$15–35/year**.
- Supabase Pro: advertised starting price around **US$25/month** at the time of planning; verify at <https://supabase.com/pricing>.
- Vercel Pro: advertised starting price around **US$20/month** at the time of planning; verify at <https://vercel.com/pricing>. Hobby plan eligibility and usage restrictions apply.
- AI, OCR, email and banking providers: usage-based or contract-based.

### Solo development effort

| Workstream | Estimated hours |
| --- | ---: |
| UI and data modelling | 15–30 |
| Accounts and transactions | 25–45 |
| Budgets and dashboard | 20–35 |
| Reports and charts | 15–25 |
| Authentication, security and tests | 20–40 |
| Deployment and refinement | 10–20 |
| **Estimated MVP total** | **105–195** |

At 10 hours/week, this is roughly **11–20 weeks** (approximately 3–5 months). Beginners may need longer. Advanced features may add another **100–300+ hours** depending on scope.

## 14. Proposed repository structure

This is a suggested layout for a Next.js App Router project; directories may change during implementation.

```text
personal-finance-manager/
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── accounts/
│   │   │   ├── budgets/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── charts/
│   │   └── finance/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── finance/
│   │   └── validation/
│   └── types/
├── supabase/
│   └── migrations/
├── tests/
│   ├── unit/
│   └── e2e/
└── docs/
    ├── decisions/
    └── screenshots/
```

## 15. Local development plan

> These are **future setup steps** once the application has been scaffolded; this repository is not assumed to contain runnable code yet.

1. Install a supported Node.js LTS version and a package manager.
2. Scaffold a Next.js project with TypeScript and Tailwind CSS.
3. Configure shadcn/ui and charting components.
4. Create a Supabase project and apply versioned SQL migrations.
5. Configure authentication and RLS policies.
6. Create `.env.local` from a documented `.env.example` (never commit secrets).
7. Add seed data that is clearly labelled as fictional.
8. Run the development server, unit tests and end-to-end tests.
9. Configure deployment only after security and calculation checks pass.

Typical commands after scaffolding:

```bash
npm install
npm run dev
npm run test
npm run build
```

Actual scripts must be defined in `package.json` before these commands can work.

## 16. Testing and acceptance criteria

### Financial correctness

- [ ] Income and expense totals match the underlying transaction records.
- [ ] Transfers do not alter total income or expense reports.
- [ ] Credit-card payments do not double-count spending.
- [ ] Budgets calculate correctly at month boundaries and when refunds occur.
- [ ] Zero income and zero budget do not cause division errors.
- [ ] Currency calculations avoid floating-point rounding defects.
- [ ] Account balances reconcile with opening balances and movements.
- [ ] Importing the same statement twice does not silently duplicate transactions.

### User experience

- [ ] Main journeys work on desktop and mobile widths.
- [ ] Forms show clear validation and success/error feedback.
- [ ] Empty, loading and error states are understandable.
- [ ] Charts have text labels or accessible alternatives.
- [ ] Transactions can be found quickly with filters and search.

### Security and reliability

- [ ] Unauthenticated access to private data is blocked.
- [ ] Cross-user reads/writes fail in RLS tests.
- [ ] Sensitive credentials never appear in client bundles or commits.
- [ ] A backup can be restored successfully.
- [ ] Production build and automated tests pass.

## 17. Open decisions

Record decisions in GitHub Issues or `docs/decisions/` before implementing ambiguous behaviour.

- [ ] Is the first release strictly single-user or designed for multiple accounts/users from day one?
- [ ] Should budgets be based on calendar months only?
- [ ] Should unused category budgets roll over?
- [ ] Should refunds reduce original spending or appear as separate credits?
- [ ] Should transactions support split categories in the MVP?
- [ ] What are the exact credit-card balance and payment conventions?
- [ ] Is CSV import part of the first release or v0.2?
- [ ] Should actual savings contributions be tracked separately from net cash flow?
- [ ] What backup frequency and retention policy are appropriate?
- [ ] Will the repository be private or public, and what licence (if any) will apply?

## 18. Project log

Use this section as a lightweight record of major project changes.

| Date | Change | Status |
| --- | --- | --- |
| 2026-11-13 | Initial project concept, feature plan, proposed stack, architecture, cost estimates and roadmap documented | Planning |

### Maintenance conventions

- Update checkboxes only when a feature is implemented and verified.
- Keep the roadmap aligned with GitHub Issues or Projects.
- Record significant architectural choices as short decision records.
- Update cost assumptions when selecting paid providers.
- Add screenshots and deployment instructions only when the app actually exists.

---

**Project intent:** Build a practical, trustworthy personal finance tool that makes spending visible, budgeting manageable and financial planning easier — without unnecessary complexity.
