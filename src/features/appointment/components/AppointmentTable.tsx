import { Space, Table, Tag, type TableProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useAppointmentList } from "../hooks/useAppointmentList";
import { useState } from "react";

interface DataType {
  appointment_id: string;
  start_time: string;
  full_name: string; // bệnh nhân
  phone_number: string;
  doctor_name: string;
  avatarurl: string; // avatar bác sĩ
  status: string;
  reason: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Bệnh nhân",
    dataIndex: "full_name",
    key: "full_name",
    render: (text) => <span className="font-medium text-gray-800">{text}</span>,
  },

  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    key: "phone_number",
    render: (text) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Bác sĩ",
    key: "doctor_name",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        {/* <Avatar src={record.avatarUrl}>
          {record.doctor_name?.charAt(0)}
        </Avatar> */}
        <span className="font-medium text-gray-700">{record.doctor_name}</span>
      </div>
    ),
  },

  {
    title: "Thời gian",
    dataIndex: "start_time",
    key: "start_time",
    render: (time) => (
      <span className="text-gray-600">
        {dayjs(time).format("HH:mm DD/MM/YYYY")}
      </span>
    ),
  },

  {
    title: "Tình trạng bệnh",
    dataIndex: "reason",
    key: "reason",
    render: (text) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color = "";
      let label = "";

      switch (status) {
        case "pending":
          color = "green";
          label = "Đang chờ";
          break;
        case "scheduled":
          color = "blue";
          label = "Đã đặt";
          break;
        case "checked_in":
          color = "gold";
          label = "Đã đến";
          break;
        case "completed":
          color = "green";
          label = "Hoàn thành";
          break;
        case "cancelled":
          color = "red";
          label = "Đã hủy";
          break;
      }

      return <Tag color={color}>{label}</Tag>;
    },
  },

  {
    title: "Hành động",
    key: "action",
    render: () => (
      <Space size="middle">
        <a className="text-blue-500">Chi tiết</a>
        <a className="text-green-500">Check-in</a>
        <a className="text-red-500">Hủy</a>
      </Space>
    ),
  },
];

type Props = {
  search?: string;
  date?: Dayjs | null;
};

export const AppointmentTable = (props: Props) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Gọi hook api lấy danh sách lịch hẹn
  const { data, isLoading } = useAppointmentList({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: props?.search,
    date: props?.date,
  });

  const mappedData: DataType[] = (data?.data ?? []).map((item) => ({
    appointment_id: item.appointment_id,
    start_time: item.start_time,

    full_name: item.patients?.full_name || "",
    phone_number: item.patients?.phone_number || "",
    reason: item.reason,
    
    doctor_name: item.profiles?.fullname || "",
    avatarurl: item.profiles?.avatarurl || "",

    status: item.status,
  }));


  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <Table<DataType>
        loading={isLoading}
        columns={columns}
        dataSource={mappedData}
        scroll={{ x: 1000 }}
        className="[&_.ant-table]:rounded-2xl"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.count || 0,

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
    </div>
  );
};
