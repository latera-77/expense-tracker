import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { ApiError } from "../lib/api";
import { deleteExpense, getExpenses, getSummary } from "../lib/expenses";
import type { CategoryTotal, Expense, ExpenseFilters } from "../types";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseFiltersBar from "../components/ExpenseFilters";
import SummaryChart from "../components/SummaryChart";

const NO_FILTERS: ExpenseFilters = { month: "", category: "" };

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<CategoryTotal[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>(NO_FILTERS);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [refresh, setRefresh] = useState(0); // bump this to reload from the server
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  // Reload the list whenever the filters change or something was saved/deleted
  useEffect(() => {
    let cancelled = false;

    getExpenses(filters)
      .then((data) => {
        if (!cancelled) {
          setExpenses(data);
          setLoadError("");
        }
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
  }, [filters, refresh]);

  // Category totals: used for the dropdown now and the chart next
  useEffect(() => {
    let cancelled = false;

    getSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        // not critical: the dropdown and chart just stay empty
      });

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  function handleFilterChange(next: ExpenseFilters) {
    setLoading(true);
    setLoadError("");
    setFilters(next);
  }

  function handleSaved() {
    setEditing(null);
    setRefresh((r) => r + 1);
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
      if (editing?.id === id) setEditing(null);
      setRefresh((r) => r + 1);
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

                <ExpenseForm
          key={editing?.id ?? "new"}
          expense={editing}
          onSaved={handleSaved}
          onCancel={editing ? () => setEditing(null) : undefined}
        />

        <SummaryChart summary={summary} />

        <ExpenseFiltersBar
          filters={filters}
          categories={summary.map((s) => s.category)}
          onChange={handleFilterChange}
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