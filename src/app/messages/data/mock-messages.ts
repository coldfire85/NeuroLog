import { MessageContact, Message } from "../models/message-models";

// Current user
export const currentUser = {
  id: "current-user",
  name: "Dr. John Smith",
  role: "Neurosurgeon",
  avatar: ""
};

// Demo contacts
export const demoContacts: MessageContact[] = [
  {
    id: "user1",
    name: "Dr. Sarah Johnson",
    role: "Functional Neurosurgeon",
    institution: "Mayo Clinic",
    avatar: "",
    status: "online",
    lastMessage: {
      text: "Thanks for sending those MRI scans. I'll review them and get back to you shortly.",
      time: "10:42 AM",
      read: true
    },
    unreadCount: 0,
    pinned: true,
    verified: true
  },
  {
    id: "user2",
    name: "Dr. Michael Chen",
    role: "Neuro-oncologist",
    institution: "Stanford Medical",
    avatar: "",
    status: "online",
    lastMessage: {
      text: "Would you like to schedule a call to discuss the tumor resection approach?",
      time: "Yesterday",
      read: false
    },
    unreadCount: 2,
    pinned: true,
    verified: true
  },
  {
    id: "user3",
    name: "Dr. Robert Williams",
    role: "Pediatric Neurosurgeon",
    institution: "Children's Hospital",
    avatar: "",
    status: "away",
    lastMessage: {
      text: "I just shared a case study on congenital hydrocephalus in infants that might interest you.",
      time: "2 days ago",
      read: true
    },
    unreadCount: 0,
    pinned: false,
    verified: false
  },
  {
    id: "user4",
    name: "Dr. Emily Patel",
    role: "Cerebrovascular Surgeon",
    institution: "University Hospital",
    avatar: "",
    status: "offline",
    lastMessage: {
      text: "Thanks for your insights on the aneurysm case. Your approach was very helpful.",
      time: "1 week ago",
      read: true
    },
    unreadCount: 0,
    pinned: false,
    verified: true
  },
  {
    id: "user5",
    name: "Dr. James Wilson",
    role: "Spine Surgeon",
    institution: "Memorial Hospital",
    avatar: "",
    status: "busy",
    lastMessage: {
      text: "I've attached the X-rays for the L4-L5 fusion case we discussed.",
      time: "2 weeks ago",
      read: true
    },
    unreadCount: 0,
    pinned: false,
    verified: true
  }
];

// Demo messages
export const demoMessages: Record<string, Message[]> = {
  "user1": [
    {
      id: "msg1",
      senderId: "current-user",
      receiverId: "user1",
      content: "Hi Dr. Johnson, I'm working on a complex DBS case and would appreciate your insights. Could I send you the patient's MRIs?",
      timestamp: "10:30 AM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg2",
      senderId: "user1",
      receiverId: "current-user",
      content: "Hello Dr. Smith, of course, I'd be happy to take a look. Please send them over.",
      timestamp: "10:35 AM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg3",
      senderId: "current-user",
      receiverId: "user1",
      content: "Great, thank you. Here are the MRI scans from last week.",
      timestamp: "10:38 AM",
      status: "read",
      attachments: [
        {
          id: "att1",
          type: "image",
          url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2669&auto=format&fit=crop",
          name: "Patient_MRI_sagittal.jpg",
          size: "2.4 MB",
          thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2669&auto=format&fit=crop"
        },
        {
          id: "att2",
          type: "image",
          url: "https://images.unsplash.com/photo-1582606338003-4bc93ca4979c?q=80&w=2670&auto=format&fit=crop",
          name: "Patient_MRI_coronal.jpg",
          size: "2.1 MB",
          thumbnail: "https://images.unsplash.com/photo-1582606338003-4bc93ca4979c?q=80&w=2670&auto=format&fit=crop"
        }
      ],
      isDeleted: false
    },
    {
      id: "msg4",
      senderId: "user1",
      receiverId: "current-user",
      content: "Thanks for sending those MRI scans. I'll review them and get back to you shortly.",
      timestamp: "10:42 AM",
      status: "read",
      isDeleted: false
    }
  ],
  "user2": [
    {
      id: "msg5",
      senderId: "user2",
      receiverId: "current-user",
      content: "Hi Dr. Smith, I saw your recent case on glioblastoma resection. Very impressive work on the eloquent area approach.",
      timestamp: "Yesterday, 2:15 PM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg6",
      senderId: "current-user",
      receiverId: "user2",
      content: "Thank you, Dr. Chen. I used fluorescence guidance which greatly improved visualization of the margins.",
      timestamp: "Yesterday, 3:05 PM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg7",
      senderId: "user2",
      receiverId: "current-user",
      content: "That's interesting. I have a similar case coming up next week. Could you share the protocol you used for the fluorescence guidance?",
      timestamp: "Yesterday, 3:30 PM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg8",
      senderId: "current-user",
      receiverId: "user2",
      content: "Absolutely. I'll put together the protocol details and send them over to you tomorrow.",
      timestamp: "Yesterday, 4:12 PM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg9",
      senderId: "user2",
      receiverId: "current-user",
      content: "That would be extremely helpful, thanks!",
      timestamp: "Yesterday, 4:15 PM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg10",
      senderId: "user2",
      receiverId: "current-user",
      content: "Would you like to schedule a call to discuss the tumor resection approach?",
      timestamp: "Yesterday, 6:45 PM",
      status: "delivered",
      isDeleted: false
    },
    {
      id: "msg11",
      senderId: "user2",
      receiverId: "current-user",
      content: "I'm available tomorrow afternoon or Friday morning if that works for you.",
      timestamp: "Yesterday, 6:47 PM",
      status: "delivered",
      isDeleted: false
    }
  ],
  "user3": [
    {
      id: "msg12",
      senderId: "user3",
      receiverId: "current-user",
      content: "Dr. Smith, I wanted to share a case study I recently published on congenital hydrocephalus in infants.",
      timestamp: "2 days ago, 11:22 AM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg13",
      senderId: "user3",
      receiverId: "current-user",
      content: "Here's the case study with the pre and post-op imaging.",
      timestamp: "2 days ago, 11:25 AM",
      status: "read",
      attachments: [
        {
          id: "att3",
          type: "file",
          url: "#",
          name: "Congenital_Hydrocephalus_Case_Study.pdf",
          size: "4.7 MB"
        }
      ],
      isDeleted: false
    },
    {
      id: "msg14",
      senderId: "current-user",
      receiverId: "user3",
      content: "Thank you for sharing this, Dr. Williams. I've been seeing more of these cases lately. Your approach to ETV looks promising.",
      timestamp: "2 days ago, 1:45 PM",
      status: "read",
      isDeleted: false
    },
    {
      id: "msg15",
      senderId: "user3",
      receiverId: "current-user",
      content: "I just shared a case study on congenital hydrocephalus in infants that might interest you.",
      timestamp: "2 days ago, 2:03 PM",
      status: "read",
      isDeleted: false
    }
  ]
};
