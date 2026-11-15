import { api } from "./api";
import type {
  CategoryTotal,
  Expense,
  ExpenseFilters,
  ExpenseInput,
} from "../types";

export function getExpenses(filters: ExpenseFilters = { month: "", category: "" }) {
  const params = new URLSearchParams();
  if (filters.month) params.set("month", filters.month);
  if (filters.category) params.set("category", filters.category);

  const query = params.toString();
  return api<Expense[]>(`/api/expenses${query ? `?${query}` : ""}`);
}

export const getSummary = () =>
  api<CategoryTotal[]>("/api/expenses/summary");

export const createExpense = (input: ExpenseInput) =>
  api<Expense>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateExpense = (id: number, input: ExpenseInput) =>
  api<Expense>(`/api/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteExpense = (id: number) =>
  api<void>(`/api/expenses/${id}`, { method: "DELETE" });