import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { ApiError } from "../lib/api";
import { getExpenses } from "../lib/expenses";
import type { Expense } from "../types";
import ExpenseList from "../components/ExpenseList";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getExpenses()
      .then((data) => {
        if (!cancelled) setExpenses(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load expenses");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        {loading && <p>Loading...</p>}
        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
        )}
        {!loading && !error && <ExpenseList expenses={expenses} />}
      </main>
    </div>
  );
}