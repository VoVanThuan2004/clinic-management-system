import { Banknote, Users } from "lucide-react";
import { useTodayStatistic } from "../../hooks/dashboard/useTodayStatistic";
import { formatCurrency } from "../../utils/formatCurrency";
import { DatePicker, Select } from "antd";
import { useRevenueStatistics } from "../../hooks/dashboard/useRevenueStatistics";
import { useState } from "react";
import dayjs from "dayjs";
import { RevenueChart } from "./RevenueChart";
import { useTopMedicines } from "../../hooks/dashboard/useTopMedicines";
import TopMedicines from "./TopMedicines";

export const DashboardPage = () => {
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<any>([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);
  const [groupBy, setGroupBy] = useState<"year" | "quarter" | "month" | "week">(
    "month",
  );
  // Convert sang start date, end date
  const startDate = dateRange?.[0]?.format("YYYY-MM-DD");
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD");

  // Gọi hook api trả về thống kê hôm nay
  const { isLoading, stats } = useTodayStatistic();

  // Gọi hook api trả về thống kế doanh thu
  const { data, isLoading: isLoadingStats } = useRevenueStatistics({
    startDate,
    endDate,
    groupBy,
  });

  // Gọi hook api trả về top thuốc bán chạy
  const { data: topMedicinesData, isLoading: isLoadingTopMedicines } =
    useTopMedicines(startDate, endDate);

  const isAnyLoading = isLoading || isLoadingStats || isLoadingTopMedicines;

  return (
    <div className="px-5 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Tổng doanh thu hôm nay */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Tổng doanh thu hôm nay</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Banknote className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-3/4 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="h-8 w-1/2 rounded-full bg-slate-200/80 animate-pulse" />
            </div>
          ) : (
            <p className="text-2xl font-semibold text-gray-800">
              {formatCurrency(stats.totalRevenue)}
            </p>
          )}
        </div>

        {/* Card: Tổng bệnh nhân hôm nay */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Tổng bệnh nhân hôm nay</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-1/3 rounded-full bg-slate-200/80 animate-pulse" />
              <div className="h-8 w-1/4 rounded-full bg-slate-200/80 animate-pulse" />
            </div>
          ) : (
            <p className="text-2xl font-semibold text-gray-800">
              {stats.totalPatients}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mt-7">
        {/* Range Date */}
        <RangePicker
          className="w-full md:w-auto h-[45px]"
          placeholder={["Từ ngày", "Đến ngày"]}
          format="DD/MM/YYYY"
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          disabled={isAnyLoading}
        />

        {/* Group By */}
        <Select
          placeholder="Chọn kiểu thống kê"
          className="w-full md:w-[200px] h-[45px]"
          value={groupBy}
          onChange={(value) => setGroupBy(value)}
          options={[
            { value: "year", label: "Theo năm" },
            { value: "quarter", label: "Theo quý" },
            { value: "month", label: "Theo tháng" },
            { value: "week", label: "Theo tuần" },
          ]}
          disabled={isAnyLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart data={data} loading={isLoading || isLoadingStats} />
        <TopMedicines
          data={topMedicinesData}
          loading={isLoading || isLoadingTopMedicines}
        />
      </div>
    </div>
  );
};
