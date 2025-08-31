-- Activer RLS sur la table visitors si ce n'est pas déjà fait
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion de nouveaux visiteurs
CREATE POLICY "Enable insert for anon users" ON "public"."visitors"
  AS PERMISSIVE FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour permettre la mise à jour des visiteurs existants
CREATE POLICY "Enable update for anon users" ON "public"."visitors"
  AS PERMISSIVE FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Activer RLS sur la table page_views si ce n'est pas déjà fait
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion de nouvelles vues de page
CREATE POLICY "Enable insert for anon users" ON "public"."page_views"
  AS PERMISSIVE FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour permettre la mise à jour des vues de page
CREATE POLICY "Enable update for anon users" ON "public"."page_views"
  AS PERMISSIVE FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
