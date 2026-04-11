import { useEffect, useState } from "react";
import { getBookedSlotsApi } from "../../services/appointment.service";
import { generateAvailableSlots } from "../../utils/appointment/generateAvailableSlots";

type Props = {
  doctorId: string;
  roomId: string;
  date: string;
  duration: number;
};

export const useAvailableSlots = ({
  doctorId,
  roomId,
  date,
  duration,
}: Props) => {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);

      const { data } = await getBookedSlotsApi({
        doctorId,
        roomId,
        date,
      });

      const result = generateAvailableSlots({
        date,
        booked: data || [],
        expectedDuration: duration,
      });

      setSlots(result);
      setLoading(false);
    };

    if (!doctorId || !roomId || !date || !duration) {
      return;
    }

    fetchSlots();
  }, [doctorId, roomId, date, duration]);

  return { slots, loading };
};
