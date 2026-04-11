import { useEffect, useState } from "react";
import { selectDoctorApi } from "../api/select-doctor";
import type { Doctor } from "../types/doctor.typ";

type Props = {
  searchDoctor?: string;
};

export const useDoctorOption = (props: Props) => {
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const { searchDoctor } = props;

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctor(true);
      try {
        const res = await selectDoctorApi(props);

        if (res.error) throw res.error;

        setDoctors(res.data);
      } catch (error) {
        console.log(error);
        setDoctors([]);
      } finally {
        setIsLoadingDoctor(false);
      }
    };

    if (searchDoctor) {
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [searchDoctor]);

  return { isLoadingDoctor, doctors };
};
