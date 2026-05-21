'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category { name: string; icon: string; items: string[]; }
interface PackerData { categories: Category[]; tips: string[]; }
interface CheckedState { [cat: string]: { [item: string]: boolean } }

const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver'];
const GENDERS = [['mixed', '👥 Mixte'], ['male', '👨 Homme'], ['female', '👩 Femme']];
const LEVELS  = [['budget', '🎒 Économique'], ['mid', '🏨 Confort'], ['luxury', '💎 Luxe']];
const ACTS    = ['Plage', 'Randonnée', 'Musées', 'Shopping', 'Gastronomie', 'Nightlife', 'Affaires', 'Trek', 'Ski', 'Culturel'];

export default function PackerPage() {
  const [form, setForm] = useState({
    city: '', country: '', days: '7', weather: 'Ensoleillé', temp: '25',
    season: 'Été', activities: [] as string[], budgetLevel: 'mid', gender: 'mixed',
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PackerData | null>(null);
  const [checked, setChecked] = useState<CheckedState>({});
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Charger depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`packer-${form.city}`);
    if (saved) setChecked(JSON.parse(saved));
  }, [data]);

  const toggleAct = (a: string) => setForm(f => ({
    ...f, activities: f.activities.includes(a) ? f.activities.filter(x => x !== a) : [...f.activities, a]
  }));

  const generate = async () => {
    if (!form.city) return;
    setLoading(true); setError(''); setData(null); setChecked({});
    try {
      const res = await fetch('/api/packer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, activities: form.activities.join(', ') || 'Tourisme général' }),
      });
      const json = await res.json();
      setData(json);
      // Init checked state
      const init: CheckedState = {};
      json.categories.forEach((c: Category) => {
        init[c.name] = {};
        c.items.forEach((item: string) => init[c.name][item] = false);
      });
      setChecked(init);
    } catch { setError('Erreur. Réessaie.'); }
    finally { setLoading(false); }
  };

  const toggle = (cat: string, item: string) => {
    const updated = { ...checked, [cat]: { ...checked[cat], [item]: !checked[cat]?.[item] } };
    setChecked(updated);
    localStorage.setItem(`packer-${form.city}`, JSON.stringify(updated));
  };

  const totalItems = data?.categories.reduce((s, c) => s + c.items.length, 0) || 0;
  const checkedCount = Object.values(checked).reduce((s, cat) => s + Object.values(cat).filter(Boolean).length, 0);
  const progress = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;

  const copyText = () => {
    if (!data) return;
    const text = `🧳 Liste pour ${form.city} (${form.days} jours)\n\n` +
      data.categories.map(c => `${c.icon} ${c.name}:\n${c.items.map(i => `  ☐ ${i}`).join('\n')}`).join('\n\n') +
      `\n\n💡 Astuces:\n${data.tips.map(t => `• ${t}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const s = {
    label: { fontSize: '11px', color: '#64748b', fontWeight: 600 as const, textTransform: 'uppercase' as const, letterSpacing: '1px', display: 'block' as const, marginBottom: '8px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const },
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: '100vh', background: '#f1f5f9' }}>

      {/* NAVBAR */}
      <div style={{ background: '#0a1628', padding: '10px 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span>🌍</span><span style={{ color: '#d4af37', fontWeight: 700, fontSize: '15px' }}>WanderWise</span>
        </Link>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['/', '🔍 Explorer'], ['/compare', '🔄 Comparer'], ['/itinerary', '🗓️ Itinéraire'], ['/budget-planner', '🧮 Budget'], ['/chatbot', '🤖 Chat']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '20px' }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', padding: '5px 16px', borderRadius: '20px', marginBottom: '1rem' }}>
          Packer AI
        </div>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '.5rem' }}>Ta valise, préparée par l'IA 🧳</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Liste de bagages personnalisée selon ta destination, météo et activités</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '-1rem auto 0', padding: '0 1rem 3rem', position: 'relative', zIndex: 10 }}>

        {/* FORMULAIRE */}
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', padding: '2rem', marginBottom: '1.5rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '1.2rem' }}>
            <div>
              <label style={s.label}>🏙️ Ville</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="ex: Marrakech" style={s.input} />
            </div>
            <div>
              <label style={s.label}>🌍 Pays</label>
              <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="ex: Maroc" style={s.input} />
            </div>
            <div>
              <label style={s.label}>📅 Durée (jours)</label>
              <input value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} type="number" min="1" max="30" style={s.input} />
            </div>
            <div>
              <label style={s.label}>🌤️ Météo prévue</label>
              <select value={form.weather} onChange={e => setForm({ ...form, weather: e.target.value })} style={s.input}>
                {['Ensoleillé', 'Nuageux', 'Pluvieux', 'Neigeux', 'Venteux', 'Chaud et humide', 'Sec et chaud'].map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>🌡️ Température (°C)</label>
              <input value={form.temp} onChange={e => setForm({ ...form, temp: e.target.value })} type="number" placeholder="25" style={s.input} />
            </div>
            <div>
              <label style={s.label}>📆 Saison</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {SEASONS.map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, season: s }))}
                    style={{ padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '11px', fontWeight: form.season === s ? 700 : 400, border: form.season === s ? 'none' : '1px solid #e2e8f0', background: form.season === s ? '#0a1628' : '#f8fafc', color: form.season === s ? '#d4af37' : '#475569' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '1.5rem' }}>
            <div>
              <label style={s.label}>💰 Niveau voyage</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {LEVELS.map(([k, l]) => (
                  <button key={k} onClick={() => setForm(f => ({ ...f, budgetLevel: k }))}
                    style={{ flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: form.budgetLevel === k ? 700 : 400, border: form.budgetLevel === k ? 'none' : '1px solid #e2e8f0', background: form.budgetLevel === k ? '#0a1628' : '#f8fafc', color: form.budgetLevel === k ? '#d4af37' : '#475569' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={s.label}>👤 Genre</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {GENDERS.map(([k, l]) => (
                  <button key={k} onClick={() => setForm(f => ({ ...f, gender: k }))}
                    style={{ flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: form.gender === k ? 700 : 400, border: form.gender === k ? 'none' : '1px solid #e2e8f0', background: form.gender === k ? '#0a1628' : '#f8fafc', color: form.gender === k ? '#d4af37' : '#475569' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={generate} disabled={loading || !form.city}
            style={{ width: '100%', background: '#d4af37', color: '#0a1628', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', opacity: !form.city ? 0.5 : 1 }}>
            {loading ? '⏳ Génération de ta liste...' : '🧳 Générer ma liste de bagages'}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>Préparation de ta valise pour <strong>{form.city}</strong>...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '12px' }}>{error}</div>}

        {data && (
          <>
            {/* HEADER RÉSULTAT */}
            <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.2rem', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Liste générée par IA</div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px' }}>🧳 {form.city} — {form.days} jours</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>
                    {form.weather} · {form.temp}°C · {form.season} · {form.budgetLevel}
                  </p>
                </div>
                <button onClick={copyText}
                  style={{ background: copied ? '#4ade80' : 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', color: copied ? '#0a1628' : '#d4af37', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                  {copied ? '✅ Copié !' : '📋 Copier la liste'}
                </button>
              </div>

              {/* BARRE DE PROGRESSION */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  <span>Progression</span>
                  <span>{checkedCount}/{totalItems} articles cochés ({progress}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#4ade80' : '#d4af37', borderRadius: '4px', transition: 'width .3s ease' }} />
                </div>
              </div>
            </div>

            {/* CATÉGORIES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.2rem' }}>
              {data.categories.map(cat => {
                const catChecked = Object.values(checked[cat.name] || {}).filter(Boolean).length;
                const catTotal = cat.items.length;
                const catDone = catChecked === catTotal;
                return (
                  <div key={cat.name} style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: catDone ? '1px solid #4ade80' : '1px solid #f1f5f9', transition: 'border .3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{cat.name}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: catDone ? '#4ade80' : '#94a3b8', fontWeight: 600 }}>{catChecked}/{catTotal}</span>
                    </div>
                    {cat.items.map(item => (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                        <div onClick={() => toggle(cat.name, item)}
                          style={{ width: '18px', height: '18px', borderRadius: '5px', border: checked[cat.name]?.[item] ? 'none' : '2px solid #e2e8f0', background: checked[cat.name]?.[item] ? '#d4af37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all .2s' }}>
                          {checked[cat.name]?.[item] && <span style={{ color: '#0a1628', fontSize: '11px', fontWeight: 800 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '12px', color: checked[cat.name]?.[item] ? '#94a3b8' : '#475569', textDecoration: checked[cat.name]?.[item] ? 'line-through' : 'none', transition: 'all .2s' }}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* ASTUCES */}
            <div style={{ background: 'linear-gradient(135deg,rgba(10,22,40,0.04),rgba(212,175,55,0.07))', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '1.2rem' }}>
              <div style={{ fontSize: '10px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '10px' }}>💡 Astuces de l'IA</div>
              {data.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  <span style={{ color: '#d4af37', flexShrink: 0 }}>→</span> {tip}
                </div>
              ))}
            </div>

            {progress === 100 && (
              <div style={{ background: 'linear-gradient(135deg,#065f46,#047857)', borderRadius: '16px', padding: '1.2rem', marginTop: '1rem', textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>Valise prête !</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Tu as tout coché. Bon voyage à {form.city} !</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
