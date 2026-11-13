
# Pockie

**Your friendly money buddy.**

*Track simply. Spend wisely. Save happily.*

Pockie is a simple, friendly and mobile-first personal finance web application designed to make everyday money management easier.

It helps users track income and expenses, manage budgets, understand spending habits and work towards savings goals — without complicated financial tools or overwhelming interfaces.

> **Project status:** Planning  
> **Version:** 0.1.0 (Planned MVP)  
> **Project type:** Personal Finance Web Application  
> **Development approach:** AI-Assisted Development  
> **Default currency:** SGD  
> **Language:** English (British)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Product Vision](#2-product-vision)
3. [Design Principles](#3-design-principles)
4. [Target Users](#4-target-users)
5. [Core Features — MVP](#5-core-features--mvp)
6. [Advanced Features](#6-advanced-features)
7. [Application Navigation](#7-application-navigation)
8. [User Experience Requirements](#8-user-experience-requirements)
9. [Technology Stack](#9-technology-stack)
10. [System Architecture](#10-system-architecture)
11. [Database Design](#11-database-design)
12. [Financial Calculation Rules](#12-financial-calculation-rules)
13. [Security and Privacy](#13-security-and-privacy)
14. [AI-Assisted Development](#14-ai-assisted-development)
15. [Development Roadmap](#15-development-roadmap)
16. [Testing and Quality Assurance](#16-testing-and-quality-assurance)
17. [Estimated Development Costs](#17-estimated-development-costs)
18. [Future Enhancements](#18-future-enhancements)
19. [Project Structure](#19-project-structure)
20. [Project Decisions and Change Log](#20-project-decisions-and-change-log)

---

## 1. Project Overview

### 1.1 What is Pockie?

Pockie is a personal finance management application that helps users organise their money through a simple, intuitive and friendly interface.

The application focuses on making financial tracking accessible, particularly for users who do not currently monitor their spending regularly.

Instead of presenting complicated accounting terminology or overwhelming financial reports, Pockie provides clear and actionable information.

### 1.2 Project Objectives

The main objectives are to:

- Make expense tracking quick and effortless.
- Provide a clear overview of income and spending.
- Help users understand where their money goes.
- Support simple monthly budgeting.
- Encourage better financial habits.
- Reduce repetitive manual data entry.
- Provide meaningful financial insights.
- Protect personal financial information.
- Support future expansion without complicating the core experience.

### 1.3 Project Scope

The initial release will focus on:

- Personal income tracking.
- Expense tracking.
- Account management.
- Monthly budgets.
- Basic financial dashboards.
- Spending reports.
- Recurring transactions.
- Data import and export.

Advanced functionality will be introduced progressively after the core application is stable.

### 1.4 Project Philosophy

**Simple first. Smart later.**

Pockie should prioritise usability, clarity and reliability over feature quantity.

Every feature should solve a meaningful user problem without introducing unnecessary complexity.

---

## 2. Product Vision

### 2.1 Vision Statement

> To make personal finance management simple, friendly and effortless, helping users understand their money and build healthier financial habits.

### 2.2 Mission

Pockie aims to help users:

1. Know how much money they earn.
2. Understand how much they spend.
3. Identify where their money goes.
4. Stay within their budgets.
5. Build better savings habits.
6. Make more informed financial decisions.

### 2.3 Brand Identity

| Attribute | Description |
|---|---|
| Application name | Pockie |
| Tagline | Your friendly money buddy. |
| Supporting tagline | Track simply. Spend wisely. Save happily. |
| Personality | Friendly, cheerful, helpful and trustworthy |
| Visual style | Clean, minimal, soft and modern |
| Primary experience | Simple, quick and intuitive |
| Default currency | SGD |
| Language | British English |

### 2.4 Suggested Colour Palette

| Purpose | Colour | Hex |
|---|---|---|
| Primary | Warm coral | `#C8795C` |
| Primary dark | Deep terracotta | `#9A503D` |
| Background | Warm cream | `#FFF7F0` |
| Secondary background | Soft peach | `#FCEAE2` |
| Success | Muted green | `#398B81` |
| Error | Soft red | `#DC6B5D` |

Colours are initial design proposals and may be refined during UI development.

---

## 3. Design Principles

### 3.1 Simplicity First

Pockie should be easy to understand without requiring financial knowledge.

Guidelines:

- Avoid unnecessary screens and settings.
- Use familiar financial terminology.
- Keep forms short.
- Display important information prominently.
- Use progressive disclosure for advanced functionality.
- Avoid cluttered dashboards.

### 3.2 Quick Expense Tracking

Recording an expense should require minimal effort.

The primary expense flow should be:

1. Tap **+ Add**.
2. Enter the amount.
3. Select a category.
4. Save the transaction.

Additional fields should remain optional or use sensible defaults.

**Target:** Record a basic expense in approximately 5–10 seconds after becoming familiar with the interface.

### 3.3 Mobile-First Experience

The application must work comfortably on mobile devices.

Requirements:

- Responsive layouts.
- Touch-friendly controls.
- Clear navigation.
- Large enough tap targets.
- Minimal horizontal scrolling.
- Quick access to transaction entry.

### 3.4 Friendly Language

Use clear and approachable wording.

Examples:

| Avoid | Prefer |
|---|---|
| Expenditure | Spending |
| Financial disbursement | Money spent |
| Transaction ledger | Transactions |
| Available liquidity | Money available |
| Budget variance | Over or under budget |
| Net cash position | Money remaining |

British English should be used consistently.

### 3.5 Meaningful Information

Every dashboard component should answer a useful question.

Examples:

- How much have I spent this month?
- How much money do I have left?
- Which category costs me the most?
- Am I staying within my budget?
- How much could I save?

### 3.6 Accessibility

The interface should aim to meet WCAG 2.2 AA accessibility standards.

This includes:

- Sufficient colour contrast.
- Keyboard accessibility.
- Clear focus indicators.
- Accessible form labels.
- Screen reader compatibility.
- Not relying on colour alone to communicate status.

---

## 4. Target Users

### 4.1 Primary Users

Individuals who want a simple way to manage their personal finances.

Especially suitable for:

- People who do not regularly track spending.
- Users who find traditional finance tools complicated.
- Individuals who want better budgeting habits.
- Users managing multiple bank accounts or credit cards.
- People planning savings goals.

### 4.2 Initial Release

The MVP will initially support one authenticated user.

The database architecture should allow future multi-user functionality without requiring a complete redesign.

### 4.3 Future Users

Potential future support includes:

- Couples managing shared expenses.
- Families managing household budgets.
- Users managing finances across multiple currencies.

---

## 5. Core Features — MVP

All features below are planned and have not yet been implemented.

### 5.1 Dashboard

**Purpose:** Provide a clear financial overview.

#### Requirements

- [ ] Display total monthly income.
- [ ] Display total monthly expenses.
- [ ] Display remaining income.
- [ ] Display monthly budget usage.
- [ ] Display spending by category.
- [ ] Show recent transactions.
- [ ] Support month selection.
- [ ] Display simple charts.
- [ ] Provide quick access to adding transactions.

#### Suggested Dashboard Cards

- Monthly Income
- Monthly Spending
- Money Remaining
- Budget Remaining
- Potential Savings Rate

**Calculation:**

`Remaining Income = Income - Expenses`

The dashboard must distinguish remaining income from actual savings and bank balances.

---

### 5.2 Quick Add Transaction

**Purpose:** Make daily expense tracking effortless.

#### Requirements

- [ ] Prominent **+ Add** action.
- [ ] Support expense entry.
- [ ] Support income entry.
- [ ] Support account transfers.
- [ ] Amount field with numeric keypad on mobile.
- [ ] Category selection.
- [ ] Default transaction date to today.
- [ ] Remember the last-used account where appropriate.
- [ ] Optional merchant and notes.
- [ ] Clear validation messages.
- [ ] Confirmation after saving.
- [ ] Ability to edit or delete transactions.

#### Basic Expense Fields

| Field | Required | Default |
|---|---|---|
| Amount | Yes | Empty |
| Type | Yes | Expense |
| Category | Yes | None |
| Account | Yes | Last-used account |
| Date | Yes | Today |
| Merchant | No | Empty |
| Notes | No | Empty |

#### Acceptance Criteria

- A user can save an expense without entering unnecessary information.
- Invalid amounts cannot be submitted.
- The dashboard updates after a successful save.
- Transactions cannot be saved to accounts the user does not own.
- Financial calculations remain accurate.

---

### 5.3 Income Management

**Purpose:** Track money received.

#### Requirements

- [ ] Add income transactions.
- [ ] Edit income transactions.
- [ ] Delete income transactions.
- [ ] Categorise income.
- [ ] Assign income to an account.
- [ ] Support recurring income.
- [ ] Filter income by date and category.

#### Default Categories

- Salary
- Bonus
- Freelance
- Interest
- Dividends
- Gifts
- Refunds
- Other Income

Refunds should be handled consistently so refunded expenses are not incorrectly treated as new earnings.

---

### 5.4 Expense Management

**Purpose:** Track and understand spending.

#### Requirements

- [ ] Add expenses.
- [ ] Edit expenses.
- [ ] Delete expenses.
- [ ] Assign categories.
- [ ] Assign accounts.
- [ ] Search transactions.
- [ ] Filter by date.
- [ ] Filter by category.
- [ ] Filter by account.
- [ ] Sort transactions.
- [ ] View monthly totals.

#### Suggested Expense Categories

| Category | Examples |
|---|---|
| Food & Drinks | Restaurants, coffee, food delivery |
| Groceries | Supermarket purchases |
| Transport | MRT, bus, taxi, petrol |
| Shopping | Clothes, accessories |
| Housing | Rent, mortgage |
| Utilities | Electricity, water, internet |
| Subscriptions | Streaming, software |
| Healthcare | Medical appointments, medication |
| Insurance | Insurance premiums |
| Entertainment | Movies, hobbies |
| Travel | Flights, hotels |
| Family | Household and family expenses |
| Other | Miscellaneous spending |

Users must be able to customise categories.

---

### 5.5 Account Management

**Purpose:** Track money across different accounts.

#### Supported Account Types

- Cash
- Bank Account
- Credit Card
- E-Wallet
- Other

#### Requirements

- [ ] Create an account.
- [ ] Edit account details.
- [ ] Archive an account.
- [ ] Set an opening balance.
- [ ] Display account balance.
- [ ] Transfer money between accounts.
- [ ] View account-specific transactions.
- [ ] Reconcile balances with actual statements.

#### Important Rules

Transfers between personal accounts must not count as income or expenses.

Credit card purchases should count as expenses when recorded.

Credit card repayments should be treated as transfers or liability settlements, not additional expenses.

---

### 5.6 Budget Management

**Purpose:** Help users control monthly spending.

#### Requirements

- [ ] Create a monthly budget.
- [ ] Set category-specific budgets.
- [ ] Edit budgets.
- [ ] Delete budgets.
- [ ] Display spending against budget.
- [ ] Display remaining budget.
- [ ] Highlight exceeded budgets.
- [ ] Support monthly budget history.

#### Example

| Category | Budget | Spent | Remaining |
|---|---:|---:|---:|
| Food | S$600 | S$420 | S$180 |
| Transport | S$250 | S$180 | S$70 |
| Shopping | S$300 | S$350 | -S$50 |

#### Calculation

`Remaining Budget = Budget Limit - Eligible Expenses`

The application should clearly indicate when spending exceeds the budget.

---

### 5.7 Reports and Insights

**Purpose:** Help users understand their financial habits.

#### Requirements

- [ ] Monthly income summary.
- [ ] Monthly expense summary.
- [ ] Category spending breakdown.
- [ ] Income versus expenses chart.
- [ ] Monthly spending trends.
- [ ] Budget performance report.
- [ ] Date range filtering.

Reports should remain simple and easy to interpret.

---

### 5.8 Recurring Transactions

**Purpose:** Reduce repetitive manual tracking.

#### Requirements

- [ ] Create recurring income.
- [ ] Create recurring expenses.
- [ ] Support daily, weekly, monthly and yearly frequencies.
- [ ] Edit recurring schedules.
- [ ] Pause recurring schedules.
- [ ] Prevent duplicate generated transactions.
- [ ] Support reminders for upcoming payments.

Recurring transactions should be clearly distinguished from confirmed payments.

---

### 5.9 Data Import and Export

**Purpose:** Reduce manual entry and maintain data portability.

#### Requirements

- [ ] Import CSV transactions.
- [ ] Preview imported records.
- [ ] Map imported columns.
- [ ] Validate imported values.
- [ ] Detect potential duplicates.
- [ ] Allow users to confirm imports.
- [ ] Export transactions to CSV.
- [ ] Export budget data.

Direct bank integrations are not required for the MVP.

---

## 6. Advanced Features

Advanced features will be considered after the MVP is stable.

### 6.1 Smart Transaction Categorisation

- [ ] Suggest categories based on merchants.
- [ ] Remember previous categorisation choices.
- [ ] Allow users to override suggestions.
- [ ] Support rule-based categorisation before introducing AI.

### 6.2 Receipt Scanning

- [ ] Upload receipt images.
- [ ] Extract merchant names.
- [ ] Extract dates and amounts.
- [ ] Suggest categories.
- [ ] Require user confirmation before saving.

### 6.3 AI Financial Insights

- [ ] Identify spending patterns.
- [ ] Compare spending between months.
- [ ] Explain budget changes.
- [ ] Highlight unusual spending.
- [ ] Suggest practical savings opportunities.
- [ ] Provide understandable financial summaries.

AI-generated insights must not be presented as guaranteed financial advice.

### 6.4 Savings Goals

- [ ] Create savings goals.
- [ ] Set target amounts.
- [ ] Set target dates.
- [ ] Track contributions.
- [ ] Display progress.
- [ ] Support multiple goals.

### 6.5 Cash Flow Forecasting

- [ ] Forecast upcoming bills.
- [ ] Forecast expected income.
- [ ] Estimate future balances.
- [ ] Highlight potential shortfalls.
- [ ] Show assumptions and uncertainty.

### 6.6 Subscription Tracking

- [ ] Identify recurring subscriptions.
- [ ] Track renewal dates.
- [ ] Show monthly subscription costs.
- [ ] Notify users of upcoming renewals.

### 6.7 Debt Management

- [ ] Track loans.
- [ ] Track credit card liabilities.
- [ ] Record interest rates.
- [ ] Track repayment progress.
- [ ] Simulate repayment plans.

### 6.8 Net Worth Tracking

- [ ] Track assets.
- [ ] Track liabilities.
- [ ] Calculate net worth.
- [ ] Display historical trends.

### 6.9 Household Finance

- [ ] Shared budgets.
- [ ] Shared transactions.
- [ ] Household member roles.
- [ ] Individual and shared accounts.
- [ ] Appropriate access controls.

### 6.10 Additional Enhancements

- [ ] Multi-currency support.
- [ ] Progressive Web App installation.
- [ ] Push notifications.
- [ ] Budget reminders.
- [ ] Annual financial planning.
- [ ] Bank integration where available.
- [ ] Custom dashboard preferences.

---

## 7. Application Navigation

### 7.1 Primary Navigation

Pockie should initially have four main sections.

| Navigation | Purpose |
|---|---|
| Home | Financial overview |
| Transactions | Income and expense records |
| Budgets | Spending limits and progress |
| Settings | Accounts, categories and preferences |

### 7.2 Quick Add

The **+ Add** action should be easily accessible from the main application interface.

On mobile, consider a prominent floating action button or central bottom-navigation action.

### 7.3 Suggested Navigation Structure

```text
Pockie
│
├── Home
│   ├── Financial Summary
│   ├── Budget Overview
│   ├── Spending Breakdown
│   └── Recent Transactions
│
├── Transactions
│   ├── All Transactions
│   ├── Income
│   ├── Expenses
│   └── Transfers
│
├── Budgets
│   ├── Monthly Budget
│   ├── Category Budgets
│   └── Budget Progress
│
├── Settings
│   ├── Accounts
│   ├── Categories
│   ├── Recurring Transactions
│   ├── Import / Export
│   └── Preferences
│
└── + Add
    ├── Expense
    ├── Income
    └── Transfer
```

Advanced features may introduce additional screens later.

---

## 8. User Experience Requirements

### 8.1 Dashboard

The dashboard should prioritise:

1. Money remaining.
2. Monthly spending.
3. Monthly income.
4. Budget progress.
5. Recent transactions.

Avoid displaying too many charts simultaneously.

### 8.2 Forms

Forms should:

- Have clear labels.
- Minimise required fields.
- Provide sensible defaults.
- Display inline validation.
- Preserve entered values when errors occur.
- Work with keyboard and touch input.

### 8.3 Feedback

Users should receive clear feedback after important actions.

Examples:

- "Expense added."
- "Budget updated."
- "Transaction deleted."
- "You're close to your food budget."
- "You've spent more than your shopping budget."

### 8.4 Empty States

When no data exists, provide helpful guidance.

Example:

> No expenses yet. Add your first expense to see where your money goes.

### 8.5 Loading and Error States

- Show loading indicators for asynchronous operations.
- Avoid duplicate submissions.
- Provide clear recovery actions.
- Do not display technical database errors to end users.
- Preserve user input where possible.

### 8.6 Performance

Initial performance targets:

- Responsive interaction on typical mobile devices.
- Fast transaction entry.
- Efficient loading of transaction history.
- Pagination for large transaction datasets.
- Avoid unnecessary API requests.

---

## 9. Technology Stack

### 9.1 Recommended Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | UI components |
| Framework | Next.js | Full-stack application |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Responsive styling |
| UI Components | shadcn/ui | Reusable interface components |
| Charts | Recharts | Financial visualisations |
| Backend | Next.js Server Actions / API Routes | Business logic |
| Database | Supabase PostgreSQL | Financial data storage |
| Authentication | Supabase Auth | User authentication |
| Hosting | Vercel | Deployment |
| Version Control | GitHub | Source management |
| Testing | Vitest | Unit and integration tests |
| E2E Testing | Playwright | User workflow testing |
| Validation | Zod | Input validation |
| CSV Processing | Papa Parse | CSV import and export |

### 9.2 Technology Selection Principles

- Prefer stable and well-supported libraries.
- Minimise unnecessary dependencies.
- Avoid premature optimisation.
- Keep the architecture maintainable.
- Prioritise security and correctness.
- Use TypeScript consistently.
- Avoid introducing microservices for the MVP.

### 9.3 Development Tools

Recommended tools:

- Visual Studio Code or Cursor.
- GitHub.
- Node.js (supported LTS version).
- npm or pnpm.
- Supabase CLI.
- Browser developer tools.
- AI coding assistants.

---

## 10. System Architecture

### 10.1 Architecture Overview

```text
                User
                 |
                 v
        Web Browser / Mobile
                 |
                 v
        Next.js Application
        ├── React Components
        ├── Dashboard
        ├── Transactions
        ├── Budgets
        └── Settings
                 |
                 v
        Server-Side Logic
        ├── Authentication Checks
        ├── Input Validation
        ├── Financial Calculations
        └── Data Access
                 |
                 v
             Supabase
        ├── PostgreSQL
        ├── Authentication
        ├── Row-Level Security
        └── File Storage (Optional)
```

### 10.2 Architecture Principles

- Use a modular monolithic architecture.
- Separate UI components from business logic.
- Centralise financial calculations.
- Validate data on the server.
- Use database constraints for data integrity.
- Apply row-level security to user-owned records.
- Keep external integrations optional.

### 10.3 API and Server Logic

Server-side functionality should handle:

- Transaction creation and updates.
- Budget management.
- Account transfers.
- Data validation.
- Import processing.
- Financial aggregation.
- Authorisation.

Do not rely solely on frontend validation.

---

## 11. Database Design

The initial database should support the following entities.

### 11.1 Users / Profiles

```text
profiles
--------
id
display_name
preferred_currency
created_at
updated_at
```

The profile ID should reference the authenticated Supabase user.

### 11.2 Accounts

```text
accounts
--------
id
user_id
name
account_type
currency
opening_balance_minor
opening_balance_date
is_archived
created_at
updated_at
```

### 11.3 Categories

```text
categories
----------
id
user_id
name
category_type
parent_category_id
icon
colour
is_archived
created_at
updated_at
```

### 11.4 Transactions

```text
transactions
------------
id
user_id
account_id
category_id
transaction_type
amount_minor
currency
transaction_date
merchant
notes
transfer_group_id
recurring_rule_id
created_at
updated_at
```

Transaction types:

- income
- expense
- transfer

Transfers should use paired account entries or another carefully designed atomic transfer model.

### 11.5 Budgets

```text
budgets
-------
id
user_id
category_id
budget_month
amount_minor
currency
created_at
updated_at
```

### 11.6 Recurring Rules

```text
recurring_rules
---------------
id
user_id
transaction_type
account_id
category_id
amount_minor
currency
frequency
start_date
next_run_date
end_date
is_active
created_at
updated_at
```

### 11.7 Savings Goals (Future)

```text
savings_goals
-------------
id
user_id
name
target_amount_minor
current_amount_minor
currency
target_date
created_at
updated_at
```

The savings goal model will need to distinguish actual contributions from manually entered progress before implementation.

### 11.8 Database Requirements

- Use UUID primary keys.
- Define appropriate foreign keys.
- Index frequently queried columns.
- Enforce user ownership.
- Prevent invalid monetary values.
- Use appropriate unique constraints.
- Use database transactions for multi-record operations.
- Support future schema migrations.

---

## 12. Financial Calculation Rules

Financial accuracy is a core requirement.

### 12.1 Monetary Storage

Do not use JavaScript floating-point arithmetic for financial calculations.

For SGD, amounts may be stored as integer cents.

Example:

```text
S$12.50 = 1250 cents
S$100.00 = 10000 cents
```

Alternatively, use exact decimal arithmetic where appropriate.

### 12.2 Income

Income includes confirmed money received from external sources.

Internal transfers should not count as income.

### 12.3 Expenses

Expenses represent actual spending.

Credit card purchases should count as expenses when the purchase occurs.

### 12.4 Transfers

Moving money between personal accounts must not increase income or expenses.

Example:

```text
Transfer S$500

Bank Account A: -S$500
Bank Account B: +S$500

Income impact: S$0
Expense impact: S$0
```

### 12.5 Credit Card Payments

Repaying a credit card should reduce the bank balance and credit card liability.

It must not count as a second expense.

### 12.6 Budget Calculations

```text
Budget Remaining = Budget Limit - Eligible Expenses
```

Refunds, reversals and adjustments should be handled consistently.

### 12.7 Savings Rate

```text
Potential Savings Rate =
(Income - Expenses) / Income × 100
```

This represents a simplified cash-flow indicator and should not automatically be described as actual savings.

### 12.8 Account Balances

```text
Current Balance =
Opening Balance + Net Account Movements
```

Account balances must consider account type, transaction direction and liabilities.

### 12.9 Date and Time

- Store timestamps consistently.
- Use the user's selected time zone for reporting.
- Default to `Asia/Singapore` for the initial release.
- Avoid changing transaction dates because of UTC conversions.

---

## 13. Security and Privacy

Pockie will handle sensitive financial information.

Security must be considered from the beginning.

### 13.1 Authentication

- [ ] Secure login.
- [ ] Secure logout.
- [ ] Session management.
- [ ] Password reset.
- [ ] Email verification where appropriate.
- [ ] Optional multi-factor authentication.

### 13.2 Authorisation

- [ ] Enforce row-level security.
- [ ] Restrict access to user-owned records.
- [ ] Validate ownership of referenced accounts and categories.
- [ ] Prevent cross-user data access.
- [ ] Test unauthorised access scenarios.

### 13.3 Data Protection

- [ ] Use HTTPS.
- [ ] Protect environment variables.
- [ ] Never expose service-role credentials to browsers.
- [ ] Avoid logging sensitive financial information.
- [ ] Implement secure data export.
- [ ] Provide account deletion functionality.
- [ ] Establish backup and recovery procedures.

### 13.4 Development Safety

- Use fictional data during development.
- Do not commit credentials.
- Do not upload real bank statements to AI tools.
- Review database migrations before execution.
- Keep production and development environments separate.

### 13.5 Backup and Recovery

- Define backup frequency.
- Test restoration procedures.
- Document recovery steps.
- Confirm provider-specific backup availability.
- Maintain data export functionality.

---

## 14. AI-Assisted Development

Pockie will be developed using an AI-assisted workflow.

AI tools may help with:

- Requirements analysis.
- UI generation.
- Code generation.
- Database design.
- Test generation.
- Refactoring.
- Debugging.
- Documentation.

### 14.1 Recommended AI Tools

| Tool | Purpose |
|---|---|
| ChatGPT | Planning, requirements and review |
| Cursor | AI-assisted coding |
| v0 | UI generation |
| GitHub Copilot | Optional coding assistance |
| GitHub | Code review and version control |

Not all tools are required.

### 14.2 Development Workflow

```text
Define Feature
      |
      v
Write Requirements
      |
      v
Generate UI / Code
      |
      v
Review Changes
      |
      v
Run Tests
      |
      v
Fix Issues
      |
      v
Create Pull Request
      |
      v
Review and Merge
```

### 14.3 AI Coding Guidelines

AI coding assistants should:

1. Read this README before implementation.
2. Follow the Pockie product vision.
3. Prioritise simplicity and usability.
4. Implement one feature at a time.
5. Use TypeScript.
6. Follow the selected technology stack.
7. Use British English.
8. Avoid unnecessary dependencies.
9. Write maintainable, reusable code.
10. Validate inputs on the server.
11. Enforce database security.
12. Use exact monetary calculations.
13. Include tests for financial logic.
14. Explain significant code changes.
15. Avoid modifying production data without approval.
16. Never expose credentials.
17. Never use real financial information as test data.

### 14.4 Recommended AI Prompt Format

When requesting implementation, provide:

- Feature name.
- Purpose.
- Functional requirements.
- UI requirements.
- Validation rules.
- Financial calculation rules.
- Security requirements.
- Acceptance criteria.
- Testing expectations.

Example:

```text
Read README.md before starting.

Implement the Quick Add Expense feature for Pockie.

Requirements:
- Mobile-first interface.
- Amount and category required.
- Date defaults to today.
- Remember last-used account.
- Optional merchant and notes.
- Validate inputs on the server.
- Store money using integer minor units.
- Enforce Supabase row-level security.
- Update dashboard totals after saving.

Use TypeScript and existing UI components.

Include tests and explain the changed files.

Do not deploy or modify production data.
```

### 14.5 Human Review Requirements

AI-generated code must be reviewed before merging.

Pay particular attention to:

- Financial calculations.
- Database migrations.
- Authentication.
- Authorisation.
- Sensitive data handling.
- Destructive operations.
- External API integrations.

---

## 15. Development Roadmap

The roadmap is an initial planning estimate and may change.

### Phase 1 — Foundation

**Estimated duration:** Weeks 1–2

- [ ] Create GitHub repository.
- [ ] Set up Next.js and TypeScript.
- [ ] Configure Tailwind CSS.
- [ ] Install shadcn/ui.
- [ ] Configure Supabase.
- [ ] Create database migrations.
- [ ] Implement authentication.
- [ ] Establish basic application layout.

### Phase 2 — Core Tracking

**Estimated duration:** Weeks 3–6

- [ ] Build Home dashboard.
- [ ] Build Quick Add Expense.
- [ ] Build income tracking.
- [ ] Build transaction management.
- [ ] Build account management.
- [ ] Implement transfers.
- [ ] Implement categories.
- [ ] Add financial calculation tests.

### Phase 3 — Budgets and Reports

**Estimated duration:** Weeks 7–9

- [ ] Build monthly budgets.
- [ ] Build category budgets.
- [ ] Display budget progress.
- [ ] Add spending charts.
- [ ] Add monthly reports.
- [ ] Add recurring transactions.
- [ ] Add CSV import/export.

### Phase 4 — Quality and Release

**Estimated duration:** Weeks 10–12

- [ ] Complete responsive layouts.
- [ ] Improve accessibility.
- [ ] Run automated tests.
- [ ] Test security policies.
- [ ] Verify financial calculations.
- [ ] Test backup and recovery.
- [ ] Configure deployment.
- [ ] Release private MVP.

### Phase 5 — Advanced Features

**After MVP release**

- [ ] Smart categorisation.
- [ ] Savings goals.
- [ ] Receipt scanning.
- [ ] AI financial insights.
- [ ] Cash flow forecasting.
- [ ] Subscription tracking.
- [ ] Additional financial reports.

---

## 16. Testing and Quality Assurance

### 16.1 Unit Tests

- [ ] Monetary calculations.
- [ ] Budget calculations.
- [ ] Income calculations.
- [ ] Expense calculations.
- [ ] Transfer calculations.
- [ ] Credit card repayment logic.
- [ ] Date handling.
- [ ] Validation rules.

### 16.2 Integration Tests

- [ ] Create transactions.
- [ ] Update transactions.
- [ ] Delete transactions.
- [ ] Manage accounts.
- [ ] Manage budgets.
- [ ] Import transactions.
- [ ] Verify user ownership restrictions.

### 16.3 End-to-End Tests

- [ ] User login.
- [ ] Add expense.
- [ ] Add income.
- [ ] Create budget.
- [ ] Transfer between accounts.
- [ ] View updated dashboard.
- [ ] Export transactions.
- [ ] Log out.

### 16.4 UI Testing

- [ ] Desktop layout.
- [ ] Tablet layout.
- [ ] Mobile layout.
- [ ] Keyboard navigation.
- [ ] Screen reader labels.
- [ ] Empty states.
- [ ] Loading states.
- [ ] Error handling.
- [ ] Colour contrast.

### 16.5 Release Criteria

The MVP is ready for release when:

- Core transaction workflows work reliably.
- Financial calculations pass tests.
- User data is protected.
- No critical security issues remain.
- Mobile layouts are usable.
- Data can be exported.
- Backup and recovery have been verified.
- Deployment configuration is documented.

---

## 17. Estimated Development Costs

The following are approximate planning estimates, not fixed provider quotations.

### 17.1 Initial Technology Costs

| Service | Estimated Cost |
|---|---|
| Next.js | Free |
| React | Free |
| TypeScript | Free |
| Tailwind CSS | Free |
| shadcn/ui | Free |
| GitHub | Free tier available |
| Supabase | Free tier available |
| Vercel | Free tier available for eligible personal use |
| Custom domain | Approximately S$15–35/year |
| AI coding tools | Free or paid, depending on usage |

Provider pricing and free-tier conditions should be verified before subscribing.

### 17.2 Estimated Monthly Running Costs

| Project Stage | Estimated Monthly Cost |
|---|---|
| Personal MVP | S$0–10 |
| Advanced personal application | S$15–80 |
| Small public application | S$70–200+ |

Costs depend on:

- Hosting usage.
- Database usage.
- Storage.
- AI API usage.
- Email services.
- Third-party integrations.
- Number of users.

### 17.3 Development Effort

| Activity | Estimated Hours |
|---|---:|
| Planning and design | 15–30 |
| Transactions and accounts | 25–45 |
| Budgets and dashboard | 20–35 |
| Reports | 15–25 |
| Security and testing | 20–40 |
| Deployment and refinement | 10–20 |
| **Total MVP** | **105–195** |

The estimate assumes some web development familiarity and AI assistance.

Actual effort may vary significantly.

---

## 18. Future Enhancements

Pockie should evolve based on real usage rather than adding features solely for completeness.

### Short-Term

- Improve transaction entry speed.
- Add transaction templates.
- Improve recurring transaction handling.
- Add CSV import.
- Add budget alerts.
- Improve mobile usability.

### Medium-Term

- Smart categorisation.
- Savings goals.
- Receipt scanning.
- Subscription management.
- Cash flow forecasting.
- PWA installation.

### Long-Term

- AI financial assistant.
- Bank integrations.
- Shared household budgets.
- Net worth tracking.
- Multi-currency support.
- Advanced financial planning.

### Feature Prioritisation Criteria

Before introducing a feature, evaluate:

1. Does it solve a real user problem?
2. Does it make money management easier?
3. Does it reduce manual effort?
4. Is it simple to understand?
5. Can it be implemented securely?
6. Does it fit Pockie's product vision?

---

## 19. Project Structure

The following structure is proposed and may evolve during implementation.

```text
pockie/
│
├── README.md
├── AGENTS.md
├── package.json
├── .env.example
├── .gitignore
│
├── public/
│   └── assets/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx
│   │   │   ├── transactions/
│   │   │   ├── budgets/
│   │   │   └── settings/
│   │   │
│   │   ├── api/
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   └── layout/
│   │
│   ├── features/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   ├── budgets/
│   │   └── reports/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── money/
│   │   ├── validation/
│   │   └── utils/
│   │
│   ├── hooks/
│   └── types/
│
├── supabase/
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
    ├── architecture.md
    ├── database.md
    ├── decisions/
    └── development-guide.md
```

### Project Organisation Guidelines

- Keep components small and reusable.
- Group related business logic by feature.
- Avoid duplicating financial calculations.
- Keep database access separate from UI presentation.
- Use clear and consistent naming.
- Document significant architectural decisions.

---

## 20. Project Decisions and Change Log

### 20.1 Key Project Decisions

| Decision | Selected Approach | Reason |
|---|---|---|
| Application name | Pockie | Short, friendly and memorable |
| Product direction | Simple personal finance management | Make tracking effortless |
| Development approach | AI-assisted | Reduce repetitive development effort |
| Frontend | Next.js + React | Mature full-stack ecosystem |
| Language | TypeScript | Maintainability and type safety |
| Styling | Tailwind CSS | Responsive development |
| Database | Supabase PostgreSQL | Structured financial data |
| Hosting | Vercel | Simple deployment |
| Default currency | SGD | Initial Singapore-focused usage |
| UI language | British English | Consistent wording |
| Initial audience | Single user | Keep MVP scope manageable |
| Navigation | Four main sections | Reduce interface complexity |
| Priority feature | Quick Add Expense | Encourage daily usage |

### 20.2 Change Log

#### v0.1.0 — Initial Planning

- Defined the personal finance application concept.
- Established MVP features.
- Identified advanced functionality.
- Selected the proposed technology stack.
- Defined the initial database architecture.
- Established security and testing requirements.
- Created the development roadmap.
- Added preliminary cost estimates.

#### v0.1.1 — Pockie Product Identity

- Selected the application name **Pockie**.
- Established the tagline **Your friendly money buddy.**
- Defined a friendly and minimal design direction.
- Prioritised effortless spending tracking.
- Added Quick Add Expense as a core interaction.
- Simplified primary navigation.
- Established mobile-first design principles.
- Added AI-assisted development guidelines.

### 20.3 Current Project Status

| Area | Status |
|---|---|
| Project concept | Defined |
| Application name | Selected |
| Product vision | Defined |
| MVP requirements | Planned |
| Technology stack | Proposed |
| Database architecture | Proposed |
| UI design | Not started |
| Development | Not started |
| Testing | Not started |
| Deployment | Not started |

---

## Project Guiding Principle

> **Pockie should make managing money feel simple, not like another chore.**

Every design and development decision should support this principle.

---

**Pockie — Your friendly money buddy.**
