const skeletonRows = ["row-1", "row-2", "row-3", "row-4", "row-5"];

export default function TopMedicines({
  data,
  loading,
}: {
  readonly data: any[];
  readonly loading: boolean;
}) {
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
      <h2 className="text-lg font-bold text-slate-800 mb-6">
        Top 5 loại thuốc bán chạy
      </h2>

      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{item.name}</span>
              <span>{item.value.toLocaleString()} units</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-orange-400 h-full rounded-full transition-all"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
