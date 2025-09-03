import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const StatCard = ({ title, value, data, growth, isNegative }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[13px] text-gray-500 font-medium">{title}</p>
        <h2 className="text-[22px] font-semibold text-gray-800 mt-1">{value}</h2>
      </div>
      <a href="#" className="text-xs text-blue-600 font-medium mt-1">
        View all
      </a>
    </div>

    {/* Gradient area chart */}
    <div className="h-24 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Tooltip contentStyle={{ display: "none" }} />
          <XAxis dataKey="name" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            fill="url(#colorBlue)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div
      className={`mt-3 text-xs font-medium flex items-center ${
        isNegative ? "text-red-500" : "text-green-600"
      }`}
    >
      {isNegative ? (
        <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpRight className="w-3 h-3" />
      )}
      <span className="ml-1">{growth}%</span>
    </div>
  </div>
);

export default StatCard;