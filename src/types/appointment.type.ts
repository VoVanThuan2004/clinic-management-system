import type dayjs from "dayjs";
import type { Doctor } from "./doctor.type";
import type { Patient } from "./patient.type";

export type AppointmentCalendarProps = {
  doctor_id?: string;
  start_time: string;
  end_time: string;
};

export type AppointmentCalendarResponse = {
  appointment_id: string;
  start_time: string;
  status: string;
  reason: string;
  doctor_id: string;
  patients: {
    id: string;
    full_name: string;
    phone_number: string;
  };
  rooms: {
    room_name: string;
  }
};

export type AppointmentTableResponse = {
  appointment_id: string;
  start_time: string;
  status: string;
  reason: string;
  patients: {
    id: string;
    full_name: string;
    phone_number: string;
  };
  profiles: {
    fullname: string;
  };
};

export type BookedData = {
  start_time: string;
  duration_minutes: number;
};

// type tạo appointment mới
export type CreateAppointmentData = {
  patient_id: string;
  doctor_id: string;
  employee_id: string;  // Nhân viên thực hiện tạo
  start_time: string;
  service_id: string;
  room_id: string;
  duration_minutes: number;
  reason: string;
  status: string;
};

export type AppointmentDetail = {
  appointment_id: string;
  service_id: string;
  start_time: string;
  status: string;
  reason: string;
  patients: Patient;
  doctor: Doctor;
  employee: {
    fullname: string;
  },
  rooms: {
    room_name: string;
  },
  services: {
    service_name: string;
  }
};

export type AppointmentUpdate = {
  appointment_id: string;
  start_time: string;
  reason: string;
  service_id: string;
  patient_id: string;
  doctor_id: string;
}

export type Interval = {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
