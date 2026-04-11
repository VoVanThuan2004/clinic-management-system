import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { MedicalRecordPDF } from "../../types/medical-record.type";
import dayjs from "dayjs";
import "../../lib/pdf_font";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 11,
    fontFamily: "Roboto",
  },

  section: {
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    marginBottom: 2,
  },

  label: {
    width: "40%",
    fontWeight: "bold",
  },

  value: {
    width: "60%",
  },

  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    marginBottom: 2,
  },

  colName: { width: "40%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "25%", textAlign: "right" },

  totalBox: {
    marginTop: 10,
    borderTop: "1 solid #000",
    paddingTop: 6,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  image: {
    width: 120,
    height: 120,
    objectFit: "cover",
    marginRight: 8,
    marginBottom: 8,
  },

  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const formatMoney = (n: number) => (n || 0).toLocaleString("vi-VN") + " VND";

const getPaymentMethod = (paymentMethod: string) => {
  if (paymentMethod === "cash") return "Thanh toán tiền mặt";
  return "Thanh toán chuyển khoản";
};

export const MedicalPDF = ({ data }: { data: MedicalRecordPDF }) => {
  const patient = data.patients;
  const doctor = data.profiles;
  const specialty = doctor?.doctor_details?.specialty || "";

  // Thông tin dịch vụ
  const serviceName = data.services?.service_name || "Khám bệnh";
  const servicePrice = data.services?.price || 0;

  const prescription = data.prescriptions;
  const items = prescription?.prescription_items || [];

  const payment = data.payments?.[0];

  // Logic phí: Ưu tiên phí đã lưu trong payment, nếu chưa có thì lấy từ thông tin dịch vụ
  const examinationFee = payment?.service_fee ?? servicePrice;
  const totalMedicine =
    payment?.total_medicine ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalAmount = payment?.total_amount || totalMedicine + examinationFee;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* ================= PATIENT ================= */}
        <View style={styles.section}>
          <Text style={styles.title}>Thông tin bệnh nhân</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{patient?.full_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày sinh:</Text>
            <Text style={styles.value}>
              {dayjs(patient.date_of_birth).format("DD/MM/YYYY")}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Giới tính:</Text>
            <Text style={styles.value}>
              {patient?.gender === 1 ? "Nam" : "Nữ"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>SĐT:</Text>
            <Text style={styles.value}>{patient?.phone_number}</Text>
          </View>
        </View>

        {/* ================= DOCTOR ================= */}
        <View style={styles.section}>
          <Text style={styles.title}>Thông tin bác sĩ</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{doctor?.fullname}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Chuyên khoa:</Text>
            <Text style={styles.value}>{specialty}</Text>
          </View>
        </View>

        {/* ================= MEDICAL INFO ================= */}
        <View style={styles.section}>
          <Text style={styles.title}>Thông tin khám</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Loại dịch vụ:</Text>
            <Text style={[styles.value, { fontWeight: "bold" }]}>
              {serviceName}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Triệu chứng:</Text>
            <Text style={styles.value}>{data.symptoms}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Chẩn đoán:</Text>
            <Text style={styles.value}>{data.diagnosis}</Text>
          </View>

           <View style={styles.row}>
            <Text style={styles.label}>Ghi chú:</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        </View>

        {/* ================= PRESCRIPTION ================= */}
        <View style={styles.section}>
          <Text style={styles.title}>Đơn thuốc</Text>

          <View style={[styles.tableHeader, { backgroundColor: "#f3f4f6" }]}>
            <Text style={[styles.colName, { flex: 2 }]}>
              Tên thuốc / Liều dùng
            </Text>
            <Text style={[styles.colQty, { flex: 0.5 }]}>SL</Text>
            <Text style={[styles.colPrice, { flex: 1 }]}>Giá</Text>
            <Text style={[styles.colTotal, { flex: 1 }]}>Thành tiền</Text>
          </View>

          {items.map((item, i) => {
            const itemTotal = item.price * item.quantity;

            return (
              <View
                key={i + 1}
                style={[
                  styles.tableRow,
                  {
                    borderBottomColor: "#eee",
                    borderBottomWidth: 1,
                    paddingVertical: 5,
                  },
                ]}
              >
                <View style={{ flex: 2 }}>
                  <Text style={styles.colName}>{item.medicine_name}</Text>
                  {item.dosage && (
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#666",
                        marginTop: 2,
                      }}
                    >
                      HDSD: {item.dosage}
                    </Text>
                  )}
                </View>
                <Text style={[styles.colQty, { flex: 0.5 }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.colPrice, { flex: 1 }]}>
                  {formatMoney(item.price)}
                </Text>
                <Text style={[styles.colTotal, { flex: 1 }]}>
                  {formatMoney(itemTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ================= TOTAL ================= */}
        <View
          style={[
            styles.section,
            styles.totalBox,
            { marginTop: 20, padding: 10, backgroundColor: "#fafafa" },
          ]}
        >
          <Text style={[styles.title, { marginBottom: 5 }]}>
            Chi tiết chi phí
          </Text>

          <View style={styles.totalRow}>
            <Text style={{ fontSize: 10 }}>Dịch vụ ({serviceName}):</Text>
            <Text style={{ fontSize: 10 }}>{formatMoney(examinationFee)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={{ fontSize: 10 }}>Tổng tiền thuốc:</Text>
            <Text style={{ fontSize: 10 }}>{formatMoney(totalMedicine)}</Text>
          </View>

          <View
            style={[
              styles.totalRow,
              {
                marginTop: 5,
                paddingTop: 5,
                borderTopWidth: 1,
                borderTopColor: "#ccc",
              },
            ]}
          >
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>TỔNG CỘNG:</Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 12, color: "#e11d48" }}
            >
              {formatMoney(totalAmount)}
            </Text>
          </View>

          {payment?.payment_method && (
            <View style={[styles.totalRow, { marginTop: 4 }]}>
              <Text style={{ fontSize: 9, color: "#666" }}>Phương thức thanh toán:</Text>
              <Text style={{ fontSize: 9, color: "#666" }}>
                {getPaymentMethod(payment.payment_method)}
              </Text>
            </View>
          )}
        </View>

        {/* ================= IMAGES ================= */}
        {data.files?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Ảnh xét nghiệm</Text>

            <View style={styles.imageContainer}>
              {data.files.map((file, i) => (
                <Image key={i} src={file.file_url} style={styles.image} />
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
