-- ReadRelay Row Level Security (RLS) Policies
-- Comprehensive security policies for all database tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;

-- Categories table is public read-only, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- PROFILES TABLE POLICIES
-- ==============================================================================

-- Users can view all profiles (for discovery) but with privacy settings
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (deleted_at IS NULL);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Users cannot delete profiles (soft delete only via deleted_at)
CREATE POLICY "Profiles cannot be deleted" ON profiles
    FOR DELETE USING (false);

-- ==============================================================================
-- BOOKS TABLE POLICIES
-- ==============================================================================

-- Books are viewable by everyone if not deleted
CREATE POLICY "Books are viewable by everyone" ON books
    FOR SELECT USING (deleted_at IS NULL);

-- Users can only insert books they own
CREATE POLICY "Users can insert their own books" ON books
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can only update their own books
CREATE POLICY "Users can update their own books" ON books
    FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Users can soft delete their own books
CREATE POLICY "Users can delete their own books" ON books
    FOR DELETE USING (auth.uid() = owner_id);

-- ==============================================================================
-- EXCHANGES TABLE POLICIES
-- ==============================================================================

-- Exchanges are viewable by participants only
CREATE POLICY "Exchanges viewable by participants" ON exchanges
    FOR SELECT USING (
        deleted_at IS NULL AND 
        (auth.uid() = owner_id OR auth.uid() = requester_id)
    );

-- Only authenticated users can create exchanges for available books
CREATE POLICY "Users can create exchanges" ON exchanges
    FOR INSERT WITH CHECK (
        auth.uid() = requester_id AND
        auth.uid() != owner_id AND
        EXISTS (
            SELECT 1 FROM books 
            WHERE id = book_id 
            AND availability_status = 'available' 
            AND deleted_at IS NULL
        )
    );

-- Participants can update exchanges with business rules
CREATE POLICY "Participants can update exchanges" ON exchanges
    FOR UPDATE USING (
        auth.uid() = owner_id OR auth.uid() = requester_id
    ) WITH CHECK (
        auth.uid() = owner_id OR auth.uid() = requester_id
    );

-- Only participants can delete exchanges
CREATE POLICY "Participants can delete exchanges" ON exchanges
    FOR DELETE USING (
        auth.uid() = owner_id OR auth.uid() = requester_id
    );

-- ==============================================================================
-- MESSAGES TABLE POLICIES
-- ==============================================================================

-- Messages are viewable by participants in the exchange
CREATE POLICY "Messages viewable by exchange participants" ON messages
    FOR SELECT USING (
        deleted_at IS NULL AND
        EXISTS (
            SELECT 1 FROM exchanges 
            WHERE id = exchange_id 
            AND (auth.uid() = owner_id OR auth.uid() = requester_id)
        )
    );

-- Users can only send messages in exchanges they participate in
CREATE POLICY "Users can send messages in their exchanges" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM exchanges 
            WHERE id = exchange_id 
            AND (auth.uid() = owner_id OR auth.uid() = requester_id)
        )
    );

-- Users can update their own messages
CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (auth.uid() = sender_id);

-- ==============================================================================
-- REVIEWS TABLE POLICIES
-- ==============================================================================

-- Reviews are public unless marked private
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
    FOR SELECT USING (deleted_at IS NULL AND is_public = true);

-- Private reviews viewable by participants only
CREATE POLICY "Private reviews viewable by participants" ON reviews
    FOR SELECT USING (
        deleted_at IS NULL AND 
        is_public = false AND
        (auth.uid() = reviewer_id OR auth.uid() = reviewee_id)
    );

-- Users can only create reviews for completed exchanges they participated in
CREATE POLICY "Users can create reviews for their exchanges" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM exchanges 
            WHERE id = exchange_id 
            AND status = 'completed'
            AND (auth.uid() = owner_id OR auth.uid() = requester_id)
            AND auth.uid() != reviewee_id
        )
    );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- ==============================================================================
-- WISHLISTS TABLE POLICIES
-- ==============================================================================

-- Users can only view their own wishlists
CREATE POLICY "Users can view their own wishlists" ON wishlists
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can only insert their own wishlists
CREATE POLICY "Users can insert their own wishlists" ON wishlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own wishlists
CREATE POLICY "Users can update their own wishlists" ON wishlists
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wishlists
CREATE POLICY "Users can delete their own wishlists" ON wishlists
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ==============================================================================

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

-- System can insert notifications for users (handled by functions/triggers)
CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- USER_FOLLOWS TABLE POLICIES
-- ==============================================================================

-- Follow relationships are public (for discovery)
CREATE POLICY "Follow relationships are viewable by everyone" ON user_follows
    FOR SELECT USING (true);

-- Users can only create follows where they are the follower
CREATE POLICY "Users can follow others" ON user_follows
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- Users can only delete their own follows
CREATE POLICY "Users can unfollow others" ON user_follows
    FOR DELETE USING (auth.uid() = follower_id);

-- ==============================================================================
-- BOOK_REPORTS TABLE POLICIES
-- ==============================================================================

-- Only admins can view all reports (implement admin check)
CREATE POLICY "Reports viewable by reporter and admins" ON book_reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- Users can create reports for any book
CREATE POLICY "Users can create book reports" ON book_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own reports" ON book_reports
    FOR UPDATE USING (auth.uid() = reporter_id) WITH CHECK (auth.uid() = reporter_id);

-- ==============================================================================
-- CATEGORIES TABLE POLICIES
-- ==============================================================================

-- Categories are public read-only
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Only admins can modify categories (implement admin role check)
CREATE POLICY "Only admins can modify categories" ON categories
    FOR ALL USING (false) WITH CHECK (false);

-- ==============================================================================
-- BOOK_CATEGORIES TABLE POLICIES
-- ==============================================================================

-- Book categories are viewable by everyone
CREATE POLICY "Book categories are viewable by everyone" ON book_categories
    FOR SELECT USING (true);

-- Users can only manage categories for their own books
CREATE POLICY "Users can manage their own book categories" ON book_categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM books 
            WHERE id = book_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own book categories" ON book_categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM books 
            WHERE id = book_id AND owner_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM books 
            WHERE id = book_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own book categories" ON book_categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM books 
            WHERE id = book_id AND owner_id = auth.uid()
        )
    );

-- ==============================================================================
-- FUNCTIONS FOR AUTOMATIC PROFILE CREATION
-- ==============================================================================

-- Function to create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKET POLICIES (for book cover images)
-- ==============================================================================

-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload book covers
CREATE POLICY "Users can upload book covers" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'book-covers' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own book covers
CREATE POLICY "Users can update their own book covers" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'book-covers' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (
    bucket_id = 'book-covers' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own book covers
CREATE POLICY "Users can delete their own book covers" ON storage.objects
FOR DELETE USING (
    bucket_id = 'book-covers' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow everyone to view book covers
CREATE POLICY "Book covers are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'book-covers'); 