import { useState, type FormEvent } from "react";
import { ApiError } from "../lib/api";
import { createExpense } from "../lib/expenses";
import type { Expense } from "../types";

// Today's date in the user's local timezone, as YYYY-MM-DD
const today = () => new Date().toLocaleDateString("en-CA");

type Props = {
  onCreated: (expense: Expense) => void;
};

export default function ExpenseForm({ onCreated }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const expense = await createExpense({
        amount: Number(amount),
        category,
        note: note.trim() || undefined,
        date,
      });
      onCreated(expense);
      setAmount("");
      setCategory("");
      setNote("");
      setDate(today());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded bg-white p-4 shadow">
      <h2 className="font-semibold">Add expense</h2>

      {error && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="rounded border p-2"
        />
        <input
          type="text"
          required
          maxLength={50}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g. Food)"
          className="rounded border p-2"
        />
        <input
          type="text"
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="rounded border p-2"
        />
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add expense"}
      </button>
    </form>
  );
}