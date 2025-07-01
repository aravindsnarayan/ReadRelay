-- ReadRelay Database Schema
-- Book-sharing application with user profiles, books, exchanges, messaging, and reviews

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location_text VARCHAR(200),
    location_point GEOGRAPHY(POINT),
    preferred_meeting_locations TEXT[], -- Array of preferred meeting spots
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::JSONB,
    privacy_settings JSONB DEFAULT '{"location_visible": true, "phone_visible": false}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Books table
CREATE TABLE books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    description TEXT,
    cover_image_url TEXT,
    publisher VARCHAR(200),
    publication_year INTEGER,
    language VARCHAR(50) DEFAULT 'en',
    genre VARCHAR(100),
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')) NOT NULL,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'exchanging', 'unavailable')) DEFAULT 'available',
    exchange_type VARCHAR(20) CHECK (exchange_type IN ('borrow', 'swap', 'give_away')) NOT NULL,
    max_borrow_days INTEGER, -- For borrow type
    tags TEXT[],
    external_id VARCHAR(100), -- For Google Books/Open Library API
    external_source VARCHAR(50), -- 'google_books', 'open_library', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Book exchanges table
CREATE TABLE exchanges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    exchange_type VARCHAR(20) CHECK (exchange_type IN ('borrow', 'swap', 'give_away')) NOT NULL,
    return_date DATE, -- For borrow exchanges
    meeting_location TEXT,
    meeting_datetime TIMESTAMPTZ,
    notes TEXT,
    owner_rating INTEGER CHECK (owner_rating >= 1 AND owner_rating <= 5),
    requester_rating INTEGER CHECK (requester_rating >= 1 AND requester_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Messages table for exchange communication
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) CHECK (message_type IN ('text', 'template', 'system', 'location')) DEFAULT 'text',
    template_data JSONB, -- For template messages
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Reviews and ratings table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exchange_id UUID REFERENCES exchanges(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    review_type VARCHAR(20) CHECK (review_type IN ('owner', 'requester')) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Wishlists table
CREATE TABLE wishlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    description TEXT,
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Book categories for better organization
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for book categories (many-to-many)
CREATE TABLE book_categories (
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'exchange_request', 'message', 'wishlist_match', etc.
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- User follows/friends table
CREATE TABLE user_follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Book reports for inappropriate content
CREATE TABLE book_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_location ON profiles USING GIST(location_point);
CREATE INDEX idx_books_owner_id ON books(owner_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_availability ON books(availability_status);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_exchanges_book_id ON exchanges(book_id);
CREATE INDEX idx_exchanges_owner_id ON exchanges(owner_id);
CREATE INDEX idx_exchanges_requester_id ON exchanges(requester_id);
CREATE INDEX idx_exchanges_status ON exchanges(status);
CREATE INDEX idx_messages_exchange_id ON messages(exchange_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_reviews_exchange_id ON reviews(exchange_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exchanges_updated_at BEFORE UPDATE ON exchanges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON wishlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_reports_updated_at BEFORE UPDATE ON book_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Fiction', 'Fictional literature and novels'),
('Non-Fiction', 'Educational and factual books'),
('Science & Technology', 'Books about science, technology, and engineering'),
('Business & Economics', 'Business, finance, and economic topics'),
('Health & Fitness', 'Health, medical, and fitness related books'),
('Self-Help', 'Personal development and self-improvement'),
('History & Biography', 'Historical events and biographical accounts'),
('Arts & Culture', 'Art, music, culture, and entertainment'),
('Religion & Spirituality', 'Religious and spiritual texts'),
('Children & Young Adult', 'Books for children and teenagers'),
('Academic & Textbooks', 'Educational textbooks and academic materials'),
('Cooking & Food', 'Cookbooks and food-related content'),
('Travel & Adventure', 'Travel guides and adventure stories'),
('Mystery & Thriller', 'Mystery, thriller, and suspense novels'),
('Romance', 'Romantic fiction and literature'),
('Science Fiction & Fantasy', 'Sci-fi and fantasy genres'); 