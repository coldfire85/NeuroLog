"use client";

import { useState, useEffect } from "react";
import { MessagesList } from "./components/messages-list";
import { MessageChat } from "./components/message-chat";
import { MessageContact } from "./models/message-models";
import { demoContacts, demoMessages } from "./data/mock-messages";

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<MessageContact | null>(null);
  const [contacts, setContacts] = useState<MessageContact[]>(demoContacts);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-select the first contact on initial load if none selected
  useEffect(() => {
    if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);

  return (
    <div className="container max-w-7xl py-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text inline-block">
        Messages
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm">
        {/* Messages list sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 border-r border-gray-200 dark:border-gray-700">
          <MessagesList
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Chat main area */}
        <div className="lg:col-span-8 xl:col-span-9">
          {selectedContact ? (
            <MessageChat
              contact={selectedContact}
              messages={demoMessages[selectedContact.id] || []}
            />
          ) : (
            <div className="h-[700px] flex items-center justify-center p-6 text-center">
              <div>
                <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Choose a colleague from the list to start a secure medical conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
