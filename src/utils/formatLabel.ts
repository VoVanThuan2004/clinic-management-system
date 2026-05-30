import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import type { GroupBy } from "../types/dashboard.type";

dayjs.extend(weekOfYear);

export const formatLabel = (
  label: string,
  groupBy: GroupBy
) => {

  switch (groupBy) {

    case "week": {
      // input: 2026-W18
      const [year, week] = label.split("-W");

      return `Tuần ${week} - ${year}`;
    }

    case "month": {
      // input: 2026-05
      const [year, month] = label.split("-");

      return `${month}/${year}`;
    }

    case "quarter": {
      // input: 2026-Q2
      const [year, quarter] = label.split("-");

      return `${quarter} - ${year}`;
    }

    case "year":
      // input: 2026
      return label;

    case "day":
      return dayjs(label).format("DD/MM/YYYY");
    default:
      // input: 2026-05-18
      return dayjs(label).format("DD/MM/YYYY");
  }
};