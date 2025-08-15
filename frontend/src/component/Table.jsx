import { useState } from "react";

const Table = ({
  colsHeader = [],
  data = [],
  itemsPerPageOptions = [5, 10, 20],
  currentPage: externalPage,
  onPageChange,
  itemsPerPage: externalItemsPerPage,
  onItemsPerPageChange,
}) => {
  // Internal state (used only if external props not given)
  const [internalPage, setInternalPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(
    itemsPerPageOptions[0]
  );

  const currentPage = externalPage ?? internalPage;
  const itemsPerPage = externalItemsPerPage ?? internalItemsPerPage;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    if (onPageChange) onPageChange(page);
    else setInternalPage(page);
  };

  const changeItemsPerPage = (value) => {
    if (onItemsPerPageChange) onItemsPerPageChange(value);
    else setInternalItemsPerPage(value);
    changePage(1);
  };

  return (
    <div className=" py-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              {colsHeader.map((col, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {col?.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    {startIndex + rowIndex + 1}
                  </td>
                  {colsHeader.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-3 text-sm text-gray-700"
                    >
                      {row[col] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={colsHeader.length + 1}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-end mt-4 gap-4">
          {/* Items Per Page */}
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={itemsPerPage}
              onChange={(e) => changeItemsPerPage(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 border border-gray-300 rounded text-sm cursor-pointer ${
                  currentPage === i + 1 ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
