"use client";

export interface TabelColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  render?: (item: T, index?: number) => React.ReactNode;
}

export interface TabelProps<T extends Record<string, unknown>> {
  data: T[];
  columns: TabelColumn<T>[];
  className?: string;
  emptyMessage?: string;
}

const getValue = <T extends Record<string, unknown>>(
  item: T,
  accessor: keyof T | ((item: T) => React.ReactNode)
): unknown => {
  if (typeof accessor === "function") {
    return accessor(item);
  }
  return item[accessor];
};

export function Tabel<T extends Record<string, unknown>>({
  data,
  columns,
  className = "",
  emptyMessage = "Tidak ada data yang tersedia",
}: TabelProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>
        <thead className="bg-indigo-700 text-white border-b-4 border-neutral-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-4 text-left font-black ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="border-b-4 border-neutral-700 hover:bg-neutral-400 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 font-bold text-black ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(item, index)
                      : (getValue(item, column.accessor) as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-black"
              >
                <p className="text-lg font-bold">{emptyMessage}</p>
                <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
