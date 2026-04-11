import dayjs from "dayjs";
import type { BookedData } from "../../types/appointment.type";
import { isOverlap, toIntervals } from "./interval.util";
import { WORKING_WINDOWS } from "./workingtime.constant";

const SLOT_STEP = 30; // phút

export const generateAvailableSlots = ({
  date,
  booked,
  expectedDuration,
}: {
  date: string;
  booked: BookedData[];
  expectedDuration: number;
}) => {
  const busyIntervals = toIntervals(booked);
  const result: string[] = [];

  const now = dayjs();
  const isToday = dayjs(date).isSame(now, "day");

  for (const window of WORKING_WINDOWS) {
    let cursor = dayjs(`${date}T${window.start}`);
    const windowEnd = dayjs(`${date}T${window.end}`);

    while (true) {
      const end = cursor.add(expectedDuration, "minute");

      if (end.isAfter(windowEnd)) break;

      // skip nếu là hôm nay và slot đã qua
      if (isToday && cursor.isBefore(now)) {
        cursor = cursor.add(SLOT_STEP, "minute");
        continue;
      }

      // check conflict
      if (!isOverlap(cursor, end, busyIntervals)) {
        result.push(cursor.format("HH:mm"));
      }

      cursor = cursor.add(SLOT_STEP, "minute");
    }
  }

  return result;
};