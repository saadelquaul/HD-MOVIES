# HD-MOVIES — Plateforme de Streaming Vidéo

Application web moderne de streaming vidéo développée avec **React 19**, **TypeScript** et **Vite**. Elle permet aux utilisateurs de découvrir, visionner des trailers et gérer leur expérience de visionnage de films, séries et documentaires.

## Fonctionnalités

### Authentification

- Formulaire de connexion et d'inscription
- Validation en temps réel des champs
- Stockage des données dans `localStorage`
- Protection des routes (accès réservé aux utilisateurs connectés)

### Page d'accueil (Catalogue)

- Grille responsive de contenus avec posters
- Filtres par type (Films, Séries, Documentaires)
- Filtre par catégorie/genre
- Tri (Tendances, Mieux notés, Populaires)
- Section Hero avec contenu vedette
- Recherche avec suggestions en temps réel

### Détails d'un contenu

- Informations complètes (titre, description, réalisateur, casting)
- Lecteur YouTube embed (bande-annonce)
- Ajouter/Retirer de Ma Liste
- Système de notation (1-10 étoiles)
- Contenus similaires

### Ma Liste (Watchlist)

- Affichage des contenus ajoutés
- Retrait d'éléments

### Profil Utilisateur

- Informations du compte
- Statistiques de visionnage (contenus visionnés, notes données, note moyenne)

## Bonus

- **API TMDb** : Données réelles de films, séries et documentaires via l'API TMDb
- Recherche avec suggestions auto-complétées
- Skeletons de chargement animés
- Micro-animations et transitions fluides

## Technologies

| Technologie      | Version |
|------------------|---------|
| React            | 19.2    |
| TypeScript       | 5.9     |
| Vite             | 7.3     |
| React Router DOM | 7.x     |
| React Icons      | 5.x     |

## Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd HD-MOVIES

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible à `http://localhost:5173/`

## Structure du projet

```
src/
├── models/           # Interfaces TypeScript
├── hooks/            # Custom Hooks (useAuth, useLocalStorage, useDebounce, useWatchlist)
├── services/         # Service API TMDb
├── contexts/         # AuthContext
├── components/       # Composants partagés (Navbar, Footer, VideoCard, SearchBar, etc.)
├── pages/            # Pages (Home, Login, Register, VideoDetail, Watchlist, Profile)
├── App.tsx           # Routage avec lazy loading
├── App.css           # Styles des composants
├── index.css         # Design system global
└── main.tsx          # Point d'entrée
```

## Exigences techniques respectées

- ✅ Composants fonctionnels avec Hooks
- ✅ Custom Hooks (`useAuth`, `useLocalStorage`, `useDebounce`, `useWatchlist`)
- ✅ Protection des routes
- ✅ Lazy loading des routes
- ✅ Responsive design
- ✅ Validation en temps réel des formulaires
- ✅ Application 100% Frontend
- ✅ Trailers YouTube (via TMDb API)
- ✅ API publique TMDb pour les métadonnées
