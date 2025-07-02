import { z } from 'zod';
export declare const uuidSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const phoneSchema: z.ZodOptional<z.ZodString>;
export declare const usernameSchema: z.ZodString;
export declare const profileSchema: z.ZodObject<
  {
    username: z.ZodString;
    full_name: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodString>;
    location_text: z.ZodOptional<z.ZodString>;
    location_latitude: z.ZodOptional<z.ZodNumber>;
    location_longitude: z.ZodOptional<z.ZodNumber>;
    preferred_meeting_locations: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    phone: z.ZodOptional<z.ZodString>;
    notification_preferences: z.ZodOptional<
      z.ZodObject<
        {
          email: z.ZodDefault<z.ZodBoolean>;
          push: z.ZodDefault<z.ZodBoolean>;
          sms: z.ZodDefault<z.ZodBoolean>;
        },
        'strip',
        z.ZodTypeAny,
        {
          push: boolean;
          email: boolean;
          sms: boolean;
        },
        {
          push?: boolean | undefined;
          email?: boolean | undefined;
          sms?: boolean | undefined;
        }
      >
    >;
    privacy_settings: z.ZodOptional<
      z.ZodObject<
        {
          location_visible: z.ZodDefault<z.ZodBoolean>;
          phone_visible: z.ZodDefault<z.ZodBoolean>;
        },
        'strip',
        z.ZodTypeAny,
        {
          location_visible: boolean;
          phone_visible: boolean;
        },
        {
          location_visible?: boolean | undefined;
          phone_visible?: boolean | undefined;
        }
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    full_name: string;
    username: string;
    avatar_url?: string | undefined;
    bio?: string | undefined;
    location_latitude?: number | undefined;
    location_longitude?: number | undefined;
    location_text?: string | undefined;
    notification_preferences?:
      | {
          push: boolean;
          email: boolean;
          sms: boolean;
        }
      | undefined;
    phone?: string | undefined;
    preferred_meeting_locations?: string[] | undefined;
    privacy_settings?:
      | {
          location_visible: boolean;
          phone_visible: boolean;
        }
      | undefined;
  },
  {
    full_name: string;
    username: string;
    avatar_url?: string | undefined;
    bio?: string | undefined;
    location_latitude?: number | undefined;
    location_longitude?: number | undefined;
    location_text?: string | undefined;
    notification_preferences?:
      | {
          push?: boolean | undefined;
          email?: boolean | undefined;
          sms?: boolean | undefined;
        }
      | undefined;
    phone?: string | undefined;
    preferred_meeting_locations?: string[] | undefined;
    privacy_settings?:
      | {
          location_visible?: boolean | undefined;
          phone_visible?: boolean | undefined;
        }
      | undefined;
  }
>;
export declare const profileUpdateSchema: z.ZodObject<
  {
    username: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location_text: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location_latitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    location_longitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    preferred_meeting_locations: z.ZodOptional<
      z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>
    >;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notification_preferences: z.ZodOptional<
      z.ZodOptional<
        z.ZodObject<
          {
            email: z.ZodDefault<z.ZodBoolean>;
            push: z.ZodDefault<z.ZodBoolean>;
            sms: z.ZodDefault<z.ZodBoolean>;
          },
          'strip',
          z.ZodTypeAny,
          {
            push: boolean;
            email: boolean;
            sms: boolean;
          },
          {
            push?: boolean | undefined;
            email?: boolean | undefined;
            sms?: boolean | undefined;
          }
        >
      >
    >;
    privacy_settings: z.ZodOptional<
      z.ZodOptional<
        z.ZodObject<
          {
            location_visible: z.ZodDefault<z.ZodBoolean>;
            phone_visible: z.ZodDefault<z.ZodBoolean>;
          },
          'strip',
          z.ZodTypeAny,
          {
            location_visible: boolean;
            phone_visible: boolean;
          },
          {
            location_visible?: boolean | undefined;
            phone_visible?: boolean | undefined;
          }
        >
      >
    >;
  } & {
    avatar_url: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    avatar_url?: string | undefined;
    bio?: string | undefined;
    full_name?: string | undefined;
    location_latitude?: number | undefined;
    location_longitude?: number | undefined;
    location_text?: string | undefined;
    notification_preferences?:
      | {
          push: boolean;
          email: boolean;
          sms: boolean;
        }
      | undefined;
    phone?: string | undefined;
    preferred_meeting_locations?: string[] | undefined;
    privacy_settings?:
      | {
          location_visible: boolean;
          phone_visible: boolean;
        }
      | undefined;
    username?: string | undefined;
  },
  {
    avatar_url?: string | undefined;
    bio?: string | undefined;
    full_name?: string | undefined;
    location_latitude?: number | undefined;
    location_longitude?: number | undefined;
    location_text?: string | undefined;
    notification_preferences?:
      | {
          push?: boolean | undefined;
          email?: boolean | undefined;
          sms?: boolean | undefined;
        }
      | undefined;
    phone?: string | undefined;
    preferred_meeting_locations?: string[] | undefined;
    privacy_settings?:
      | {
          location_visible?: boolean | undefined;
          phone_visible?: boolean | undefined;
        }
      | undefined;
    username?: string | undefined;
  }
