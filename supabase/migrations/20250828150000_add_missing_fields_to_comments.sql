-- Migration pour ajouter les champs manquants à la table comments

-- Ajout des champs author_name et author_email
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS author_name TEXT NOT NULL DEFAULT 'Anonyme',
ADD COLUMN IF NOT EXISTS author_email TEXT NOT NULL DEFAULT '';

-- Mise à jour des commentaires existants avec des valeurs par défaut
UPDATE comments SET 
  author_name = COALESCE(author_name, 'Anonyme'),
  author_email = COALESCE(author_email, '')
WHERE author_name IS NULL OR author_email IS NULL;

-- Suppression de la valeur par défaut après la migration
ALTER TABLE comments 
ALTER COLUMN author_name DROP DEFAULT,
ALTER COLUMN author_email DROP DEFAULT;

-- Mise à jour des politiques RLS pour autoriser l'insertion de commentaires anonymes
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent créer des commentaires" ON comments;

-- Nouvelle politique qui permet à n'importe qui de créer un commentaire
CREATE POLICY "Tout le monde peut créer des commentaires"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Vérification des modifications
COMMENT ON COLUMN comments.author_name IS 'Nom de l\'auteur du commentaire';
COMMENT ON COLUMN comments.author_email IS 'Email de l\'auteur du commentaire (non affiché publiquement)';

-- Vérification de la structure de la table
COMMENT ON TABLE comments IS 'Table des commentaires des articles de blog';

-- Mise à jour des commentaires pour le développeur
COMMENT ON FUNCTION update_updated_at_column() IS 'Fonction pour mettre à jour automatiquement le champ updated_at';

-- Vérification des index
COMMENT ON INDEX comments_post_id_idx IS 'Index pour accélérer les recherches par post_id';
COMMENT ON INDEX comments_user_id_idx IS 'Index pour accélérer les recherches par user_id';
COMMENT ON INDEX comments_parent_id_idx IS 'Index pour accélérer les recherches hiérarchiques';

-- Vérification des triggers
COMMENT ON TRIGGER update_comments_updated_at ON comments 
IS 'Déclencheur pour mettre à jour automatiquement le champ updated_at lors des mises à jour';
