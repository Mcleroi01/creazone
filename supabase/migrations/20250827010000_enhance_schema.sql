-- Suppression des tables existantes dans le bon ordre (si nécessaire)
DROP TRIGGER IF EXISTS refresh_analytics_after_insert ON page_views;
DROP FUNCTION IF EXISTS refresh_analytics_views();
DROP MATERIALIZED VIEW IF EXISTS daily_visitor_stats;
DROP MATERIALIZED VIEW IF EXISTS tutorial_analytics;

-- Suppression des tables avec contraintes de clés étrangères
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS tutorial_tags;
DROP TABLE IF EXISTS post_revisions;
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tutorials;

-- Suppression des tables restantes
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- Création de la table des rôles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  last_login TIMESTAMP WITH TIME ZONE,
  last_ip TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison utilisateurs-rôles (plusieurs rôles par utilisateur possible)
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Création de la table des catégories avec parent_id pour les sous-catégories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description TEXT,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, parent_id)
);

-- Création de la table des tags avec compteur d'utilisation
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug)
);

-- Création de la table des articles
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
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

-- Table de révisions des articles
CREATE TABLE post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER NOT NULL
);

-- Création de la table des tutoriels
CREATE TABLE tutorials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'pt')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('débutant', 'intermédiaire', 'avancé')),
  estimated_time INTEGER, -- en minutes
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, language)
);

-- Table de liaison articles-tags
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- Table de liaison tutoriels-tags
CREATE TABLE tutorial_tags (
  tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (tutorial_id, tag_id)
);

-- Table des visiteurs
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,  -- UUID généré côté client
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

-- Table des sessions utilisateur
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT REFERENCES visitors(visitor_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,  -- en secondes
  page_views_count INTEGER DEFAULT 1,
  entry_url TEXT,
  exit_url TEXT,
  referrer TEXT,
  device_type TEXT,
  country TEXT,
  city TEXT
);

-- Table des vues de page
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT REFERENCES visitors(visitor_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  query_params JSONB,
  view_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_ended_at TIMESTAMP WITH TIME ZONE,
  time_on_page INTEGER,  -- en secondes
  is_bounce BOOLEAN DEFAULT true,
  is_returning_visitor BOOLEAN DEFAULT false
);

-- Table des événements personnalisés
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT REFERENCES visitors(visitor_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value JSONB,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vues matérialisées pour les statistiques
CREATE MATERIALIZED VIEW daily_visitor_stats AS
SELECT
  DATE_TRUNC('day', view_started_at) AS date,
  COUNT(DISTINCT visitor_id) AS unique_visitors,
  COUNT(*) AS page_views,
  COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN visitor_id END) AS authenticated_visitors,
  ROUND(AVG(time_on_page) FILTER (WHERE time_on_page IS NOT NULL), 2) AS avg_time_on_page,
  COUNT(DISTINCT post_id) AS unique_posts_viewed,
  COUNT(DISTINCT tutorial_id) AS unique_tutorials_viewed,
  COUNT(DISTINCT CASE WHEN is_bounce = true THEN id END) AS bounces
FROM page_views
GROUP BY DATE_TRUNC('day', view_started_at)
ORDER BY date DESC
WITH NO DATA;

-- Vues matérialisées pour les statistiques des tutoriels
CREATE MATERIALIZED VIEW tutorial_analytics AS
SELECT
  t.id,
  t.title,
  t.slug,
  t.language,
  t.difficulty_level,
  t.estimated_time,
  COUNT(DISTINCT pv.visitor_id) AS unique_visitors,
  COUNT(pv.id) AS page_views,
  ROUND(AVG(pv.time_on_page) FILTER (WHERE pv.time_on_page IS NOT NULL), 2) AS avg_time_spent,
  COUNT(DISTINCT CASE WHEN pv.time_on_page > 60 THEN pv.visitor_id END) AS engaged_visitors
FROM tutorials t
LEFT JOIN page_views pv ON t.id = pv.tutorial_id
GROUP BY t.id, t.title, t.slug, t.language, t.difficulty_level, t.estimated_time
WITH NO DATA;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_language_idx ON posts(language);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS posts_author_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category_id);

