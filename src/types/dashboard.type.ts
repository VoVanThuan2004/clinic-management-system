
export type GroupBy = "year" | "quarter" | "month" | "week" | "day";

export type RevenueParams = {
    startDate: string;
    endDate: string;
    groupBy: GroupBy;
}

export type TodayStatistics = {
    totalPatients: number;
    totalRevenue: number;
}

export type RevenueAndProfitStatsDTO = {
    label: string;
    revenue: number;
    profit: number;
}

export type TopMedicineDTO = {
    medicineId: string;
    medicineName: string;
    totalSold: number;
}