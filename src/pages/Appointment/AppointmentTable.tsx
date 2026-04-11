import { useState } from "react";
import { BaseTable } from "../../components/Table";
import { getAppointmentColumns } from "./get-appointment-columns";
import { useAppointmentList } from "../../hooks/useAppointmentList";
import type { Dayjs } from "dayjs";
import { useAppointmentStatus } from "../../hooks/useAppointmentStatus";
import { AppointmentModal } from "./AppointmentModal";
import { message } from "antd";
import { getAppointmentDetail } from "../../services/appointment.service";
import { pdf } from "@react-pdf/renderer";
import { AppointmentPDF } from "./AppointmentPDF";
import { saveAs } from "file-saver";

type Props = {
  debounceSearch?: string;
  date?: Dayjs | null;
  doctor_id?: string;
};

export const AppointmentTable = ({
  debounceSearch,
  date,
  doctor_id,
}: Props) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [appointmentId, setAppointmentId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPdfId, setLoadingPdfId] = useState("");

  // Gọi hook api lấy list appointment
  const { data, isLoading } = useAppointmentList({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debounceSearch,
    date: date,
    doctor_id: doctor_id,
  });

  const mappedData = (data?.data ?? []).map((item) => ({
    appointment_id: item.appointment_id,
    start_time: item.start_time,

    full_name: item.patients?.full_name || "",
    phone_number: item.patients?.phone_number || "",
    reason: item.reason,

    doctor_name: item.profiles?.fullname || "",
    avatarurl: item.profiles?.avatarurl || "",
    room_name: item.rooms?.room_name || "",
    service_name: item.services?.service_name || "",

    status: item.status,
  }));

  // Gọi hook api cập nhật status lịch hẹn
  const updateAppointmentStatus = useAppointmentStatus("list");

  const handleUpdateStatus = (appointmentId: string, status: string) => {
    updateAppointmentStatus.mutate({
      appointment_id: appointmentId,
      status: status,
    });
  };

  const openModalUpdate = (id: string) => {
    setAppointmentId(id);
    setIsOpen(true);
  };

  const onCloseModalUpdate = () => {
    setIsOpen(false);
  };

  // Download pdf lịch hẹn chi tiết
  const onDownloadPDFAppointment = async (appointmentId: string) => {
    if (!appointmentId) return;

    try {
      setLoadingPdfId(appointmentId);

      const res = await getAppointmentDetail(appointmentId);

      if (!res.data) throw new Error("No data");

      // Tạo file pdf
      const blob = await pdf(<AppointmentPDF appointment={res.data} />).toBlob();
    
      // Tự động download
      saveAs(blob, "appointment.pdf");
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải file pdf. Vui lòng thử lại");
    } finally {
      setLoadingPdfId("");
    }
  };

  const columns = getAppointmentColumns({
    handleUpdateStatus,
    openModalUpdate,
    onDownloadPDFAppointment,
    loadingPdfId
  });

  return (
    <>
      <BaseTable
        loading={isLoading || updateAppointmentStatus.isPending}
        columns={columns}
        dataSource={mappedData || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: mappedData.length || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page,
              pageSize: pageSize,
            });
          },
        }}
      />

      <AppointmentModal
        isOpen={isOpen}
        onClose={onCloseModalUpdate}
        appointmentId={appointmentId}
      />
    </>
  );
};
