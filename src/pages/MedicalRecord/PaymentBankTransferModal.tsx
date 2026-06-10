import {  Modal, notification } from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { getOrderPaymentDetail } from "../../services/order-payment.service";

type Props = {
  bankTransferModalOpen: boolean;
  setBankTransferModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  recordId: string;
  totalPrice: number;
};

export const PaymentBankTransferModal = (props: Props) => {
  const { bankTransferModalOpen, setBankTransferModalOpen, totalPrice, recordId } = props;
  const navigate = useNavigate();

  // Hook gọi kiểm tra đã thanh toán hay chưa
  useEffect(() => {
    if (!bankTransferModalOpen) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await getOrderPaymentDetail(recordId);

        console.log(
          res.data
        );
        

        if (res.data?.status === "SUCCESS") {
          clearInterval(intervalId);

          setBankTransferModalOpen(false);
          
          notification.success({
            message: "Thanh toán thành công",
            description: `Đã nhận thanh toán ${totalPrice.toLocaleString()} VNĐ`,
          });

          navigate("/employee/medical-records");
        }
      } catch (error) {
        console.log(error);
        notification.error({
          title: "Thanh toán thất bại",
        });
        setBankTransferModalOpen(false);
      }
    }, 3500)

    return () => {
      clearInterval(intervalId);
    }

  }, [bankTransferModalOpen, setBankTransferModalOpen, recordId, totalPrice]);

  const bankInfo = {
    bankName: "MBBank",
    accountNumber: "VQRQAJNWQ0088",
    accountHolder: "VO VAN THUAN",
    amount: totalPrice,
  };

  const qrCodeUrl = `https://qr.sepay.vn/img?bank=MBBank&acc=${bankInfo.accountNumber}&template=&amount=${totalPrice}&des=Thanh+toan+don+goi+mon`;

//   const handleConfirmPayment = () => {
//     notification.success({
//       message: "Thanh toán thành công",
//       description: "Đơn gọi món của bạn đã được thanh toán thành công",
//       duration: 2,
//     });
//     setBankTransferModalOpen(false);
//   };

  return (
    <>
      <style>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 100%;
          }
        }
      `}</style>

      <Modal
        open={bankTransferModalOpen}
        onCancel={() => setBankTransferModalOpen(false)}
        width={500}
        centered
        closeIcon={<CloseOutlined />}
        footer={null}
      >
        <div className="bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-8 text-white -m-6 mb-6 rounded-t-2xl">
            <div className="flex items-center justify-center mb-2">
              <CheckCircleOutlined className="text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-center">Thanh toán chuyển khoản</h2>
            <p className="text-red-100 text-center text-sm mt-1">
              Quét mã QR hoặc nhập thông tin dưới đây
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            {/* QR CODE SECTION */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="relative w-64 h-64 bg-white rounded-2xl p-4 shadow-2xl border-2 border-slate-200 overflow-hidden">
                  {/* Scanning line */}
                  <div
                    className="absolute inset-x-0 h-0.5 bg-red-500 shadow-lg shadow-red-500"
                    style={{
                      animation: "scan 2s ease-in-out infinite",
                      top: "0%",
                    }}
                  />

                  {/* QR Image - prevent right-click and drag */}
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Thanh toán"
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                </div>

                {/* Corner decorations */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-red-500 rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-red-500 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-red-500 rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-red-500 rounded-br-lg" />
              </div>
            </div>

            {/* Amount Display */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Số tiền cần thanh toán</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(bankInfo.amount)}
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gradient-to-br from-slate-50 to-slate-100 text-xs text-gray-500 font-medium">
                  Thông tin chuyển khoản
                </span>
              </div>
            </div>

            {/* Payment Info Cards */}
            <div className="space-y-3">
              {/* Bank */}
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Ngân hàng
                </p>
                <p className="text-lg font-bold text-gray-900">{bankInfo.bankName}</p>
              </div>

              {/* Account Holder */}
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Tên tài khoản
                </p>
                <p className="text-lg font-bold text-gray-900">{bankInfo.accountHolder}</p>
              </div>

              {/* Account Number */}
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Số tài khoản
                </p>
                <p className="text-lg font-bold font-mono text-gray-900 tracking-widest">
                  {bankInfo.accountNumber}
                </p>
              </div>
            </div>

            {/* Quick Instructions */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">💡 Hướng dẫn nhanh</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">1.</span>
                  <span>Quét mã QR bằng ứng dụng ngân hàng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">2.</span>
                  <span>Hoặc nhập thông tin chuyển khoản ở trên</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold flex-shrink-0">3.</span>
                  <span>Nhấn "Đã chuyển khoản" khi hoàn tất</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setBankTransferModalOpen(false)}
                className="flex-1 rounded-xl h-12 text-base font-semibold border-2 border-gray-200 hover:border-gray-400 text-gray-700"
              >
                Huỷ bỏ
              </Button>
              <Button
                type="primary"
                onClick={handleConfirmPayment}
                className="flex-1 rounded-xl h-12 text-base font-semibold bg-red-500 hover:bg-red-600 text-white border-0"
                size="large"
              >
                Đã chuyển khoản
              </Button>
            </div> */}
          </div>

          
        </div>
      </Modal>
    </>
  );
};