import { http } from "@/lib/http";
import { AiChatRequest, AiChatResponse } from "@/types/Ai";

const ENDPOINT = "/api/ai/chat";

export async function chatWithAi(message: string): Promise<string> {
    const request: AiChatRequest = { prompt: message };
    const { data } = await http.post<AiChatResponse>(ENDPOINT, request);
    return data.respuesta;
}
