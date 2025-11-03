"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  chatData,
  Contact,
  contacts,
  mentionableUsers,
} from "@/data/Info/chat/chat.data";
import { RadioGroup, RadioGroupItem } from "@/components/forms/CustomeRadio";
import { Label } from "@/components/ui/label";
import { CusInput } from "@/components/forms/CusInput";
import { CusTextarea } from "@/components/forms/CusTextarea";
// import { contacts, chatData, mentionableUsers, type Contact, type Message } from './chat.data';

export default function ChatInterface() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChatData = chatData[selectedContact.id];
  const currentMessages = currentChatData?.messages || [];
  const currentParticipants = currentChatData?.participants || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedContact]);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setMessageInput("");
    setShowMentions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    setMessageInput(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf("@", cursorPosition - 1);
    if (lastAtIndex !== -1) {
      const textAfterAt = value.substring(lastAtIndex + 1, cursorPosition);
      if (!textAfterAt.includes(" ") && textAfterAt.length <= 20) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (userName: string) => {
    const beforeMention = messageInput.substring(0, mentionPosition);
    const afterMention = messageInput.substring(
      mentionPosition + mentionQuery.length + 1
    );
    setMessageInput(`${beforeMention}@${userName} ${afterMention}`);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const filteredMentions = mentionableUsers.filter((user) =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "candidate":
        return "text-blue-600 bg-blue-50 border-blue-300 text-xs";
      case "te - recruiter":
      case "recruiter":
        return "text-purple-600 bg-purple-50 border-purple-300 text-xs";
      case "customer - hr":
      case "hr manager":
      case "hr":
        return "text-orange-600 bg-orange-50 border-orange-300 text-xs";
      case "team lead":
        return "text-green-600 bg-green-50 border-green-300 text-xs";
      default:
        return "text-gray-600 bg-gray-50 border-gray-300 text-xs";
    }
  };

  const getMessageBgColor = (type: string, role: string) => {
    if (type === "sent") return "bg-yellow-50 text-label";

    switch (role.toLowerCase()) {
      case "candidate":
        return "bg-blue-50 text-gray-800 border border-blue-100";
      case "te - recruiter":
      case "recruiter":
        return "bg-purple-50 text-gray-800 border border-purple-100";
      case "customer - hr":
      case "hr manager":
      case "hr":
        return "bg-orange-50 text-gray-800 border border-orange-100";
      case "team lead":
        return "bg-green-50 text-gray-800 border border-green-100";
      default:
        return "bg-gray-50 text-gray-800 border border-gray-100";
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
      setShowMentions(false);
    }
  };

  return (
    <div className="mx-auto h-[calc(80vh-3.5rem)] overflow-auto p-2 pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
        {/* Contacts Card */}
        <Card className="lg:col-span-1 shadow-none border bg-card/80 backdrop-blur-sm py-0 gap-0 ">
          <CardHeader className="p-2 ">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-md font-bold text-gray-900">
                  Chat ({contacts.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Discuss each candidate with the recruiter
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-gray-50/50 border-gray-200 rounded-md focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[calc(56vh-1rem)]">
              <div className="px-2 pb-2 space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={cn(
                      "flex items-center gap-2 p-2 cursor-pointer transition-all duration-200 hover:shadow-xs border border-transparent rounded-md group hover:bg-blue-50",
                      selectedContact.id === contact.id &&
                        "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {contact.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      )}
                    </div>

                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-label truncate group-hover:text-blue-600 transition-colors">
                          {contact.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">
                            {contact.timestamp}
                          </span>
                          {contact.unread && (
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"></div>
                          )}
                        </div>
                      </div>
                      {/* <p className="text-xs text-(--muted-foreground) truncate leading-relaxed max-w-3/4">
                        {contact.lastMessage}
                      </p> */}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Card */}
        <Card className="lg:col-span-2 shadow-none border bg-card/80 backdrop-blur-sm flex flex-col py-0 gap-0">
          {/* Chat Header */}
          <CardHeader className="p-2  bg-primary text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <Avatar className="w-8 h-8 ring-2 ring-white/20">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback className="bg-card/20 text-white font-semibold">
                  {selectedContact.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-base font-semibold">
                  {selectedContact.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-(--secondary)">
                  <Users className="w-4 h-4" />
                  <span>{currentParticipants.join(", ")}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 pt-2 pb-0 px-0 flex flex-col justify-between">
            <ScrollArea className="h-[calc(56vh-1rem)] px-2">
              <div className="space-y-6">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4 group",
                      message.type === "sent" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.type === "received" && (
                      <Avatar className="w-8 h-8 mt-1 ring-2 ring-gray-100">
                        <AvatarImage
                          src={`https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs">
                          {message.senderName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-md flex flex-col rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ease-in-out",
                        message.type === "sent" ? "items-end" : "items-start",
                        getMessageBgColor(message.type, message.senderRole),
                        message.type === "sent"
                          ? "rounded-br-md"
                          : "rounded-bl-md"
                      )}
                    >
                      {message.type === "received" && (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 relative">
                            <span className="text-xs font-semibold text-gray-900">
                              {message.senderName}
                            </span>
                            {message.senderRole !== "AI" ? (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded ",
                                  getRoleColor(message.senderRole)
                                )}
                              >
                                {message.senderRole}
                              </Badge>
                            ) : (
                              <img
                                src={"/assets/icons/job-info/loraAI_w.svg"}
                                alt="Printer"
                                className="h-4 w-4 cursor-pointer absolute -top-1.5 -right-4"
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            {message.timestamp}
                          </p>
                        </div>
                      )}

                      <div className={cn("group-hover:")}>
                        <p className="text-xs leading-relaxed">
                          {message.content.split(/(@\w+)/).map((part, index) =>
                            part.startsWith("@") ? (
                              <span
                                key={index}
                                className="font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-md"
                              >
                                {part}
                              </span>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </p>
                        {message.type === "sent" && (
                          <div className="text-xs text-gray-500 mt-2 text-right font-medium">
                            {message.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-gray-100 p-0 bg-gray-50/50 relative">
              {showMentions && filteredMentions.length > 0 && (
                <Card className="absolute bottom-20 left-6 right-6 shadow-none border-0 bg-card/95 backdrop-blur-sm z-10">
                  <CardContent className="p-2">
                    <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                      Mention someone
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filteredMentions.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                          onClick={() => handleMentionSelect(user.name)}
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop" />
                            <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs">
                              {user.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="relative p-1">
                <CusTextarea
                  mHeight="60px"
                  // {...register("special_notes")}
                  // error={errors.special_notes?.message}
                />

                <Button
                  type="submit"
                  size="icon"
                  // disabled={!messageInput.trim()}
                  className="absolute end-2 bottom-2 right-2 h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
