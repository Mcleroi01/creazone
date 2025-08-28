-- Script d'insertion de données de démonstration
-- Date: 2025-08-28

-- Désactiver temporairement les contraintes de clés étrangères
SET session_replication_role = 'replica';

-- Nettoyer les données existantes (attention, cette partie est commentée pour sécurité)
-- TRUNCATE TABLE events, page_views, sessions, post_tags, tutorial_tags, post_revisions, posts, tutorials, tags, categories, user_roles, users, roles RESTART IDENTITY CASCADE;

-- Activer les contraintes de clés étrangères
SET session_replication_role = 'origin';

-- 1. Insertion des rôles (en évitant les doublons)
INSERT INTO roles (name, description, permissions, created_at, updated_at) 
VALUES
('super_admin', 'Super Administrateur', '{"can_manage_all": true, "can_edit_all": true, "can_delete_all": true}', NOW(), NOW()),
('admin', 'Administrateur', '{"can_manage_content": true, "can_edit_content": true, "can_delete_content": true}', NOW(), NOW()),
('editor', 'Editeur', '{"can_edit_content": true}', NOW(), NOW()),
('author', 'Auteur', '{"can_create_content": true, "can_edit_own_content": true}', NOW(), NOW()),
('subscriber', 'Abonne', '{"can_comment": true}', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Insertion des utilisateurs
-- Mot de passe pour tous les utilisateurs: password123
INSERT INTO users (email, password_hash, display_name, avatar_url, bio, status, last_login, email_verified, created_at, updated_at) VALUES
('admin@example.com', '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J', 'Admin Principal', 'https://i.pravatar.cc/150?img=1', 'Administrateur principal du blog', 'active', NOW(), true, NOW(), NOW()),
('editor@example.com', '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J', 'Éditeur Web', 'https://i.pravatar.cc/150?img=2', 'Éditeur en chef', 'active', NOW(), true, NOW(), NOW()),
('author1@example.com', '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J', 'Jean Dupont', 'https://i.pravatar.cc/150?img=3', 'Auteur passionné par la technologie', 'active', NOW(), true, NOW(), NOW()),
('author2@example.com', '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J', 'Marie Martin', 'https://i.pravatar.cc/150?img=4', 'Auteure spécialisée en voyage', 'active', NOW(), true, NOW(), NOW()),
('user@example.com', '$2a$10$r8Z2LdJZ1JN1JNZLdJZ1J.1JNZLdJZ1JNZLdJZ1JNZLdJZ1JNZLdJZ1J', 'Utilisateur Test', 'https://i.pravatar.cc/150?img=5', 'Simple utilisateur du blog', 'active', NOW(), true, NOW(), NOW());

-- 3. Attribution des rôles aux utilisateurs
INSERT INTO user_roles (user_id, role_id, created_at)
SELECT u.id, r.id, NOW()
FROM users u, roles r
WHERE (u.email = 'admin@example.com' AND r.name = 'super_admin')
   OR (u.email = 'editor@example.com' AND r.name = 'editor')
   OR (u.email = 'author1@example.com' AND r.name = 'author')
   OR (u.email = 'author2@example.com' AND r.name = 'author')
   OR (u.email = 'user@example.com' AND r.name = 'subscriber');

-- 4. Insertion des catégories
WITH inserted_categories AS (
  INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at) 
  VALUES
  ('Technologie', 'technologie', 'Actualites et tutoriels technologiques', NULL, NOW(), NOW())
  RETURNING id, slug
),
web_dev AS (
  INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at)
  SELECT 'Developpement Web', 'developpement-web', 'Tout sur le developpement web moderne', id, NOW(), NOW()
  FROM inserted_categories WHERE slug = 'technologie'
  RETURNING id, slug
),
ai AS (
  INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at)
  SELECT 'Intelligence Artificielle', 'intelligence-artificielle', 'IA, machine learning et data science', id, NOW(), NOW()
  FROM inserted_categories WHERE slug = 'technologie'
  RETURNING id, slug
),
travel AS (
  INSERT INTO categories (name, slug, description, created_at, updated_at)
  VALUES ('Voyages', 'voyages', 'Recits de voyage et conseils', NOW(), NOW())
  RETURNING id, slug
),
cuisine AS (
  INSERT INTO categories (name, slug, description, created_at, updated_at)
  VALUES ('Cuisine', 'cuisine', 'Recettes et astuces culinaires', NOW(), NOW())
  RETURNING id, slug
),
sante AS (
  INSERT INTO categories (name, slug, description, created_at, updated_at)
  VALUES ('Sante', 'sante', 'Conseils sante et bien-etre', NOW(), NOW())
  RETURNING id, slug
),
other_cats AS (
  INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES
  ('Mode', 'mode', 'Tendances mode et style de vie', NOW(), NOW()),
  ('Education', 'education', 'Conseils educatifs et apprentissage', NOW(), NOW()),
  ('Affaires', 'affaires', 'Actualites et conseils professionnels', NOW(), NOW()),
  ('Divertissement', 'divertissement', 'Films, series et culture pop', NOW(), NOW())
  RETURNING id, slug
)
-- Insertion des sous-catégories
INSERT INTO categories (name, slug, description, parent_id, created_at, updated_at)
SELECT 'Asie', 'asie', 'Voyages en Asie', id, NOW(), NOW() FROM travel WHERE slug = 'voyages'
UNION ALL
SELECT 'Europe', 'europe', 'Voyages en Europe', id, NOW(), NOW() FROM travel WHERE slug = 'voyages'
UNION ALL
SELECT 'Vegetarien', 'vegetarien', 'Cuisine vegetarienne', id, NOW(), NOW() FROM cuisine WHERE slug = 'cuisine';

