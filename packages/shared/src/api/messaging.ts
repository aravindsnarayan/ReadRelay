import { supabase } from '../lib/supabase';
import { validateInput } from '../utils/validation';
import { messageSchema, type MessageInput } from '../utils/validation';
import type {
  Message,
  MessageInsert,
  Profile,
  Exchange,
  Book,
} from '../types/database';
import { getCurrentUser } from './auth';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Message result types
export interface MessageResult {
  success: boolean;
  error?: string;
  message?: Message;
}

export interface MessagesResult {
  success: boolean;
  error?: string;
  messages?: Array<
    Message & { sender?: Partial<Profile>; receiver?: Partial<Profile> }
  >;
  total?: number;
  hasMore?: boolean;
}

// Send message
export const sendMessage = async (
  messageData: MessageInput
): Promise<MessageResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const validatedData = validateInput(messageSchema, messageData);

    const messageInsert: MessageInsert = {
      ...validatedData,
      sender_id: user.id,
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(messageInsert)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
};

// Get messages for an exchange
export const getExchangeMessages = async (
  exchangeId: string,
  limit: number = 50,
  offset: number = 0
): Promise<MessagesResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify user is part of the exchange
    const { data: exchange, error: exchangeError } = await supabase
      .from('exchanges')
      .select('owner_id, requester_id')
      .eq('id', exchangeId)
      .single();

    if (exchangeError) {
      return { success: false, error: exchangeError.message };
    }

    if (exchange.owner_id !== user.id && exchange.requester_id !== user.id) {
      return { success: false, error: 'Access denied to this exchange' };
    }

    const { data, error, count } = await supabase
      .from('messages')
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(id, username, full_name),
        receiver:profiles!messages_receiver_id_fkey(id, username, full_name)
      `,
        { count: 'exact' }
      )
      .eq('exchange_id', exchangeId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    const hasMore = count ? offset + limit < count : false;

    return {
      success: true,
      messages: data || [],
      total: count || 0,
      hasMore,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get messages',
    };
  }
};

// Get user conversations (exchanges with latest message)
export const getUserConversations = async (): Promise<{
  success: boolean;
  error?: string;
  conversations?: Array<{
    exchange: Exchange & {
      book?: Partial<Book>;
      owner?: Partial<Profile>;
      requester?: Partial<Profile>;
    };
    latest_message?: Message & { sender?: Partial<Profile> };
    unread_count: number;
  }>;
}> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get exchanges where user is either owner or requester
    const { data: exchanges, error: exchangesError } = await supabase
      .from('exchanges')
      .select(
        `
        *,
        book:books!exchanges_book_id_fkey(id, title, author, cover_image_url),
        owner:profiles!exchanges_owner_id_fkey(id, username, full_name),
        requester:profiles!exchanges_requester_id_fkey(id, username, full_name)
      `
      )
      .or(`owner_id.eq.${user.id},requester_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (exchangesError) {
      return { success: false, error: exchangesError.message };
    }

    if (!exchanges || exchanges.length === 0) {
      return { success: true, conversations: [] };
    }

    // Get latest message and unread count for each exchange
    const conversations = await Promise.all(
      exchanges.map(async exchange => {
        // Get latest message
        const { data: latestMessage } = await supabase
          .from('messages')
          .select(
            `
            *,
            sender:profiles!messages_sender_id_fkey(id, username, full_name)
          `
          )
          .eq('exchange_id', exchange.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get unread message count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('exchange_id', exchange.id)
          .eq('receiver_id', user.id)
          .eq('is_read', false);

        return {
          exchange,
          latest_message: latestMessage || undefined,
          unread_count: unreadCount || 0,
        };
      })
    );

    return { success: true, conversations };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get conversations',
    };
  }
};

// Mark messages as read
export const markMessagesAsRead = async (
  exchangeId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('exchange_id', exchangeId)
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to mark messages as read',
    };
  }
};

// Subscribe to new messages for an exchange
export const subscribeToExchangeMessages = (
  exchangeId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`messages:exchange_id=eq.${exchangeId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `exchange_id=eq.${exchangeId}`,
      },
      payload => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};

// Subscribe to all user messages
export const subscribeToUserMessages = (
  userId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`messages:receiver_id=eq.${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      payload => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};

// Unsubscribe from messages
export const unsubscribeFromMessages = (subscription: RealtimeChannel) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};

// Send template message (predefined messages for common exchanges)
export const sendTemplateMessage = async (
  exchangeId: string,
  receiverId: string,
  templateType:
    | 'exchange_request'
    | 'exchange_accepted'
    | 'exchange_rejected'
    | 'meeting_arranged'
    | 'exchange_completed',
  templateData?: Record<string, string>
): Promise<MessageResult> => {
  try {
    const templates = {
      exchange_request: `Hi! I'm interested in borrowing your book "{{book_title}}". Would you like to arrange an exchange?`,
      exchange_accepted: `Great! I've accepted your request to exchange "{{book_title}}". Let's arrange a meeting time and place.`,
      exchange_rejected: `Thank you for your interest in "{{book_title}}", but I'm not able to exchange it at this time.`,
      meeting_arranged: `I've suggested a meeting at {{location}} on {{date}} at {{time}}. Please let me know if this works for you!`,
      exchange_completed: `Thanks for the exchange! I hope you enjoy reading "{{book_title}}". Please don't forget to leave a review.`,
    };

    let content = templates[templateType];

    // Replace template variables
    if (templateData) {
      Object.keys(templateData).forEach(key => {
        content = content.replace(
          new RegExp(`{{${key}}}`, 'g'),
          templateData[key]
        );
      });
    }

    const messageData: MessageInput = {
      exchange_id: exchangeId,
      receiver_id: receiverId,
      content,
      message_type: 'template',
      template_data: templateData,
    };

    return await sendMessage(messageData);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send template message',
    };
  }
};

// Get unread message count for user
export const getUnreadMessageCount = async (): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get unread count',
    };
  }
};

// Delete message (soft delete by setting content to empty)
export const deleteMessage = async (
  messageId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('messages')
      .update({
        content: '[Message deleted]',
        deleted_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('sender_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete message',
    };
  }
};
