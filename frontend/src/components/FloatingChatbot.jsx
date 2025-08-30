import React, { useState, useRef } from "react";
import csIcon from "../assets/cs.png";
import ChatbotService from "../services/user/ChatbotService";

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! Ada yang bisa dibantu?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await ChatbotService.chat(
        newMessages.map(({ role, content }) => ({ role, content }))
      );
      if (!response.body) throw new Error("No response body");
      let botMsg = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data:")) {
            try {
              const { content } = JSON.parse(line.replace("data:", "").trim());
              if (content) {
                botMsg += content;
                setMessages((msgs) => {
                  if (
                    msgs[msgs.length - 1]?.role === "assistant" &&
                    msgs[msgs.length - 1].streaming
                  ) {
                    return [
                      ...msgs.slice(0, -1),
                      { role: "assistant", content: botMsg, streaming: true },
                    ];
                  } else {
                    return [
                      ...msgs,
                      { role: "assistant", content: content, streaming: true },
                    ];
                  }
                });
              }
            } catch {}
          }
        });
      }
      setMessages((msgs) =>
        msgs.map((m, i) =>
          i === msgs.length - 1 && m.role === "assistant"
            ? { ...m, streaming: false }
            : m
        )
      );
    } catch (err) {
      setError("Gagal terhubung ke chatbot. Coba lagi nanti.");
    }
    setLoading(false);
    scrollToBottom();
  };

  return (
    <div style={{ fontFamily: "poppins" }}>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Buka Chatbot"
      >
        <img src={csIcon} alt="Chatbot" style={{ width: 36, height: 36 }} />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 340,
            maxWidth: "90vw",
            height: 420,
            background: "rgba(255,255,255,0.98)",
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "#1976d2",
              color: "#fff",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Asisten Desa</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
              aria-label="Tutup Chatbot"
            >
              ×
            </button>
          </div>
          {/* Chat Area */}
          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              background: "#f7fafd",
              fontSize: 15,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 12,
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {msg.role === "assistant" ? (
                  <img
                    src={csIcon}
                    alt="Bot"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      marginRight: 8,
                      marginLeft: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#1976d2",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      marginLeft: 8,
                      marginRight: 0,
                    }}
                  >
                    U
                  </div>
                )}
                <div
                  style={{
                    background: msg.role === "user" ? "#e3f0ff" : "#fff",
                    borderRadius: 8,
                    padding: "8px 12px",
                    maxWidth: "75%",
                    boxShadow:
                      msg.role === "assistant"
                        ? "0 1px 4px rgba(25,118,210,0.07)"
                        : "none",
                    fontStyle: msg.streaming ? "italic" : "normal",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Error */}
          {error && (
            <div
              style={{
                color: "#d32f2f",
                padding: "0 16px 8px 16px",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}
          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              display: "flex",
              borderTop: "1px solid #e0e0e0",
              padding: 10,
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                loading ? "Menunggu jawaban..." : "Tulis pertanyaan..."
              }
              disabled={loading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 15,
                background: "transparent",
              }}
              autoFocus={open}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSend(e);
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 16px",
                marginLeft: 8,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              {loading ? "..." : "Kirim"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
