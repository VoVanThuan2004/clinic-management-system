export interface MedicalRecordDetail {
  record_id: string;
  appointment_id: string;
  symptoms: string | null;
  diagnosis: string | null;
  notes: string | null;
  payment_status: boolean;
  created_at: string;
  profiles: {
    id: string;
    fullname: string;
  };
  patients: {
    id: string;
    full_name: string;
    phone_number: string;
    gender?: number;
    date_of_birth?: string;
  };
}

export interface MedicalRecord {
  record_id: string;
  symptoms: string;
  diagnosis: string;
  notes: string;
  payment_status: boolean;
  patients: {
    full_name: string;
    phone_number: string;
  };
  profiles: {
    fullname: string;
    doctor_details: {
      specialty: string;
    };
  };
}

export interface FileRecord {
  file_id: string;
  file_url: string;
  file_type: string;
}

export interface MedicalRecordPDF {
  record_id: string;
  appointment_id: string;

  symptoms: string;
  diagnosis: string;
  notes: string;
  payment_status: boolean;
  created_at: string;

  services: {
    service_id: string;
    service_name: string;
    price: number;
  },

  patients: {
    full_name: string;
    phone_number: string;
    gender: number;
    date_of_birth: string;
  };

  profiles: {
    fullname: string;
    doctor_details: {
      specialty: string;
    }; // luôn nên để array
  };

  files: FileRecord[];

  prescriptions: {
    created_at: string;
    prescription_items: {
      medicine_name: string;
      price: number;
      quantity: number;
      dosage: string;
    }[];
  };

  payments: {
    service_fee: number;
    total_medicine: number;
    total_amount: number;
    payment_method: string;
  }[];
}
