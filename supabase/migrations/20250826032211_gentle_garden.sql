/*
  # Enhanced Blog Schema

  Tables:
  1. users - User accounts with roles (super_admin, editor, author)
  2. categories - Content categories
  3. tags - Content tags
  4. posts - Blog posts
  5. post_tags - Many-to-many relationship between posts and tags

  Features:
  - User authentication and authorization
  - Multilingual support
  - Categories and tags system
  - Image support for posts
  - Row Level Security (RLS) policies
  - Proper indexes for performance
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('super_admin', 'editor', 'author');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'author',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table with foreign keys
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'pt')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, language)
);

-- Create junction table for posts and tags
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS posts_author_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category_id);
CREATE INDEX IF NOT EXISTS posts_language_idx ON posts(language);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Technologie', 'technologie', 'Actualités et tutoriels technologiques'),
('Voyages', 'voyages', 'Récits de voyage et conseils'),
('Cuisine', 'cuisine', 'Recettes et astuces culinaires'),
('Santé', 'sante', 'Conseils santé et bien-être'),
('Mode', 'mode', 'Tendances mode et style de vie'),
('Éducation', 'education', 'Conseils éducatifs et apprentissage'),
('Affaires', 'affaires', 'Actualités et conseils professionnels'),
('Divertissement', 'divertissement', 'Films, séries et culture pop');

-- Insert sample tags
INSERT INTO tags (name, slug) VALUES
('react', 'react'),
('javascript', 'javascript'),
('typescript', 'typescript'),
('voyage', 'voyage'),
('recette', 'recette'),
('santé', 'sante'),
('mode', 'mode'),
('éducation', 'education'),
('business', 'business'),
('divertissement', 'divertissement'),
('technologie', 'technologie'),
('conseils', 'conseils');

-- Create default admin user (password: changeme)
INSERT INTO users (email, password_hash, display_name, role) VALUES
('admin@example.com', '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J', 'Admin', 'super_admin');

-- Sample posts with proper relationships
WITH author_id AS (
    SELECT id FROM users WHERE email = 'admin@example.com'
),
tech_category AS (
    SELECT id FROM categories WHERE slug = 'technologie'
)
INSERT INTO posts (slug, language, title, excerpt, content, author_id, category_id, is_published, published_at, cover_image_url)
SELECT 
    'getting-started-react', 
    'en', 
    'Getting Started with React', 
    'Learn the basics of React development', 
    '# Getting Started with React\n\nReact is a powerful JavaScript library...', 
    (SELECT id FROM author_id), 
    (SELECT id FROM tech_category), 
    true, 
    NOW(),
    'https://example.com/images/react-cover.jpg';

-- Add tags to the post
INSERT INTO post_tags (post_id, tag_id)
SELECT 
    (SELECT id FROM posts WHERE slug = 'getting-started-react' AND language = 'en'),
    id
FROM tags 
WHERE slug IN ('react', 'javascript', 'technologie');

-- Create policies
-- Posts are publicly readable if published
CREATE POLICY "Posts are publicly readable"
  ON posts
  FOR SELECT
  TO public
  USING (is_published = true);

-- Users can only edit their own posts
CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Only admins can manage categories and tags
CREATE POLICY "Only admins can manage categories"
  ON categories
  USING (auth.jwt() ->> 'role' = 'super_admin' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can manage tags"
  ON tags
  USING (auth.jwt() ->> 'role' = 'super_admin' OR auth.jwt() ->> 'role' = 'admin');

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Analytics Tables

-- Track unique visitors
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,  -- Client-side generated UUID
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    os TEXT,
    browser TEXT,
    screen_resolution TEXT,
    UNIQUE(visitor_id)
);

-- Track page views
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT REFERENCES visitors(visitor_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    path TEXT NOT NULL,
    query_params JSONB,
    view_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_ended_at TIMESTAMP WITH TIME ZONE,
    time_on_page INTEGER,  -- in seconds
    is_bounce BOOLEAN DEFAULT true,
    is_returning_visitor BOOLEAN DEFAULT false
);

-- Track user sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT REFERENCES visitors(visitor_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER,  -- in seconds
    page_views_count INTEGER DEFAULT 1,
    entry_url TEXT,
    exit_url TEXT,
    referrer TEXT,
    device_type TEXT,
    country TEXT,
    city TEXT
);

-- Track custom events (e.g., button clicks, form submissions)
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT REFERENCES visitors(visitor_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_category TEXT,
    event_label TEXT,
    event_value JSONB,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materialized views for analytics dashboards
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_visitor_stats AS
SELECT
    DATE_TRUNC('day', view_started_at) AS date,
    COUNT(DISTINCT visitor_id) AS unique_visitors,
    COUNT(*) AS page_views,
    COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN visitor_id END) AS authenticated_visitors,
    ROUND(AVG(time_on_page) FILTER (WHERE time_on_page IS NOT NULL), 2) AS avg_time_on_page,
    COUNT(DISTINCT post_id) AS unique_posts_viewed,
    COUNT(DISTINCT CASE WHEN is_bounce = true THEN page_views.id END) AS bounces
FROM page_views
GROUP BY DATE_TRUNC('day', view_started_at)
ORDER BY date DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS page_views_post_id_idx ON page_views(post_id);
CREATE INDEX IF NOT EXISTS page_views_view_started_at_idx ON page_views(view_started_at);
CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON sessions(started_at);
CREATE INDEX IF NOT EXISTS events_visitor_id_idx ON events(visitor_id);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at);

-- RLS policies for analytics tables
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Only admins can view analytics data
CREATE POLICY "Only admins can view analytics"
  ON visitors
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

CREATE POLICY "Only admins can view page views"
  ON page_views
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

CREATE POLICY "Only admins can view sessions"
  ON sessions
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

CREATE POLICY "Only admins can view events"
  ON events
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW daily_visitor_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update materialized views when new data comes in
CREATE TRIGGER refresh_analytics_after_insert
AFTER INSERT ON page_views
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_analytics_views();

-- Function to get popular posts
CREATE OR REPLACE FUNCTION get_popular_posts(
    days INTEGER DEFAULT 30,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    post_id UUID,
    title TEXT,
    slug TEXT,
    language TEXT,
    view_count BIGINT,
    unique_visitors BIGINT,
    avg_time_on_page NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS post_id,
        p.title,
        p.slug,
        p.language,
        COUNT(pv.id) AS view_count,
        COUNT(DISTINCT pv.visitor_id) AS unique_visitors,
        ROUND(AVG(pv.time_on_page) FILTER (WHERE pv.time_on_page IS NOT NULL), 2) AS avg_time_on_page
    FROM 
        posts p
    LEFT JOIN 
        page_views pv ON p.id = pv.post_id
    WHERE 
        pv.view_started_at >= (CURRENT_DATE - (days || ' days')::INTERVAL)
    GROUP BY 
        p.id, p.title, p.slug, p.language
    ORDER BY 
        view_count DESC
    LIMIT 
        limit_count;
END;
$$ LANGUAGE plpgsql;