>;
export declare const bookConditionSchema: z.ZodEnum<
  ['excellent', 'good', 'fair', 'poor']
>;
export declare const exchangeTypeSchema: z.ZodEnum<
  ['borrow', 'swap', 'give_away']
>;
export declare const availabilityStatusSchema: z.ZodEnum<
  ['available', 'exchanging', 'unavailable']
>;
export declare const bookSchema: z.ZodObject<
  {
    title: z.ZodString;
    author: z.ZodString;
    isbn: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    publisher: z.ZodOptional<z.ZodString>;
    publication_year: z.ZodOptional<z.ZodNumber>;
    language: z.ZodDefault<z.ZodString>;
    genre: z.ZodOptional<z.ZodString>;
    condition: z.ZodEnum<['excellent', 'good', 'fair', 'poor']>;
    exchange_type: z.ZodEnum<['borrow', 'swap', 'give_away']>;
    cover_image_url: z.ZodOptional<z.ZodString>;
    max_borrow_days: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>;
    external_id: z.ZodOptional<z.ZodString>;
    external_source: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    author: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    exchange_type: 'borrow' | 'swap' | 'give_away';
    language: string;
    title: string;
    description?: string | undefined;
    cover_image_url?: string | undefined;
    external_id?: string | undefined;
    external_source?: string | undefined;
    genre?: string | undefined;
    isbn?: string | undefined;
    max_borrow_days?: number | undefined;
    publication_year?: number | undefined;
    publisher?: string | undefined;
    tags?: string[] | undefined;
  },
  {
    author: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    exchange_type: 'borrow' | 'swap' | 'give_away';
    title: string;
    description?: string | undefined;
    cover_image_url?: string | undefined;
    external_id?: string | undefined;
    external_source?: string | undefined;
    genre?: string | undefined;
    isbn?: string | undefined;
    language?: string | undefined;
    max_borrow_days?: number | undefined;
    publication_year?: number | undefined;
    publisher?: string | undefined;
    tags?: string[] | undefined;
  }
>;
export declare const bookUpdateSchema: z.ZodObject<
  {
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    publisher: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    publication_year: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    language: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    genre: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    condition: z.ZodOptional<z.ZodEnum<['excellent', 'good', 'fair', 'poor']>>;
    exchange_type: z.ZodOptional<z.ZodEnum<['borrow', 'swap', 'give_away']>>;
    max_borrow_days: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>>;
    external_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    external_source: z.ZodOptional<z.ZodOptional<z.ZodString>>;
  } & {
    cover_image_url: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    description?: string | undefined;
    author?: string | undefined;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | undefined;
    cover_image_url?: string | undefined;
    exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
    external_id?: string | undefined;
    external_source?: string | undefined;
    genre?: string | undefined;
    isbn?: string | undefined;
    language?: string | undefined;
    max_borrow_days?: number | undefined;
    publication_year?: number | undefined;
    publisher?: string | undefined;
    tags?: string[] | undefined;
    title?: string | undefined;
  },
  {
    description?: string | undefined;
    author?: string | undefined;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | undefined;
    cover_image_url?: string | undefined;
    exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
    external_id?: string | undefined;
    external_source?: string | undefined;
    genre?: string | undefined;
    isbn?: string | undefined;
    language?: string | undefined;
    max_borrow_days?: number | undefined;
    publication_year?: number | undefined;
    publisher?: string | undefined;
    tags?: string[] | undefined;
    title?: string | undefined;
  }
>;
export declare const exchangeStatusSchema: z.ZodEnum<
  ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled']
