import { api } from "./api";
import type { Expense, ExpenseInput } from "../types";

export const getExpenses = () => api<Expense[]>("/api/expenses");

export const createExpense = (input: ExpenseInput) =>
  api<Expense>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const deleteExpense = (id: number) =>
  api<void>(`/api/expenses/${id}`, { method: "DELETE" });