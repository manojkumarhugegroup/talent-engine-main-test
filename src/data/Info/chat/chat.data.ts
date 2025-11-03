export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  online: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

export interface ChatData {
  contact: Contact;
  messages: Message[];
  participants: string[];
}

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'John',
    role: 'Candidate',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    lastMessage: "You're shortlisted! Interview slot is open.",
    timestamp: '15:41',
    unread: true,
    online: true
  },
  {
    id: '2',
    name: 'Monika',
    role: 'Recruiter',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    lastMessage: 'We received your application.',
    timestamp: '08:35',
    unread: true,
    online: false
  },
  {
    id: '3',
    name: 'Sophia Reynolds',
    role: 'HR',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    lastMessage: 'We received your application.',
    timestamp: '08:33',
    unread: true,
    online: false
  },
  {
    id: '4',
    name: 'Ethan Hayes',
    role: 'Recruiter',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    lastMessage: 'Recruiter viewed your resume.',
    timestamp: 'Yesterday',
    unread: false,
    online: false
  },
  {
    id: '5',
    name: 'Liam Brooks',
    role: 'HR',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
    lastMessage: 'Salary expectations noted.',
    timestamp: 'Friday',
    unread: false,
    online: false
  }
];

export const chatData: Record<string, ChatData> = {
  '1': {
    contact: contacts[0],
    participants: ['John (recruiter)', 'Maddy (Customer - HR)', 'Joe (TE - Recruiter)'],
    messages: [
      {
        id: '1',
        senderId: '1',
        senderName: 'John',
        senderRole: 'Recruiter',
        content: 'Hi sir, Is it possible for me to be picked up from Shanghai instead of Beijing for my initial relocation?',
        timestamp: '10:41AM',
        type: 'received'
      },
      {
        id: '2',
        senderId: '2',
        senderName: 'Joe',
        senderRole: 'TE - Recruiter',
        content: 'Hi John! Thanks for asking. Yes, we can arrange pickup from Shanghai instead of Beijing. Just make sure to update your travel preferences in the portal.',
        timestamp: '10:45AM',
        type: 'received'
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'John',
        senderRole: 'Recruiter',
        content: "That's great, thank you! Another question—will lunch be provided during office hours?",
        timestamp: '10:47AM',
        type: 'sent'
      },
      {
        id: '4',
        senderId: '3',
        senderName: 'Maddy',
        senderRole: 'Customer - HR',
        content: "Yes, lunch is provided during working days at the site. You'll have access to the cafeteria with both vegetarian and non-vegetarian options available.",
        timestamp: '10:55AM',
        type: 'received'
      },
      {
        id: '5',
        senderId: '1',
        senderName: 'John',
        senderRole: 'Recruiter',
        content: 'Perfect, thank you.',
        timestamp: '10:47AM',
        type: 'sent'
      },
      {
        id: '6',
        senderId: '1',
        senderName: 'John',
        senderRole: 'Recruiter',
        content: '@Lora can you please confirm if the medical insurance includes coverage for my spouse and children?',
        timestamp: '10:47AM',
        type: 'sent'
      },
      {
        id: '7',
        senderId: '4',
        senderName: 'Lora',
        senderRole: 'AI',
        content: 'Yes John, it covers your spouse and two children—see "Benefits" in the onboarding document.',
        timestamp: '1:12PM',
        type: 'received'
      }
    ]
  },
  '2': {
    contact: contacts[1],
    participants: ['Monika (Recruiter)', 'Sarah (HR Manager)', 'Alex (Team Lead)'],
    messages: [
      {
        id: '1',
        senderId: '2',
        senderName: 'Monika',
        senderRole: 'Recruiter',
        content: 'Hi! I wanted to follow up on your application for the Senior Developer position.',
        timestamp: '08:30AM',
        type: 'received'
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        senderRole: 'Recruiter',
        content: 'Thank you for reaching out! I\'m very interested in the position.',
        timestamp: '08:32AM',
        type: 'sent'
      },
      {
        id: '3',
        senderId: '2',
        senderName: 'Monika',
        senderRole: 'Recruiter',
        content: 'Great! We\'d like to schedule a technical interview. Are you available this week?',
        timestamp: '08:35AM',
        type: 'received'
      },
      {
        id: '4',
        senderId: 'me',
        senderName: 'You',
        senderRole: 'Recruiter',
        content: 'Yes, I\'m available Thursday or Friday afternoon. What time works best?',
        timestamp: '08:37AM',
        type: 'sent'
      },
      {
        id: '5',
        senderId: '3',
        senderName: 'Sarah',
        senderRole: 'HR Manager',
        content: '@Monika can we schedule it for Friday at 2 PM? I\'ll send the calendar invite.',
        timestamp: '08:40AM',
        type: 'received'
      },
      {
        id: '6',
        senderId: '2',
        senderName: 'Monika',
        senderRole: 'Recruiter',
        content: 'Perfect! Friday at 2 PM works. You\'ll receive a calendar invite shortly with the meeting details.',
        timestamp: '08:42AM',
        type: 'received'
      }
    ]
  }
};

export const mentionableUsers = [
  { id: '1', name: 'John', role: 'Recruiter' },
  { id: '2', name: 'Monika', role: 'Recruiter' },
  { id: '3', name: 'Maddy', role: 'Customer - HR' },
  { id: '4', name: 'Joe', role: 'TE - Recruiter' },
  { id: '5', name: 'Lora', role: 'AI' },
  { id: '6', name: 'Sarah', role: 'HR Manager' },
  { id: '7', name: 'Alex', role: 'Team Lead' }
];