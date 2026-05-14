
export type GroupBy = "year" | "quarter" | "month" | "week";

export type RevenueParams = {
    startDate: string;
    endDate: string;
    groupBy: GroupBy;
}

export type TodayStatistics = {
    totalPatients: number;
    totalRevenue: number;
}