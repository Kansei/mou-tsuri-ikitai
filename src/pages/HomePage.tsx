import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { BookingCard } from '../components/BookingCard';
import { FilterPanel } from '../components/FilterPanel';
import { parseDate, formatDate } from '../services/googleSheets';
import type { FilterOptions, Booking, Ship } from '../types';
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

function formatDateHeader(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];

  return `${month}月${day}日（${weekday}）`;
}

interface GroupedBookings {
  date: string;
  dateKey: string;
  bookings: Booking[];
  isWeekend: boolean;
  isSunday: boolean;
}

export function HomePage() {
  const { ships, bookings, loading, error } = useData();
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: getDefaultDateFrom(),
    dateTo: getDefaultDateTo(),
    category: '',
    port: '',
    area: '',
    statusFilter: ['open', 'full'], // デフォルトで空きありと満船を表示
  });

  // 船名から船情報を取得
  const getShipByName = (name: string): Ship | undefined =>
    ships.find((s) => s.shipname === name);

  // フィルタリングされたブッキング
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

        // 港フィルタ
        if (filters.port) {
          const ship = getShipByName(booking.shipname);
          if (!ship || ship.departure_port !== filters.port) {
            return false;
          }
        }

        // 地域フィルタ
        if (filters.area) {
          const ship = getShipByName(booking.shipname);
          if (!ship || !ship.address.includes(filters.area)) {
            return false;
          }
        }

        // ステータスフィルタ
        if (filters.statusFilter.length > 0 && !filters.statusFilter.includes(booking.status)) {
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
  }, [bookings, filters, ships]);

  // ステータスの並び順
  const STATUS_ORDER: Record<string, number> = {
    open: 0,
    full: 1,
    close: 2,
    undefined: 3,
  };

  // カテゴリーの並び順（その他は最後）
  const getCategoryOrder = (category: string): number => {
    if (category === 'その他' || category === '') return 999;
    return 0;
  };

  // 日別にグループ化し、グループ内をソート
  const groupedBookings = useMemo((): GroupedBookings[] => {
    const groups: Map<string, Booking[]> = new Map();

    filteredBookings.forEach((booking) => {
      const date = parseDate(booking.datedtime);
      if (!date) return;

      const dateKey = formatDate(date);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(booking);
    });

    return Array.from(groups.entries()).map(([dateKey, dateBookings]) => {
      const date = parseDate(dateKey);
      const dayOfWeek = date ? date.getDay() : -1;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;

      // グループ内をステータス → 釣り方 → 港の順でソート
      const sortedBookings = [...dateBookings].sort((a, b) => {
        // 1. ステータス順
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (statusDiff !== 0) return statusDiff;

        // 2. 釣り方順（その他は最後）
        const categoryOrderA = getCategoryOrder(a.category);
        const categoryOrderB = getCategoryOrder(b.category);
        if (categoryOrderA !== categoryOrderB) return categoryOrderA - categoryOrderB;
        const categoryDiff = (a.category || '').localeCompare(b.category || '');
        if (categoryDiff !== 0) return categoryDiff;

        // 3. 港順
        const shipA = getShipByName(a.shipname);
        const shipB = getShipByName(b.shipname);
        const portA = shipA?.departure_port || '';
        const portB = shipB?.departure_port || '';
        return portA.localeCompare(portB);
      });

      return {
        date: formatDateHeader(dateKey),
        dateKey,
        bookings: sortedBookings,
        isWeekend,
        isSunday,
      };
    });
  }, [filteredBookings, ships]);

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
        <div className="date-groups">
          {groupedBookings.map((group) => (
            <div key={group.dateKey} className="date-group">
              <h2 className={`date-header ${group.isSunday ? 'sunday' : group.isWeekend ? 'weekend' : ''}`}>
                {group.date}
                <span className="booking-count">{group.bookings.length}件</span>
              </h2>
              <div className="booking-grid">
                {group.bookings.map((booking, index) => (
                  <BookingCard
                    key={`${booking.shipname}-${booking.datedtime}-${index}`}
                    booking={booking}
                    ship={getShipByName(booking.shipname)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
