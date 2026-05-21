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
git clone https://github.com/B-Bilal05/wanderwise.git
cd wanderwise
Installer les dépendances
npm install
[200~3. Configurer les variables d'environnement
bash

cp .env.example .env.local

Remplir .env.local :
env

GROQ_API_KEY=gsk_votre_cle_groq
NEXT_PUBLIC_OPENWEATHER_KEY=votre_cle_meteo

4. Lancer en développement
bash

npm run dev

Ouvrir http://localhost:3000
📁 Structure du Projet
text

wanderwise/
├── src/app/
│   ├── page.tsx
│   ├── compare/
│   ├── favorites/
│   ├── budget-planner/
│   ├── itinerary/
│   ├── packer/
│   ├── safety/
│   ├── chatbot/
│   ├── api/
│   ├── components/
│   └── context/
├── public/
├── package.json
└── README.md

🌐 Pages de l'Application
RouteDescription
/Recherche et fiche destination
/compareComparateur de 2 villes
/favoritesDestinations sauvegardées
/budget-plannerPlanificateur de budget
/itineraryGénérateur d'itinéraire
/packerListe de bagages IA
/safetySécurité & santé
/chatbotAssistant de voyage
🔑 Variables d'Environnement
VariableDescription
GROQ_API_KEYClé API Groq (serveur)
NEXT_PUBLIC_OPENWEATHER_KEYClé OpenWeatherMap (client)
👤 Auteur

Bilal BOUKAICH – GitHub
📄 Licence

Libre d'utilisation pour un usage pédagogique.
