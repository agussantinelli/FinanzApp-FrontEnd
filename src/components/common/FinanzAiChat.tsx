"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Typography, IconButton } from "@mui/material";
import { RiRobot2Line } from "react-icons/ri";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from 'react-markdown';
import { TypingIndicator } from "@/components/ui/TypingIndicator";
import styles from "./styles/FinanzAiChat.module.css";
import { chatWithAi } from "@/services/AiService";

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

export default function FinanzAiChat() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "¡Hola! Soy FinanzAI 🤖. ¿En qué puedo ayudarte hoy con tus inversiones?", sender: "ai" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || loading) return;

        const userMsg: Message = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setLoading(true);

        try {
            const responseText = await chatWithAi(userMsg.text);
            const aiMsg: Message = { id: Date.now() + 1, text: responseText, sender: "ai" };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = { id: Date.now() + 1, text: "Lo siento, tuve un problema al procesar tu consulta.", sender: "ai" };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    // Ocultar en auth
    if (pathname?.includes("/auth/login") || pathname?.includes("/auth/register")) {
        return null;
    }

    return (
        <Box className={styles.chatContainer}>
            {isOpen && (
                <Box className={styles.chatWindow}>
                    <Box className={styles.header}>
                        <Typography className={styles.headerTitle}>
                            <RiRobot2Line /> FinanzAI
                        </Typography>
                        <button onClick={toggleChat} className={styles.closeButton}>
                            <CloseIcon fontSize="small" />
                        </button>
                    </Box>

                    <Box className={styles.messagesContainer}>
                        {messages.map((msg) => (
                            <Box
                                key={msg.id}
                                className={`${styles.message} ${msg.sender === "user" ? styles.userMessage : styles.aiMessage
                                    }`}
                            >
                                <div className={styles.markdownContent}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </Box>
                        ))}
                        {loading && (
                            <Box className={`${styles.message} ${styles.aiMessage}`}>
                                <TypingIndicator />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <form className={styles.inputArea} onSubmit={handleSend}>
                        <textarea
                            className={styles.inputField}
                            placeholder="Escribe tu consulta..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={loading}
                            rows={1}
                        />
                        <button type="submit" className={styles.sendButton} disabled={loading || !inputValue.trim()}>
                            <SendIcon fontSize="small" />
                        </button>
                    </form>
                </Box>
            )}

            <button className={styles.fab} onClick={toggleChat} aria-label="Abrir asistente IA">
                {isOpen ? (
                    <CloseIcon className={styles.fabIcon} />
                ) : (
                    <RiRobot2Line className={styles.fabIcon} />
                )}
            </button>
        </Box>
    );
}
