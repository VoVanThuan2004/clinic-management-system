import { useEffect, useState } from "react";
import type { AppointmentDetail } from "../../types/appointment.type";
import { getAppointmentDetail } from "../../services/appointment.service";

export const useAppointmentDetail = (appointmentId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentDetail>();

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      if (!appointmentId) return;
      setIsLoading(true);
      try {
        const res = await getAppointmentDetail(appointmentId);

        const appointment = res.data;
        setAppointment({
          appointmentId: appointment?.appointmentId as string,
          patientId: appointment?.patientId as string,
          doctorId: appointment?.doctorId as string,
          employeeId: appointment?.employeeId as string,
          roomId: appointment?.roomId as string,
          serviceId: appointment?.serviceId as string,
          startTime: appointment?.startTime as string,
          durationMinutes: appointment?.durationMinutes as number,
          reason: appointment?.reason as string,
          patientCode: appointment?.patientCode as string,
          patientName: appointment?.patientName as string,
          phoneNumber: appointment?.phoneNumber as string,
          gender: appointment?.gender as number,
          dateOfBirth: appointment?.dateOfBirth as string,
          address: appointment?.address as string,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentDetail();
  }, [appointmentId]);

  return { isLoading, appointment };
};
