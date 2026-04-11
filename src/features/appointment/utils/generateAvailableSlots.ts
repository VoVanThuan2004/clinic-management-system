import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import type { BookedData } from "../types/appointment.type";

export const generateAvailableSlots = (
  bookedAppointments: BookedData[],
  selectedDate: string,
) => {
  const slots = [];
  const now = dayjs();
  const isToday = dayjs(selectedDate).isSame(now, "day");

  let currentSlot = dayjs(`${selectedDate}T08:00:00`);
  const endWork = dayjs(`${selectedDate}T17:00:00`);
  const lunchStart = dayjs(`${selectedDate}T12:00:00`);
  const lunchEnd = dayjs(`${selectedDate}T13:00:00`);

  while (currentSlot.isBefore(endWork)) {
    const isLunch = currentSlot.isBetween(lunchStart, lunchEnd, null, "[)");

    // Kiểm tra 1: Không phải giờ nghỉ trưa
    // Kiểm tra 2: Nếu là hôm nay, giờ slot phải lớn hơn giờ hiện tại
    const isPast = isToday && currentSlot.isBefore(now);

    if (!isLunch && !isPast) {
      const isBooked = bookedAppointments.some((apt) => {
        const aptStart = dayjs(apt.start_time);
        const aptEnd = dayjs(apt.end_time);
        return currentSlot.isBetween(aptStart, aptEnd, null, "[)");
      });

      if (!isBooked) {
        slots.push(currentSlot.format("HH:mm"));
      }
    }
    currentSlot = currentSlot.add(30, "minute");
  }
  return slots;
};
