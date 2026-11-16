import type { CategoryTotal } from "../types";
import { formatAmount } from "../lib/format";

type Props = {
  summary: CategoryTotal[];
};

export default function SummaryChart({ summary }: Props) {
  if (summary.length === 0) return null;

  const rows = summary.map((s) => ({
    category: s.category,
    total: Number(s.total ?? 0),
  }));
  const max = Math.max(...rows.map((r) => r.total));

  return (
    <section className="space-y-3 rounded bg-white p-4 shadow">
      <h2 className="font-semibold">Spending by category (all time)</h2>

      {rows.map((row) => (
        <div key={row.category}>
          <div className="mb-1 flex justify-between text-sm">
            <span>{row.category}</span>
            <span className="font-medium">{formatAmount(row.total)}</span>
          </div>
          <div className="h-3 rounded bg-gray-100">
            <div
              className="h-3 rounded bg-blue-600"
              style={{ width: `${max > 0 ? (row.total / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}