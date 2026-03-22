import { http } from "@/lib/http";
import { AiChatRequest, AiChatResponse } from "@/types/Ai";

const ENDPOINT = "/api/ai/chat";

export async function chatWithAi(message: string): Promise<string> {
    const request: AiChatRequest = { prompt: message };
    const { data } = await http.post<AiChatResponse>(ENDPOINT, request);
    return data.respuesta;
}

export async function streamChatWithAi(message: string, onChunk: (text: string) => void): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}${ENDPOINT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
    });

    if (!response.ok) throw new Error("Error en la comunicación con la IA");

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No se pudo inicializar el lector de stream");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const chunk = line.substring(6);
                if (chunk) onChunk(chunk);
            }
        }
    }
}