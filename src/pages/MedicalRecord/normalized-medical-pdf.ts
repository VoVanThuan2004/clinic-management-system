import type { MedicalRecordPDF } from "../../types/medical-record.type";

export const normalizeMedicalPDF = (data: MedicalRecordPDF) => {
  const prescription = data.prescriptions;
  const payment = data.payments?.[0];

  return {
    ...data,

    doctorName: data.profiles?.fullname,
    specialty: data.profiles?.doctor_details.specialty,

    items: prescription?.prescription_items || [],

    examinationFee: payment?.service_fee || 0,
    totalMedicine: payment?.total_medicine || 0,
    totalAmount: payment?.total_amount || 0,
  };
};