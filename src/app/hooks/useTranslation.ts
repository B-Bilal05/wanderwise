const COUNTRY_LANGS: Record<string, {code: string; name: string; label: string; dir: 'ltr'|'rtl'}[]> = {
  // Arabophones
  'Morocco': [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'Maroc':   [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'Algeria': [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'Tunisia': [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'Egypt':   [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'Saudi Arabia': [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'United Arab Emirates': [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  'UAE':     [{code:'ar',name:'Arabic',label:'العربية',dir:'rtl'}],
  // Asiatiques
  'Japan':   [{code:'ja',name:'Japanese',label:'日本語',dir:'ltr'}],
  'China':   [{code:'zh',name:'Chinese',label:'中文',dir:'ltr'}],
  'South Korea': [{code:'ko',name:'Korean',label:'한국어',dir:'ltr'}],
  'Thailand': [{code:'th',name:'Thai',label:'ภาษาไทย',dir:'ltr'}],
  'Vietnam': [{code:'vi',name:'Vietnamese',label:'Tiếng Việt',dir:'ltr'}],
  'Indonesia': [{code:'id',name:'Indonesian',label:'Bahasa',dir:'ltr'}],
  // Européens
  'France':   [{code:'fr',name:'French',label:'Français',dir:'ltr'}],
  'Belgium':  [{code:'fr',name:'French',label:'Français',dir:'ltr'}],
  'Spain':    [{code:'es',name:'Spanish',label:'Español',dir:'ltr'}],
  'Italy':    [{code:'it',name:'Italian',label:'Italiano',dir:'ltr'}],
  'Germany':  [{code:'de',name:'German',label:'Deutsch',dir:'ltr'}],
  'Austria':  [{code:'de',name:'German',label:'Deutsch',dir:'ltr'}],
  'Portugal': [{code:'pt',name:'Portuguese',label:'Português',dir:'ltr'}],
  'Brazil':   [{code:'pt',name:'Portuguese',label:'Português',dir:'ltr'}],
  'Turkey':   [{code:'tr',name:'Turkish',label:'Türkçe',dir:'ltr'}],
  'Greece':   [{code:'el',name:'Greek',label:'Ελληνικά',dir:'ltr'}],
  'Netherlands': [{code:'nl',name:'Dutch',label:'Nederlands',dir:'ltr'}],
  'Russia':   [{code:'ru',name:'Russian',label:'Русский',dir:'ltr'}],
  'Poland':   [{code:'pl',name:'Polish',label:'Polski',dir:'ltr'}],
  // Amériques
  'Mexico':   [{code:'es',name:'Spanish',label:'Español',dir:'ltr'}],
  'Argentina':[{code:'es',name:'Spanish',label:'Español',dir:'ltr'}],
  'Colombia': [{code:'es',name:'Spanish',label:'Español',dir:'ltr'}],
  // Autres
  'Israel':   [{code:'he',name:'Hebrew',label:'עברית',dir:'rtl'}],
  'India':    [{code:'hi',name:'Hindi',label:'हिन्दी',dir:'ltr'}],
};

// Correspondance pays anglais → pays tel que retourné par l'IA
const ALIASES: Record<string, string> = {
  'Japon': 'Japan',
  'Italie': 'Italy',
  'Espagne': 'Spain',
  'France': 'France',
  'Allemagne': 'Germany',
  'Maroc': 'Morocco',
  'Thaïlande': 'Thailand',
  'Chine': 'China',
  'Turquie': 'Turkey',
  'Grèce': 'Greece',
  'Russie': 'Russia',
  'Brésil': 'Brazil',
  'Inde': 'India',
  'Corée du Sud': 'South Korea',
  'Émirats arabes unis': 'United Arab Emirates',
  'Égypte': 'Egypt',
  'Tunisie': 'Tunisia',
  'Algérie': 'Algeria',
  'Arabie saoudite': 'Saudi Arabia',
  'Viêt Nam': 'Vietnam',
  'Indonésie': 'Indonesia',
};

export function getAvailableLangs(country: string) {
  const normalized = ALIASES[country] || country;
  return COUNTRY_LANGS[normalized] || [];
}
