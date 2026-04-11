import dayjs from "dayjs";
import type { BookedData, Interval } from "../../types/appointment.type";

export const toIntervals = (data: BookedData[]): Interval[] => {
  return data.map((item) => {
    const start = dayjs(item.start_time);
    const end = start.add(item.duration_minutes, "minute");

    return { start, end };
  });
};

export const isOverlap = (
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  intervals: Interval[],
) => {
  return intervals.some((i) => start.isBefore(i.end) && end.isAfter(i.start));
};
