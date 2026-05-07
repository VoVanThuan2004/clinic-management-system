import { useEffect, useState } from "react";
import { selectDoctorApi } from "../services/doctor.service";
import type { DoctorOption } from "../types/doctor.type";

type Props = {
  searchDoctor?: string;
};

export const useDoctorOption = (props: Props) => {
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);

  const { searchDoctor } = props;

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctor(true);
      try {
        const res = await selectDoctorApi(props);

        if (res.status === "success") {
          setDoctors(res.data || []);
        }
        
      } catch (error) {
        console.log(error);
        setDoctors([]);
      } finally {
        setIsLoadingDoctor(false);
      }
    };

    fetchDoctors();
  }, [searchDoctor]);

  return { isLoadingDoctor, doctors };
};