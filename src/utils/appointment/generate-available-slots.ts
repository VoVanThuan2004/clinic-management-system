import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import type { BookedData } from "../../types/appointment.type";

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

  // Chuyển danh sách các lịch đã đặt thành tập hợp các chuỗi thời gian "HH:mm" để so sánh nhanh hơn
  const bookedTimes = bookedAppointments.map((apt) => 
    dayjs(apt.start_time).format("HH:mm")
  );

  while (currentSlot.isBefore(endWork)) {
    const isLunch = currentSlot.isBetween(lunchStart, lunchEnd, null, "[)");
    const isPast = isToday && currentSlot.isBefore(now);
    const slotFormatted = currentSlot.format("HH:mm");

    if (!isLunch && !isPast) {
      // Chỉ cần kiểm tra xem slot hiện tại có nằm trong danh sách đã đặt không
      const isBooked = bookedTimes.includes(slotFormatted);

      if (!isBooked) {
        slots.push(slotFormatted);
      }
    }
    
    currentSlot = currentSlot.add(30, "minute");
  }
  return slots;
};