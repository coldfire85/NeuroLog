// Message contact model
export interface MessageContact {
  id: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastMessage?: {
    text: string;
    time: string;
    read: boolean;
  };
  unreadCount: number;
  pinned: boolean;
  verified: boolean;
}

// Message model
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    id: string;
    type: 'image' | 'file' | 'case' | 'radiology';
    url: string;
    name: string;
    size?: string;
    thumbnail?: string;
  }>;
  isDeleted: boolean;
}

// Conversation model - for tracking metadata about a conversation
export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageTime: string;
  lastMessagePreview: string;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
}
