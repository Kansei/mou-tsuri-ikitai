import type { Ship } from '../types';
import './ShipCard.css';

interface ShipCardProps {
  ship: Ship;
}

// 住所から都道府県・市区町村を抽出
function extractLocation(address: string): string {
  if (!address) return '';
  const match = address.match(/^(.+?[都道府県])(.+?[市区町村])?/);
  if (match) {
    return match[1] + (match[2] || '');
  }
  return '';
}

export function ShipCard({ ship }: ShipCardProps) {
  const handleClick = () => {
    if (ship.url) {
      window.open(ship.url, '_blank', 'noopener,noreferrer');
    }
  };

  const location = extractLocation(ship.address);
  const departureLocation = [location, ship.departure_port].filter(Boolean).join(' ');

  const isCalendarActive = ship.calender_status === 'active';

  return (
    <div
      className={`ship-card ${ship.url ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="ship-header">
        <h3 className="ship-name">{ship.shipname}</h3>
        <span className={`ship-calendar-badge ${isCalendarActive ? 'active' : 'inactive'}`}>
          {isCalendarActive ? '連携中' : '未連携'}
        </span>
      </div>

      <div className="ship-info">
        {departureLocation && (
          <div className="ship-info-row">
            <span className="ship-info-label">出港地</span>
            <span className="ship-info-value">{departureLocation}</span>
          </div>
        )}

        {ship.phonenumber && (
          <div className="ship-info-row">
            <span className="ship-info-label">電話</span>
            <span className="ship-info-value">{ship.phonenumber}</span>
          </div>
        )}

        {ship.review && (
          <div className="ship-info-row">
            <span className="ship-info-label">推奨度</span>
            <span className="ship-info-value">{ship.review}</span>
          </div>
        )}

        {ship.memo && (
          <div className="ship-info-row">
            <span className="ship-info-label">メモ</span>
            <span className="ship-info-value ship-memo">{ship.memo}</span>
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
