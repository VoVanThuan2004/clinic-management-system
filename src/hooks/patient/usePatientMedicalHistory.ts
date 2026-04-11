import { useEffect, useState } from "react"
import type { PatientHistory } from "../../types/patient.type";
import { getPatientMedicalHistory } from "../../services/patient.service";

export const usePatientMedicalHistory = (patientId: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<PatientHistory[]>([]);

    useEffect(() => {

        const fetchPatientMedicalHistory = async () => {
            if (!patientId) return;

            setIsLoading(true);
            try {
                const patientMedicalHistories = await getPatientMedicalHistory(patientId);

                setData(patientMedicalHistories || []);
            } catch (error) {
                console.log(error);
                
            } finally {
                setIsLoading(false);
            }
        }

        fetchPatientMedicalHistory();
    }, [patientId]);

    return { isLoading, data }
}