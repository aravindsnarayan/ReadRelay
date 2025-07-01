import { supabase } from '../lib/supabase';
import { validateInput } from '../utils/validation';
import {
  exchangeSchema,
  exchangeUpdateSchema,
  type ExchangeInput,
  type ExchangeUpdateInput,
} from '../utils/validation';
import type {
  Exchange,
  ExchangeInsert,
  ExchangeUpdate,
  Profile,
  Book,
} from '../types/database';
import { getCurrentUser } from './auth';

// Exchange result types
export interface ExchangeResult {
  success: boolean;
  error?: string;
  exchange?: Exchange & { book?: Book; owner?: Profile; requester?: Profile };
}

export interface ExchangesResult {
  success: boolean;
  error?: string;
  exchanges?: Array<
    Exchange & { book?: Book; owner?: Profile; requester?: Profile }
  >;
  total?: number;
  hasMore?: boolean;
}

// Create new exchange request
export const createExchange = async (
  exchangeData: ExchangeInput
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const validatedData = validateInput(exchangeSchema, exchangeData);

    // Get book details to find owner
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*, owner:profiles!books_owner_id_fkey(*)')
      .eq('id', validatedData.book_id)
      .eq('availability_status', 'available')
      .single();

    if (bookError || !book) {
      return { success: false, error: 'Book not found or not available' };
    }

    if (book.owner_id === user.id) {
      return { success: false, error: 'Cannot request your own book' };
    }

    const exchangeInsert: ExchangeInsert = {
      ...validatedData,
      owner_id: book.owner_id,
      requester_id: user.id,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('exchanges')
      .insert(exchangeInsert)
      .select(
        `
        *,
        book:books!exchanges_book_id_fkey(*),
        owner:profiles!exchanges_owner_id_fkey(*),
        requester:profiles!exchanges_requester_id_fkey(*)
      `
      )
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Update book status to exchanging
    await supabase
      .from('books')
      .update({ availability_status: 'exchanging' })
      .eq('id', validatedData.book_id);

    return { success: true, exchange: data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create exchange',
    };
  }
};

// Get exchange by ID
export const getExchange = async (
  exchangeId: string
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('exchanges')
      .select(
        `
        *,
        book:books!exchanges_book_id_fkey(*),
        owner:profiles!exchanges_owner_id_fkey(*),
        requester:profiles!exchanges_requester_id_fkey(*)
      `
      )
      .eq('id', exchangeId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Exchange not found' };
    }

    // Check if user has access to this exchange
    if (data.owner_id !== user.id && data.requester_id !== user.id) {
      return { success: false, error: 'Access denied to this exchange' };
    }

    return { success: true, exchange: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get exchange',
    };
  }
};

// Update exchange status and details
export const updateExchange = async (
  exchangeId: string,
  exchangeData: ExchangeUpdateInput
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const validatedData = validateInput(exchangeUpdateSchema, exchangeData);

    // Get current exchange to verify permissions
    const { data: currentExchange, error: getCurrentError } = await supabase
      .from('exchanges')
      .select('*, book:books!exchanges_book_id_fkey(*)')
      .eq('id', exchangeId)
      .single();

    if (getCurrentError || !currentExchange) {
      return { success: false, error: 'Exchange not found' };
    }

    // Check permissions
    if (
      currentExchange.owner_id !== user.id &&
      currentExchange.requester_id !== user.id
    ) {
      return { success: false, error: 'Access denied to this exchange' };
    }

    const updateData: ExchangeUpdate = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    };

    // Handle status-specific updates
    if (validatedData.status) {
      switch (validatedData.status) {
        case 'accepted':
          updateData.meeting_datetime = validatedData.meeting_datetime;
          updateData.meeting_location = validatedData.meeting_location;
          break;
        case 'completed':
          updateData.completed_at = new Date().toISOString();
          // Update book status back to available
          await supabase
            .from('books')
            .update({ availability_status: 'available' })
            .eq('id', currentExchange.book_id);
          break;
        case 'cancelled':
        case 'rejected':
          // Update book status back to available
          await supabase
            .from('books')
            .update({ availability_status: 'available' })
            .eq('id', currentExchange.book_id);
          break;
      }
    }

    // Prepare update data with clean status
    const cleanUpdateData: ExchangeUpdate = {};

    if (
      updateData.status &&
      [
        'pending',
        'accepted',
        'rejected',
        'in_progress',
        'completed',
        'cancelled',
      ].includes(updateData.status)
    ) {
      cleanUpdateData.status = updateData.status as
        | 'pending'
        | 'accepted'
        | 'rejected'
        | 'in_progress'
        | 'completed'
        | 'cancelled';
    }

    // Copy other valid fields
    if (updateData.meeting_datetime !== undefined)
      cleanUpdateData.meeting_datetime = updateData.meeting_datetime;
    if (updateData.meeting_location !== undefined)
      cleanUpdateData.meeting_location = updateData.meeting_location;
    if (updateData.notes !== undefined)
      cleanUpdateData.notes = updateData.notes;
    if (updateData.owner_rating !== undefined)
      cleanUpdateData.owner_rating = updateData.owner_rating;
    if (updateData.requester_rating !== undefined)
      cleanUpdateData.requester_rating = updateData.requester_rating;
    if (updateData.return_date !== undefined)
      cleanUpdateData.return_date = updateData.return_date;

    const { data, error } = await supabase
      .from('exchanges')
      .update(cleanUpdateData)
      .eq('id', exchangeId)
      .select(
        `
        *,
        book:books!exchanges_book_id_fkey(*),
        owner:profiles!exchanges_owner_id_fkey(*),
        requester:profiles!exchanges_requester_id_fkey(*)
      `
      )
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, exchange: data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update exchange',
    };
  }
};

