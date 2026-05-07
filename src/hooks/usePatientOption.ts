import { useEffect, useState } from "react";
import { getPatientsApi } from "../services/patient.service";

type Props = {
  searchPatient?: string;
};

export const usePatientOption = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { searchPatient } = props;

  useEffect(() => {
    // định nghĩa function
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const data = await getPatientsApi({
          page: 0,
          pageSize: 10,
          search: searchPatient
        })


        const patients = data.data?.content || [];
        setData(patients)
      } catch (error) {
        console.error("Fetch patient error:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Khi có giá trị search thì gọi fetch api, ngược lại thì không
    fetchPatients();
  }, [searchPatient]);

  return { isLoading, data };
};