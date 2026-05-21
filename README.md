# 🌍 WanderWise — AI Travel Advisor

> Application web full-stack de conseils de voyage intelligente, propulsée par l'IA.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=flat-square)
![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-green?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Fonctionnalités

| Module | Description |
|--------|-------------|
| 🔍 **Recherche destination** | Fiche complète : budget, lieux, météo, conseils IA |
| 🔄 **Comparateur de villes** | Comparaison côte à côte avec verdict IA |
| 💰 **Budget Planner** | Estimation détaillée selon vol, hôtel, nourriture, transport |
| 🗓️ **Itinéraire IA** | Planning jour par jour avec carte interactive |
| 🧳 **Packer AI** | Liste de bagages personnalisée avec checklist interactive |
| 🛡️ **Sécurité & Santé** | Conseils santé, numéros d'urgence, coutumes locales |
| 🤖 **Chatbot** | Assistant de voyage conversationnel |
| 🗺️ **Carte interactive** | Leaflet + OpenStreetMap avec marqueurs GPS |
| 🌤️ **Météo temps réel** | Température, humidité, vent via OpenWeatherMap |
| ❤️ **Favoris** | Sauvegarde locale des destinations préférées |
| 🌐 **Multilingue** | 8 langues avec support RTL (arabe, hébreu) |

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), TypeScript, Tailwind CSS
- **IA** : Groq API — Llama 3.3 70B (gratuit)
- **Carte** : Leaflet.js + React-Leaflet + OpenStreetMap
- **Météo** : OpenWeatherMap API
- **Stockage** : localStorage (favoris, checklist bagages)
- **Déploiement** : Vercel

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+
- Compte [Groq](https://console.groq.com) (gratuit)
- Compte [OpenWeatherMap](https://openweathermap.org/api) (gratuit)

### 1. Cloner le projet
```bash
git clone https://github.com/TON_USERNAME/wanderwise.git
cd wanderwise
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```
Remplir `.env.local` :
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENWEATHER_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Lancer en développement
```bash
npm run dev
```
Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du Projet
wanderwise/
├── src/app/
│   ├── page.tsx                    # Page principale
│   ├── compare/page.tsx            # Comparateur de villes
│   ├── favorites/page.tsx          # Destinations favorites
│   ├── budget-planner/page.tsx     # Planificateur de budget
│   ├── itinerary/page.tsx          # Itinéraire jour par jour
│   ├── packer/page.tsx             # Packer AI (bagages)
│   ├── safety/page.tsx             # Sécurité & Santé
│   ├── chatbot/page.tsx            # Chatbot IA
│   ├── api/
│   │   ├── destination/route.ts
│   │   ├── compare/route.ts
│   │   ├── translate/route.ts
│   │   ├── budget-planner/route.ts
│   │   ├── itinerary/route.ts
│   │   ├── packer/route.ts
│   │   ├── safety/route.ts
│   │   └── recommendation/route.ts
│   ├── components/
│   │   ├── MapView.tsx
│   │   ├── Weather.tsx
│   │   └── ChatInterface.tsx
│   ├── context/
│   │   └── LanguageContext.tsx
│   └── hooks/
│       ├── useFavorites.ts
│       └── useTranslation.ts
├── .env.local
└── .env.example
---

## 🌐 Pages de l'Application

| Route | Description |
|-------|-------------|
| `/` | Recherche et fiche destination |
| `/compare` | Comparateur de 2 villes |
| `/favorites` | Destinations sauvegardées |
| `/budget-planner` | Planificateur de budget |
| `/itinerary` | Générateur d'itinéraire |
| `/packer` | Liste de bagages IA |
| `/safety` | Sécurité & santé |
| `/chatbot` | Assistant de voyage |

---

## 🔑 Variables d'Environnement

| Variable | Description | Source |
|----------|-------------|--------|
| `GROQ_API_KEY` | Clé API Groq (serveur) | [console.groq.com](https://console.groq.com) |
| `NEXT_PUBLIC_OPENWEATHER_KEY` | Clé OpenWeatherMap (client) | [openweathermap.org](https://openweathermap.org/api) |

---

## 👨‍💻 Auteur

**Boukaich Bilal** — Étudiant en Ingénierie des Données et du Logiciel, INSEA Maroc

---

## 📄 Licence

MIT License — libre d'utilisation et de modification.
