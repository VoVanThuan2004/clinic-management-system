import { Space, Tag, Tooltip } from "antd";
import { Check, EyeIcon, FileCodeCorner } from "lucide-react";

type Props = {
  openPaymentModal?: (
    recordId: string,
    patientName: string,
    doctorName: string,
  ) => void;
  onViewMedicalRecordDetail: (recordId: string) => void;
  onDownloadMedicalRecordPDF: (recordId: string) => Promise<void>;
  loadingPdfId: string | null;
};

export const getMedicalRecordColumns = (props: Props) => [
  {
    title: "Bác sĩ",
    dataIndex: "doctor_name",
    key: "doctor_name",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },
  {
    title: "Bệnh nhân",
    dataIndex: "full_name",
    key: "full_name",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },
  {
    title: "Triệu chứng",
    dataIndex: "symptoms",
    key: "symptoms",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },
  {
    title: "Chẩn đoán",
    dataIndex: "diagnosis",
    key: "diagnosis",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },
  {
    title: "Ghi chú",
    dataIndex: "notes",
    key: "notes",
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },
  {
    title: "Trạng thái",
    dataIndex: "payment_status",
    key: "payment_status",
    render: (status: boolean) => {
      if (status) {
        return <Tag color={"green"}>{"Đã thanh toán"}</Tag>;
      }
      return <Tag color={"red"}>{"Chưa thanh toán"}</Tag>;
    },
  },
  {
    title: "Hành động",
    key: "action",
    fixed: "right" as const, // Cố định cột bên phải nếu bảng nhiều cột
    width: 200,
    render: (_: any, record: any) => (
      <Space size="middle">
        <Tooltip title="Xem chi tiết">
          <button
            className="cursor-pointer"
            onClick={() => props.onViewMedicalRecordDetail(record.record_id)}
          >
            <EyeIcon size={17} className="text-blue-600" />
          </button>
        </Tooltip>

        {props.openPaymentModal && !record.payment_status && (
          <Tooltip title="Thanh toán">
            <button
              className="flex items-center gap-1 bg-red-500 px-2 py-1.5 rounded-md cursor-pointer"
              onClick={() =>
               
                props.openPaymentModal!(
                  record.record_id,
                  record.full_name,
                  record.doctor_name,
                )
              }
            >
              <Check size={11} color="white" />
              <p className="text-white text-[12px] font-medium">Thanh toán</p>
            </button>
          </Tooltip>
        )}

        {record.payment_status && (
          <Tooltip title="Tải file pdf">
            <span
              onClick={() => props.onDownloadMedicalRecordPDF(record.record_id)}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
            >
              <FileCodeCorner
                size={17}
                className={`${
                  props.loadingPdfId === record.record_id
                    ? "text-gray-400 animate-pulse"
                    : "text-red-500"
                }`}
              />
            </span>
          </Tooltip>
        )}
      </Space>
    ),
  },
];
