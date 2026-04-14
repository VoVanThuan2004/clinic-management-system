import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import type { GroupBy } from "../types/dashboard.type";

dayjs.extend(weekOfYear);

export const formatLabel = (date: string, groupBy: GroupBy) => {
  const d = dayjs(date);

  switch (groupBy) {
    case "week":
      return `Tuần ${d.week()} - ${d.format("YYYY")}`;
    case "month":
      return d.format("MM/YYYY");
    case "quarter":
      return `Q${Math.ceil((d.month() + 1) / 3)} - ${d.year()}`;
    case "year":
      return d.format("YYYY");
    default:
      return d.format("DD/MM/YYYY");
  }
};