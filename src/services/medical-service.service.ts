import { supabase } from "../lib/supabase"

// Hàm lấy danh sách dịch vụ khám
export const selectMedicalService = async () => {
    return await supabase.from("services")
             .select(`
                service_id,
                service_name   
            `)
}

// Hàm trả về chi phí dịch vụ khám theo record_id
export const getServiceFee = async (recordId: string) => {
    const { data, error } = await supabase
        .from("medical_records")
        .select(`
            record_id,
            appointment_id,
            appointments:appointment_id (
                service_id,
                services:service_id (
                    service_id,
                    service_name,
                    price
                )
            )
        `)
        .eq("record_id", recordId)
        .single();

    if (error) throw error;

    const appointmentData: any = data?.appointments;
    
    // Nếu appointments là mảng, lấy phần tử 0. Nếu là object, lấy chính nó.
    const appointment = Array.isArray(appointmentData) ? appointmentData[0] : appointmentData;
    
    // Tương tự cho services nằm bên trong appointment
    const serviceData = appointment?.services;
    const serviceInfo = Array.isArray(serviceData) ? serviceData[0] : serviceData;

    return {
        record_id: data.record_id,
        appointment_id: data.appointment_id,
        services: serviceInfo || null,
    };
};