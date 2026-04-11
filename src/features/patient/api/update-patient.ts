import { supabase } from "../../../lib/supabase";
import type { PatientUpdate } from "../types/patient";

type Props = {
  patientId: string;
  patientUpdate: PatientUpdate
}

export const updatePatientApi = async (props: Props) => {
  return await supabase
    .from("patients")
    .update({
      full_name: props.patientUpdate.full_name,
      gender: props.patientUpdate.gender,
      phone_number: props.patientUpdate.phone_number,
      address: props.patientUpdate.address,
      date_of_birth: props.patientUpdate.date_of_birth,
    })
    .eq("id", props.patientId);
};