>;
export declare const exchangeSchema: z.ZodObject<
  {
    book_id: z.ZodString;
    exchange_type: z.ZodEnum<['borrow', 'swap', 'give_away']>;
    return_date: z.ZodOptional<z.ZodString>;
    meeting_location: z.ZodOptional<z.ZodString>;
    meeting_datetime: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    book_id: string;
    exchange_type: 'borrow' | 'swap' | 'give_away';
    meeting_datetime?: string | undefined;
    meeting_location?: string | undefined;
    notes?: string | undefined;
    return_date?: string | undefined;
  },
  {
    book_id: string;
    exchange_type: 'borrow' | 'swap' | 'give_away';
    meeting_datetime?: string | undefined;
    meeting_location?: string | undefined;
    notes?: string | undefined;
    return_date?: string | undefined;
  }
>;
export declare const exchangeUpdateSchema: z.ZodObject<
  {
    book_id: z.ZodOptional<z.ZodString>;
    exchange_type: z.ZodOptional<z.ZodEnum<['borrow', 'swap', 'give_away']>>;
    return_date: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    meeting_location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    meeting_datetime: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
  } & {
    status: z.ZodOptional<
      z.ZodEnum<
        [
          'pending',
          'accepted',
          'rejected',
          'in_progress',
          'completed',
          'cancelled',
        ]
      >
    >;
  },
  'strip',
  z.ZodTypeAny,
  {
    book_id?: string | undefined;
    status?:
      | 'pending'
      | 'accepted'
      | 'rejected'
      | 'in_progress'
      | 'completed'
      | 'cancelled'
      | undefined;
    exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
    meeting_datetime?: string | undefined;
    meeting_location?: string | undefined;
    notes?: string | undefined;
    return_date?: string | undefined;
  },
  {
    book_id?: string | undefined;
    status?:
      | 'pending'
      | 'accepted'
      | 'rejected'
      | 'in_progress'
      | 'completed'
      | 'cancelled'
      | undefined;
    exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
    meeting_datetime?: string | undefined;
    meeting_location?: string | undefined;
    notes?: string | undefined;
    return_date?: string | undefined;
  }
>;
export declare const messageTypeSchema: z.ZodEnum<
  ['text', 'template', 'system', 'location']
>;
export declare const messageSchema: z.ZodObject<
  {
    exchange_id: z.ZodString;
    receiver_id: z.ZodString;
    content: z.ZodString;
    message_type: z.ZodDefault<
      z.ZodEnum<['text', 'template', 'system', 'location']>
    >;
    template_data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
  },
  'strip',
  z.ZodTypeAny,
  {
    exchange_id: string;
    receiver_id: string;
    content: string;
    message_type: 'text' | 'template' | 'system' | 'location';
    template_data?: Record<string, any> | undefined;
  },
  {
    exchange_id: string;
    receiver_id: string;
    content: string;
    message_type?: 'text' | 'template' | 'system' | 'location' | undefined;
    template_data?: Record<string, any> | undefined;
  }
>;
export declare const reviewTypeSchema: z.ZodEnum<['owner', 'requester']>;
export declare const reviewSchema: z.ZodObject<
  {
    exchange_id: z.ZodString;
    reviewee_id: z.ZodString;
    rating: z.ZodNumber;
    review_text: z.ZodOptional<z.ZodString>;
    review_type: z.ZodEnum<['owner', 'requester']>;
    is_public: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    exchange_id: string;
    reviewee_id: string;
    is_public: boolean;
    rating: number;
    review_type: 'owner' | 'requester';
    review_text?: string | undefined;
  },
  {
    exchange_id: string;
    reviewee_id: string;
    rating: number;
    review_type: 'owner' | 'requester';
    is_public?: boolean | undefined;
    review_text?: string | undefined;
  }
>;
export declare const wishlistPrioritySchema: z.ZodEnum<
  ['low', 'medium', 'high']
>;
export declare const wishlistSchema: z.ZodObject<
  {
    title: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodEnum<['low', 'medium', 'high']>>;
    notification_enabled: z.ZodDefault<z.ZodBoolean>;
  },
  'strip',
  z.ZodTypeAny,
  {
    title: string;
    notification_enabled: boolean;
    priority: 'low' | 'medium' | 'high';
    description?: string | undefined;
    author?: string | undefined;
    isbn?: string | undefined;
  },
  {
    title: string;
    description?: string | undefined;
    author?: string | undefined;
    isbn?: string | undefined;
    notification_enabled?: boolean | undefined;
    priority?: 'low' | 'medium' | 'high' | undefined;
  }
