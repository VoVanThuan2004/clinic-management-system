import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Doanh thu</h3>
        <div className="h-[420px] flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-slate-50/80">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-500">Đang tải dữ liệu doanh thu...</span>
          <div className="w-full max-w-2xl space-y-3 px-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-4 rounded-full bg-slate-200/90 animate-pulse"
                style={{ width: `${90 - idx * 12}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-5">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Doanh thu</h3>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="4 3" />

          {/* Trục X */}
          <XAxis dataKey="label" />

          {/* Trục Y */}
          <YAxis />

          {/* Tooltip */}
          <Tooltip
            formatter={(value) => `${Number(value).toLocaleString()} đ`}
          />

          {/* Bar */}
          <Bar
            dataKey="revenue"
            fill="#3b82f6" 
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
