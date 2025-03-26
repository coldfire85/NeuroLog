"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageContact } from "../models/message-models";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pin,
  CheckCircle2
} from "lucide-react";

interface MessagesListProps {
  contacts: MessageContact[];
  selectedContact: MessageContact | null;
  onSelectContact: (contact: MessageContact) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Status indicator colors
const statusColors: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500"
};

export function MessagesList({
  contacts,
  selectedContact,
  onSelectContact,
  searchQuery,
  onSearchChange
}: MessagesListProps) {
  const [showSearch, setShowSearch] = useState(false);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.role.toLowerCase().includes(query) ||
      contact.institution.toLowerCase().includes(query) ||
      (contact.lastMessage?.text.toLowerCase().includes(query))
    );
  });

  // Sort contacts: pinned first, then those with unread messages, then by last message time
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    // Pinned contacts come first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Then sort by unread count
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

    // Then by last message time (this would be better with actual timestamps)
    return 0;
  });

  return (
    <div className="flex flex-col h-[700px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Messages</h2>
        <div className="flex items-center gap-1">
          {showSearch ? (
            <div className="flex items-center w-full">
              <Input
                className="h-8 text-sm rounded-full"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full ml-1"
                onClick={() => {
                  setShowSearch(false);
                  onSearchChange("");
                }}
              >
                <span className="sr-only">Clear search</span>
                &times;
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Plus className="h-4 w-4" />
                <span className="sr-only">New message</span>
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {sortedContacts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No contacts found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedContacts.map((contact) => (
              <li
                key={contact.id}
                className={`relative cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <div className="flex items-start gap-3 p-3 pr-10">
                  {/* Avatar with status */}
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

                  {/* Contact info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="font-medium text-sm truncate">
                        {contact.name}
                      </span>
                      {contact.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 ml-1 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contact.role}
                    </p>

                    {contact.lastMessage && (
                      <p className={`text-xs mt-1 line-clamp-1 ${
                        !contact.lastMessage.read
                          ? "font-medium text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {contact.lastMessage.text}
                      </p>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {/* Time */}
                    {contact.lastMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.lastMessage.time}
                      </span>
                    )}

                    {/* Unread badge */}
                    {contact.unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white border-none h-5 min-w-5 flex items-center justify-center rounded-full">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>

                  {/* Pinned indicator */}
                  {contact.pinned && (
                    <div className="absolute top-3 right-3 text-blue-500">
                      <Pin className="h-3 w-3 rotate-45" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
