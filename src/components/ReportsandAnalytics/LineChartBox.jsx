import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const LineChartBox = ({ title, data, total }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm text-gray-700">{title}</h3>
      <a href="#" className="text-xs text-blue-600">View all</a>
    </div>
    <div className="text-2xl font-bold mb-1">{total}</div>
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default LineChartBox;
