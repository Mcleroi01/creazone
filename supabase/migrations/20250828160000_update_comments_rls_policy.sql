-- Suppression de l'ancienne politique d'insertion
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent créer des commentaires" ON comments;

-- Création d'une nouvelle politique qui permet à tout le monde de créer des commentaires
CREATE POLICY "Tout le monde peut créer des commentaires"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Vérification des politiques existantes
COMMENT ON POLICY "Les commentaires sont visibles par tout le monde" ON comments 
IS 'Permet à tout le monde de voir les commentaires publiés';

COMMENT ON POLICY "Tout le monde peut créer des commentaires" ON comments 
IS 'Permet à tout le monde de créer des commentaires, même non authentifié';

COMMENT ON POLICY "Les utilisateurs peuvent modifier leurs propres commentaires" ON comments 
IS 'Permet aux utilisateurs de modifier uniquement leurs propres commentaires';

COMMENT ON POLICY "Les utilisateurs peuvent supprimer leurs propres commentaires" ON comments 
IS 'Permet aux utilisateurs de supprimer uniquement leurs propres commentaires';

COMMENT ON POLICY "Les administrateurs peuvent tout faire sur les commentaires" ON comments 
IS 'Donne tous les droits aux administrateurs et modérateurs';

-- Vérification des permissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'comments' 
        AND policyname = 'Tout le monde peut créer des commentaires'
    ) THEN
        RAISE EXCEPTION 'La politique d''insertion n''a pas été créée correctement';
    END IF;
END $$;
