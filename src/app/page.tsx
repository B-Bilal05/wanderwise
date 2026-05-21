'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useFavorites } from './hooks/useFavorites';
import { useLang, LANGUAGES } from './context/LanguageContext';

const Weather = dynamic(() => import('./components/Weather'), { ssr: false });
const MapView = dynamic(() => import('./components/MapView'), { ssr: false });

const POPULAR = ['Tokyo', 'Marrakech', 'Rome', 'Bangkok', 'New York', 'Dubai'];
const TABS = ['overview', 'places', 'budget', 'tips', 'ai'] as const;
type Tab = typeof TABS[number];

interface Place { name: string; description: string; category: string; entryFee: string; duration: string; lat?: number; lng?: number; }
interface BudgetTier { daily: number; hotel: number; food: number; transport: number; }
interface Tip { type: 'info'|'warn'|'ok'; title: string; text: string; }
interface DestData {
  city: string; country: string; flag: string; currency: string; language: string;
  timezone: string; bestSeason: string; safetyLevel: string; visaInfo: string;
  overview: string; places: Place[]; aiAdvice: string;
  cityLat?: number; cityLng?: number;
  budget: { budget: BudgetTier; mid: BudgetTier; luxury: BudgetTier };
  tips: Tip[];
}

function HomeContent() {
  const searchParams = useSearchParams();
  const { lang, setLang, t, dir, apiLang } = useLang();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DestData | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const search = async (dest: string, forceLang?: string) => {
    if (!dest.trim()) return;
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: dest, lang: forceLang || apiLang }),
      });
      if (!res.ok) throw new Error('API error');
      setData(await res.json()); setTab('overview');
    } catch { setError(t.error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const city = searchParams.get('city');
    if (city) { setQuery(city); search(city); }
  }, [searchParams]);

  // Re-fetch when language changes and we have a destination
  useEffect(() => {
    if (data && query) search(query);
  }, [lang]);

  const toggleFavorite = () => {
    if (!data) return;
    if (isFavorite(data.city)) removeFavorite(data.city);
    else addFavorite({ city: data.city, country: data.country, flag: data.flag, budgetPerDay: data.budget.budget.daily });
  };

  const tipIcon = (type: string) => type === 'warn' ? '⚠' : type === 'ok' ? '✓' : 'ℹ';
  const tipColor = (type: string) => type === 'warn' ? '#fef3c7' : type === 'ok' ? '#dcfce7' : '#dbeafe';
  const safetyColor = (s: string) => s?.toLowerCase().includes('safe') ? '#dcfce7' : s?.toLowerCase().includes('caution') ? '#fef3c7' : '#fef2f2';
  const safetyText = (s: string) => s?.toLowerCase().includes('safe') ? '#166534' : s?.toLowerCase().includes('caution') ? '#854d0e' : '#dc2626';
  const isRTL = dir === 'rtl';

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: '#f1f5f9' }} dir={dir}>

      {/* NAVBAR */}
      <div style={{ background: '#0a1628', padding: '10px 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🌍</span>
          <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '15px' }}>WanderWise</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[['/', t.nav_explore], ['/compare', t.nav_compare], ['/favorites', t.nav_favorites], ['/budget-planner', t.nav_budget], ['/itinerary', t.nav_itinerary], ['/packer', '🎒 Packer'], ['/chatbot', t.nav_chatbot]].map(([href, label]) => (
            <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '20px' }}>{label}</a>
          ))}

          {/* LANGUAGE SELECTOR */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowLangMenu(!showLangMenu)}
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', fontSize: '11px', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontWeight: 700 }}>
              {LANGUAGES.find(l => l.code === lang)?.label} ▾
            </button>
            {showLangMenu && (
              <div style={{ position: 'absolute', top: '36px', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', zIndex: 999, minWidth: '140px' }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '13px', background: lang === l.code ? '#f1f5f9' : 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: lang === l.code ? 700 : 400, color: lang === l.code ? '#d4af37' : '#0f172a' }}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c,#0f2744)', padding: '3.5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '20px', marginBottom: '1.2rem' }}>
          AI Travel Advisor
        </div>
        <h1 style={{ color: '#fff', fontSize: '2.6rem', fontWeight: 800, marginBottom: '.5rem', lineHeight: 1.2 }}>
          {t.hero_title} <span style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: 400 }}>{t.hero_italic}</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '14px' }}>{t.tagline}</p>
        <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '6px 6px 6px 16px' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search(query)}
            placeholder={t.search}
            style={{ flex: 1, background: '#fff', border: 'none', outline: 'none', color: '#0f172a', fontSize: '14px', direction: isRTL ? 'rtl' : 'ltr' }} />
          <button onClick={() => search(query)} disabled={loading}
            style={{ background: '#0a1628', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
            {loading ? '...' : t.explore}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.2rem' }}>
          {POPULAR.map(p => (
            <span key={p} onClick={() => { setQuery(p); search(p); }}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)', fontSize: '11px', padding: '5px 14px', borderRadius: '20px', cursor: 'pointer' }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '-1.5rem auto 0', padding: '0 1rem 3rem', position: 'relative', zIndex: 10 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>{t.searching} <strong>{query}</strong>...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '12px' }}>{error}</div>}

        {data && (
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '2.8rem', marginBottom: '6px' }}>{data.flag}</div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#fff' }}>{data.city}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', margin: '3px 0 0' }}>{data.country}</p>
                </div>
                <button onClick={toggleFavorite}
                  style={{ background: isFavorite(data.city) ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.08)', border: isFavorite(data.city) ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '16px' }}>
                  {isFavorite(data.city) ? '❤️' : '🤍'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '1rem' }}>
                {[[`💰`, `${t.currency}: ${data.currency}`], [`🗣`, `${t.language}: ${data.language}`], [`🕐`, `${t.timezone}: ${data.timezone}`], [`📅`, `${t.bestTime}: ${data.bestSeason}`]].map(([icon, v]) => (
                  <div key={v} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.75)' }}>{icon} {v}</div>
                ))}
                <div style={{ background: safetyColor(data.safetyLevel), fontSize: '11px', padding: '4px 12px', borderRadius: '20px', color: safetyText(data.safetyLevel), fontWeight: 600 }}>🛡 {data.safetyLevel}</div>
                <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', color: 'rgba(255,255,255,0.75)' }}>✈️ {data.visaInfo}</div>
              </div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', overflowX: 'auto', background: '#fafafa' }}>
              {(['overview','places','budget','tips','ai'] as const).map(tabKey => (
                <div key={tabKey} onClick={() => setTab(tabKey)}
                  style={{ padding: '12px 18px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: tab === tabKey ? '2px solid #d4af37' : '2px solid transparent', color: tab === tabKey ? '#d4af37' : '#64748b', fontWeight: tab === tabKey ? 700 : 400 }}>
                  {t[tabKey]}
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem' }}>
              {tab === 'overview' && (
                <div>
                  {data.cityLat && data.cityLng && <Weather lat={data.cityLat} lng={data.cityLng} city={data.city} />}
                  <p style={{ fontSize: '14px', lineHeight: 1.9, color: '#475569', marginBottom: '1.2rem' }}>{data.overview}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '10px', marginBottom: '1.2rem' }}>
                    {data.places.slice(0,3).map(p => (
                      <div key={p.name} style={{ background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', cursor: 'pointer' }} onClick={() => setTab('places')}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📍 {t.topSpot}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#d4af37', marginTop: '4px' }}>{p.entryFee}</div>
                      </div>
                    ))}
                    <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💰 {t.fromDay}</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#d4af37' }}>${data.budget.budget.daily}</div>
                    </div>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg,rgba(10,22,40,0.03),rgba(212,175,55,0.06))', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>{t.aiInsight}</div>
                    <p style={{ fontSize: '13px', lineHeight: 1.9, color: '#475569', margin: 0 }}>{data.aiAdvice}</p>
                  </div>
                </div>
              )}

              {tab === 'places' && (
                <div>
                  {data.cityLat && data.cityLng && (
                    <div style={{ marginBottom: '1.2rem', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <MapView center={[data.cityLat, data.cityLng]} places={data.places.filter(p => p.lat && p.lng).map(p => ({ name: p.name, lat: p.lat!, lng: p.lng! }))} />
                    </div>
                  )}
                  {data.places.map((p, i) => (
                    <div key={p.name} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '10px', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', color: '#d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.7, marginBottom: '8px' }}>{p.description}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#f1f5f9', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', color: '#475569' }}>{p.category}</span>
                          <span style={{ background: '#f1f5f9', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', color: '#475569' }}>⏱ {p.duration}</span>
                          <span style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', color: '#92600a', fontWeight: 600 }}>💰 {p.entryFee}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'budget' && (
                <div>
                  <div style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.2rem' }}>
                    {(['budget','mid','luxury'] as const).map((tier, i) => {
                      const tv = data.budget[tier];
                      const labels = ['🎒', '🏨', '💎'];
                      const names = lang === 'fr' ? ['Petits budgets','Confort','Luxe'] : lang === 'ar' ? ['اقتصادي','متوسط','فاخر'] : ['Budget','Mid-range','Luxury'];
                      const colors = ['#4ade80','#d4af37','#f87171'];
                      const pct = Math.round((tv.daily / data.budget.luxury.daily) * 100);
                      return (
                        <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '16px 1.2rem', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, width: '110px', flexShrink: 0 }}>{labels[i]} {names[i]}</div>
                          <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: colors[i], borderRadius: '4px' }} />
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, minWidth: '70px', textAlign: 'right' }}>${tv.daily}<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>/j</span></div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>{t.midBreakdown}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[[t.hotelNight, `$${data.budget.mid.hotel}`],[t.foodDay, `$${data.budget.mid.food}`],[t.transportDay, `$${data.budget.mid.transport}`],[t.weekTrip, `$${data.budget.mid.daily * 7}`]].map(([l, v]) => (
                      <div key={l} style={{ background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{l}</div>
                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'tips' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.tips.map((tip, i) => (
                    <div key={i} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '14px 1.2rem', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', background: tipColor(tip.type), borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{tipIcon(tip.type)}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{tip.title}</div>
                        <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7 }}>{tip.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'ai' && (
                <div>
                  <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 700 }}>{t.aiPowered}</div>
                    <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{data.aiAdvice}</p>
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>{t.poweredBy}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return <Suspense><HomeContent /></Suspense>;
}
