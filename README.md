# Expense Tracker

Full-stack expense tracker built with React, Express, TypeScript, PostgreSQL, Prisma, and Tailwind CSS.


## API (so far)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Create a user (email, password min 8 chars) |
| POST | /api/auth/login | No | Returns a JWT and the user |
| GET | /api/auth/me | Bearer token | Returns the logged-in user |

## Setup

1. `cd server && npm install`
2. Copy `.env.example` to `.env` and fill in the values
3. `npx prisma migrate dev`
4. `npm run dev`
