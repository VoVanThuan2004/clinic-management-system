import dayjs from "dayjs";
import type { AppointmentDetail } from "../../types/appointment.type";
import "../../lib/pdf_font";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getAppointmentStatus } from "./get-appointment-status";

// Định nghĩa Stylesheet
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Roboto",
    color: "#1f2937",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 15,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  appointmentId: {
    fontSize: 10,
    color: "#6b7280",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: "35%",
    fontWeight: "bold",
    color: "#4b5563",
  },
  value: {
    width: "65%",
  },
  highlightBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  highlightRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  highlightLabel: {
    width: "35%",
    fontWeight: "bold",
    fontSize: 13,
  },
  highlightValue: {
    width: "65%",
    fontWeight: "bold",
    fontSize: 13,
    color: "#111827",
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureCol: {
    alignItems: "center",
    width: "40%",
  },
  signatureTitle: {
    fontWeight: "bold",
    marginBottom: 40, // Khoảng trống để ký tên
  },
  signatureName: {
    fontStyle: "normal",
  },
  noteWrapper: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: "#d1d5db",
  },
  noteText: {
    fontSize: 10,
    fontStyle: "normal",
    color: "#4b5563",
    marginBottom: 3,
  },
});


export const AppointmentPDF = ({ appointment}: { appointment: AppointmentDetail}) => {
    
  const { patients, doctor, employee, rooms, services } = appointment;

  // Xử lý format ngày giờ
  const appointmentDate = dayjs(appointment.start_time);
  const dateStr = appointmentDate.format("DD/MM/YYYY");
  const timeStr = appointmentDate.format("HH:mm");

  return (
    <Document>
      <Page size="A5" style={styles.page} wrap>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.clinicName}>PHÒNG KHÁM ĐA KHOA</Text>
          <Text style={styles.documentTitle}>PHIẾU HẸN KHÁM BỆNH</Text>
          <Text style={styles.appointmentId}>Mã phiếu: {appointment.appointment_id.split("-")[0].toUpperCase()}</Text>
        </View>

        {/* ================= PATIENT INFO ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. THÔNG TIN BỆNH NHÂN</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Họ và tên:</Text>
            <Text style={[styles.value, { textTransform: "uppercase", fontWeight: "bold" }]}>
              {patients?.full_name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày sinh:</Text>
            <Text style={styles.value}>
              {patients?.date_of_birth ? dayjs(patients.date_of_birth).format("DD/MM/YYYY") : "..."}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Giới tính:</Text>
            <Text style={styles.value}>
              {patients?.gender === 1 ? "Nam" : patients?.gender === 0 ? "Nữ" : "Khác"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{patients?.phone_number || "..."}</Text>
          </View>
        </View>

        {/* ================= APPOINTMENT INFO (HIGHLIGHTED) ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. THÔNG TIN LỊCH HẸN</Text>

          <View style={styles.highlightBox}>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Ngày khám:</Text>
              <Text style={styles.highlightValue}>{dateStr}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Giờ khám:</Text>
              <Text style={styles.highlightValue}>{timeStr}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Phòng khám:</Text>
              <Text style={styles.highlightValue}>{rooms?.room_name || "Chưa xếp phòng"}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dịch vụ khám:</Text>
            <Text style={styles.value}>{services?.service_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Lý do khám:</Text>
            <Text style={styles.value}>{appointment.reason || "Không có"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Bác sĩ phụ trách:</Text>
            <Text style={styles.value}>
              {doctor?.fullname} {doctor?.doctor_details?.specialty ? `(${doctor.doctor_details.specialty})` : ""}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Nhân viên thực hiện:</Text>
            <Text style={styles.value}>
              {employee.fullname || ""}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={styles.value}>
              {getAppointmentStatus(appointment.status) || ""}
            </Text>
          </View>
        </View>

        

        {/* ================= NOTES ================= */}
        <View style={styles.noteWrapper}>
          <Text style={[styles.noteText]}>* Lưu ý dành cho bệnh nhân:</Text>
          <Text style={styles.noteText}>1. Vui lòng mang theo phiếu này và đến trước giờ hẹn 15 phút để làm thủ tục.</Text>
          <Text style={styles.noteText}>2. Nếu không thể đến đúng hẹn, vui lòng liên hệ tổng đài để dời lịch.</Text>
          <Text style={styles.noteText}>3. Vui lòng mang theo các kết quả xét nghiệm, đơn thuốc cũ (nếu có).</Text>
        </View>
      </Page>
    </Document>
  );
}