
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CusTextarea } from "@/components/forms/CusTextarea";

export enum MessageSender {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: MessageSender | "user" | "assistant";
  timestamp: Date;
}

interface ChatProps {
  chatMessages: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (msg: string) => void;
  handleSendMessage: () => void;
  handleKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  contextLabel?: string;
}

export default function Chat({
  chatMessages,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  handleKeyPress,
  contextLabel = "@Form",
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // mention states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = ["Project Details", "Responsibilities", "Special Notes"];

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentMessage(value);

    const cursorPos = e.target.selectionStart;
    const textUntilCursor = value.slice(0, cursorPos);

    const match = textUntilCursor.match(/@(\w*)$/);
    if (match) {
      setQuery(match[1]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Insert mention
  const handleSelectSuggestion = (item: string) => {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const textBefore = currentMessage.slice(0, cursorPos);
    const textAfter = currentMessage.slice(cursorPos);

    const newText = textBefore.replace(/@(\w*)$/, "@" + item) + " " + textAfter;
    setCurrentMessage(newText);

    setShowSuggestions(false);
    setQuery("");
    textareaRef.current.focus();
  };

  // Keyboard navigation
  const handleSuggestionKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div className="col-span-2 border-l rounded-xl bg-card flex flex-col sticky top-10 h-[calc(90vh-6rem)] shadow-md border overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-lg">Chat</h2>
          <Badge variant="outline" className="text-xs border-gray-300 bg-gray-100">
            {contextLabel}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">Ask questions about resource requirements</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="flex flex-col gap-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-28 text-gray-300">
              <h3 className="text-2xl font-medium">What can I help with?</h3>
              <p className="mt-2 text-sm">Type a message below to start the conversation</p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-card text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <p className="text-xs opacity-50 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 bg-card flex items-center gap-3 relative">
        <CusTextarea
          ref={textareaRef}
          value={currentMessage}
          onChange={handleChange}
          onKeyDown={(e) => {
            handleSuggestionKey(e);
            handleKeyPress?.(e);
          }}
          className="flex-1 min-h-[60px] resize-none border rounded-xl px-3 py-2 w-full"
          rows={2}
          placeholder="Type your message..."
        />

        <Button
          onClick={handleSendMessage}
          size="sm"
          variant="outline"
          className="p-2 rounded-full w-10 h-10 flex items-center justify-center transition"
        >
          <img src="/assets/icons/job-info/send.svg" alt="send" className="h-5 w-5" />
        </Button>

        {/* Suggestion dropdown (fixed below textarea) */}
        {showSuggestions && (
          <div className="absolute bottom-16 left-4 bg-white border rounded-md shadow-md z-50 w-60">
            {suggestions
              .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
              .map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(item)}
                  className={`px-3 py-2 cursor-pointer ${
                    idx === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                >
                  {item}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
