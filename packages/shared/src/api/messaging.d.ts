import { type MessageInput } from '../utils/validation';
import type { Message, Profile, Exchange, Book } from '../types/database';
import type { RealtimeChannel } from '@supabase/supabase-js';
export interface MessageResult {
  success: boolean;
  error?: string;
  message?: Message;
}
export interface MessagesResult {
  success: boolean;
  error?: string;
  messages?: Array<
    Message & {
      sender?: Partial<Profile>;
      receiver?: Partial<Profile>;
    }
  >;
  total?: number;
  hasMore?: boolean;
}
export declare const sendMessage: (
  messageData: MessageInput
) => Promise<MessageResult>;
export declare const getExchangeMessages: (
  exchangeId: string,
  limit?: number,
  offset?: number
) => Promise<MessagesResult>;
export declare const getUserConversations: () => Promise<{
  success: boolean;
  error?: string;
  conversations?: Array<{
    exchange: Exchange & {
      book?: Partial<Book>;
      owner?: Partial<Profile>;
      requester?: Partial<Profile>;
    };
    latest_message?: Message & {
      sender?: Partial<Profile>;
    };
    unread_count: number;
  }>;
}>;
export declare const markMessagesAsRead: (exchangeId: string) => Promise<{
  success: boolean;
  error?: string;
}>;
export declare const subscribeToExchangeMessages: (
  exchangeId: string,
  callback: (message: Message) => void
) => RealtimeChannel;
export declare const subscribeToUserMessages: (
  userId: string,
  callback: (message: Message) => void
) => RealtimeChannel;
export declare const unsubscribeFromMessages: (
  subscription: RealtimeChannel
) => void;
export declare const sendTemplateMessage: (
  exchangeId: string,
  receiverId: string,
  templateType:
    | 'exchange_request'
    | 'exchange_accepted'
    | 'exchange_rejected'
    | 'meeting_arranged'
    | 'exchange_completed',
  templateData?: Record<string, string>
) => Promise<MessageResult>;
export declare const getUnreadMessageCount: () => Promise<{
  success: boolean;
  count?: number;
  error?: string;
}>;
export declare const deleteMessage: (messageId: string) => Promise<{
  success: boolean;
  error?: string;
}>;
//# sourceMappingURL=messaging.d.ts.map
