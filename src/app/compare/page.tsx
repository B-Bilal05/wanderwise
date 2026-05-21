'use client';
import { useState } from 'react';
import Link from 'next/link';

interface CityData {
  name: string; country: string; flag: string;
  currency: string; language: string; safety: string;
  bestSeason: string; budgetPerDay: number;
  highlights: string[]; pros: string[]; cons: string[];
  idealFor: string; rating: number;
}
interface CompareData {
  city1: CityData; city2: CityData;
  verdict: { winner: string; reason: string; budgetWinner: string; safetyWinner: string; cultureWinner: string; };
}

export default function Compare() {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompareData | null>(null);
  const [error, setError] = useState('');

  const compare = async () => {
    if (!city1.trim() || !city2.trim()) return;
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city1, city2 }),
      });
      if (!res.ok) throw new Error('API error');
      setData(await res.json());
    } catch {
      setError('Erreur lors de la comparaison. Réessaie.');
    } finally { setLoading(false); }
  };

  const isWinner = (cityName: string, field: 'winner' | 'budgetWinner' | 'safetyWinner' | 'cultureWinner') =>
    data?.verdict[field]?.toLowerCase().includes(cityName.toLowerCase());

  const CityCard = ({ city, side }: { city: CityData; side: 'left' | 'right' }) => {
    const won = isWinner(city.name, 'winner');
    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: won ? 'linear-gradient(135deg,#0a1628,#1a3a5c)' : '#fff',
          border: won ? '2px solid #d4af37' : '1px solid #e2e8f0',
          borderRadius: '14px', padding: '1.5rem', position: 'relative',
          color: won ? '#fff' : '#0f172a'
        }}>
          {won && (
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#d4af37', color: '#0a1628', fontSize: '10px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
              ★ RECOMMANDÉ
            </div>
          )}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>{city.flag}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{city.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.6 }}>{city.country}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: won ? '#d4af37' : '#0a1628', margin: '8px 0 2px' }}>{city.rating}<span style={{ fontSize: '12px', fontWeight: 400, opacity: 0.6 }}>/10</span></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
            {[['Budget/jour', `$${city.budgetPerDay}`], ['Langue', city.language], ['Sécurité', city.safety], ['Meilleure saison', city.bestSeason]].map(([l, v]) => (
              <div key={l} style={{ background: won ? 'rgba(255,255,255,0.08)' : '#f8fafc', borderRadius: '8px', padding: '8px 10px' }}>
                <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>{l}</div>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Points forts</div>
            {city.highlights.map(h => (
              <div key={h} style={{ fontSize: '12px', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#d4af37' }}>★</span> {h}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Avantages</div>
            {city.pros.map(p => (
              <div key={p} style={{ fontSize: '12px', padding: '3px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span> {p}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Inconvénients</div>
            {city.cons.map(c => (
              <div key={c} style={{ fontSize: '12px', padding: '3px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#f87171', flexShrink: 0 }}>✗</span> {c}
              </div>
            ))}
          </div>

          <div style={{ background: won ? 'rgba(212,175,55,0.15)' : '#f0f9ff', borderRadius: '8px', padding: '8px 10px' }}>
            <div style={{ fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>Idéal pour</div>
            <div style={{ fontSize: '12px', fontWeight: 500 }}>{city.idealFor}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
          ← Retour à la recherche
        </Link>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '20px', marginBottom: '1rem' }}>
          Comparateur de destinations
        </div>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Quelle ville choisir ?
        </h1>

        <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input value={city1} onChange={e => setCity1(e.target.value)}
            placeholder="Ville 1 (ex: Paris)"
            style={{ flex: 1, minWidth: '140px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
          <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '18px' }}>VS</span>
          <input value={city2} onChange={e => setCity2(e.target.value)}
            placeholder="Ville 2 (ex: Tokyo)"
            style={{ flex: 1, minWidth: '140px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={compare} disabled={loading}
            style={{ background: '#d4af37', color: '#0a1628', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', opacity: loading ? 0.6 : 1 }}>
            {loading ? '...' : 'Comparer'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          {[['Paris', 'Tokyo'], ['Rome', 'Barcelona'], ['Dubai', 'Singapore'], ['Marrakech', 'Istanbul']].map(([a, b]) => (
            <span key={a} onClick={() => { setCity1(a); setCity2(b); }}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' }}>
              {a} vs {b}
            </span>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#64748b' }}>Comparaison de {city1} et {city2}...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

        {data && (
          <>
            {/* Verdict */}
            <div style={{ background: 'linear-gradient(135deg,rgba(10,22,40,0.05),rgba(212,175,55,0.08))', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Verdict AI</div>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#475569', margin: '0 0 1rem' }}>{data.verdict.reason}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[['Budget', data.verdict.budgetWinner], ['Sécurité', data.verdict.safetyWinner], ['Culture', data.verdict.cultureWinner]].map(([cat, winner]) => (
                  <div key={cat} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', fontSize: '11px' }}>
                    <span style={{ color: '#94a3b8' }}>{cat} : </span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{winner}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <CityCard city={data.city1} side="left" />
              <CityCard city={data.city2} side="right" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
