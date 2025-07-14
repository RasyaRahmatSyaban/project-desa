import { FaTrash, FaExchangeAlt } from "react-icons/fa";

export default function TableAdmin({ columns, data, onDelete, onTransfer }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 overflow-x-auto">
      <table className="min-w-full text-sm text-gray-600">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 text-left font-medium text-gray-600 ${
                  idx === 0 ? "rounded-tl-lg" : ""
                } ${idx === columns.length - 1 ? "rounded-tr-lg" : ""}`}
              >
                {col}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium text-gray-600 rounded-tr-lg">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-8 text-center text-gray-500"
              >
                Tidak ada data admin.
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3 text-gray-800">
                    {item[col]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {onTransfer && item.role !== "superadmin" && (
                      <button
                        onClick={() => onTransfer(idx)}
                        className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        title="Jadikan Superadmin"
                      >
                        <FaExchangeAlt className="text-blue-600" />
                      </button>
                    )}
                    {onDelete && item.role !== "superadmin" && (
                      <button
                        onClick={() => onDelete(idx)}
                        className="p-1.5 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        title="Hapus"
                      >
                        <FaTrash className="text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
