import type { Expense } from "../types";
import { formatAmount, formatDate } from "../lib/format";

type Props = {
  expenses: Expense[];
};

export default function ExpenseList({ expenses }: Props) {
  if (expenses.length === 0) {
    return (
      <p className="rounded bg-white p-6 text-center text-gray-500 shadow">
        No expenses yet.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded bg-white shadow">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{expense.category}</p>
            <p className="text-sm text-gray-500">
              {formatDate(expense.date)}
              {expense.note ? ` · ${expense.note}` : ""}
            </p>
          </div>
          <span className="font-semibold">{formatAmount(expense.amount)}</span>
        </li>
      ))}
    </ul>
  );
}