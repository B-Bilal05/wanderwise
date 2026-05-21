'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'fr' | 'ar' | 'es' | 'it' | 'ja' | 'de' | 'pt';

interface LangOption { code: Lang; label: string; dir: 'ltr'|'rtl'; apiName: string }

export const LANGUAGES: LangOption[] = [
  { code: 'en', label: '🇬🇧 EN', dir: 'ltr', apiName: 'English' },
  { code: 'fr', label: '🇫🇷 FR', dir: 'ltr', apiName: 'French' },
  { code: 'ar', label: '🇲🇦 AR', dir: 'rtl', apiName: 'Arabic' },
  { code: 'es', label: '🇪🇸 ES', dir: 'ltr', apiName: 'Spanish' },
  { code: 'it', label: '🇮🇹 IT', dir: 'ltr', apiName: 'Italian' },
  { code: 'ja', label: '🇯🇵 JA', dir: 'ltr', apiName: 'Japanese' },
  { code: 'de', label: '🇩🇪 DE', dir: 'ltr', apiName: 'German' },
  { code: 'pt', label: '🇧🇷 PT', dir: 'ltr', apiName: 'Portuguese' },
];

export const UI: Record<Lang, Record<string, string>> = {
  en: {
    search: 'Search a city...', explore: 'Explore', tagline: 'Budget · Weather · Map · AI Advice',
    overview: '🏠 Overview', places: '📍 Places', budget: '💰 Budget', tips: '💡 Tips', ai: '🤖 AI',
    topSpot: 'Top Spot', fromDay: 'From / day', aiInsight: '🤖 AI Insight',
    currentWeather: 'Current Weather', safetyLevel: 'Safety', bestTime: 'Best Time',
    currency: 'Currency', language: 'Language', timezone: 'Timezone', visa: 'Visa',
    midBreakdown: 'Mid-range breakdown', hotelNight: '🏨 Hotel / night',
    foodDay: '🍽 Food / day', transportDay: '🚌 Transport / day', weekTrip: '📅 7-day trip',
    aiPowered: 'AI-Powered Travel Advice', poweredBy: 'Powered by Groq · Llama 3.3',
    nav_explore: '🔍 Explore', nav_compare: '🔄 Compare', nav_favorites: '❤️ Favorites', nav_budget: '🧮 Budget', nav_itinerary: '📅 Itinerary', nav_chatbot: '🤖 Chatbot',
    searching: 'Searching for', hero_title: 'Discover the world,', hero_italic: 'smarter.',
    loading: 'Loading...', error: 'Error. Please try again.',
  },
  fr: {
    search: 'Rechercher une ville...', explore: 'Explorer', tagline: 'Budget · Météo · Carte · Conseils IA',
    overview: '🏠 Aperçu', places: '📍 Lieux', budget: '💰 Budget', tips: '💡 Conseils', ai: '🤖 IA',
    topSpot: 'À Voir', fromDay: 'Dès / jour', aiInsight: '🤖 Conseil IA',
    currentWeather: 'Météo Actuelle', safetyLevel: 'Sécurité', bestTime: 'Meilleure Période',
    currency: 'Monnaie', language: 'Langue', timezone: 'Fuseau', visa: 'Visa',
    midBreakdown: 'Détail budget moyen', hotelNight: '🏨 Hôtel / nuit',
    foodDay: '🍽 Repas / jour', transportDay: '🚌 Transport / jour', weekTrip: '📅 Séjour 7 jours',
    aiPowered: 'Conseils IA Personnalisés', poweredBy: 'Propulsé par Groq · Llama 3.3',
    nav_explore: '🔍 Explorer', nav_compare: '🔄 Comparer', nav_favorites: '❤️ Favoris', nav_budget: '🧮 Budget', nav_itinerary: '📅 Itinéraire', nav_chatbot: '🤖 Chatbot',
    searching: 'Recherche en cours pour', hero_title: 'Découvrez le monde,', hero_italic: 'intelligemment.',
    loading: 'Chargement...', error: 'Erreur. Veuillez réessayer.',
  },
  ar: {
    search: 'ابحث عن مدينة...', explore: 'استكشف', tagline: 'الميزانية · الطقس · الخريطة · نصائح الذكاء الاصطناعي',
    overview: '🏠 نظرة عامة', places: '📍 الأماكن', budget: '💰 الميزانية', tips: '💡 النصائح', ai: '🤖 الذكاء',
    topSpot: 'مكان مميز', fromDay: 'من / يوم', aiInsight: '🤖 نصيحة الذكاء',
    currentWeather: 'الطقس الحالي', safetyLevel: 'الأمان', bestTime: 'أفضل وقت',
    currency: 'العملة', language: 'اللغة', timezone: 'المنطقة الزمنية', visa: 'التأشيرة',
    midBreakdown: 'تفاصيل الميزانية المتوسطة', hotelNight: '🏨 الفندق / ليلة',
    foodDay: '🍽 الطعام / يوم', transportDay: '🚌 النقل / يوم', weekTrip: '📅 رحلة 7 أيام',
    aiPowered: 'نصائح سفر مدعومة بالذكاء الاصطناعي', poweredBy: 'مدعوم بـ Groq · Llama 3.3',
    nav_explore: '🔍 استكشف', nav_compare: '🔄 قارن', nav_favorites: '❤️ المفضلة', nav_budget: '🧮 الميزانية', nav_itinerary: '📅 الرحلة', nav_chatbot: '🤖 الدردشة',
    searching: 'جارٍ البحث عن', hero_title: 'اكتشف العالم،', hero_italic: 'بذكاء.',
    loading: 'جارٍ التحميل...', error: 'خطأ. حاول مجدداً.',
  },
  es: {
    search: 'Buscar una ciudad...', explore: 'Explorar', tagline: 'Presupuesto · Clima · Mapa · Consejos IA',
    overview: '🏠 Resumen', places: '📍 Lugares', budget: '💰 Presupuesto', tips: '💡 Consejos', ai: '🤖 IA',
    topSpot: 'Lugar Top', fromDay: 'Desde / día', aiInsight: '🤖 Consejo IA',
    currentWeather: 'Clima Actual', safetyLevel: 'Seguridad', bestTime: 'Mejor Época',
    currency: 'Moneda', language: 'Idioma', timezone: 'Zona horaria', visa: 'Visa',
    midBreakdown: 'Desglose presupuesto medio', hotelNight: '🏨 Hotel / noche',
    foodDay: '🍽 Comida / día', transportDay: '🚌 Transporte / día', weekTrip: '📅 Viaje 7 días',
    aiPowered: 'Consejos de Viaje con IA', poweredBy: 'Impulsado por Groq · Llama 3.3',
    nav_explore: '🔍 Explorar', nav_compare: '🔄 Comparar', nav_favorites: '❤️ Favoritos', nav_budget: '🧮 Presupuesto', nav_itinerary: '📅 Itinerario', nav_chatbot: '🤖 Chatbot',
    searching: 'Buscando', hero_title: 'Descubre el mundo,', hero_italic: 'más inteligente.',
    loading: 'Cargando...', error: 'Error. Inténtalo de nuevo.',
  },
  it: {
    search: 'Cerca una città...', explore: 'Esplora', tagline: 'Budget · Meteo · Mappa · Consigli IA',
    overview: '🏠 Panoramica', places: '📍 Luoghi', budget: '💰 Budget', tips: '💡 Consigli', ai: '🤖 IA',
    topSpot: 'Luogo Top', fromDay: 'Da / giorno', aiInsight: '🤖 Consiglio IA',
    currentWeather: 'Meteo Attuale', safetyLevel: 'Sicurezza', bestTime: 'Periodo Migliore',
    currency: 'Valuta', language: 'Lingua', timezone: 'Fuso orario', visa: 'Visto',
    midBreakdown: 'Dettaglio budget medio', hotelNight: '🏨 Hotel / notte',
    foodDay: '🍽 Cibo / giorno', transportDay: '🚌 Trasporto / giorno', weekTrip: '📅 Viaggio 7 giorni',
    aiPowered: 'Consigli di Viaggio IA', poweredBy: 'Powered by Groq · Llama 3.3',
    nav_explore: '🔍 Esplora', nav_compare: '🔄 Confronta', nav_favorites: '❤️ Preferiti', nav_budget: '🧮 Budget', nav_itinerary: '📅 Itinerario', nav_chatbot: '🤖 Chatbot',
    searching: 'Ricerca in corso per', hero_title: 'Scopri il mondo,', hero_italic: 'in modo più intelligente.',
    loading: 'Caricamento...', error: 'Errore. Riprova.',
  },
  ja: {
    search: '都市を検索...', explore: '探索', tagline: '予算・天気・地図・AIアドバイス',
    overview: '🏠 概要', places: '📍 スポット', budget: '💰 予算', tips: '💡 ヒント', ai: '🤖 AI',
    topSpot: 'おすすめ', fromDay: '1日 / から', aiInsight: '🤖 AIアドバイス',
    currentWeather: '現在の天気', safetyLevel: '安全性', bestTime: 'ベストシーズン',
    currency: '通貨', language: '言語', timezone: 'タイムゾーン', visa: 'ビザ',
    midBreakdown: '中級予算の内訳', hotelNight: '🏨 ホテル / 泊',
    foodDay: '🍽 食事 / 日', transportDay: '🚌 交通 / 日', weekTrip: '📅 7日間旅行',
    aiPowered: 'AI旅行アドバイス', poweredBy: 'Powered by Groq · Llama 3.3',
    nav_explore: '🔍 探索', nav_compare: '🔄 比較', nav_favorites: '❤️ お気に入り', nav_budget: '🧮 予算', nav_itinerary: '📅 旅程', nav_chatbot: '🤖 チャット',
    searching: '検索中', hero_title: '世界を発見しよう、', hero_italic: 'スマートに。',
    loading: '読み込み中...', error: 'エラーが発生しました。',
  },
  de: {
    search: 'Stadt suchen...', explore: 'Erkunden', tagline: 'Budget · Wetter · Karte · KI-Tipps',
    overview: '🏠 Übersicht', places: '📍 Orte', budget: '💰 Budget', tips: '💡 Tipps', ai: '🤖 KI',
    topSpot: 'Top Ort', fromDay: 'Ab / Tag', aiInsight: '🤖 KI-Tipp',
    currentWeather: 'Aktuelles Wetter', safetyLevel: 'Sicherheit', bestTime: 'Beste Reisezeit',
    currency: 'Währung', language: 'Sprache', timezone: 'Zeitzone', visa: 'Visum',
    midBreakdown: 'Mittelklasse-Budget', hotelNight: '🏨 Hotel / Nacht',
    foodDay: '🍽 Essen / Tag', transportDay: '🚌 Transport / Tag', weekTrip: '📅 7-Tage-Reise',
    aiPowered: 'KI-Reiseempfehlungen', poweredBy: 'Powered by Groq · Llama 3.3',
    nav_explore: '🔍 Erkunden', nav_compare: '🔄 Vergleichen', nav_favorites: '❤️ Favoriten', nav_budget: '🧮 Budget', nav_itinerary: '📅 Reiseplan', nav_chatbot: '🤖 Chatbot',
    searching: 'Suche nach', hero_title: 'Entdecke die Welt,', hero_italic: 'intelligenter.',
    loading: 'Laden...', error: 'Fehler. Bitte versuche es erneut.',
  },
  pt: {
    search: 'Pesquisar uma cidade...', explore: 'Explorar', tagline: 'Orçamento · Clima · Mapa · Conselhos IA',
    overview: '🏠 Visão Geral', places: '📍 Lugares', budget: '💰 Orçamento', tips: '💡 Dicas', ai: '🤖 IA',
    topSpot: 'Lugar Top', fromDay: 'A partir / dia', aiInsight: '🤖 Dica IA',
    currentWeather: 'Clima Atual', safetyLevel: 'Segurança', bestTime: 'Melhor Época',
    currency: 'Moeda', language: 'Idioma', timezone: 'Fuso horário', visa: 'Visto',
    midBreakdown: 'Detalhes orçamento médio', hotelNight: '🏨 Hotel / noite',
    foodDay: '🍽 Comida / dia', transportDay: '🚌 Transporte / dia', weekTrip: '📅 Viagem 7 dias',
    aiPowered: 'Conselhos de Viagem com IA', poweredBy: 'Powered by Groq · Llama 3.3',
    nav_explore: '🔍 Explorar', nav_compare: '🔄 Comparar', nav_favorites: '❤️ Favoritos', nav_budget: '🧮 Orçamento', nav_itinerary: '📅 Roteiro', nav_chatbot: '🤖 Chatbot',
    searching: 'Pesquisando', hero_title: 'Descubra o mundo,', hero_italic: 'de forma mais inteligente.',
    loading: 'Carregando...', error: 'Erro. Tente novamente.',
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Record<string, string>;
  dir: 'ltr' | 'rtl';
  apiLang: string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en', setLang: () => {}, t: UI.en, dir: 'ltr', apiLang: 'English'
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const current = LANGUAGES.find(l => l.code === lang)!;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: UI[lang], dir: current.dir, apiLang: current.apiName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
