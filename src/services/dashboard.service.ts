import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse } from "../types/api.response";
import type { GroupBy, RevenueAndProfitStatsDTO, RevenueParams, TodayStatistics, TopMedicineDTO } from "../types/dashboard.type";

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
        year: "year",
        day: "day"
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
  const queryParams: Record<string, any> = {
    start: startDate,
    end: endDate,
    limit: 5
  };
  const res = await axiosClient.get<ApiResponse<TopMedicineDTO[]>>(
    "/v1/dashboard/top-medicine",
    {
      params: queryParams
    }
  );

  return res.data;
}


// Version 2
export const getRevenueAndProfitStatistics = async (params: RevenueParams) => {
  const {startDate, endDate, groupBy} = params;
  const queryParams: Record<string, any> = {
    start: startDate,
    end: endDate,
    groupBy
  };

  const res = await axiosClient.get<ApiResponse<RevenueAndProfitStatsDTO[]>>(
    "/v1/dashboard/statistic",
    {
      params: queryParams
    }
  );

  return res.data;
}
