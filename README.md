# What-to-do.ch — V1 (front-end)

Plateforme de découverte d'évènements en Suisse romande. React + Vite + TypeScript + Tailwind, 100% front-end (pas de backend), parfaitement responsive mobile & desktop.

## Lancer en local

```bash
cd app
npm install      # (déjà fait)
npm run dev      # → http://localhost:5173
```

Build de production : `npm run build` puis `npm run preview`.

## Pages

| Route | Page |
|---|---|
| `/` | Accueil — hero, recherche, catégories, carrousel premium, stats, tendances |
| `/evenements` | Recherche — filtres (date/région/catégorie), tri, arbre de sous-catégories, liste + **carte interactive** |
| `/evenement/:slug` | Fiche évènement — countdown, infos, carte, réservation simulée, similaires |
| `/mon-evenement` | Espace organisateur — formulaire de publication avec **aperçu en direct** |
| `/centre-aide` | FAQ + contact + chatbot Hi-5 |
| `/connexion` | Connexion / inscription (simulée, localStorage) |
| `/favoris` | Évènements mis en favori |

## Fonctionnalités

- 🎨 Branding fidèle : logo wordmark recréé en CSS, mascotte **Hi-5**, palette violet/teal, dégradés par catégorie, cartes à halo lumineux.
- ⏱️ Comptes à rebours **en direct** sur chaque évènement (dataset « evergreen » : les dates se calent automatiquement dans le futur).
- 🗺️ Carte Leaflet avec pins colorés par catégorie + popups.
- ❤️ Favoris, 🔐 auth simulée et 📅 évènements publiés — persistés en `localStorage`.
- 🤖 Chatbot **Hi-5** flottant avec recommandations.
- 📱 100% responsive, animations Framer Motion, polices Proxima Nova + Pacifico.

## Stack

React 18 · React Router · Vite 6 · Tailwind 3 · Framer Motion · Leaflet · lucide-react

> Données mockées dans `src/data/`. Aucune transaction réelle.
