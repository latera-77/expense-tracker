# Expense Tracker

Full-stack expense tracker built with React, Express, TypeScript, PostgreSQL, Prisma, and Tailwind CSS.


## API

All `/api/expenses` routes require an `Authorization: Bearer <token>` header.

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Create a user (email, password min 8 chars) |
| POST | /api/auth/login | No | Returns a JWT and the user |
| GET | /api/auth/me | Yes | Returns the logged-in user |

### Expenses

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/expenses | Create an expense (`amount`, `category`, optional `note`, `date`) |
| GET | /api/expenses | List your expenses, newest first |
| GET | /api/expenses?month=2026-11 | Only expenses from that month |
| GET | /api/expenses?category=Food | Only expenses in that category |
| GET | /api/expenses/summary | Total spent per category, highest first |
| GET | /api/expenses/:id | Get one expense |
| PUT | /api/expenses/:id | Update any of the expense fields |
| DELETE | /api/expenses/:id | Delete an expense |

Users can only see and change their own expenses. Other users' expenses return 404.
## Setup

1. `cd server && npm install`
2. Copy `.env.example` to `.env` and fill in the values
3. `npx prisma migrate dev`
4. `npm run dev`
