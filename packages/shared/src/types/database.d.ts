export type Json =
  | string
  | number
  | boolean
  | null
  | {
      [key: string]: Json | undefined;
    }
  | Json[];
export type Database = {
  public: {
    Tables: {
      book_categories: {
        Row: {
          book_id: string;
          category_id: string;
        };
        Insert: {
          book_id: string;
          category_id: string;
        };
        Update: {
          book_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'book_categories_book_id_fkey';
            columns: ['book_id'];
            isOneToOne: false;
            referencedRelation: 'books';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'book_categories_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      book_reports: {
        Row: {
          book_id: string;
          created_at: string | null;
          description: string | null;
          id: string;
          reason: string;
          reporter_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          book_id: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason: string;
          reporter_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          book_id?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason?: string;
          reporter_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'book_reports_book_id_fkey';
            columns: ['book_id'];
            isOneToOne: false;
            referencedRelation: 'books';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'book_reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      books: {
        Row: {
          author: string;
          availability_status: string | null;
          condition: string;
          cover_image_url: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          exchange_type: string;
          external_id: string | null;
          external_source: string | null;
          genre: string | null;
          id: string;
          isbn: string | null;
          language: string | null;
          max_borrow_days: number | null;
          owner_id: string;
          publication_year: number | null;
          publisher: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author: string;
          availability_status?: string | null;
          condition: string;
          cover_image_url?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          exchange_type: string;
          external_id?: string | null;
          external_source?: string | null;
          genre?: string | null;
          id?: string;
          isbn?: string | null;
          language?: string | null;
          max_borrow_days?: number | null;
          owner_id: string;
          publication_year?: number | null;
          publisher?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author?: string;
          availability_status?: string | null;
          condition?: string;
          cover_image_url?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          exchange_type?: string;
          external_id?: string | null;
          external_source?: string | null;
          genre?: string | null;
          id?: string;
          isbn?: string | null;
          language?: string | null;
          max_borrow_days?: number | null;
          owner_id?: string;
          publication_year?: number | null;
          publisher?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'books_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          parent_category_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          parent_category_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          parent_category_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_category_id_fkey';
            columns: ['parent_category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      exchanges: {
        Row: {
          book_id: string;
          completed_at: string | null;
          created_at: string | null;
          deleted_at: string | null;
          exchange_type: string;
          id: string;
          meeting_datetime: string | null;
          meeting_location: string | null;
          notes: string | null;
          owner_id: string;
          owner_rating: number | null;
          requester_id: string;
          requester_rating: number | null;
          return_date: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          book_id: string;
          completed_at?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          exchange_type: string;
          id?: string;
          meeting_datetime?: string | null;
          meeting_location?: string | null;
          notes?: string | null;
          owner_id: string;
          owner_rating?: number | null;
          requester_id: string;
          requester_rating?: number | null;
          return_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          book_id?: string;
          completed_at?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          exchange_type?: string;
          id?: string;
          meeting_datetime?: string | null;
          meeting_location?: string | null;
          notes?: string | null;
          owner_id?: string;
          owner_rating?: number | null;
          requester_id?: string;
          requester_rating?: number | null;
          return_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exchanges_book_id_fkey';
            columns: ['book_id'];
            isOneToOne: false;
            referencedRelation: 'books';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exchanges_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exchanges_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          created_at: string | null;
          deleted_at: string | null;
          exchange_id: string;
          id: string;
          is_read: boolean | null;
          message_type: string | null;
          read_at: string | null;
          receiver_id: string;
          sender_id: string;
          template_data: Json | null;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          deleted_at?: string | null;
          exchange_id: string;
          id?: string;
          is_read?: boolean | null;
          message_type?: string | null;
          read_at?: string | null;
          receiver_id: string;
          sender_id: string;
          template_data?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          exchange_id?: string;
          id?: string;
          is_read?: boolean | null;
          message_type?: string | null;
          read_at?: string | null;
          receiver_id?: string;
          sender_id?: string;
          template_data?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_exchange_id_fkey';
            columns: ['exchange_id'];
            isOneToOne: false;
            referencedRelation: 'exchanges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          content: string;
          created_at: string | null;
          data: Json | null;
          deleted_at: string | null;
          expires_at: string | null;
          id: string;
          is_read: boolean | null;
          read_at: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          data?: Json | null;
          deleted_at?: string | null;
          expires_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          read_at?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          data?: Json | null;
          deleted_at?: string | null;
          expires_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          read_at?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          deleted_at: string | null;
          full_name: string;
          id: string;
          is_verified: boolean | null;
          location_latitude: number | null;
          location_longitude: number | null;
          location_text: string | null;
          notification_preferences: Json | null;
          phone: string | null;
          preferred_meeting_locations: string[] | null;
          privacy_settings: Json | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          full_name: string;
          id: string;
          is_verified?: boolean | null;
          location_latitude?: number | null;
          location_longitude?: number | null;
          location_text?: string | null;
          notification_preferences?: Json | null;
          phone?: string | null;
          preferred_meeting_locations?: string[] | null;
          privacy_settings?: Json | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          full_name?: string;
          id?: string;
          is_verified?: boolean | null;
          location_latitude?: number | null;
          location_longitude?: number | null;
          location_text?: string | null;
          notification_preferences?: Json | null;
          phone?: string | null;
          preferred_meeting_locations?: string[] | null;
          privacy_settings?: Json | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          exchange_id: string;
          id: string;
          is_public: boolean | null;
          rating: number;
          review_text: string | null;
          review_type: string;
          reviewee_id: string;
          reviewer_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          exchange_id: string;
          id?: string;
          is_public?: boolean | null;
          rating: number;
          review_text?: string | null;
          review_type: string;
          reviewee_id: string;
          reviewer_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          exchange_id?: string;
          id?: string;
          is_public?: boolean | null;
          rating?: number;
          review_text?: string | null;
          review_type?: string;
          reviewee_id?: string;
          reviewer_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_exchange_id_fkey';
            columns: ['exchange_id'];
            isOneToOne: false;
            referencedRelation: 'exchanges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewee_id_fkey';
            columns: ['reviewee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_reviewer_id_fkey';
            columns: ['reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_follows: {
        Row: {
          created_at: string | null;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          created_at?: string | null;
          follower_id: string;
          following_id: string;
        };
        Update: {
          created_at?: string | null;
          follower_id?: string;
          following_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_follows_follower_id_fkey';
            columns: ['follower_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_follows_following_id_fkey';
            columns: ['following_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      wishlists: {
        Row: {
          author: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          isbn: string | null;
          notification_enabled: boolean | null;
          priority: string | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          author?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          isbn?: string | null;
          notification_enabled?: boolean | null;
          priority?: string | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          author?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          isbn?: string | null;
          notification_enabled?: boolean | null;
          priority?: string | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'wishlists_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
type DefaultSchema = Database[Extract<keyof Database, 'public'>];
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | {
        schema: keyof Database;
      },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | {
        schema: keyof Database;
      },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | {
        schema: keyof Database;
      },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;
export type Profile = Tables<'profiles'>;
export type Book = Tables<'books'>;
export type Exchange = Tables<'exchanges'>;
export type Message = Tables<'messages'>;
export type Review = Tables<'reviews'>;
export type Wishlist = Tables<'wishlists'>;
export type Category = Tables<'categories'>;
export type Notification = Tables<'notifications'>;
export type UserFollow = Tables<'user_follows'>;
export type BookReport = Tables<'book_reports'>;
export type BookCategory = Tables<'book_categories'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type BookInsert = TablesInsert<'books'>;
export type ExchangeInsert = TablesInsert<'exchanges'>;
export type MessageInsert = TablesInsert<'messages'>;
export type ReviewInsert = TablesInsert<'reviews'>;
export type WishlistInsert = TablesInsert<'wishlists'>;
export type NotificationInsert = TablesInsert<'notifications'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;
export type BookUpdate = TablesUpdate<'books'>;
export type ExchangeUpdate = TablesUpdate<'exchanges'>;
export type MessageUpdate = TablesUpdate<'messages'>;
export type ReviewUpdate = TablesUpdate<'reviews'>;
export type WishlistUpdate = TablesUpdate<'wishlists'>;
export type BookCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type AvailabilityStatus = 'available' | 'exchanging' | 'unavailable';
export type ExchangeType = 'borrow' | 'swap' | 'give_away';
export type ExchangeStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';
export type MessageType = 'text' | 'template' | 'system' | 'location';
export type ReviewType = 'owner' | 'requester';
export type WishlistPriority = 'low' | 'medium' | 'high';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export {};
//# sourceMappingURL=database.d.ts.map
