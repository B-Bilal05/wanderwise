'use client';
import { useFavorites } from '../hooks/useFavorites';
import Link from 'next/link';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
          ← Retour à la recherche
        </Link>
        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '20px', marginBottom: '1rem' }}>
          Mes Favoris
        </div>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>
          Destinations sauvegardées
        </h1>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '1.5rem' }}>
              Tu n&apos;as pas encore de destinations sauvegardées.
            </p>
            <Link href="/" style={{ background: '#d4af37', color: '#0a1628', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
              Explorer des destinations
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {favorites.map(fav => (
              <div key={fav.city} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{fav.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{fav.city}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{fav.country} · À partir de ${fav.budgetPerDay}/jour</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Sauvegardé le {new Date(fav.savedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/?city=${fav.city}`}
                    style={{ background: '#0a1628', color: '#d4af37', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
                    Voir
                  </Link>
                  <button onClick={() => removeFavorite(fav.city)}
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
