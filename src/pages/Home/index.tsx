import { Activity, Calendar, FileText, ShieldCheck, Users, Video } from "lucide-react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
              ClinicOS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button type="text" className="text-slate-700 hover:text-blue-600">
              Tính năng
            </Button>
            <Button type="text" className="text-slate-700 hover:text-blue-600">
              Giải pháp
            </Button>
            <Button type="text" className="text-slate-700 hover:text-blue-600">
              Liên hệ
            </Button>
            <Button
              type="primary"
              className="rounded-2xl bg-blue-600 px-6 py-2 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-white py-20">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-700">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Giải pháp quản lý phòng khám thông minh
              </div>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Quản lý phòng khám hiện đại, từ đặt lịch đến hồ sơ bệnh án.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Tự động hóa quy trình khám chữa bệnh, tối ưu lịch hẹn, quản lý bác sĩ, thuốc và bệnh nhân trong một nền tảng duy nhất.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  type="primary"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700"
                  onClick={() => navigate("/login")}
                >
                  Bắt đầu ngay
                </Button>
                <Button
                  type="default"
                  className="rounded-2xl border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-700"
                >
                  Xem demo
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-3xl font-semibold text-blue-700">99.9%</p>
                  <p className="mt-2 text-sm text-slate-500">Uptime hệ thống</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-3xl font-semibold text-blue-700">120+</p>
                  <p className="mt-2 text-sm text-slate-500">Phòng khám đang sử dụng</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-3xl font-semibold text-blue-700">50k+</p>
                  <p className="mt-2 text-sm text-slate-500">Bệnh nhân được phục vụ mỗi tháng</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/50">
              <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-blue-600/10 blur-2xl" />
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/95 px-5 py-4 text-white shadow-lg shadow-slate-900/10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Tổng lượt khám</p>
                    <p className="mt-2 text-3xl font-semibold">1,243</p>
                  </div>
                  <div className="rounded-2xl bg-white/15 px-3 py-2 text-sm">
                    +12.5%
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Lịch hẹn hôm nay</p>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">4 việc</span>
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">08:00 - Bs. Linh</p>
                      <p className="mt-1 font-medium text-slate-900">Khám tổng quát</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-500">09:30 - Bs. Hùng</p>
                      <p className="mt-1 font-medium text-slate-900">Tái khám</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-blue-600/5 p-4">
                    <p className="text-sm text-slate-500">Bệnh nhân hôm nay</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">72</p>
                  </div>
                  <div className="rounded-3xl bg-emerald-600/5 p-4">
                    <p className="text-sm text-slate-500">Đơn thuốc đã phát hành</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">34</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Tính năng nổi bật</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Tất cả giải pháp cho phòng khám hiện đại
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Hệ thống được thiết kế để hợp nhất quản lý bệnh nhân, lịch khám, hồ sơ điện tử và kê đơn trong một trải nghiệm mượt mà.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="rounded-[1.75rem] border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-700">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Hồ sơ bệnh án điện tử</h3>
              <p className="mt-3 text-slate-600">Cập nhật và tìm kiếm bệnh án nhanh chóng, duy trì lịch sử điều trị đầy đủ.</p>
            </Card>

            <Card className="rounded-[1.75rem] border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-600/10 text-sky-700">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Quản lý lịch hẹn</h3>
              <p className="mt-3 text-slate-600">Lên lịch khám, sắp xếp phòng và nhắc lịch tự động cho bệnh nhân.</p>
            </Card>

            <Card className="rounded-[1.75rem] border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-600/10 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Bảo mật dữ liệu</h3>
              <p className="mt-3 text-slate-600">Mật khẩu, quyền truy cập và sao lưu an toàn theo tiêu chuẩn y tế.</p>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="rounded-[1.75rem] border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-600/10 text-violet-700">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Quản lý bệnh nhân</h3>
              <p className="mt-3 text-slate-600">Theo dõi thông tin liên lạc, tiền sử khám và đơn thuốc của bệnh nhân.</p>
            </Card>

            <Card className="rounded-[1.75rem] border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-600/10 text-orange-700">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Báo cáo & phân tích</h3>
              <p className="mt-3 text-slate-600">Báo cáo trực quan về hiệu suất phòng khám và mức độ sử dụng dịch vụ.</p>
            </Card>

            <Card className="rounded-[1.75rem] border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-600/10 text-cyan-700">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Telehealth & tư vấn từ xa</h3>
              <p className="mt-3 text-slate-600">Kết nối bệnh nhân và bác sĩ thông qua cuộc gọi video ngay trong ứng dụng.</p>
            </Card>
          </div>
        </section>

        <section className="bg-slate-900 py-20 px-6 text-white">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Quy trình sử dụng</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Từ đăng ký đến kê đơn, mọi bước đều đơn giản</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Hệ thống thiết kế tối ưu cho đội ngũ y tế, hỗ trợ chuẩn hóa nghiệp vụ, giảm thiểu thao tác giấy tờ và gia tăng trải nghiệm bệnh nhân.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl shadow-slate-950/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-500/15 text-blue-200">
                1
              </div>
              <h3 className="text-xl font-semibold">Đăng ký & tiếp nhận</h3>
              <p className="mt-3 text-slate-300">Tiếp nhận bệnh nhân nhanh gọn với thông tin được chuẩn bị sẵn.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl shadow-slate-950/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-200">
                2
              </div>
              <h3 className="text-xl font-semibold">Khám & xử lý</h3>
              <p className="mt-3 text-slate-300">Bác sĩ dễ dàng xem lịch sử bệnh án và ghi nhận đơn thuốc ngay khi khám.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-xl shadow-slate-950/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-200">
                3
              </div>
              <h3 className="text-xl font-semibold">Theo dõi hiệu quả</h3>
              <p className="mt-3 text-slate-300">Theo dõi tiến trình điều trị, nhắc lịch tái khám và quản lý thuốc.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          © 2026 ClinicOS. Thiết kế cho quản lý phòng khám thông minh.
        </div>
      </footer>
    </div>
  );
}
