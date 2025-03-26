"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Phone,
  Video,
  Info,
  MoreHorizontal,
  Paperclip,
  Smile,
  SendHorizontal,
  ImageIcon,
  FileIcon,
  Check,
  CheckCheck
} from "lucide-react";
import { MessageContact, Message } from "../models/message-models";
import { currentUser } from "../data/mock-messages";
import { useToast } from "@/hooks/use-toast";

interface MessageChatProps {
  contact: MessageContact;
  messages: Message[];
}

// Function to format file size
const formatFileSize = (size: string): string => {
  return size;
};

// Status indicator colors
const statusColors: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500"
};

export function MessageChat({ contact, messages: initialMessages }: MessageChatProps) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages on changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Handle message send
  const handleSendMessage = () => {
    if (!text.trim()) return;

    // Create a new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: contact.id,
      content: text,
      timestamp: "Just now",
      status: "sent",
      isDeleted: false
    };

    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    setText("");

    // Simulate message delivery status change
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: "delivered" }
            : msg
        )
      );
    }, 1000);
  };

  // Get message status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[700px]">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              {contact.avatar ? (
                <AvatarImage src={contact.avatar} alt={contact.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  {contact.name.split(" ").map(name => name[0]).join("")}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Status indicator */}
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${statusColors[contact.status]}`}
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-medium">{contact.name}</span>
              {contact.verified && (
                <svg className="h-3.5 w-3.5 text-blue-500 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-7l-4-4 1.414-1.414L12 12.172l2.586-2.586L16 11l-4 4z" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
              <span className={`text-xs flex items-center gap-1 ${
                contact.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full inline-block ${statusColors[contact.status]}`} />
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex gap-2 max-w-[80%]">
                {/* Avatar for other user messages */}
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    {contact.avatar ? (
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {contact.name.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}

                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  {/* Message content */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      isCurrentUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={`rounded-lg overflow-hidden ${
                            isCurrentUser
                              ? 'bg-blue-100 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-800'
                              : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          {attachment.type === 'image' ? (
                            <div className="relative h-48 w-60">
                              <Image
                                src={attachment.url}
                                alt={attachment.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="p-3 flex items-center gap-3">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <FileIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{attachment.name}</p>
                                {attachment.size && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(attachment.size)}
                                  </p>
                                )}
                              </div>
                              <Button variant="ghost" size="sm" className="rounded-full">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Time and status */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp}
                    </span>
                    {isCurrentUser && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-32 pr-12 py-2.5 resize-none rounded-full"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                disabled={!text.trim()}
                className="h-8 w-8 rounded-full text-blue-500 disabled:text-gray-300"
                onClick={handleSendMessage}
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