CREATE INDEX IF NOT EXISTS tutorials_slug_idx ON tutorials(slug);
CREATE INDEX IF NOT EXISTS tutorials_language_idx ON tutorials(language);
CREATE INDEX IF NOT EXISTS tutorials_published_at_idx ON tutorials(published_at DESC);
CREATE INDEX IF NOT EXISTS tutorials_author_idx ON tutorials(author_id);
CREATE INDEX IF NOT EXISTS tutorials_category_idx ON tutorials(category_id);
CREATE INDEX IF NOT EXISTS tutorials_difficulty_idx ON tutorials(difficulty_level);

CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);
CREATE INDEX IF NOT EXISTS tags_usage_count_idx ON tags(usage_count);

CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);

-- Index pour les performances des requêtes analytiques
CREATE INDEX IF NOT EXISTS page_views_visitor_id_idx ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS page_views_user_id_idx ON page_views(user_id);
CREATE INDEX IF NOT EXISTS page_views_post_id_idx ON page_views(post_id);
CREATE INDEX IF NOT EXISTS page_views_tutorial_id_idx ON page_views(tutorial_id);
CREATE INDEX IF NOT EXISTS page_views_view_started_at_idx ON page_views(view_started_at);
CREATE INDEX IF NOT EXISTS page_views_is_bounce_idx ON page_views(is_bounce);

CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON sessions(started_at);

CREATE INDEX IF NOT EXISTS events_visitor_id_idx ON events(visitor_id);
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_session_id_idx ON events(session_id);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at);
CREATE INDEX IF NOT EXISTS events_event_name_idx ON events(event_name);

-- Fonction pour rafraîchir les vues matérialisées de manière sécurisée
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS TRIGGER AS $$
BEGIN
    -- D'abord rafraîchir sans CONCURRENTLY pour s'assurer que la vue est valide
    REFRESH MATERIALIZED VIEW daily_visitor_stats;
    
    -- Ensuite, créer un index unique nécessaire pour CONCURRENTLY
    BEGIN
        CREATE UNIQUE INDEX IF NOT EXISTS daily_visitor_stats_date_idx 
        ON daily_visitor_stats (date);
    EXCEPTION WHEN others THEN
        -- L'index existe peut-être déjà, on continue
        NULL;
    END;
    
    -- Maintenant, on peut rafraîchir avec CONCURRENTLY
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_visitor_stats;
    
    -- Même chose pour tutorial_analytics
    REFRESH MATERIALIZED VIEW tutorial_analytics;
    
    BEGIN
        CREATE UNIQUE INDEX IF NOT EXISTS tutorial_analytics_id_idx 
        ON tutorial_analytics (id);
    EXCEPTION WHEN others THEN
        NULL;
    END;
    
    REFRESH MATERIALIZED VIEW CONCURRENTLY tutorial_analytics;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Déclencheur pour mettre à jour les vues matérialisées
CREATE TRIGGER refresh_analytics_after_insert
AFTER INSERT ON page_views
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_analytics_views();

-- Fonction pour incrémenter le compteur d'utilisation des tags
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tags 
    SET usage_count = usage_count + 1, 
        updated_at = NOW()
    WHERE id = NEW.tag_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Déclencheurs pour mettre à jour le compteur d'utilisation des tags
CREATE TRIGGER increment_post_tag_usage
AFTER INSERT ON post_tags
FOR EACH ROW
EXECUTE FUNCTION increment_tag_usage();

CREATE TRIGGER increment_tutorial_tag_usage
AFTER INSERT ON tutorial_tags
FOR EACH ROW
EXECUTE FUNCTION increment_tag_usage();

