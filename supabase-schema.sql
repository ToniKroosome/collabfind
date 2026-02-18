-- =====================================================
-- CollabFind - Full Database Schema
-- Run this entire file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. UTILITY FUNCTION: updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    niche TEXT[] DEFAULT '{}',
    follower_count_min INT DEFAULT 0,
    follower_count_max INT DEFAULT 0,
    instagram_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    twitter_url TEXT,
    location TEXT,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_niche ON profiles USING GIN(niche);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. COLLAB POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS collab_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    collab_type TEXT NOT NULL CHECK (collab_type IN (
        'video', 'photo', 'livestream', 'podcast', 'blog', 'event', 'giveaway', 'other'
    )),
    niche_tags TEXT[] DEFAULT '{}',
    preferred_audience_min INT DEFAULT 0,
    preferred_audience_max INT DEFAULT 0,
    location TEXT,
    timeline TEXT,
    deliverables TEXT,
    requirements TEXT,
    compensation TEXT,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collab_posts_user_id ON collab_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_collab_posts_collab_type ON collab_posts(collab_type);
CREATE INDEX IF NOT EXISTS idx_collab_posts_niche_tags ON collab_posts USING GIN(niche_tags);
CREATE INDEX IF NOT EXISTS idx_collab_posts_is_open ON collab_posts(is_open);
CREATE INDEX IF NOT EXISTS idx_collab_posts_created_at ON collab_posts(created_at DESC);

ALTER TABLE collab_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open collab posts are viewable by everyone"
ON collab_posts FOR SELECT USING (true);

CREATE POLICY "Users can create their own collab posts"
ON collab_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collab posts"
ON collab_posts FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collab posts"
ON collab_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER trigger_collab_posts_updated_at
    BEFORE UPDATE ON collab_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. INTERESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES collab_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_interests_post_id ON interests(post_id);
CREATE INDEX IF NOT EXISTS idx_interests_user_id ON interests(user_id);
CREATE INDEX IF NOT EXISTS idx_interests_status ON interests(status);

ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relevant interests"
ON interests FOR SELECT TO authenticated
USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT user_id FROM collab_posts WHERE id = post_id)
);

CREATE POLICY "Users can create interests on others posts"
ON interests FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() != (SELECT user_id FROM collab_posts WHERE id = post_id)
);

CREATE POLICY "Post owners can update interest status"
ON interests FOR UPDATE TO authenticated
USING (auth.uid() IN (SELECT user_id FROM collab_posts WHERE id = post_id))
WITH CHECK (auth.uid() IN (SELECT user_id FROM collab_posts WHERE id = post_id));

CREATE TRIGGER trigger_interests_updated_at
    BEFORE UPDATE ON interests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. MATCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interest_id UUID NOT NULL UNIQUE REFERENCES interests(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES collab_posts(id) ON DELETE CASCADE,
    user_a UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_user_a ON matches(user_a);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON matches(user_b);
CREATE INDEX IF NOT EXISTS idx_matches_post_id ON matches(post_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches"
ON matches FOR SELECT TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "System can create matches"
ON matches FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_a);

CREATE POLICY "Participants update match status"
ON matches FOR UPDATE TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b)
WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- Auto-create match when interest is accepted
CREATE OR REPLACE FUNCTION handle_interest_accepted()
RETURNS TRIGGER AS $$
DECLARE
    v_post_owner UUID;
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        SELECT user_id INTO v_post_owner
        FROM collab_posts WHERE id = NEW.post_id;

        INSERT INTO matches (interest_id, post_id, user_a, user_b)
        VALUES (NEW.id, NEW.post_id, v_post_owner, NEW.user_id)
        ON CONFLICT (interest_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_on_interest_accepted
    AFTER UPDATE ON interests
    FOR EACH ROW
    EXECUTE FUNCTION handle_interest_accepted();

-- =====================================================
-- 6. MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can view messages"
ON messages FOR SELECT TO authenticated
USING (
    match_id IN (
        SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid()
    )
);

CREATE POLICY "Match participants can send messages"
ON messages FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = sender_id
    AND match_id IN (
        SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid()
    )
);

CREATE POLICY "Users can mark messages as read"
ON messages FOR UPDATE TO authenticated
USING (
    auth.uid() != sender_id
    AND match_id IN (
        SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid()
    )
);

-- =====================================================
-- 6.5. COLLAB REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS collab_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT CHECK (char_length(review_text) <= 300),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_collab_reviews_reviewee_id ON collab_reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_collab_reviews_match_id ON collab_reviews(match_id);

ALTER TABLE collab_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone"
ON collab_reviews FOR SELECT USING (true);

CREATE POLICY "Participants create reviews"
ON collab_reviews FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = reviewer_id AND reviewer_id != reviewee_id
    AND match_id IN (
        SELECT id FROM matches WHERE status = 'completed'
        AND (user_a = auth.uid() OR user_b = auth.uid())
    )
);