// Get user's exchanges (as owner or requester)
export const getUserExchanges = async (
  status?: string,
  limit: number = 20,
  offset: number = 0
): Promise<ExchangesResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    let query = supabase
      .from('exchanges')
      .select(
        `
        *,
        book:books!exchanges_book_id_fkey(*),
        owner:profiles!exchanges_owner_id_fkey(*),
        requester:profiles!exchanges_requester_id_fkey(*)
      `,
        { count: 'exact' }
      )
      .or(`owner_id.eq.${user.id},requester_id.eq.${user.id}`);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { success: false, error: error.message };
    }

    const hasMore = count ? offset + limit < count : false;

    return {
      success: true,
      exchanges: data || [],
      total: count || 0,
      hasMore,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get user exchanges',
    };
  }
};

// Accept exchange request (owner only)
export const acceptExchange = async (
  exchangeId: string,
  meetingLocation?: string,
  meetingDatetime?: string
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify user is the owner
    const { data: exchange, error: getError } = await supabase
      .from('exchanges')
      .select('*')
      .eq('id', exchangeId)
      .eq('owner_id', user.id)
      .eq('status', 'pending')
      .single();

    if (getError || !exchange) {
      return { success: false, error: 'Exchange not found or access denied' };
    }

    return await updateExchange(exchangeId, {
      status: 'accepted',
      meeting_location: meetingLocation,
      meeting_datetime: meetingDatetime,
    });
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to accept exchange',
    };
  }
};

// Reject exchange request (owner only)
export const rejectExchange = async (
  exchangeId: string
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify user is the owner
    const { data: exchange, error: getError } = await supabase
      .from('exchanges')
      .select('*')
      .eq('id', exchangeId)
      .eq('owner_id', user.id)
      .eq('status', 'pending')
      .single();

    if (getError || !exchange) {
      return { success: false, error: 'Exchange not found or access denied' };
    }

    return await updateExchange(exchangeId, {
      status: 'rejected',
    });
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to reject exchange',
    };
  }
};

// Complete exchange (either party)
export const completeExchange = async (
  exchangeId: string,
  rating?: number
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get exchange details
    const { data: exchange, error: getError } = await supabase
      .from('exchanges')
      .select('*')
      .eq('id', exchangeId)
      .single();

    if (getError || !exchange) {
      return { success: false, error: 'Exchange not found' };
    }

    // Check if user is part of this exchange
    if (exchange.owner_id !== user.id && exchange.requester_id !== user.id) {
      return { success: false, error: 'Access denied to this exchange' };
    }

    const updateData: {
      status: 'completed';
      owner_rating?: number;
      requester_rating?: number;
    } = {
      status: 'completed',
    };

    // Add rating based on user role
    if (rating) {
      if (exchange.owner_id === user.id) {
        updateData.owner_rating = rating;
      } else {
        updateData.requester_rating = rating;
      }
    }

    return await updateExchange(exchangeId, updateData);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to complete exchange',
    };
  }
};

// Cancel exchange (requester only, before acceptance)
export const cancelExchange = async (
  exchangeId: string
): Promise<ExchangeResult> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Verify user is the requester and exchange is still pending
    const { data: exchange, error: getError } = await supabase
      .from('exchanges')
      .select('*')
      .eq('id', exchangeId)
      .eq('requester_id', user.id)
      .eq('status', 'pending')
      .single();

    if (getError || !exchange) {
      return {
        success: false,
        error: 'Exchange not found or cannot be cancelled',
      };
    }

    return await updateExchange(exchangeId, {
      status: 'cancelled',
    });
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to cancel exchange',
    };
  }
};
