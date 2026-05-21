import { useState, useEffect } from 'react';

export interface Favorite {
  city: string;
  country: string;
  flag: string;
  budgetPerDay: number;
  savedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wanderwise-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const addFavorite = (fav: Omit<Favorite, 'savedAt'>) => {
    const newFav = { ...fav, savedAt: new Date().toISOString() };
    const updated = [newFav, ...favorites.filter(f => f.city !== fav.city)];
    setFavorites(updated);
    localStorage.setItem('wanderwise-favorites', JSON.stringify(updated));
  };

  const removeFavorite = (city: string) => {
    const updated = favorites.filter(f => f.city !== city);
    setFavorites(updated);
    localStorage.setItem('wanderwise-favorites', JSON.stringify(updated));
  };

  const isFavorite = (city: string) => favorites.some(f => f.city === city);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
