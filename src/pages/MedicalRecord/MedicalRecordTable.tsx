import { BaseTable } from "../../components/Table";
import { getMedicalRecordColumns } from "./get-medical-record-columns";

type Props = {
  isLoading: boolean;
  data: any;
  pagination: any;
  onView: (id: string) => void;
  onDownload: (id: string) => Promise<void>;
  openPayment?: (recordId: string, patientName: string, doctorName: string) => void;
  loadingPdfId: string | null;
};

export const MedicalRecordTable = (props: Props) => {
  const {
    data,
    isLoading,
    pagination,
    onView,
    onDownload,
    openPayment,
    loadingPdfId,
  } = props;

  const columns = getMedicalRecordColumns({
    onViewMedicalRecordDetail: onView,
    onDownloadMedicalRecordPDF: onDownload,
    openPaymentModal: openPayment,
    loadingPdfId,
  });

  return (
    <BaseTable
      loading={isLoading}
      columns={columns}
      dataSource={data || []}
      pagination={pagination}
    />
  );
};