-- 5. Insertion des tags
INSERT INTO tags (name, slug, created_at, updated_at) VALUES
('react', 'react', NOW(), NOW()),
('javascript', 'javascript', NOW(), NOW()),
('typescript', 'typescript', NOW(), NOW()),
('nodejs', 'nodejs', NOW(), NOW()),
('python', 'python', NOW(), NOW()),
('ia', 'ia', NOW(), NOW()),
('machine-learning', 'machine-learning', NOW(), NOW()),
('voyage', 'voyage', NOW(), NOW()),
('cuisine', 'cuisine', NOW(), NOW()),
('sante', 'sante', NOW(), NOW()),
('productivite', 'productivite', NOW(), NOW()),
('design', 'design', NOW(), NOW());

-- 6. Insertion des articles
-- Note: Les IDs sont générés de manière déterministe pour faciliter les références
WITH author_ids AS (
  SELECT id FROM users WHERE email IN ('author1@example.com', 'author2@example.com')
  ORDER BY email
  LIMIT 2
),
category_ids AS (
  SELECT id FROM categories WHERE name IN ('Développement Web', 'Intelligence Artificielle', 'Voyages', 'Cuisine')
  ORDER BY name
  LIMIT 4
)
INSERT INTO posts (
  id, slug, language, title, excerpt, content, cover_image_url, author_id, category_id, 
  is_published, published_at, created_at, updated_at
) VALUES 
-- Article 1
(gen_random_uuid(), 'introduction-a-react', 'fr', 
 'Introduction à React', 
 'Découvrez les bases de React, la bibliothèque JavaScript pour construire des interfaces utilisateur.',
 'Contenu complet de l''article sur React...',
 'https://source.unsplash.com/random/800x450/?react,programming',
 (SELECT id FROM users WHERE email = 'author1@example.com'),
 (SELECT id FROM categories WHERE slug = 'developpement-web'),
 true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),
-- Article 2
(gen_random_uuid(), 'machine-learning-pour-debutants', 'fr',
 'Le Machine Learning pour les débutants',
 'Un guide complet pour commencer avec le machine learning, même sans expérience préalable.',
 'Contenu complet de l''article sur le machine learning...',
 'https://source.unsplash.com/random/800x450/?ai,machine-learning',
 (SELECT id FROM users WHERE email = 'author2@example.com'),
 (SELECT id FROM categories WHERE slug = 'intelligence-artificielle'),
 true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'
),
-- Article 3
(gen_random_uuid(), 'meilleures-destinations-2025', 'fr',
 'Les 10 meilleures destinations à visiter en 2025',
 'Découvrez les destinations les plus en vogue pour vos prochaines vacances.',
 'Contenu complet de l''article sur les destinations de voyage...',
 'https://source.unsplash.com/random/800x450/?travel,landscape',
 (SELECT id FROM users WHERE email = 'author2@example.com'),
 (SELECT id FROM categories WHERE slug = 'voyages'),
 true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'
),
-- Article 4 (brouillon)
(gen_random_uuid(), 'recette-pates-fraiches', 'fr',
 'Recette de pâtes fraîches maison',
 'Apprenez à préparer des pâtes fraîches délicieuses en quelques étapes simples.',
 'Contenu complet de la recette de pates fraiches...',
 'https://source.unsplash.com/random/800x450/?pasta,food',
 (SELECT id FROM users WHERE email = 'author1@example.com'),
 (SELECT id FROM categories WHERE slug = 'cuisine'),
 false, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
);

