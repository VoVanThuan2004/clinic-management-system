import { Popover, Space, Tag, Tooltip } from "antd";
import { Check, EyeIcon, FileCodeCorner } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

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
    dataIndex: "doctorName",
    key: "doctorName",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },
  {
    title: "Bệnh nhân",
    dataIndex: "patientName",
    key: "patientName",
    render: (_: string, record: any) => {
      const content = (
        <div className="w-[280px]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">

            <div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                {record.patientName}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <Tag color={record.gender === 1 ? "blue" : "magenta"}>
                  {record.gender === 1 ? "Nam" : "Nữ"}
                </Tag>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-500">Số điện thoại</span>

              <div className="flex items-center gap-1 text-gray-700 font-medium">
                {record.phoneNumber}
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-500">Ngày sinh</span>

              <span className="font-medium text-gray-700">
                {formatDate(record.dateOfBirth)}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-500">Địa chỉ</span>

              <span className="font-medium text-gray-700 text-right">
                {record.address}
              </span>
            </div>
          </div>
        </div>
      );

      return (
        <Popover
          content={content}
          trigger={["hover", "click"]}
          placement="right"
        >
          <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer hover:underline transition">
            {record.patientName}
          </button>
        </Popover>
      );
    },
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
    dataIndex: "paymentStatus",
    key: "paymentStatus",
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
            onClick={() =>
              props.onViewMedicalRecordDetail(record.medicalRecordId)
            }
          >
            <EyeIcon size={17} className="text-blue-600" />
          </button>
        </Tooltip>

        {props.openPaymentModal && !record.paymentStatus && (
          <Tooltip title="Thanh toán">
            <button
              className="flex items-center gap-1 bg-red-500 px-2 py-1.5 rounded-md cursor-pointer"
              onClick={() =>
                props.openPaymentModal!(
                  record.medicalRecordId,
                  record.patientName,
                  record.doctorName,
                )
              }
            >
              <Check size={11} color="white" />
              <p className="text-white text-[12px] font-medium">Thanh toán</p>
            </button>
          </Tooltip>
        )}

        {record.paymentStatus && (
          <Tooltip title="Tải file pdf">
            <span
              onClick={() =>
                props.onDownloadMedicalRecordPDF(record.medicalRecordId)
              }
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
            >
              <FileCodeCorner
                size={17}
                className={`${
                  props.loadingPdfId === record.medicalRecordId
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
