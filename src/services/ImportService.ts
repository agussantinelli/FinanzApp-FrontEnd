import { http } from "@/lib/http";
import { ImportConfirmDTO, ImportPreviewDTO } from "@/types/Import";

const ENDPOINT = "/api/import";

export const analyzeFile = async (file: File): Promise<ImportPreviewDTO> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await http.post<ImportPreviewDTO>(`${ENDPOINT}/analyze`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const confirmImport = async (dto: ImportConfirmDTO): Promise<{ message: string }> => {
    const { data } = await http.post<{ message: string }>(`${ENDPOINT}/confirm`, dto);
    return data;
};
