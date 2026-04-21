import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

export const RevenueChart = ({
  data,
  loading,
}: {
  data: any[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Doanh thu & Lợi nhuận
        </h3>
        <div className="h-[420px] flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-slate-50/80">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-500">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-5">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Doanh thu & Lợi nhuận
      </h3>

      <ResponsiveContainer height={500}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
        >
          {/* Grid */}
          <CartesianGrid strokeDasharray="4 3" />

          {/* X */}
          <XAxis dataKey="label" />

          {/* Y */}
          <YAxis
            tickFormatter={(value) => `${(value / 1000).toLocaleString()}`}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value, name) => {
              if (name === "revenue") {
                return [`${Number(value).toLocaleString()} đ`, "Doanh thu"];
              }
              if (name === "profit") {
                return [`${Number(value).toLocaleString()} đ`, "Lợi nhuận"];
              }
              return [value, name];
            }}
          />

          {/* Legend */}
          <Legend />

          {/* Bar: Doanh thu */}
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            name="Doanh thu"
            barSize={45}
          />

          {/* Line: Lợi nhuận */}
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#37e505"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            name="Lợi nhuận"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
