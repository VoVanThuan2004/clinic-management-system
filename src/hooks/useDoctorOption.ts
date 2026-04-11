import { useEffect, useState } from "react";
import { selectDoctor } from "../services/doctor.service";
import type { Doctor } from "../types/doctor.type";

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
        const res = await selectDoctor(props);

        if (res.error) throw res.error;

        setDoctors(res.data);
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