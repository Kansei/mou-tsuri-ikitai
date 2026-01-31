import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { BookingCard } from '../components/BookingCard';
import { FilterPanel } from '../components/FilterPanel';
import { parseDate } from '../services/googleSheets';
import type { FilterOptions } from '../types';
import './HomePage.css';

const CATEGORIES = ['ジギング', 'SLJ', 'キャスティング', 'タイラバ', 'その他'];

function getDefaultDateFrom(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getDefaultDateTo(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 2);
  return date.toISOString().split('T')[0];
}

export function HomePage() {
  const { ships, bookings, loading, error } = useData();
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: getDefaultDateFrom(),
    dateTo: getDefaultDateTo(),
    category: '',
    showOnlyAvailable: false,
    shipname: '',
  });

  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings
      .filter((booking) => {
        const bookingDate = parseDate(booking.datedtime);
        if (!bookingDate) return false;

        // 今日以前のプランは除外
        if (bookingDate < today) {
          return false;
        }

        // 開始日フィルタ
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          if (bookingDate < fromDate) {
            return false;
          }
        }

        // 終了日フィルタ
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (bookingDate > toDate) {
            return false;
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
