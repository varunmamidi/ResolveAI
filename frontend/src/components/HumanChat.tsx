
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

import { createChatSocket } from "../services/socket";

interface Message {
  id: number;
  escalationId: number;
  senderId: number;
  content: string;
  createdAt: string;
}

interface Props {
  escalationId: number;
  token: string;
  currentUserId: number;
}

export default function HumanChat({
  escalationId,
  token,
  currentUserId
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = createChatSocket(token);
    socketRef.current = socket;

    async function loadHistory() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/${escalationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load chat history");
        }

        const result = await response.json();
        setMessages(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Request failed"
        );
      }
    }

    socket.on("connect", () => {
      socket.emit(
        "join_escalation",
        { escalationId },
        (result: { success: boolean; message?: string }) => {
          if (result.success) {
            setConnected(true);
            setError("");
          } else {
            setConnected(false);
            setError(result.message || "Unable to join chat");
          }
        }
      );
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err: Error) => {
      setConnected(false);
      setError(err.message);
    });

    socket.on("new_message", (message: Message) => {
      setMessages(previous => {
        if (previous.some(item => item.id === message.id)) {
          return previous;
        }

        return [...previous, message];
      });
    });

    loadHistory();
    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [escalationId, token]);

  function sendMessage() {
    const content = input.trim();

    if (!content || !connected || sending) return;

    const socket = socketRef.current;

    if (!socket) return;

    setSending(true);

    socket.timeout(10000).emit(
      "send_message",
      { escalationId, content },
      (
        err: Error | null,
        result?: { success: boolean; message?: string }
      ) => {
        setSending(false);

        if (err || !result?.success) {
          setError(
            result?.message || "Unable to send message"
          );
          return;
        }

        setInput("");
        setError("");
      }
    );
  }

  return (
    <div style={{ maxWidth: 650, margin: "20px auto" }}>
      <h2>Human Support Chat</h2>

      <p>
        Status: {connected ? "Connected" : "Disconnected"}
      </p>

      {error && <p role="alert">{error}</p>}

      <div
        style={{
          height: 350,
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: 12
        }}
      >
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              textAlign:
                message.senderId === currentUserId
                  ? "right"
                  : "left",
              marginBottom: 12
            }}
          >
            <strong>
              {message.senderId === currentUserId
                ? "You"
                : "Support"}
            </strong>

            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
          maxLength={2000}
          style={{ flex: 1, padding: 10 }}
        />

        <button
          onClick={sendMessage}
          disabled={!connected || sending || !input.trim()}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