-- =====================================================
-- 7. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'new_interest', 'interest_accepted', 'interest_declined', 'new_message', 'new_match',
        'new_review', 'collab_completed'
    )),
    title TEXT NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 8. NOTIFICATION TRIGGERS
-- =====================================================

-- Notify post owner when someone expresses interest
CREATE OR REPLACE FUNCTION notify_new_interest()
RETURNS TRIGGER AS $$
DECLARE
    v_post_owner UUID;
    v_post_title TEXT;
    v_user_name TEXT;
BEGIN
    SELECT cp.user_id, cp.title INTO v_post_owner, v_post_title
    FROM collab_posts cp WHERE cp.id = NEW.post_id;

    SELECT full_name INTO v_user_name
    FROM profiles WHERE id = NEW.user_id;

    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
        v_post_owner,
        'new_interest',
        'New interest in your collab!',
        COALESCE(v_user_name, 'Someone') || ' is interested in "' || v_post_title || '"',
        jsonb_build_object('post_id', NEW.post_id, 'interest_id', NEW.id, 'from_user_id', NEW.user_id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_interest
    AFTER INSERT ON interests
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_interest();

-- Notify interested user when accepted/declined
CREATE OR REPLACE FUNCTION notify_interest_response()
RETURNS TRIGGER AS $$
DECLARE
    v_post_title TEXT;
    v_notif_type TEXT;
    v_title TEXT;
    v_body TEXT;
BEGIN
    IF NEW.status != OLD.status AND NEW.status IN ('accepted', 'declined') THEN
        SELECT title INTO v_post_title
        FROM collab_posts WHERE id = NEW.post_id;

        IF NEW.status = 'accepted' THEN
            v_notif_type := 'interest_accepted';
            v_title := 'Collab accepted!';
            v_body := 'Your interest in "' || v_post_title || '" was accepted! You can now chat.';
        ELSE
            v_notif_type := 'interest_declined';
            v_title := 'Interest update';
            v_body := 'Your interest in "' || v_post_title || '" was declined.';
        END IF;

        INSERT INTO notifications (user_id, type, title, body, data)
        VALUES (
            NEW.user_id,
            v_notif_type,
            v_title,
            v_body,
            jsonb_build_object('post_id', NEW.post_id, 'interest_id', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_interest_response
    AFTER UPDATE ON interests
    FOR EACH ROW
    EXECUTE FUNCTION notify_interest_response();

-- =====================================================
-- 8.5. REVIEW & COMPLETION NOTIFICATION TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION notify_new_review()
RETURNS TRIGGER AS $$
DECLARE v_name TEXT;
BEGIN
    SELECT full_name INTO v_name FROM profiles WHERE id = NEW.reviewer_id;
    INSERT INTO notifications (user_id, type, title, body, data) VALUES (
        NEW.reviewee_id, 'new_review',
        'You received a new review!',
        COALESCE(v_name, 'Someone') || ' left you a ' || NEW.rating || '-star review',
        jsonb_build_object('match_id', NEW.match_id, 'review_id', NEW.id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_review
    AFTER INSERT ON collab_reviews
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_review();

CREATE OR REPLACE FUNCTION notify_collab_completed()
RETURNS TRIGGER AS $$
DECLARE v_other UUID; v_name TEXT; v_title TEXT;
BEGIN
    IF NEW.status = 'completed' AND OLD.status = 'active' THEN
        v_other := CASE WHEN NEW.user_a = auth.uid() THEN NEW.user_b ELSE NEW.user_a END;
        SELECT full_name INTO v_name FROM profiles WHERE id = auth.uid();
        SELECT title INTO v_title FROM collab_posts WHERE id = NEW.post_id;
        INSERT INTO notifications (user_id, type, title, body, data) VALUES (
            v_other, 'collab_completed',
            'Collab marked as completed!',
            COALESCE(v_name, 'Your partner') || ' marked "' || COALESCE(v_title, 'a collab') || '" as completed. Leave a review!',
            jsonb_build_object('match_id', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_collab_completed
    AFTER UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION notify_collab_completed();

-- =====================================================
-- 9. ENABLE REALTIME
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =====================================================
-- 10. STORAGE POLICIES
-- NOTE: First create a bucket called "avatars" (set to Public)
-- in Supabase Dashboard > Storage > New Bucket
-- THEN run these policies below:
-- =====================================================

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================
-- 11. SOCIAL MEDIA VERIFICATION
-- Run these ALTER TABLE statements if the database already exists.
-- =====================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tiktok_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_verified BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS social_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    UNIQUE(user_id, platform)
);

ALTER TABLE social_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own verifications"
ON social_verifications FOR ALL TO authenticated
USING (auth.uid() = user_id);
