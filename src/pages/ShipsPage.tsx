import { useData } from '../hooks/useData';
import { ShipCard } from '../components/ShipCard';
import './ShipsPage.css';

export function ShipsPage() {
  const { ships, loading, error } = useData();

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
      </div>
    );
  }

  return (
    <div className="ships-page">
      <h2 className="ships-title">遊漁船一覧</h2>
      <p className="ships-count">{ships.length}隻の遊漁船</p>

      <div className="ships-grid">
        {ships.map((ship) => (
          <ShipCard key={ship.shipname} ship={ship} />
        ))}
      </div>
    </div>
  );
}
