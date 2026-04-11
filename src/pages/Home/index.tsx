import { Calendar, FileText, Video } from "lucide-react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-blue-600">
          Clinic Management
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
            onClick={() => navigate("/login")}
        >
          Đăng nhập
        </Button>
      </header>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-8 py-16 max-w-7xl mx-auto">
        {/* Text */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-700 leading-tight">
            Effortless Clinic Workflow
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Nền tảng quản lý phòng khám hiện đại giúp bác sĩ, nhân viên và quản lý
            vận hành hiệu quả với quy trình số hóa toàn diện.
          </p>

          <div className="mt-8 flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
              Bắt đầu
            </Button>
            <Button variant="dashed" className="px-6 py-2 rounded-xl">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>

        {/* Illustration */}
        <div className="bg-gradient-to-tr from-blue-100 to-blue-50 rounded-3xl p-8 shadow-inner">
          <div className="w-full h-64 bg-white rounded-2xl flex items-center justify-center text-gray-400">
            Illustration Doctors & Dashboard
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="p-6">
              <FileText className="text-blue-600 w-10 h-10" />
              <h3 className="mt-4 text-xl font-semibold">
                Digital Health Records
              </h3>
              <p className="mt-2 text-gray-600">
                Lưu trữ hồ sơ bệnh án điện tử an toàn, truy cập nhanh chóng.
              </p>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="p-6">
              <Calendar className="text-blue-600 w-10 h-10" />
              <h3 className="mt-4 text-xl font-semibold">
                Online Booking
              </h3>
              <p className="mt-2 text-gray-600">
                Đặt lịch khám dễ dàng, quản lý lịch hẹn hiệu quả.
              </p>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <Card className="p-6">
              <Video className="text-blue-600 w-10 h-10" />
              <h3 className="mt-4 text-xl font-semibold">Telehealth</h3>
              <p className="mt-2 text-gray-600">
                Khám bệnh từ xa qua video, tiện lợi và tiết kiệm thời gian.
              </p>
            </Card>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Dashboard trực quan
          </h2>

          <div className="mt-10 bg-white rounded-3xl shadow-lg p-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="h-24 bg-blue-100 rounded-xl"></div>
              <div className="h-24 bg-blue-200 rounded-xl"></div>
              <div className="h-24 bg-blue-300 rounded-xl"></div>
            </div>

            <div className="mt-6 h-40 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © 2026 Clinic Management System
      </footer>
    </div>
  );
}
