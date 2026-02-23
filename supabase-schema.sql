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
    is_admin BOOLEAN DEFAULT FALSE,
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
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid()));

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
    deliverable_slots JSONB,
    requirements TEXT,
    compensation TEXT,
    max_collaborators INT NOT NULL DEFAULT 1,
    collab_mode TEXT NOT NULL DEFAULT 'separate'
        CHECK (collab_mode IN ('separate', 'group')),
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
    interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES collab_posts(id) ON DELETE CASCADE,
    user_a UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    members UUID[] DEFAULT '{}',
    collab_mode TEXT DEFAULT 'separate'
        CHECK (collab_mode IN ('separate', 'group')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_interest_id ON matches(interest_id);

CREATE INDEX IF NOT EXISTS idx_matches_user_a ON matches(user_a);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON matches(user_b);
CREATE INDEX IF NOT EXISTS idx_matches_post_id ON matches(post_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches"
ON matches FOR SELECT TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b OR auth.uid() = ANY(members));

CREATE POLICY "System can create matches"
ON matches FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_a);

CREATE POLICY "Participants update match status"
ON matches FOR UPDATE TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b OR auth.uid() = ANY(members))
WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b OR auth.uid() = ANY(members));

-- Auto-create match when interest is accepted (supports multi-collaborator)
CREATE OR REPLACE FUNCTION handle_interest_accepted()
RETURNS TRIGGER AS $$
DECLARE
    v_post_owner UUID;
    v_post_mode TEXT;
    v_max INT;
    v_accepted_count INT;
    v_existing_match_id UUID;
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        SELECT user_id, collab_mode, max_collaborators
        INTO v_post_owner, v_post_mode, v_max
        FROM collab_posts WHERE id = NEW.post_id;

        IF v_post_mode = 'group' THEN
            -- Group mode: reuse single match, add member
            SELECT id INTO v_existing_match_id
            FROM matches WHERE post_id = NEW.post_id AND collab_mode = 'group' AND status = 'active'
            LIMIT 1;

            IF v_existing_match_id IS NULL THEN
                INSERT INTO matches (interest_id, post_id, user_a, user_b, collab_mode, members)
                VALUES (NEW.id, NEW.post_id, v_post_owner, NEW.user_id, 'group',
                        ARRAY[v_post_owner, NEW.user_id]);
            ELSE
                UPDATE matches
                SET members = array_append(members, NEW.user_id), interest_id = NEW.id
                WHERE id = v_existing_match_id AND NOT (NEW.user_id = ANY(members));
            END IF;
        ELSE
            -- Separate mode: one match per collaborator
            INSERT INTO matches (interest_id, post_id, user_a, user_b, collab_mode, members)
            VALUES (NEW.id, NEW.post_id, v_post_owner, NEW.user_id, 'separate',
                    ARRAY[v_post_owner, NEW.user_id])
            ON CONFLICT DO NOTHING;
        END IF;

        -- Auto-close post when all slots filled
        SELECT COUNT(*) INTO v_accepted_count
        FROM interests WHERE post_id = NEW.post_id AND status = 'accepted';
        IF v_accepted_count >= v_max THEN
            UPDATE collab_posts SET is_open = false WHERE id = NEW.post_id;
        END IF;
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
        SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
    )
);

CREATE POLICY "Match participants can send messages"
ON messages FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = sender_id
    AND match_id IN (
        SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
    )
);

CREATE POLICY "Users can mark messages as read"
ON messages FOR UPDATE TO authenticated
USING (
    auth.uid() != sender_id
    AND match_id IN (
        SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
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
        AND (user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members))
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

-- =====================================================
-- 12. COLLAB CONTRACTS
-- =====================================================
CREATE TABLE IF NOT EXISTS collab_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    requirements_a TEXT NOT NULL,
    requirements_b TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','accepted','declined','completed','cancelled')),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collab_contracts_match_id ON collab_contracts(match_id);

ALTER TABLE collab_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can view contracts"
ON collab_contracts FOR SELECT TO authenticated
USING (match_id IN (
    SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
));

CREATE POLICY "Match participants can create contracts"
ON collab_contracts FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = created_by
    AND match_id IN (
        SELECT id FROM matches
        WHERE (user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)) AND status = 'active'
    )
);

CREATE POLICY "Match participants can update contracts"
ON collab_contracts FOR UPDATE TO authenticated
USING (match_id IN (
    SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
));

CREATE TRIGGER trigger_collab_contracts_updated_at
    BEFORE UPDATE ON collab_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. CONTRACT SUBMISSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS contract_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES collab_contracts(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','revision_requested')),
    revision_note TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contract_submissions_contract_id ON contract_submissions(contract_id);

ALTER TABLE contract_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can view submissions"
ON contract_submissions FOR SELECT TO authenticated
USING (contract_id IN (
    SELECT c.id FROM collab_contracts c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_a = auth.uid() OR m.user_b = auth.uid() OR auth.uid() = ANY(m.members)
));

CREATE POLICY "Match participants can create submissions"
ON contract_submissions FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = submitted_by
    AND contract_id IN (
        SELECT c.id FROM collab_contracts c
        JOIN matches m ON c.match_id = m.id
        WHERE (m.user_a = auth.uid() OR m.user_b = auth.uid() OR auth.uid() = ANY(m.members)) AND c.status = 'accepted'
    )
);

