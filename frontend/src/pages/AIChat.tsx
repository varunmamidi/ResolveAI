
import { useState, type FormEvent } from "react";
import api from "../api/axios";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm ResolveAI. How can I help you today?"
    }
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendQuestion(e: FormEvent) {
    e.preventDefault();

    const text = question.trim();

    if (!text || loading) return;

    setMessages(previous => [
      ...previous,
      { role: "user", content: text }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        question: text
      });

      const result = response.data.data ??
        response.data;

      setMessages(previous => [
        ...previous,
        {
          role: "assistant",
          content: result.answer
        }
      ]);
    } catch {
      setMessages(previous => [
        ...previous,
        {
          role: "assistant",
          content:
            "The AI service is temporarily unavailable. You can request human support from the Human Support page."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>AI Support Assistant</h1>
        <p>Powered by Gemini and RAG</p>
      </div>

      <div className="content-card">
        <div className="ai-chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-bubble ${message.role}`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <form
          className="chat-input-form"
          onSubmit={sendQuestion}
        >
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a support question..."
          />

          <button
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
