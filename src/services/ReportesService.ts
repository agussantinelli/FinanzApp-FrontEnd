import { http } from "@/lib/http";

const ENDPOINT = "/api/reportes";


function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export async function downloadPortfolioPdf(id: string, filename: string = 'reporte-portafolio.pdf'): Promise<void> {
    const response = await http.get(`/api/portafolios/${id}/reporte/pdf`, {
        responseType: 'blob'
    });
    downloadBlob(response.data, filename);
}

export async function downloadPortfolioExcel(id: string, filename: string = 'reporte-portafolio.xlsx'): Promise<void> {
    const response = await http.get(`/api/portafolios/${id}/reporte/excel`, {
        responseType: 'blob'
    });
    downloadBlob(response.data, filename);
}

export async function downloadMisOperacionesPdf(filename: string = 'mis-operaciones.pdf'): Promise<void> {
    const response = await http.get(`/api/operaciones/reporte/pdf`, {
        responseType: 'blob'
    });
    downloadBlob(response.data, filename);
}

export async function downloadMisOperacionesExcel(filename: string = 'mis-operaciones.xlsx'): Promise<void> {
    const response = await http.get(`/api/operaciones/reporte/excel`, {
        responseType: 'blob'
    });
    downloadBlob(response.data, filename);
}
