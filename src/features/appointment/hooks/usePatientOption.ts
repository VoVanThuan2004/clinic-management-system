import { useEffect, useState } from "react";
import type { Patient } from "../types/patient.type";
import { selectPatientApi } from "../api/select-patient";

type Props = {
  searchPatient?: string;
};

export const usePatientOption = (props: Props) => {
  const [data, setData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { searchPatient } = props;

  useEffect(() => {
    // định nghĩa function
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const data = await selectPatientApi({ search: searchPatient });

        if (data.error) throw data.error;

        setData(data?.data || []);
      } catch (error) {
        console.error("Fetch patient error:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Khi có giá trị search thì gọi fetch api, ngược lại thì không
    if (searchPatient) {
        fetchPatients();
    }
    else {
        setData([]);
    }
  }, [searchPatient]);

  return { isLoading, data };
};
