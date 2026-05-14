import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse } from "../types/api.response";
import type { GroupBy, RevenueParams, TodayStatistics } from "../types/dashboard.type";

export const getTodayStatistics = async () => {
  const res = await axiosClient.get<ApiResponse<TodayStatistics>>("/v1/dashboard/today");
  return res.data;
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

export const profitStatistics = async (params: RevenueParams) => {
  const { startDate, endDate, groupBy } = params;

  const { data, error } = await supabase.rpc("get_profit_stats", {
    start_date: startDate,
    end_date: endDate,
    group_by: groupBy,
  });

  if (error) throw error;

  return data;
};

export const getTopMedicines = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase.rpc("get_top_medicines", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) throw error;
  return data;
}
