import type dayjs from "dayjs";

export type AppointmentCalendarProps = {
  doctor_id?: string;
  start_time: string;
  end_time: string;
};

export type AppointmentResponse = {
  appointmentId: string;
  patientName: string;
  phoneNumber: string;
  doctorName: string;
  roomName: string;
  serviceName: string;
  startTime: string;
  reason: string;
  status: string;
}

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
  startTime: string;
  durationMinutes: number;
};

// type tạo appointment mới
export type AppointmentData = {
  patientId: string;
  doctorId: string;
  employeeId: string;  // Nhân viên thực hiện tạo
  startTime: string;
  serviceId: string;
  roomId: string;
  durationMinutes: number;
  reason: string;
};

export type AppointmentDetailPDF = {
  appointmentId: string;
  patientName: string;
  dateOfBirth: string;
  gender: number;
  phoneNumber: string;
  address: string;
  doctorName: string;
  specialty: string;
  employeeName: string;
  roomName: string;
  serviceName: string;
  startTime: string;
  reason: string;
  status: string;
};

export type AppointmentDetail = {
  appointmentId: string;
  patientId: string;
  patientCode: string;
  patientName: string;
  phoneNumber: string;
  gender: number;
  dateOfBirth: string;
  address: string;
  doctorId: string;
  employeeId: string;
  roomId: string;
  serviceId: string;
  startTime: string;
  durationMinutes: number;
  reason: string;
}

export type AppointmentUpdate = {
  appointmentId: string;
  startTime: string;
  reason: string;
  serviceId: string;
  roomId: string;
  durationMinutes: number;
  patientId: string;
  doctorId: string;
  employeeId: string;
}

export type Interval = {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
