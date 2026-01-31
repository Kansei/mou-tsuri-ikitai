import type { Ship } from '../types';
import './ShipCard.css';

interface ShipCardProps {
  ship: Ship;
}

export function ShipCard({ ship }: ShipCardProps) {
  const handleClick = () => {
    if (ship.url) {
      window.open(ship.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`ship-card ${ship.url ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <h3 className="ship-name">{ship.shipname}</h3>

      <div className="ship-info">
        {ship.departure_port && (
          <div className="ship-info-row">
            <span className="ship-info-label">出港地</span>
            <span className="ship-info-value">{ship.departure_port}</span>
          </div>
        )}

        {ship.phonenumber && (
          <div className="ship-info-row">
            <span className="ship-info-label">電話</span>
            <span className="ship-info-value">{ship.phonenumber}</span>
          </div>
        )}

        {ship.payment_method && (
          <div className="ship-info-row">
            <span className="ship-info-label">支払</span>
            <span className="ship-info-value">{ship.payment_method}</span>
          </div>
        )}

        {ship.booking_method && (
          <div className="ship-info-row">
            <span className="ship-info-label">予約</span>
            <span className="ship-info-value">{ship.booking_method}</span>
          </div>
        )}
      </div>

      {ship.url && (
        <div className="ship-link">
          詳細を見る →
        </div>
      )}
    </div>
  );
}
