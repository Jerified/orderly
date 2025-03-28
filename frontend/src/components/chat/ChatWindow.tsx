"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { sendMessage, joinChatRoom, leaveChatRoom } from "@/lib/websocket";
import { addMessage, setMessages } from "@/store/slices/chat.slice";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  orderId: string;
}

export default function ChatWindow({ orderId }: ChatWindowProps) {
  const dispatch = useDispatch();
  const { messages, isConnected } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${orderId}/messages`);
        dispatch(setMessages(response.data.data.messages));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    joinChatRoom(orderId);

    return () => {
      leaveChatRoom(orderId);
    };
  }, [orderId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim() && user) {
      sendMessage(orderId, message);
      dispatch(
        addMessage({
          chatRoom: orderId,
          sender: user.id,
          senderRole: user.role,
          content: message,
          createdAt: new Date().toISOString(),
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
            isCurrentUser={msg.sender === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2 items-center">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message here..."
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