>;
export declare const locationSchema: z.ZodObject<
  {
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
  },
  'strip',
  z.ZodTypeAny,
  {
    latitude: number;
    longitude: number;
  },
  {
    latitude: number;
    longitude: number;
  }
>;
export declare const radiusSearchSchema: z.ZodObject<
  {
    center: z.ZodObject<
      {
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
      },
      'strip',
      z.ZodTypeAny,
      {
        latitude: number;
        longitude: number;
      },
      {
        latitude: number;
        longitude: number;
      }
    >;
    radius_km: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
  },
  'strip',
  z.ZodTypeAny,
  {
    center: {
      latitude: number;
      longitude: number;
    };
    radius_km: number;
    limit: number;
    offset: number;
  },
  {
    center: {
      latitude: number;
      longitude: number;
    };
    radius_km?: number | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
  }
>;
export declare const bookSearchSchema: z.ZodEffects<
  z.ZodObject<
    {
      query: z.ZodOptional<z.ZodString>;
      author: z.ZodOptional<z.ZodString>;
      genre: z.ZodNullable<z.ZodOptional<z.ZodString>>;
      condition: z.ZodOptional<
        z.ZodEnum<['excellent', 'good', 'fair', 'poor']>
      >;
      exchange_type: z.ZodOptional<z.ZodEnum<['borrow', 'swap', 'give_away']>>;
      availability_status: z.ZodOptional<
        z.ZodEnum<['available', 'exchanging', 'unavailable']>
      >;
      owner_id: z.ZodOptional<z.ZodString>;
      limit: z.ZodDefault<z.ZodNumber>;
      offset: z.ZodDefault<z.ZodNumber>;
    },
    'strip',
    z.ZodTypeAny,
    {
      limit: number;
      offset: number;
      owner_id?: string | undefined;
      author?: string | undefined;
      availability_status?:
        | 'available'
        | 'exchanging'
        | 'unavailable'
        | undefined;
      condition?: 'excellent' | 'good' | 'fair' | 'poor' | undefined;
      exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
      genre?: string | null | undefined;
      query?: string | undefined;
    },
    {
      owner_id?: string | undefined;
      author?: string | undefined;
      availability_status?:
        | 'available'
        | 'exchanging'
        | 'unavailable'
        | undefined;
      condition?: 'excellent' | 'good' | 'fair' | 'poor' | undefined;
      exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
      genre?: string | null | undefined;
      limit?: number | undefined;
      offset?: number | undefined;
      query?: string | undefined;
    }
  >,
  {
    genre: string | undefined;
    limit: number;
    offset: number;
    owner_id?: string | undefined;
    author?: string | undefined;
    availability_status?:
      | 'available'
      | 'exchanging'
      | 'unavailable'
      | undefined;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | undefined;
    exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
    query?: string | undefined;
  },
  {
    owner_id?: string | undefined;
    author?: string | undefined;
    availability_status?:
      | 'available'
      | 'exchanging'
      | 'unavailable'
      | undefined;
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | undefined;
    exchange_type?: 'borrow' | 'swap' | 'give_away' | undefined;
    genre?: string | null | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    query?: string | undefined;
  }
>;
export declare const loginSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string;
    password: string;
  },
  {
    email: string;
    password: string;
  }
>;
export declare const registerSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
    username: z.ZodString;
    full_name: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    full_name: string;
    username: string;
    email: string;
    password: string;
  },
  {
    full_name: string;
    username: string;
    email: string;
    password: string;
  }
>;
export declare const resetPasswordSchema: z.ZodObject<
  {
    email: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string;
  },
  {
    email: string;
  }
>;
export declare const updatePasswordSchema: z.ZodObject<
  {
    current_password: z.ZodString;
    new_password: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    current_password: string;
    new_password: string;
  },
  {
    current_password: string;
    new_password: string;
  }
>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type BookUpdateInput = z.infer<typeof bookUpdateSchema>;
export type ExchangeInput = z.infer<typeof exchangeSchema>;
export type ExchangeUpdateInput = z.infer<typeof exchangeUpdateSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type WishlistInput = z.infer<typeof wishlistSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type RadiusSearchInput = z.infer<typeof radiusSearchSchema>;
export type BookSearchInput = z.infer<typeof bookSearchSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export declare const validateInput: <T>(
  schema: z.ZodSchema<T>,
  data: unknown
) => T;
export declare const safeValidateInput: <T>(
  schema: z.ZodSchema<T>,
  data: unknown
) =>
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: z.ZodError;
    };
//# sourceMappingURL=validation.d.ts.map