-- 7. Association des tags aux articles
INSERT INTO post_tags (post_id, tag_id, created_at)
SELECT p.id, t.id, NOW()
FROM posts p, tags t
WHERE (p.slug = 'introduction-a-react' AND t.slug IN ('react', 'javascript'))
   OR (p.slug = 'machine-learning-pour-debutants' AND t.slug IN ('ia', 'machine-learning', 'python'))
   OR (p.slug = 'meilleures-destinations-2025' AND t.slug = 'voyage')
   OR (p.slug = 'recette-pates-fraiches' AND t.slug = 'cuisine');

-- 8. Insertion de révisions d'articles
INSERT INTO post_revisions (id, post_id, title, excerpt, content, author_id, created_at, version)
SELECT 
  gen_random_uuid(),
  p.id,
  p.title || ' (révision 1)',
  p.excerpt,
  p.content || E'\n\nPremiere revision de l''article.',
  p.author_id,
  p.created_at + INTERVAL '1 hour',
  1
FROM posts p
WHERE p.slug = 'introduction-a-react';

-- 9. Insertion de tutoriels
INSERT INTO tutorials (
  id, slug, language, title, excerpt, content, difficulty_level, 
  estimated_time, author_id, is_published, published_at, created_at, updated_at
) VALUES 
(gen_random_uuid(), 'apprendre-react-en-30-minutes', 'fr',
 'Apprendre React en 30 minutes',
 'Un tutoriel rapide pour maîtriser les bases de React',
 'Contenu detaille du tutoriel React...',
 'débutant', 30, 
 (SELECT id FROM users WHERE email = 'author1@example.com'),
 true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
),
(gen_random_uuid(), 'premier-projet-machine-learning', 'fr',
 'Votre premier projet de Machine Learning',
 'Guide pas à pas pour créer votre premier modèle de machine learning',
 'Contenu detaille du tutoriel Machine Learning...',
 'intermédiaire', 120,
 (SELECT id FROM users WHERE email = 'author2@example.com'),
 true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'
);

-- 10. Association des tags aux tutoriels
INSERT INTO tutorial_tags (tutorial_id, tag_id, created_at)
SELECT t.id, tg.id, NOW()
FROM tutorials t, tags tg
WHERE (t.slug = 'apprendre-react-en-30-minutes' AND tg.slug IN ('react', 'javascript'))
   OR (t.slug = 'premier-projet-machine-learning' AND tg.slug IN ('ia', 'machine-learning', 'python'));

-- 11. Insertion de visiteurs
INSERT INTO visitors (
  id, visitor_id, first_seen_at, last_seen_at, user_agent, 
  referrer, ip_address, country, city, device_type, 
  browser, os, screen_resolution
) VALUES 
(gen_random_uuid(), 'visitor_001', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 hour',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
 'https://www.google.com', '192.168.1.1', 'France', 'Paris', 'desktop',
 'Chrome 91', 'Windows 10', '1920x1080'
),
(gen_random_uuid(), 'visitor_002', NOW() - INTERVAL '15 days', NOW() - INTERVAL '3 hours',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
 'https://www.facebook.com', '192.168.1.2', 'France', 'Lyon', 'mobile',
 'Safari', 'iOS 14.6', '390x844'
);

-- 12. Insertion de sessions utilisateur
WITH visitor_ids AS (
  SELECT visitor_id FROM visitors ORDER BY first_seen_at LIMIT 3
)
INSERT INTO sessions (
  visitor_id, user_id, started_at, ended_at, duration, page_views_count, referrer, device_type, 
  country, city
) VALUES
-- Session d'un utilisateur connecté (30 minutes de navigation)
((SELECT visitor_id FROM visitor_ids OFFSET 0 LIMIT 1),
 (SELECT id FROM users WHERE email = 'user@example.com'),
 NOW() - INTERVAL '2 hours',
 NOW() - INTERVAL '1 hour 30 minutes',
 1800, 5, 'https://www.google.com', 'desktop', 'France', 'Paris'
),
((SELECT visitor_id FROM visitor_ids OFFSET 1 LIMIT 1), NULL,
 NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 45 minutes',
 900, 3, 'https://www.facebook.com', 'mobile',
 'France', 'Lyon'
);