CREATE POLICY "Reviewers can update submissions"
ON contract_submissions FOR UPDATE TO authenticated
USING (
    submitted_by != auth.uid()
    AND contract_id IN (
        SELECT c.id FROM collab_contracts c
        JOIN matches m ON c.match_id = m.id
        WHERE m.user_a = auth.uid() OR m.user_b = auth.uid() OR auth.uid() = ANY(m.members)
    )
);

CREATE TRIGGER trigger_contract_submissions_updated_at
    BEFORE UPDATE ON contract_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. STORYBOARDS
-- =====================================================
CREATE TABLE IF NOT EXISTS storyboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    post_id UUID REFERENCES collab_posts(id) ON DELETE CASCADE UNIQUE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    slots JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE storyboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match participants can view storyboards"
ON storyboards FOR SELECT TO authenticated
USING (
    post_id IN (
        SELECT post_id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
    )
);

CREATE POLICY "Match participants can create storyboards"
ON storyboards FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = created_by
    AND post_id IN (
        SELECT post_id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)
    )
);

CREATE POLICY "Creator can update storyboard"
ON storyboards FOR UPDATE TO authenticated
USING (auth.uid() = created_by);

CREATE TRIGGER trigger_storyboards_updated_at
    BEFORE UPDATE ON storyboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 15. CONTRACT & SUBMISSION NOTIFICATION TRIGGERS
-- =====================================================

-- Extend notification types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
CHECK (type IN (
    'new_interest', 'interest_accepted', 'interest_declined',
    'new_message', 'new_match', 'new_review', 'collab_completed',
    'new_contract', 'contract_accepted', 'contract_declined',
    'new_submission', 'submission_approved', 'submission_revision_requested'
));

CREATE OR REPLACE FUNCTION notify_new_contract()
RETURNS TRIGGER AS $$
DECLARE
    v_other UUID;
    v_name TEXT;
