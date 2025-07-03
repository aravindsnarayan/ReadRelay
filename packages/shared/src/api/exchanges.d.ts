import { type ExchangeInput, type ExchangeUpdateInput } from '../utils/validation';
import type { Exchange, Profile, Book } from '../types/database';
export interface ExchangeResult {
    success: boolean;
    error?: string;
    exchange?: Exchange & {
        book?: Book;
        owner?: Profile;
        requester?: Profile;
    };
}
export interface ExchangesResult {
    success: boolean;
    error?: string;
    exchanges?: Array<Exchange & {
        book?: Book;
        owner?: Profile;
        requester?: Profile;
    }>;
    total?: number;
    hasMore?: boolean;
}
export declare const createExchange: (exchangeData: ExchangeInput) => Promise<ExchangeResult>;
export declare const getExchange: (exchangeId: string) => Promise<ExchangeResult>;
export declare const updateExchange: (exchangeId: string, exchangeData: ExchangeUpdateInput) => Promise<ExchangeResult>;
export declare const getUserExchanges: (status?: string, limit?: number, offset?: number) => Promise<ExchangesResult>;
export declare const acceptExchange: (exchangeId: string, meetingLocation?: string, meetingDatetime?: string) => Promise<ExchangeResult>;
export declare const rejectExchange: (exchangeId: string) => Promise<ExchangeResult>;
export declare const completeExchange: (exchangeId: string, rating?: number) => Promise<ExchangeResult>;
export declare const cancelExchange: (exchangeId: string) => Promise<ExchangeResult>;
//# sourceMappingURL=exchanges.d.ts.map