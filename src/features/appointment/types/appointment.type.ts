export type Appointment = {
  appointment_id: string;
  start_time: string;
  end_time: string;
  status: string;
  patients: {
    full_name: string;
    phone_number: string;
  };
  profiles: {
    fullname: string;
    avatarurl: string | null;
  };
};

export type AppointmentCalendarProps = {
  doctor_id?: string;
  start_time: string;
  end_time: string;
}

export type AppointmentCalendarResponse = {
  appointment_id: string;
  start_time: string;
  end_time: string;
  status: string;
  reason: string;
  patients: {
    id: string;
    full_name: string;
    phone_number: string;
  };
}

export type BookedData = {
  start_time: string;
  end_time: string;
}

// type tạo appointment mới
export type CreateAppointmentData = {
  patient_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  reason: string;
  status: string;
}
