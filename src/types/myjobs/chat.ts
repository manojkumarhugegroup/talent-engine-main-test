// types/resourceRequirements.types.ts

import { JobDataType } from "@/types/jobs/editRR.type";

export interface ResourceRequirementsLayoutProps {
  data: JobDataType | null;
  loading?: boolean;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping?: boolean;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
}

export interface RrInfoProps {
  setFullscreenSection?: (section: string | null) => void;
  isFull?: boolean;
  data: JobDataType | null;
  loading?: boolean;
}

export interface HeaderProps {
  isEditMode: boolean;
  onEditModeToggle: () => void;
  onSave: () => void;
  onSubmit: () => void;
  onBack?: () => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

export interface ChatHeaderProps {
  title?: string;
  context?: string;
  onRefresh?: () => void;
}

// Enums for better type safety
export enum MessageSender {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected'
}

export enum FullscreenSection {
  LIST = 'list',
  CHAT = 'chat'
}

// Event handler types
export type MessageHandler = (message: string) => void;
export type FullscreenHandler = (section: string | null) => void;
export type EditModeHandler = () => void;
export type SaveHandler = () => void;
export type SubmitHandler = () => void;