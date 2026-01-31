import type { Booking, Ship } from '../types';
import { formatDateForDisplay } from '../services/googleSheets';
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

export function BookingCard({ booking, ship }: BookingCardProps) {
  const handleClick = () => {
    if (ship?.url) {
      window.open(ship.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`booking-card ${ship?.url ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="booking-header">
        <span className="booking-date">{formatDateForDisplay(booking.datedtime)}</span>
        <span className={`booking-status ${statusColors[booking.status]}`}>
          {statusLabels[booking.status]}
        </span>
      </div>

      <h3 className="booking-shipname">{booking.shipname}</h3>

      <div className="booking-details">
        {booking.category && (
          <span className="booking-category">{booking.category}</span>
        )}
        {booking.status === 'open' && booking.capacityCount > 0 && (
          <span className="booking-capacity">残り{booking.capacityCount}名</span>
        )}
      </div>

      {ship?.departure_port && (
        <div className="booking-port">{ship.departure_port}</div>
      )}
    </div>
  );
}
