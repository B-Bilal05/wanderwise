'use client';
import { useState } from 'react';
import Link from 'next/link';

interface SafetyData {
  riskLevel: string; riskColor: string;
  healthAdvice: string[]; securityAdvice: string[];
  emergencyNumbers: { police: string; ambulance: string; pompiers: string; urgences: string };
  specificRisks: string[]; localCustoms: string[];
  waterSafe: boolean; vaccinesRequired: string[];
}

const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver'];
const ACTS = ['Tourisme général', 'Randonnée', 'Plage', 'Musées', 'Marchés', 'Nightlife', 'Trek', 'Affaires'];

export default function SafetyPage() {
  const [form, setForm] = useState({ city: '', country: '', season: 'Été', activities: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SafetyData | null>(null);
  const [error, setError] = useState('');

  const toggleAct = (a: string) => setForm(f => ({
    ...f, activities: f.activities.includes(a) ? f.activities.filter(x => x !== a) : [...f.activities, a]
  }));

  const generate = async () => {
    if (!form.city || !form.country) return;
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, activities: form.activities.join(', ') || 'Tourisme général' }),
      });
      setData(await res.json());
    } catch { setError('Erreur. Réessaie.'); }
    finally { setLoading(false); }
  };

  const riskBg = data?.riskLevel === 'faible' ? 'linear-gradient(135deg,#065f46,#047857)'
    : data?.riskLevel === 'moyen' ? 'linear-gradient(135deg,#78350f,#b45309)'
    : 'linear-gradient(135deg,#7f1d1d,#b91c1c)';

  const riskEmoji = data?.riskLevel === 'faible' ? '🟢' : data?.riskLevel === 'moyen' ? '🟡' : '🔴';

  const s = {
    label: { fontSize: '11px', color: '#64748b', fontWeight: 600 as const, textTransform: 'uppercase' as const, letterSpacing: '1px', display: 'block' as const, marginBottom: '8px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const },
    card: { background: '#fff', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '12px' },
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: '100vh', background: '#f1f5f9' }}>

      {/* NAVBAR */}
      <div style={{ background: '#0a1628', padding: '10px 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span>🌍</span><span style={{ color: '#d4af37', fontWeight: 700, fontSize: '15px' }}>WanderWise</span>
        </Link>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[['/', '🔍 Explorer'], ['/compare', '🔄 Comparer'], ['/itinerary', '🗓️ Itinéraire'], ['/packer', '🧳 Packer'], ['/budget-planner', '🧮 Budget'], ['/chatbot', '🤖 Chat']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '20px' }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '20px', marginBottom: '1rem' }}>
          Assistant Sécurité & Santé
        </div>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '.5rem' }}>Voyage serein, voyage préparé 🛡️</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Conseils santé, sécurité et urgences personnalisés par destination</p>
      </div>

      <div style={{ maxWidth: '780px', margin: '-1rem auto 0', padding: '0 1rem 3rem', position: 'relative', zIndex: 10 }}>

        {/* FORM */}
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '1.2rem' }}>
            <div>
              <label style={s.label}>🏙️ Ville</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="ex: Marrakech" style={s.input} />
            </div>
            <div>
              <label style={s.label}>🌍 Pays</label>
              <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="ex: Maroc" style={s.input} />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={s.label}>📆 Saison du voyage</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {SEASONS.map(season => (
                <button key={season} onClick={() => setForm(f => ({ ...f, season }))}
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: form.season === season ? 700 : 400, border: form.season === season ? 'none' : '1px solid #e2e8f0', background: form.season === season ? '#0a1628' : '#f8fafc', color: form.season === season ? '#d4af37' : '#475569' }}>
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={s.label}>🎯 Activités prévues</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ACTS.map(a => (
                <button key={a} onClick={() => toggleAct(a)}
                  style={{ padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: form.activities.includes(a) ? 700 : 400, border: form.activities.includes(a) ? 'none' : '1px solid #e2e8f0', background: form.activities.includes(a) ? '#0a1628' : '#f8fafc', color: form.activities.includes(a) ? '#d4af37' : '#475569', transition: 'all .2s' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generate} disabled={loading || !form.city || !form.country}
            style={{ width: '100%', background: '#d4af37', color: '#0a1628', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', opacity: (!form.city || !form.country) ? 0.5 : 1 }}>
            {loading ? '⏳ Analyse en cours...' : '🛡️ Analyser la sécurité & santé'}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>Analyse de <strong>{form.city}</strong> en cours...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '12px' }}>{error}</div>}

        {data && (
          <>
            {/* NIVEAU DE RISQUE */}
            <div style={{ background: riskBg, borderRadius: '20px', padding: '1.5rem', marginBottom: '1.2rem', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Niveau de risque global</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{riskEmoji} Risque <span style={{ color: data.riskColor }}>{data.riskLevel.toUpperCase()}</span></div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '6px 0 0' }}>
                    {form.city}, {form.country} · {form.season}
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Eau du robinet</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: data.waterSafe ? '#4ade80' : '#f87171' }}>
                    {data.waterSafe ? '✅ Potable' : '❌ Non potable'}
                  </div>
                </div>
              </div>

              {/* RISQUES SPÉCIFIQUES */}
              {data.specificRisks.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {data.specificRisks.map((r, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                      ⚠️ {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

              {/* SANTÉ */}
              <div style={s.card}>
                <div style={{ fontSize: '11px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px' }}>💉 Conseils Santé</div>
                {data.vaccinesRequired.length > 0 && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 12px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 700, marginBottom: '4px' }}>VACCINS RECOMMANDÉS</div>
                    {data.vaccinesRequired.map((v, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#1d4ed8', marginBottom: '2px' }}>💉 {v}</div>
                    ))}
                  </div>
                )}
                {data.healthAdvice.map((advice, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                    <span style={{ color: '#3b82f6', flexShrink: 0 }}>+</span> {advice}
                  </div>
                ))}
              </div>

              {/* SÉCURITÉ */}
              <div style={s.card}>
                <div style={{ fontSize: '11px', color: '#f87171', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px' }}>🔒 Conseils Sécurité</div>
                {data.securityAdvice.map((advice, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '12px', color: '#475569', lineHeight: 1.6, padding: '8px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                    <span style={{ color: '#f87171', flexShrink: 0 }}>⚠</span> {advice}
                  </div>
                ))}
              </div>
            </div>

            {/* NUMÉROS D'URGENCE */}
            <div style={{ ...s.card, border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '11px', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '12px' }}>📞 Numéros d'Urgence — {form.city}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '10px' }}>
                {[['🚔 Police', data.emergencyNumbers.police], ['🚑 Ambulance', data.emergencyNumbers.ambulance], ['🚒 Pompiers', data.emergencyNumbers.pompiers], ['🆘 Urgences', data.emergencyNumbers.urgences]].map(([label, num]) => (
                  <div key={label} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>{num}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* COUTUMES LOCALES */}
            <div style={{ background: 'linear-gradient(135deg,rgba(10,22,40,0.04),rgba(212,175,55,0.07))', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '1.2rem' }}>
              <div style={{ fontSize: '11px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '12px' }}>🤝 Coutumes & Respect Local</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {data.localCustoms.map((custom, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#475569', lineHeight: 1.6, background: '#fff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#d4af37', flexShrink: 0 }}>→</span> {custom}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
