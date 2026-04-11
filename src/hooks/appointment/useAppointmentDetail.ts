import { useEffect, useState } from "react";
import { getAppointmentDetail } from "../../services/appointment.service";
import type { AppointmentDetail } from "../../types/appointment.type";

export const useAppointmentDetail = (appointmentId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentDetail>();

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      if (!appointmentId) return;
      setIsLoading(true);
      try {
        const appointmentDetail = await getAppointmentDetail(appointmentId);

        setAppointment({
          appointment_id: appointmentDetail.data?.appointment_id,
          status: appointmentDetail.data?.status,
          start_time: appointmentDetail.data?.start_time,
          reason: appointmentDetail.data?.reason,
          service_id: appointmentDetail.data?.service_id,
          patients: appointmentDetail.data?.patients,
          employee: {
            fullname: appointmentDetail.data?.employee.fullname
          },
          doctor: appointmentDetail.data?.doctor,
          rooms: {
            room_name: appointmentDetail.data?.rooms.room_name
          },
          services: {
            service_name: appointmentDetail.data?.services.service_name
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentDetail();
  }, [appointmentId]);

  return { isLoading, appointment };
};
