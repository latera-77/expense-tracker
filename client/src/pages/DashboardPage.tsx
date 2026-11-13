import { useAuth } from "../context/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();

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

      <main className="mx-auto max-w-3xl p-4">
        <p>You're logged in. Expenses are coming next.</p>
      </main>
    </div>
  );
}