export type User = {
  id: number;
  email: string;
  createdAt?: string;
};

export type Expense = {
  id: number;
  amount: string; // Prisma sends Decimals as strings, e.g. "12.50"
  category: string;
  note: string | null;
  date: string; // ISO date string
  createdAt: string;
  userId: number;
};

export type ExpenseInput = {
  amount: number;
  category: string;
  note?: string;
  date?: string;
};

export type ExpenseFilters = {
  month: string; // "" or "2026-11"
  category: string; // "" or an exact category name
};

export type CategoryTotal = {
  category: string;
  total: string | null; // Decimal as string
};