# CréaZone

Plateforme d'apprentissage et de partage de compétences créatives et techniques.

## 🚀 Fonctionnalités

- Articles et tutoriels sur le développement et le design
- Système de commentaires interactif
- Interface moderne et réactive
- Mode sombre/clair
- Optimisé pour le référencement (SEO)

## 🛠️ Technologies utilisées

- React 18 avec TypeScript
- Vite pour le build
- Tailwind CSS pour le style
- Supabase pour la base de données et l'authentification
- React Router pour la navigation

## 🚀 Démarrage rapide

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_REPO]
   cd Blog
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env` à la racine du projet avec les variables nécessaires (voir `.env.example`)

4. **Démarrer l'environnement de développement**
   ```bash
   npm run dev
   ```

5. **Créer une version de production**
   ```bash
   npm run build
   ```

## 🌐 Déploiement

Le projet est configuré pour être déployé sur Netlify avec les paramètres suivants :
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: Configurées dans les paramètres Netlify

## 📂 Structure du projet

```
/
├── public/           # Fichiers statiques
├── src/
│   ├── components/   # Composants React
│   ├── contexts/     # Contextes React
│   ├── hooks/        # Hooks personnalisés
│   ├── lib/          # Utilitaires et configurations
│   └── App.tsx       # Composant racine
├── .env.example      # Exemple de configuration
├── index.html        # Point d'entrée HTML
└── vite.config.ts    # Configuration Vite
```

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 🙋‍♂️ Auteur

Créé avec ❤️ par l'équipe CréaZone
