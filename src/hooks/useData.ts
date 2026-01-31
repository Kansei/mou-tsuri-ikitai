import { useState, useEffect } from 'react';
import type { Ship, Booking } from '../types';
import { fetchShips, fetchBookings } from '../services/googleSheets';

interface UseDataResult {
  ships: Ship[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useData(): UseDataResult {
  const [ships, setShips] = useState<Ship[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [shipsData, bookingsData] = await Promise.all([
        fetchShips(),
        fetchBookings(),
      ]);

      setShips(shipsData);
      setBookings(bookingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ships, bookings, loading, error, refetch: fetchData };
}
