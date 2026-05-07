import { Avatar, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { AppointmentStatus } from "./appointment-status";
import { FileCodeCorner } from "lucide-react";

type Props = {
  handleUpdateStatus: (appointmentId: string, status: string) => void;
  openModalUpdate: (appointmentId: string) => void;
  onDownloadPDFAppointment: (appointmentId: string) => Promise<void>;
  loadingPdfId: string | null;
};

export const getAppointmentColumns = (props: Props) => [
  {
    title: "Bệnh nhân",
    dataIndex: "patientName",
    key: "patientName",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Bác sĩ",
    key: "doctorName",
    render: (_: any, record: any) => {
      const name = record.doctorName || "";
      const avatar = record.avatarUrl;

      return (
        <div className="flex items-center gap-3">
          <Avatar size={34} src={avatar} className="bg-blue-500 text-white">
            {!avatar && name.charAt(0).toUpperCase()}
          </Avatar>

          <span className="font-medium text-gray-700">{name}</span>
        </div>
      );
    },
  },

  {
    title: "Phòng khám",
    dataIndex: "roomName",
    key: "roomName",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Loại dịch vụ",
    dataIndex: "serviceName",
    key: "serviceName",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Thời gian",
    dataIndex: "startTime",
    key: "startTime",
    render: (time: string) => (
      <span className="text-gray-600">
        {dayjs(time).format("HH:mm DD/MM/YYYY")}
      </span>
    ),
  },

  {
    title: "Tình trạng bệnh",
    dataIndex: "reason",
    key: "reason",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      let color = "";
      let label = "";

      switch (status) {
        case "scheduled":
          color = "gold";
          label = "Đã đặt lịch";
          break;

        case "checked_in":
          color = "blue";
          label = "Đã đến";
          break;

        case "examining":
          color = "purple";
          label = "Đang khám";
          break;

        case "completed":
          color = "green";
          label = "Hoàn thành";
          break;

        case "cancelled":
          color = "red";
          label = "Đã hủy";
          break;

        default:
          color = "default";
          label = "Không xác định";
      }

      return <Tag color={color}>{label}</Tag>;
    },
  },

  {
    title: "Hành động",
    key: "action",
    render: (_: any, record: any) => {
      const canCheckIn = record.status === "scheduled";
      const canCancel =
        record.status === "scheduled" || record.status === "checked_in";
      const canUpdate = !["examining", "completed", "cancelled"].includes(
        record.status,
      );

      return (
        <Space size="middle">
          {canCheckIn && (
            <a
              className="text-green-500"
              onClick={() =>
                props.handleUpdateStatus(
                  record.appointmentId,
                  AppointmentStatus.CHECKED_IN,
                )
              }
            >
              Check-in
            </a>
          )}

          {canCancel && (
            <a
              className="text-red-500"
              onClick={() =>
                props.handleUpdateStatus(
                  record.appointmentId,
                  AppointmentStatus.CANCELLED,
                )
              }
            >
              Hủy
            </a>
          )}

          {canUpdate && (
            <a
              className="text-blue-500"
              onClick={() => props.openModalUpdate(record.appointmentId)}
            >
              Cập nhật
            </a>
          )}

          <Tooltip title="Tải file pdf">
            <span
              onClick={() =>
                props.onDownloadPDFAppointment(record.appointmentId)
              }
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
            >
              <FileCodeCorner
                size={17}
                className={`${
                  props.loadingPdfId === record.appointment_id
                    ? "text-gray-400 animate-pulse"
                    : "text-red-500"
                }`}
              />
            </span>
          </Tooltip>
        </Space>
      );
    },
  },
];
