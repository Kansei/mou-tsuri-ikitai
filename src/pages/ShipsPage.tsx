import { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { ShipCard } from '../components/ShipCard';
import './ShipsPage.css';

interface ShipFilters {
  area: string;
  port: string;
  calendarStatus: string;
}

export function ShipsPage() {
  const { ships, loading, error } = useData();
  const [filters, setFilters] = useState<ShipFilters>({
    area: '',
    port: '',
    calendarStatus: '',
  });

  // 地域リストを取得（addressから都道府県を抽出）
  const areas = useMemo(() => {
    return [...new Set(ships.map((s) => {
      const match = s.address.match(/^(.+?[都道府県])/);
      return match ? match[1] : s.address.split(/[市区町村]/)[0];
    }).filter(Boolean))].sort();
  }, [ships]);

  // 港リストを取得（重複排除）
  const ports = useMemo(() => {
    return [...new Set(ships.map((s) => s.departure_port).filter(Boolean))].sort();
  }, [ships]);

  // フィルタリングされた船
  const filteredShips = useMemo(() => {
    return ships.filter((ship) => {
      // 地域フィルタ
      if (filters.area && !ship.address.includes(filters.area)) {
        return false;
      }

      // 港フィルタ
      if (filters.port && ship.departure_port !== filters.port) {
        return false;
      }

      // カレンダー取得状況フィルタ
      if (filters.calendarStatus === 'active' && ship.calender_status !== 'active') {
        return false;
      }
      if (filters.calendarStatus === 'inactive' && ship.calender_status === 'active') {
        return false;
      }

      return true;
    });
  }, [ships, filters]);

  const handleChange = (key: keyof ShipFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

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

      <div className="ships-filter-panel">
        <div className="ships-filter-row">
          <div className="ships-filter-group">
            <label className="ships-filter-label">地域</label>
            <select
              className="ships-filter-select"
              value={filters.area}
              onChange={(e) => handleChange('area', e.target.value)}
            >
              <option value="">すべて</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="ships-filter-group">
            <label className="ships-filter-label">港</label>
            <select
              className="ships-filter-select"
              value={filters.port}
              onChange={(e) => handleChange('port', e.target.value)}
            >
              <option value="">すべて</option>
              {ports.map((port) => (
                <option key={port} value={port}>
                  {port}
                </option>
              ))}
            </select>
          </div>

          <div className="ships-filter-group">
            <label className="ships-filter-label">プラン取得</label>
            <select
              className="ships-filter-select"
              value={filters.calendarStatus}
              onChange={(e) => handleChange('calendarStatus', e.target.value)}
            >
              <option value="">すべて</option>
              <option value="active">取得中</option>
              <option value="inactive">未取得</option>
            </select>
          </div>
        </div>
      </div>

      <p className="ships-count">{filteredShips.length}隻の遊漁船</p>

      <div className="ships-grid">
        {filteredShips.map((ship) => (
          <ShipCard key={ship.shipname} ship={ship} />
        ))}
      </div>
    </div>
  );
}
