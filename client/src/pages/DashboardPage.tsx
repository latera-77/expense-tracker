import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { ApiError } from "../lib/api";
import { deleteExpense, getExpenses } from "../lib/expenses";
import type { Expense } from "../types";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";

function sortExpenses(list: Expense[]) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getExpenses()
      .then((data) => {
        if (!cancelled) setExpenses(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : "Could not load expenses");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Works for both new and edited expenses: drop any old copy, add the saved one
  function handleSaved(saved: Expense) {
    setExpenses((prev) =>
      sortExpenses([...prev.filter((e) => e.id !== saved.id), saved])
    );
    setEditing(null);
  }

  function handleEdit(expense: Expense) {
    setEditing(expense);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this expense?")) return;

    setActionError("");
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete expense");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Expense Tracker</h1>
          <div className="flex items-center gap-3 text-sm">
            <span>{user?.email}</span>
            <button
              onClick={logout}
              className="rounded bg-gray-900 px-3 py-1 text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 p-4">
        <ExpenseForm
          key={editing?.id ?? "new"}
          expense={editing}
          onSaved={handleSaved}
          onCancel={editing ? () => setEditing(null) : undefined}
        />

        {loading && <p>Loading...</p>}
        {loadError && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">{loadError}</p>
        )}
        {actionError && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">{actionError}</p>
        )}
        {!loading && !loadError && (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}