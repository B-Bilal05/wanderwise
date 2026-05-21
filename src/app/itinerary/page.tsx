'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../components/MapView'), { ssr: false });

const INTERESTS = ['Culture & Histoire', 'Gastronomie', 'Nature & Randonnée', 'Shopping', 'Art & Musées', 'Vie nocturne', 'Architecture', 'Plages', 'Aventure', 'Spiritualité'];
const LEVELS = [
  { key: 'budget', label: '🎒 Économique', daily: 50 },
  { key: 'mid', label: '🏨 Confort', daily: 120 },
  { key: 'luxury', label: '💎 Luxe', daily: 300 },
];

interface Activity {
  time: string; place: string; description: string;
  duration: string; cost: number; category: string; tip: string;
  lat?: number; lng?: number;
}
interface DayPlan {
  day: number; title: string; theme: string;
  activities: Activity[];
  budgetBreakdown: { food: number; transport: number; activities: number; total: number };
}
interface Itinerary {
  city: string; days: number; totalEstimated: number;
  weatherAdvice: string; itinerary: DayPlan[];
}

const CAT_COLORS: Record<string, string> = {
  Museum: '#3b82f6', Restaurant: '#4ade80', Landmark: '#d4af37',
  Market: '#f87171', Nature: '#34d399', Hotel: '#a78bfa',
  Transport: '#fb923c', Shopping: '#f472b6', default: '#94a3b8',
};

