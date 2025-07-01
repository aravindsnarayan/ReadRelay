# ReadRelay Database Package

This package contains the database schema, migrations, and TypeScript types for the ReadRelay book-sharing application.

## 📋 Overview

ReadRelay uses Supabase (PostgreSQL) as its backend database with comprehensive Row Level Security (RLS) policies to ensure data privacy and security.

## 🏗️ Database Schema

### Core Tables

#### **profiles**

User profiles extending Supabase auth.users

- Links to auth.users via foreign key
- Contains user metadata, preferences, and location data
- Automatic profile creation via trigger on user signup

#### **books**

Book catalog with detailed metadata

- Owner-based book management
- Support for physical condition tracking
- Integration with external book APIs
- Category association via junction table

#### **exchanges**

Book exchange transactions

- Supports borrow, swap, and give-away types
- Complete status tracking from request to completion
- Meeting coordination and rating system

#### **messages**

In-app messaging system

- Exchange-specific conversations
- Support for text, template, and system messages
- Read status tracking

#### **reviews**

User and exchange rating system

- Bidirectional reviews (owner ↔ requester)
- Public/private review options
- 1-5 star rating system

#### **wishlists**

User book wishlists

- Priority-based organization
- Notification system for availability
- ISBN-based book matching

#### **categories**

Hierarchical book categorization

- Support for nested categories
- Pre-populated with common genres

#### **notifications**

Real-time notification system

- Multiple notification types
- Expiration and read status tracking
- JSON metadata support

#### **user_follows**

Social following system

- Simple follower/following relationships
- Public visibility for discovery

#### **book_reports**

Content moderation system

- Community-driven book reporting
- Admin review workflow

## 🔐 Security Features

### Row Level Security (RLS)

All tables have comprehensive RLS policies:

- **User Data Isolation**: Users can only access their own data
- **Exchange Permissions**: Only exchange participants can view messages/details
- **Public Discovery**: Books and public reviews are discoverable by all users
- **Privacy Controls**: Users control visibility of personal information

### Data Encryption

- Sensitive fields use JSONB for flexible privacy settings
- Location data includes both text and coordinate options
- Phone numbers and personal data respect privacy preferences

## 🚀 Setup Instructions

### 1. Environment Variables

```bash
# Add to your .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Database Setup

The database is already configured with:

- ✅ Complete schema with all tables
- ✅ Row Level Security policies
- ✅ Storage bucket for book covers
- ✅ Automatic profile creation trigger
- ✅ Indexes for performance optimization
- ✅ Default categories populated

### 3. TypeScript Types

Generated types are available in `src/types/database.ts`:

```typescript
import type {
  Database,
  Profile,
  Book,
  Exchange,
} from '@readrelay/shared/types/database';
```

## 📊 Key Features

### Location Support

- Text-based location descriptions
- Latitude/longitude coordinates for mapping
- Preferred meeting locations array
- Privacy controls for location visibility

### File Storage

- Dedicated `book-covers` bucket
- User-specific upload permissions
- Public read access for cover images
- 10MB file size limit

### Notification System

- Real-time notifications via Supabase Realtime
- Email/push/SMS preference controls
- Automatic cleanup of expired notifications

### Social Features

- User following system
- Public book discovery
- Community-driven reporting
- Rating and review system

## 🔧 Database Functions

### `handle_new_user()`

Automatically creates a user profile when a new user signs up via Supabase Auth.

### `update_updated_at_column()`

Trigger function to automatically update `updated_at` timestamps.

## 📈 Performance Optimizations

### Indexes

Optimized indexes on frequently queried columns:

- User lookups (`profiles.username`)
- Book searches (`books.title`, `books.author`, `books.isbn`)
- Exchange queries (`exchanges.status`, `exchanges.book_id`)
- Message retrieval (`messages.exchange_id`)
- Geographic queries (`profiles.location_latitude`, `profiles.location_longitude`)

### Query Optimization

- Proper foreign key relationships for JOIN efficiency
- Selective RLS policies to minimize data scanning
- Soft deletes with `deleted_at` for data integrity

## 🛡️ Security Compliance

### Data Privacy

- GDPR-compliant soft deletion
- User-controlled privacy settings
- Minimal data collection principle
- Secure storage of sensitive information

### Security Advisors

Regular monitoring with Supabase security advisors:

- Function security validation
- RLS policy verification
- Extension security checks

## 🔄 Migration History

All database changes are tracked via Supabase migrations:

1. `initial_schema_setup` - Core table structure
2. `add_indexes_and_triggers` - Performance optimizations
3. `insert_default_categories` - Initial data population
4. `enable_rls_and_policies` - Security policies
5. `add_remaining_rls_policies` - Complete RLS coverage
6. `add_final_rls_policies` - Final security policies
7. `add_profile_creation_function` - Auto profile creation
8. `setup_storage_bucket` - File storage configuration

## 🚨 Important Notes

- The `spatial_ref_sys` table is a PostGIS system table and cannot be modified
- All user-uploaded files are stored in Supabase Storage
- Real-time subscriptions are available for all tables
- Backup and point-in-time recovery are enabled
- Database logs are available for debugging

## 🤝 Contributing

When adding new tables or modifying schema:

1. Create new migration files in `migrations/`
2. Update TypeScript types in `src/types/database.ts`
3. Add appropriate RLS policies
4. Update this documentation
5. Test with security advisor
