import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const skeletonRows = ["row-1", "row-2", "row-3", "row-4", "row-5"];
const PERCENT_COLORS = ["#38bdf8", "#f97316", "#34d399", "#a855f7", "#f43f5e"];

export default function TopMedicines({
  data,
  loading,
}: {
  readonly data: any[];
  readonly loading: boolean;
}) {
  const chartData = data?.slice(0, 5).map((item, index) => ({
    name: item.name,
    value: item.value ?? 0,
    fill: PERCENT_COLORS[index % PERCENT_COLORS.length],
  })) ?? [];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-5">
        <h2 className="text-lg font-bold text-slate-800 mb-6">
          Top 5 loại thuốc bán chạy
        </h2>

        <div className="space-y-4">
          {skeletonRows.map((row) => (
            <div key={row} className="space-y-2">
              <div className="h-4 rounded-full bg-slate-200 animate-pulse w-3/5" />
              <div className="h-3 rounded-full bg-slate-200 animate-pulse w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Top 5 loại thuốc bán chạy</h2>
          <p className="mt-1 text-sm text-slate-500">
            Thống kê thuốc được sử dụng nhiều nhất theo đơn thuốc gần đây.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          Tổng: {data.length} loại thuốc
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_0.9fr] items-start">
        <div className="space-y-5">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.name} className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-700">
                <span>{item.name}</span>
                <span>{item.value.toLocaleString()} đơn vị</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percent ?? 0}%`,
                    backgroundColor: PERCENT_COLORS[index % PERCENT_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Phân bố đơn thuốc</span>
            <span>{chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} tổng</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={48}
                  paddingAngle={4}
                />
                <Tooltip formatter={(value) => `${Number(value ?? 0).toLocaleString()} đơn vị`} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  wrapperStyle={{ paddingLeft: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
