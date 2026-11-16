import type { ExpenseFilters } from "../types";

type Props = {
  filters: ExpenseFilters;
  categories: string[];
  onChange: (filters: ExpenseFilters) => void;
};

export default function ExpenseFiltersBar({ filters, categories, onChange }: Props) {
  // Keep the selected category in the list even if its expenses were all deleted
  const options =
    !filters.category || categories.includes(filters.category)
      ? categories
      : [filters.category, ...categories];

  const hasFilters = filters.month !== "" || filters.category !== "";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded bg-white p-4 shadow">
      <label className="flex items-center gap-2 text-sm">
        Month
        <input
          type="month"
          value={filters.month}
          onChange={(e) => onChange({ ...filters, month: e.target.value })}
          className="rounded border p-1"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        Category
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="rounded border p-1"
        >
          <option value="">All</option>
          {options.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button
          onClick={() => onChange({ month: "", category: "" })}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}