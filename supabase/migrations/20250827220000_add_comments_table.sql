-- Création de la table des commentaires
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

-- Activer RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
-- Les utilisateurs authentifiés peuvent voir les commentaires publiés
CREATE POLICY "Les commentaires sont visibles par tout le monde"
  ON comments FOR SELECT
  USING (is_published = true);

-- Tout le monde peut créer des commentaires (même non authentifié)
CREATE POLICY "Tout le monde peut créer des commentaires"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Les utilisateurs peuvent modifier leurs propres commentaires
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres commentaires"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres commentaires
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres commentaires"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Les administrateurs peuvent tout faire
CREATE POLICY "Les administrateurs peuvent tout faire sur les commentaires"
  ON comments
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() 
    AND r.name IN ('super_admin', 'admin', 'moderator')
  ));

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Déclencheur pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
