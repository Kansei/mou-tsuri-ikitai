import type { Booking, Ship } from '../types';
import './BookingCard.css';

interface BookingCardProps {
  booking: Booking;
  ship?: Ship;
}

const statusLabels: Record<string, string> = {
  open: '空きあり',
  full: '満船',
  close: '休船',
  undefined: '-',
};

const statusColors: Record<string, string> = {
  open: 'status-open',
  full: 'status-full',
  close: 'status-close',
  undefined: 'status-undefined',
};

// 住所から都道府県・市区町村を抽出
function extractLocation(address: string): string {
  if (!address) return '';
  // 例: 「福岡県福岡市西区...」→「福岡県福岡市西区」
  const match = address.match(/^(.+?[都道府県])(.+?[市区町村])?/);
  if (match) {
    return match[1] + (match[2] || '');
  }
  return '';
}

export function BookingCard({ booking, ship }: BookingCardProps) {
  const handleClick = () => {
    if (ship?.url) {
      window.open(ship.url, '_blank', 'noopener,noreferrer');
    }
  };

  const location = ship ? extractLocation(ship.address) : '';

  return (
    <div
      className={`booking-card ${statusColors[booking.status]} ${ship?.url ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="booking-header">
        <div className="booking-shipname">{booking.shipname}</div>
        <span className={`booking-status ${statusColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </div>

      <div className="booking-meta">
        {location && (
          <span className="booking-location">{location}</span>
        )}
        {ship?.departure_port && (
          <span className="booking-port">{ship.departure_port}</span>
        )}
        {booking.category && (
          <span className="booking-category">{booking.category}</span>
        )}
      </div>

      {booking.status === 'open' && booking.capacityCount > 0 && (
        <div className="booking-capacity">残り{booking.capacityCount}名</div>
      )}

      {booking.calendarTitle && (
        <div className="booking-calendar-title">{booking.calendarTitle}</div>
      )}
    </div>
  );
}
