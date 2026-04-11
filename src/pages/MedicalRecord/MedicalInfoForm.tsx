import { zodResolver } from "@hookform/resolvers/zod";
import { Spin } from "antd";
import { Tag } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  symptoms: string | null;
  diagnosis: string | null;
  notes: string | null;
  payment_status: boolean;
  isLoading: boolean;
  onSaveMedicalInfo: (
    symptoms: string,
    diagnosis: string,
    notes: string,
  ) => Promise<void>;
};

const medicalFormSchema = z.object({
  symptoms: z
    .string()
    .min(3, { message: "Triệu chứng phải có ít nhất 3 ký tự" })
    .max(1000, { message: "Triệu chứng không quá 1000 ký tự" }),

  diagnosis: z
    .string()
    .min(3, { message: "Chẩn đoán phải có ít nhất 3 ký tự" })
    .max(1000, { message: "Chẩn đoán không quá 1000 ký tự" }),

  notes: z
    .string()
    .max(2000, { message: "Ghi chú không quá 2000 ký tự" })
    .optional()
    .or(z.literal("")), // cho phép rỗng
});

export const MedicalInfoForm = (props: Props) => {
  const { symptoms, diagnosis, notes, payment_status, isLoading, onSaveMedicalInfo } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof medicalFormSchema>>({
    resolver: zodResolver(medicalFormSchema),
    defaultValues: {
      symptoms: symptoms || undefined,
      diagnosis: diagnosis || undefined,
      notes: notes || undefined,
    },
  });

  useEffect(() => {
    if (symptoms || diagnosis || notes) {
      reset({
        symptoms: symptoms || "",
        diagnosis: diagnosis || "",
        notes: notes || "",
      });
    }
  }, [symptoms, diagnosis, notes, reset]);

  const onSubmit = async (data: z.infer<typeof medicalFormSchema>) => {
    await onSaveMedicalInfo(
      data.symptoms,
      data.diagnosis,
      data.notes as string,
    );
  };

  return (
    <Spin spinning={isLoading}>
      <div className="px-6 py-5 bg-white rounded-md shadow-sm">
        {/* Header */}
        <div className="flex gap-2 items-center mb-3">
          <Tag size={19} className="text-blue-500" />
          <h2 className="text-lg font-semibold">Thông tin khám</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-0.5">
                Triệu chứng
              </label>

              <textarea
                className="mt-1 block w-full px-2 pt-2 bg-gray-50 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                rows={4}
                placeholder="Nhập triệu chứng của bệnh nhân..."
                disabled={payment_status}
                {...register("symptoms")}
              />

              {/* error */}
              {errors.symptoms && (
                <p className="text-red-500 font-medium text-[13px] mt-1">
                  {errors.symptoms.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-0.5">
                Chẩn đoán
              </label>

              <textarea
                className="mt-1 block w-full px-2 pt-2 bg-gray-50 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                rows={4}
                placeholder="Nhập chẩn đoán của bệnh nhân..."
                disabled={payment_status}
                {...register("diagnosis")}
              />

              {errors.diagnosis && (
                <p className="text-red-500 font-medium text-[13px] mt-1">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col mt-4">
            <label className="text-sm font-medium text-gray-700 mb-0.5">
              Ghi chú
            </label>
            <textarea
              className="mt-1 block w-full px-2 pt-2 bg-gray-50 rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              rows={4}
              placeholder="Nhập ghi chú của bệnh nhân..."
              disabled={payment_status}
              {...register("notes")}
            />

            {errors.notes && (
              <p className="text-red-500 font-medium text-[13px] mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          {!payment_status && (
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="bg-blue-500 px-3 py-2 text-white text-[15px] rounded-md cursor-pointer hover:bg-blue-600 transition"
              >
                Lưu thông tin
              </button>
            </div>
          )}
        </form>
      </div>
    </Spin>
  );
};