export default function ItineraryPage() {
  const [form, setForm] = useState({ city: '', days: '5', level: 'mid', interests: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Itinerary | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [error, setError] = useState('');

  const toggleInterest = (i: string) => setForm(f => ({
    ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
  }));

  const generate = async () => {
    if (!form.city || form.interests.length === 0) return;
    setLoading(true); setError(''); setPlan(null);
    const lvl = LEVELS.find(l => l.key === form.level)!;
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: form.city, days: parseInt(form.days), budget: lvl.daily, interests: form.interests, level: lvl.label }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setPlan(data); setActiveDay(0);
    } catch { setError('Erreur de génération. Réessaie.'); }
    finally { setLoading(false); }
  };

  const currentDay = plan?.itinerary[activeDay];
  const allPoints = currentDay?.activities.filter(a => a.lat && a.lng).map(a => ({ name: a.place, lat: a.lat!, lng: a.lng! })) || [];
  const centerLat = allPoints.length ? allPoints[0].lat : 48.8566;
  const centerLng = allPoints.length ? allPoints[0].lng : 2.3522;

  const s = {
    card: { background: '#fff', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '12px' },
    label: { fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', display: 'block' as const, marginBottom: '8px' },
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: '#f1f5f9' }}>
      <style>{`
        input::placeholder { color: #94a3b8; opacity: 1; }
        select option { color: #0f172a; background: #fff; }
        input, select { color: #0f172a !important; }
      `}</style>

      {/* NAVBAR */}
      <div style={{ background: '#0a1628', padding: '10px 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span>🌍</span><span style={{ color: '#d4af37', fontWeight: 700, fontSize: '15px' }}>WanderWise</span>
        </Link>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['/', '🔍 Explorer'], ['/compare', '🔄 Comparer'], ['/favorites', '❤️ Favoris'], ['/budget-planner', '🧮 Budget'], ['/chatbot', '🤖 Chat']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '20px' }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '20px', marginBottom: '1rem' }}>
          Planificateur d'itinéraire IA
        </div>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '.5rem' }}>Ton voyage, jour par jour 🗓️</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>L'IA génère un planning complet personnalisé selon tes envies</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '-1rem auto 0', padding: '0 1rem 3rem', position: 'relative', zIndex: 10 }}>

        {/* FORM */}
        {!plan && (
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '1.5rem' }}>
              <div>
                <label style={s.label}>🏙️ Destination</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="ex: Tokyo, Rome..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#f8fafc' }} />
              </div>
              <div>
                <label style={s.label}>📅 Nombre de jours</label>
                <select value={form.days} onChange={e => setForm({ ...form, days: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}>
                  {[3,4,5,6,7,10,14].map(d => <option key={d} value={d}>{d} jours</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>💰 Niveau de budget</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {LEVELS.map(l => (
                    <button key={l.key} onClick={() => setForm({ ...form, level: l.key })}
                      style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: form.level === l.key ? 700 : 400, border: form.level === l.key ? 'none' : '1px solid #e2e8f0', background: form.level === l.key ? '#0a1628' : '#f8fafc', color: form.level === l.key ? '#d4af37' : '#475569', textAlign: 'left' }}>
                      {l.label} <span style={{ opacity: 0.6 }}>~${l.daily}/j</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={s.label}>🎯 Centres d'intérêt (choisir au moins 1)</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)}
                    style={{ padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: form.interests.includes(i) ? 700 : 400, border: form.interests.includes(i) ? 'none' : '1px solid #e2e8f0', background: form.interests.includes(i) ? '#0a1628' : '#f8fafc', color: form.interests.includes(i) ? '#d4af37' : '#475569', transition: 'all .2s' }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading || !form.city || form.interests.length === 0}
              style={{ width: '100%', background: '#d4af37', color: '#0a1628', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', opacity: (!form.city || form.interests.length === 0) ? 0.5 : 1 }}>
              {loading ? '⏳ Génération de votre itinéraire...' : '✨ Générer mon itinéraire'}
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b', fontSize: '14px' }}>L'IA prépare votre itinéraire pour <strong>{form.city}</strong>...</p>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>Cela peut prendre 10-15 secondes</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '12px' }}>{error}</div>}

        {plan && (
          <>
            {/* HEADER DU PLAN */}
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.2rem', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Itinéraire généré par IA</div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px' }}>{plan.city}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>{plan.days} jours · Budget estimé total : <strong style={{ color: '#d4af37' }}>${plan.totalEstimated}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => setPlan(null)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px' }}>
                    🔄 Nouveau
                  </button>
                </div>
              </div>
              {plan.weatherAdvice && (
                <div style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '10px 14px', marginTop: '1rem', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  🌤️ {plan.weatherAdvice}
                </div>
              )}
            </div>

            {/* SÉLECTEUR DE JOURS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
              {plan.itinerary.map((d, i) => (
                <button key={i} onClick={() => setActiveDay(i)}
                  style={{ padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: activeDay === i ? 700 : 400, border: activeDay === i ? 'none' : '1px solid #e2e8f0', background: activeDay === i ? '#0a1628' : '#fff', color: activeDay === i ? '#d4af37' : '#475569', boxShadow: activeDay === i ? '0 2px 8px rgba(0,0,0,0.15)' : 'none', transition: 'all .2s' }}>
                  Jour {d.day}
                </button>
              ))}
            </div>

            {currentDay && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                {/* COLONNE GAUCHE : activités */}
                <div>
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '10px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '4px' }}>Jour {currentDay.day}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>{currentDay.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>🎯 {currentDay.theme}</div>
                  </div>

                  {currentDay.activities.map((act, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '1rem', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', borderLeft: `3px solid ${CAT_COLORS[act.category] || CAT_COLORS.default}` }}>
                      <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#0a1628', background: '#f1f5f9', borderRadius: '8px', padding: '4px 8px', marginBottom: '4px' }}>{act.time}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{act.duration}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '3px' }}>{act.place}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, marginBottom: '6px' }}>{act.description}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ background: `${CAT_COLORS[act.category] || CAT_COLORS.default}20`, color: CAT_COLORS[act.category] || CAT_COLORS.default, fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{act.category}</span>
                          <span style={{ fontSize: '11px', color: act.cost === 0 ? '#4ade80' : '#d4af37', fontWeight: 700 }}>{act.cost === 0 ? 'Gratuit' : `$${act.cost}`}</span>
                        </div>
                        {act.tip && (
                          <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '6px 10px', marginTop: '6px', fontSize: '11px', color: '#475569' }}>
                            💡 {act.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* BUDGET DU JOUR */}
                  <div style={{ background: 'linear-gradient(135deg,rgba(10,22,40,0.04),rgba(212,175,55,0.06))', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '1rem' }}>
                    <div style={{ fontSize: '11px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '10px' }}>💰 Budget Jour {currentDay.day}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[['🍽 Repas', currentDay.budgetBreakdown.food], ['🚌 Transport', currentDay.budgetBreakdown.transport], ['🎯 Activités', currentDay.budgetBreakdown.activities]].map(([l, v]) => (
                        <div key={l as string} style={{ background: '#fff', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '3px' }}>{l as string}</div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>${v as number}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', fontWeight: 700, color: '#0a1628' }}>
                      Total : <span style={{ color: '#d4af37' }}>${currentDay.budgetBreakdown.total}</span>
                    </div>
                  </div>
                </div>

                {/* COLONNE DROITE : carte */}
                <div>
                  <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '12px', position: 'sticky', top: '80px' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                      📍 Parcours Jour {currentDay.day}
                    </div>
                    {allPoints.length > 0 ? (
                      <MapView center={[centerLat, centerLng]} places={allPoints} />
                    ) : (
                      <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        Coordonnées indisponibles
                      </div>
                    )}
                    <div style={{ padding: '12px 16px' }}>
                      {currentDay.activities.map((act, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ width: '20px', height: '20px', background: CAT_COLORS[act.category] || CAT_COLORS.default, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                          <span style={{ fontSize: '11px', color: '#475569' }}>{act.time} — {act.place}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
