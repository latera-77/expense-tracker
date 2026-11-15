import { useState, type FormEvent } from "react";
import { ApiError } from "../lib/api";
import { createExpense, updateExpense } from "../lib/expenses";
import type { Expense } from "../types";

const today = () => new Date().toLocaleDateString("en-CA");

type Props = {
  expense?: Expense | null; // present = edit mode, absent = add mode
  onSaved: (expense: Expense) => void;
  onCancel?: () => void;
};

export default function ExpenseForm({ expense, onSaved, onCancel }: Props) {
  const [amount, setAmount] = useState(expense?.amount ?? "");
  const [category, setCategory] = useState(expense?.category ?? "");
  const [note, setNote] = useState(expense?.note ?? "");
  const [date, setDate] = useState(() =>
    expense ? expense.date.slice(0, 10) : today()
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const input = {
        amount: Number(amount),
        category,
        note: note.trim(),
        date,
      };

      const saved = expense
        ? await updateExpense(expense.id, input)
        : await createExpense(input);

      onSaved(saved);

      if (!expense) {
        setAmount("");
        setCategory("");
        setNote("");
        setDate(today());
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded bg-white p-4 shadow">
      <h2 className="font-semibold">{expense ? "Edit expense" : "Add expense"}</h2>

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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : expense ? "Save changes" : "Add expense"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}