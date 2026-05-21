'use client';
import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind: number;
  city: string;
}

export default function Weather({ lat, lng, city }: { lat: number; lng: number; city: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
    if (!key) { setError('No API key'); setLoading(false); return; }

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (d.cod !== 200) throw new Error(d.message);
        setWeather({
          temp: Math.round(d.main.temp),
          feels_like: Math.round(d.main.feels_like),
          humidity: d.main.humidity,
          description: d.weather[0].description,
          icon: d.weather[0].icon,
          wind: Math.round(d.wind.speed * 3.6),
          city: d.name,
        });
      })
      .catch(() => setError('Météo indisponible'))
      .finally(() => setLoading(false));
  }, [lat, lng]);

  if (loading) return (
    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem', fontSize: '13px', color: '#0369a1' }}>
      Chargement météo...
    </div>
  );

  if (error || !weather) return null;

  return (
    <div style={{ background: 'linear-gradient(135deg,#0a1628,#1a3a5c)', borderRadius: '12px', padding: '1.2rem 1.5rem', marginBottom: '1.2rem', color: '#fff' }}>
      <div style={{ fontSize: '10px', color: '#d4af37', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
        Météo actuelle · {weather.city}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" style={{ width: '52px', height: '52px' }} />
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{weather.temp}°C</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{weather.description}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {[
            ['Ressenti', `${weather.feels_like}°C`],
            ['Humidité', `${weather.humidity}%`],
            ['Vent', `${weather.wind} km/h`],
          ].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{l}</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