-- Fonction pour obtenir les articles/tutoriels populaires
CREATE OR REPLACE FUNCTION get_popular_content(
    p_content_type TEXT,
    p_days INTEGER DEFAULT 30,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    content_type TEXT,
    language TEXT,
    view_count BIGINT,
    unique_visitors BIGINT,
    avg_time_on_page NUMERIC
) AS $$
BEGIN
    IF p_content_type = 'post' THEN
        RETURN QUERY
        SELECT 
            p.id,
            p.title,
            p.slug,
            'post' AS content_type,
            p.language,
            COUNT(pv.id) AS view_count,
            COUNT(DISTINCT pv.visitor_id) AS unique_visitors,
            ROUND(AVG(pv.time_on_page) FILTER (WHERE pv.time_on_page IS NOT NULL), 2) AS avg_time_on_page
        FROM 
            posts p
        LEFT JOIN 
            page_views pv ON p.id = pv.post_id
        WHERE 
            pv.view_started_at >= (CURRENT_DATE - (p_days || ' days')::INTERVAL)
            AND p.is_published = true
        GROUP BY 
            p.id, p.title, p.slug, p.language
        ORDER BY 
            view_count DESC
        LIMIT 
            p_limit;
    ELSIF p_content_type = 'tutorial' THEN
        RETURN QUERY
        SELECT 
            t.id,
            t.title,
            t.slug,
            'tutorial' AS content_type,
            t.language,
            COUNT(pv.id) AS view_count,
            COUNT(DISTINCT pv.visitor_id) AS unique_visitors,
            ROUND(AVG(pv.time_on_page) FILTER (WHERE pv.time_on_page IS NOT NULL), 2) AS avg_time_on_page
        FROM 
            tutorials t
        LEFT JOIN 
            page_views pv ON t.id = pv.tutorial_id
        WHERE 
            pv.view_started_at >= (CURRENT_DATE - (p_days || ' days')::INTERVAL)
            AND t.is_published = true
        GROUP BY 
            t.id, t.title, t.slug, t.language
        ORDER BY 
            view_count DESC
        LIMIT 
            p_limit;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Politiques de sécurité (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politiques pour les articles (lecture publique)
CREATE POLICY "Tout le monde peut voir les articles publiés"
  ON posts
  FOR SELECT
  TO public
  USING (is_published = true);

-- Politiques pour les tutoriels (lecture publique)
CREATE POLICY "Tout le monde peut voir les tutoriels publiés"
  ON tutorials
  FOR SELECT
  TO public
  USING (is_published = true);

-- Politique pour les catégories (lecture publique)
CREATE POLICY "Tout le monde peut voir les catégories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les tags (lecture publique)
CREATE POLICY "Tout le monde peut voir les tags"
  ON tags
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les relations post_tags (lecture publique)
CREATE POLICY "Tout le monde peut voir les relations post_tags"
  ON post_tags
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les relations tutorial_tags (lecture publique)
CREATE POLICY "Tout le monde peut voir les relations tutorial_tags"
  ON tutorial_tags
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les utilisateurs (limité aux informations publiques)
CREATE POLICY "Tout le monde peut voir les profils utilisateurs (limité)"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Désactiver toutes les autres politiques par défaut
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_tags DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS avec les bonnes politiques
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_tags ENABLE ROW LEVEL SECURITY;

-- Politique pour les révisions d'articles (accès public en lecture seule)
CREATE POLICY "Tout le monde peut voir les révisions publiées"
  ON post_revisions
  FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM posts p 
    WHERE p.id = post_revisions.post_id 
    AND p.is_published = true
  ));

-- Politique pour les visiteurs (accès public en lecture seule)
CREATE POLICY "Tout le monde peut voir les statistiques des visiteurs"
  ON visitors
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les sessions (accès public en lecture seule)
CREATE POLICY "Tout le monde peut voir les sessions"
  ON sessions
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les vues de page (accès public en lecture seule)
CREATE POLICY "Tout le monde peut voir les statistiques de pages vues"
  ON page_views
  FOR SELECT
  TO public
  USING (true);

-- Politique pour les événements (accès public en lecture seule)
CREATE POLICY "Tout le monde peut voir les événements publics"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Données initiales
INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrateur avec accès complet'),
  ('editor', 'Peut créer et modifier du contenu'),
  ('author', 'Peut créer et modifier son propre contenu'),
  ('subscriber', 'Utilisateur enregistré avec accès limité');

-- Créer un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (email, password_hash, display_name, status, email_verified)
VALUES (
  'admin@skillcraft.com',
  '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J',
  'Admin',
  'active',
  true
);

-- Assigner le rôle admin au premier utilisateur
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.email = 'admin@skillcraft.com' AND r.name = 'admin';
