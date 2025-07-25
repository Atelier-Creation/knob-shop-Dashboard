
export default function ResponsiveTableCard({
  data = [],
  columns = [],
  renderRow,
  renderCard,
  tableMinWidth = "700px",
  cardActions = true,
}) {
  return (
    <div className="rounded border-0 md:border border-gray-300 overflow-hidden">
      <div className="w-full overflow-x-auto">
        {/* Table view for md and above */}
        <table className={`min-w-[${tableMinWidth}] bg-white w-full text-sm hidden md:table`}>
          <thead className="bg-gray-100 text-left text-gray-600">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="p-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Card view for mobile */}
        <div className="space-y-4 md:hidden">
          {data.map((item, i) => (
            <div
              key={i}
              className="border border-gray-300 rounded-md p-4 shadow-sm bg-white"
            >
              {renderCard(item, i, cardActions)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