BEGIN
    SELECT CASE WHEN m.user_a = NEW.created_by THEN m.user_b ELSE m.user_a END
    INTO v_other FROM matches m WHERE m.id = NEW.match_id;
    SELECT full_name INTO v_name FROM profiles WHERE id = NEW.created_by;
    INSERT INTO notifications (user_id, type, title, body, data) VALUES (
        v_other, 'new_contract',
        'New contract proposal!',
        COALESCE(v_name, 'Your partner') || ' proposed a contract: "' || NEW.title || '"',
        jsonb_build_object('match_id', NEW.match_id, 'contract_id', NEW.id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_contract
    AFTER INSERT ON collab_contracts FOR EACH ROW
    EXECUTE FUNCTION notify_new_contract();

CREATE OR REPLACE FUNCTION notify_contract_response()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status AND NEW.status IN ('accepted', 'declined') THEN
        INSERT INTO notifications (user_id, type, title, body, data) VALUES (
            NEW.created_by,
            CASE WHEN NEW.status = 'accepted' THEN 'contract_accepted' ELSE 'contract_declined' END,
            CASE WHEN NEW.status = 'accepted' THEN 'Contract accepted!' ELSE 'Contract declined' END,
            CASE WHEN NEW.status = 'accepted'
                THEN 'Your contract "' || NEW.title || '" was accepted.'
                ELSE 'Your contract "' || NEW.title || '" was declined.'
            END,
            jsonb_build_object('match_id', NEW.match_id, 'contract_id', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_contract_response
    AFTER UPDATE ON collab_contracts FOR EACH ROW
    EXECUTE FUNCTION notify_contract_response();

CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
DECLARE
    v_other UUID;
    v_name TEXT;
    v_match_id UUID;
BEGIN
    SELECT c.match_id INTO v_match_id FROM collab_contracts c WHERE c.id = NEW.contract_id;
    SELECT CASE WHEN m.user_a = NEW.submitted_by THEN m.user_b ELSE m.user_a END
    INTO v_other FROM matches m WHERE m.id = v_match_id;
    SELECT full_name INTO v_name FROM profiles WHERE id = NEW.submitted_by;
    INSERT INTO notifications (user_id, type, title, body, data) VALUES (
        v_other, 'new_submission',
        'New task submission!',
        COALESCE(v_name, 'Your partner') || ' submitted their work for review.',
        jsonb_build_object('match_id', v_match_id, 'contract_id', NEW.contract_id, 'submission_id', NEW.id)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_submission
    AFTER INSERT ON contract_submissions FOR EACH ROW
    EXECUTE FUNCTION notify_new_submission();

CREATE OR REPLACE FUNCTION notify_submission_review()
RETURNS TRIGGER AS $$
DECLARE
    v_match_id UUID;
BEGIN
    IF NEW.status != OLD.status AND NEW.status IN ('approved', 'revision_requested') THEN
        SELECT c.match_id INTO v_match_id FROM collab_contracts c WHERE c.id = NEW.contract_id;
        INSERT INTO notifications (user_id, type, title, body, data) VALUES (
            NEW.submitted_by,
            CASE WHEN NEW.status = 'approved' THEN 'submission_approved' ELSE 'submission_revision_requested' END,
            CASE WHEN NEW.status = 'approved' THEN 'Submission approved!' ELSE 'Revision requested' END,
            CASE WHEN NEW.status = 'approved'
                THEN 'Your work submission was approved!'
                ELSE 'Your partner requested revisions on your submission.'
            END,
            jsonb_build_object('match_id', v_match_id, 'contract_id', NEW.contract_id, 'submission_id', NEW.id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_submission_review
    AFTER UPDATE ON contract_submissions FOR EACH ROW
    EXECUTE FUNCTION notify_submission_review();

-- =====================================================
-- 16. MULTI-COLLABORATOR MIGRATION
-- Run these ALTER TABLE statements if the database already exists.
-- =====================================================

-- Add multi-collaborator columns to collab_posts
ALTER TABLE collab_posts
    ADD COLUMN IF NOT EXISTS max_collaborators INT NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS collab_mode TEXT NOT NULL DEFAULT 'separate'
        CHECK (collab_mode IN ('separate', 'group'));

-- Add multi-collaborator columns to matches
ALTER TABLE matches
    ADD COLUMN IF NOT EXISTS members UUID[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS collab_mode TEXT DEFAULT 'separate'
        CHECK (collab_mode IN ('separate', 'group'));

-- Drop UNIQUE on interest_id (group mode reuses one match)
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_interest_id_key;
CREATE INDEX IF NOT EXISTS idx_matches_interest_id ON matches(interest_id);

-- Add post_id to storyboards, change from match-unique to post-unique
ALTER TABLE storyboards
    ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES collab_posts(id) ON DELETE CASCADE;
UPDATE storyboards s SET post_id = m.post_id FROM matches m WHERE s.match_id = m.id AND s.post_id IS NULL;
ALTER TABLE storyboards DROP CONSTRAINT IF EXISTS storyboards_match_id_key;
ALTER TABLE storyboards ADD CONSTRAINT storyboards_post_id_key UNIQUE (post_id);

-- Update RLS policies for group mode (members array check)
DROP POLICY IF EXISTS "Users can view their own matches" ON matches;
CREATE POLICY "Users can view their own matches" ON matches FOR SELECT TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b OR auth.uid() = ANY(members));

DROP POLICY IF EXISTS "Participants update match status" ON matches;
CREATE POLICY "Participants update match status" ON matches FOR UPDATE TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b OR auth.uid() = ANY(members));

DROP POLICY IF EXISTS "Match participants can view messages" ON messages;
CREATE POLICY "Match participants can view messages" ON messages FOR SELECT TO authenticated
USING (match_id IN (SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)));

DROP POLICY IF EXISTS "Match participants can send messages" ON messages;
CREATE POLICY "Match participants can send messages" ON messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id AND match_id IN (SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)));

DROP POLICY IF EXISTS "Users can mark messages as read" ON messages;
CREATE POLICY "Users can mark messages as read" ON messages FOR UPDATE TO authenticated
USING (auth.uid() != sender_id AND match_id IN (SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)));

DROP POLICY IF EXISTS "Match participants can view storyboards" ON storyboards;
CREATE POLICY "Match participants can view storyboards" ON storyboards FOR SELECT TO authenticated
USING (post_id IN (SELECT post_id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)));

DROP POLICY IF EXISTS "Match participants can create storyboards" ON storyboards;
CREATE POLICY "Match participants can create storyboards" ON storyboards FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by AND post_id IN (SELECT post_id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid() OR auth.uid() = ANY(members)));

-- =====================================================
-- 17. ADMIN DASHBOARD MIGRATION
-- Run this if the database already exists.
-- =====================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set yourself as admin (replace with your user ID):
-- UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';

-- =====================================================
-- 18. PAGE VIEWS TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    visitor_id TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (middleware uses anon key)
CREATE POLICY "Anyone can insert page views"
ON page_views FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Authenticated users can read page views (visitor_id is anonymous UUID, no PII)
CREATE POLICY "Authenticated users can read page views"
ON page_views FOR SELECT TO authenticated
USING (true);

-- =====================================================
-- 19. PAGE VIEWS - ADD VISITOR_ID (migration)
-- Run this if page_views table already exists.
-- =====================================================
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS visitor_id TEXT;
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
