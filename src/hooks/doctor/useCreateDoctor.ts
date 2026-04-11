import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDoctor } from "../../services/doctor.service";

export const useCreateDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors"]});
        }
    })
}