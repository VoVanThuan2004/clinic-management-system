import { supabase } from "../lib/supabase";
import type { GroupBy, RevenueParams } from "../types/dashboard.type";

export const getTodayStatistics = async () => {
  const { data, error } = await supabase.rpc("get_daily_stats");

  if (error) throw error;

  if (data && data.length > 0) {
    return {
      totalRevenue: data[0].total_revenue,
      totalPatients: data[0].total_patients,
    };
  }

  return { totalRevenue: 0, totalPatients: 0 };
};

export const revenueStatistics = async (params: RevenueParams) => {
    const { startDate, endDate, groupBy } = params;

    const groupMap: Record<GroupBy, string> = {
        week: "week",
        month: "month",
        quarter: "quarter",
        year: "year"
    };

    const trunc = groupMap[groupBy];

    const { data, error } = await supabase.rpc("get_revenue_stats", {
        start_date: startDate,
        end_date: endDate,
        group_by: trunc
    });

    if (error) throw error;

    return data;
}

export const getTopMedicines = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase.rpc("get_top_medicines", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) throw error;
  return data;
}
