import { useEffect, useState } from "react";
import { getBookedSlotsApi } from "../api/get-booked-slots";
import type { BookedData } from "../types/appointment.type";

type Props = {
  doctorId: string | null;
  date: string | null;
};

export const useBookedSlot = (props: Props) => {
  const [isLoadingSlot, setIsLoadingSlot] = useState(false);
  const [bookedData, setBookedData] = useState<BookedData[]>([]);

  const { doctorId, date } = props;

  useEffect(() => {
    const getBookedSlots = async () => {
      setIsLoadingSlot(true);
      try {
        const data = await getBookedSlotsApi(props);

        if (data.error) throw data.error;

        setBookedData(data.data ?? []);
      } catch (error) {
        console.log(error);
        setBookedData([]);
      } finally {
        setIsLoadingSlot(false);
      }
    };

    if (doctorId && date) {
      getBookedSlots();
    }
  }, [doctorId, date]);

  return { bookedData, isLoadingSlot };
};
