# Expense Tracker

Full-stack expense tracker. Register, log in, and manage your own expenses with filters and a spending summary.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express 5, TypeScript, Zod
- **Database:** PostgreSQL (Neon) with Prisma 7
- **Auth:** bcrypt password hashing and JWT

## Features

- Register and log in; the session survives a page refresh
- Add, edit and delete expenses
- Filter by month and category
- Total of the expenses shown
- Spending by category chart
- Automatic logout when the session expires
- Each user can only see and change their own data

## Project structure

```
expense-tracker/
├── client/                 React app
│   └── src/
│       ├── components/     ExpenseForm, ExpenseList, ExpenseFilters, SummaryChart, ProtectedRoute
│       ├── context/        auth context, provider and useAuth hook
│       ├── lib/            api helper, expense API calls, formatters
│       └── pages/          LoginPage, RegisterPage, DashboardPage
└── server/                 Express API
    ├── prisma/             schema and migrations
    └── src/
        ├── lib/            prisma client, JWT helpers
        ├── middleware/     requireAuth
        └── routes/         auth and expense routes
```

## Setup

### Server

```bash
cd server
npm install
cp .env.example .env       # then fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npx prisma generate
npm run dev                # http://localhost:5000
```

### Client

```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

The client calls `http://localhost:5000` by default. To use a different API address, set `VITE_API_URL` in `client/.env`.

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