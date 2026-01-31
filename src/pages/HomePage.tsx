import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { BookingCard } from '../components/BookingCard';
import { FilterPanel } from '../components/FilterPanel';
import { parseDate } from '../services/googleSheets';
import type { FilterOptions } from '../types';
import './HomePage.css';

const CATEGORIES = ['ジギング', 'SLJ', 'キャスティング', 'タイラバ', 'その他'];

export function HomePage() {
  const { ships, bookings, loading, error } = useData();
  const [filters, setFilters] = useState<FilterOptions>({
    date: '',
    category: '',
    showOnlyAvailable: false,
    shipname: '',
  });

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        // 日付フィルタ
        if (filters.date) {
          const bookingDate = parseDate(booking.datedtime);
          const filterDate = new Date(filters.date);
          if (bookingDate && filterDate) {
            if (
              bookingDate.getFullYear() !== filterDate.getFullYear() ||
              bookingDate.getMonth() !== filterDate.getMonth() ||
              bookingDate.getDate() !== filterDate.getDate()
            ) {
              return false;
            }
          }
        }

        // カテゴリフィルタ
        if (filters.category && !booking.category.includes(filters.category)) {
          return false;
        }

        // 遊漁船フィルタ
        if (filters.shipname && booking.shipname !== filters.shipname) {
          return false;
        }

        // 空きありのみ
        if (filters.showOnlyAvailable && booking.status !== 'open') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = parseDate(a.datedtime);
        const dateB = parseDate(b.datedtime);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
      });
  }, [bookings, filters]);

  const getShipByName = (name: string) => ships.find((s) => s.shipname === name);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>エラーが発生しました: {error}</p>
        <p>スプレッドシートが「ウェブに公開」されているか確認してください。</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        ships={ships}
        categories={CATEGORIES}
      />

      <div className="results-header">
        <span className="results-count">{filteredBookings.length}件</span>
        のプランが見つかりました
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-results">
          <p>条件に一致するプランがありません</p>
        </div>
      ) : (
        <div className="booking-grid">
          {filteredBookings.map((booking, index) => (
            <BookingCard
              key={`${booking.shipname}-${booking.datedtime}-${index}`}
              booking={booking}
              ship={getShipByName(booking.shipname)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