-- 13. Insertion de vues de page
WITH post_ids AS (
  SELECT id FROM posts WHERE is_published = true ORDER BY created_at LIMIT 2
),
visitor_ids AS (
  SELECT id FROM visitors ORDER BY first_seen_at LIMIT 2
)
INSERT INTO page_views (
  visitor_id, user_id, post_id, url, path,
  view_started_at, view_ended_at, time_on_page, is_bounce, is_returning_visitor
) VALUES 
-- Vues pour le premier visiteur (connecté)
((SELECT visitor_id FROM visitors ORDER BY first_seen_at OFFSET 0 LIMIT 1),
 (SELECT id FROM users WHERE email = 'user@example.com'),
 (SELECT id FROM posts WHERE slug = 'introduction-a-react'),
 'https://example.com/blog/introduction-a-react', '/blog/introduction-a-react',
 NOW() - INTERVAL '2 hours 10 minutes',
 NOW() - INTERVAL '2 hours 8 minutes',
 120, false, false
),
-- Vues pour le deuxième visiteur (anonyme)
((SELECT visitor_id FROM visitors ORDER BY first_seen_at OFFSET 1 LIMIT 1), NULL,
 (SELECT id FROM posts WHERE slug = 'machine-learning-pour-debutants'),
 'https://example.com/blog/machine-learning-pour-debutants', '/blog/machine-learning-pour-debutants',
 NOW() - INTERVAL '3 hours 10 minutes',
 NOW() - INTERVAL '3 hours 7 minutes',
 180, true, false
);

-- 14. Insertion d'événements personnalisés
WITH visitor_ids AS (
  SELECT id FROM visitors ORDER BY first_seen_at LIMIT 2
),
post_ids AS (
  SELECT id FROM posts WHERE is_published = true ORDER BY created_at LIMIT 2
)
INSERT INTO events (
  visitor_id, user_id, event_name, 
  event_category, event_label, event_value,
  url, created_at
) VALUES 
-- Événement de clic sur un bouton
((SELECT visitor_id FROM visitors ORDER BY first_seen_at OFFSET 0 LIMIT 1),
 (SELECT id FROM users WHERE email = 'user@example.com'),
 'cta_button_click',
 'engagement', 'newsletter',
 '{"button_id": "subscribe-newsletter", "text": "S''abonner"}'::jsonb,
 '/blog/introduction-a-react',
 NOW() - INTERVAL '2 hours 10 minutes'
),
-- Événement de soumission de formulaire
((SELECT visitor_id FROM visitors ORDER BY first_seen_at OFFSET 1 LIMIT 1), NULL,
 'newsletter_submission',
 'conversion', 'newsletter',
 '{"email": "visiteur@example.com", "source": "blog_sidebar"}'::jsonb,
 '/blog/machine-learning-pour-debutants',
 NOW() - INTERVAL '3 hours 20 minutes'
);

-- Ajout de la colonne view_count si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'view_count') THEN
        ALTER TABLE posts ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Mise à jour des compteurs de vues pour les articles
UPDATE posts p
SET view_count = (
  SELECT COUNT(*) 
  FROM page_views pv 
  WHERE pv.post_id = p.id
)
WHERE is_published = true;

-- Mise à jour des compteurs d'utilisation des tags
UPDATE tags t
SET usage_count = (
  SELECT COUNT(*) 
  FROM (
    SELECT post_id FROM post_tags WHERE tag_id = t.id
    UNION ALL
    SELECT tutorial_id FROM tutorial_tags WHERE tag_id = t.id
  ) AS combined
);

-- Ajout de la colonne post_count si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'post_count') THEN
        ALTER TABLE categories ADD COLUMN post_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Mise à jour des compteurs d'articles par catégorie
UPDATE categories c
SET post_count = (
  SELECT COUNT(*) 
  FROM posts p 
  WHERE p.category_id = c.id AND p.is_published = true
);

-- Afficher un message de confirmation
SELECT 'Données de démonstration insérées avec succès !' as message;
