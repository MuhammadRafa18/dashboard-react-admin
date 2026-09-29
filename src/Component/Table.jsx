import { useMemo, useState } from "react";

export const Table = ({ colums, Data, filters, page, setPage }) => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = Data?.data ?? [];

    if (activeFilter !== "all") {
      result = result.filter((item) => item.category.type === activeFilter);
    }

    if (search) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }

    return result;
  }, [Data, search, activeFilter]);

  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
      {filters?.length > 0 && (
        <div className="flex items-center gap-2 px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex-wrap">
          <input
            type="text"
            placeholder="title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-36 text-sm px-3 py-1.5 rounded-lg  border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {["all", ...filters].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs border transition-all duration-150
                ${
                  activeFilter === f
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
            >
              {f === "all" ? "Semua" : f}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} data
          </span>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              {colums.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 animate-fadeIn"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {colums.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 align-top text-center text-gray-700 dark:text-gray-300 ${col.className || ""}`}
                    >
                      {col.render ? col.render(item, index) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colums.length}
                  className="py-12 text-center text-gray-400"
                >
                  <div className="text-3xl mb-2">○</div>
                  <div className="text-sm">Tidak ada data ditemukan</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {setPage && Data?.meta && Data?.links && <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!Data?.links?.prev}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 transition enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm">
          Halaman {Data?.meta?.current_page} dari {Data?.meta?.last_page}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!Data?.links?.next}
          className="px-4 py-2 rounded-lg border hover:opacity-35 cursor-pointer"
        >
          Next
        </button>
      </div>}
    </div>
  );
};
