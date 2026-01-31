import type { FilterOptions, Ship } from '../types';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  ships: Ship[];
  categories: string[];
}

export function FilterPanel({ filters, onFilterChange, ships, categories }: FilterPanelProps) {
  const handleChange = (key: keyof FilterOptions, value: string | boolean) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label className="filter-label">日付</label>
        <input
          type="date"
          className="filter-input"
          value={filters.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">釣り方</label>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">すべて</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">遊漁船</label>
        <select
          className="filter-select"
          value={filters.shipname}
          onChange={(e) => handleChange('shipname', e.target.value)}
        >
          <option value="">すべて</option>
          {ships.map((ship) => (
            <option key={ship.shipname} value={ship.shipname}>
              {ship.shipname}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group filter-checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.showOnlyAvailable}
            onChange={(e) => handleChange('showOnlyAvailable', e.target.checked)}
          />
          <span>空きありのみ表示</span>
        </label>
      </div>
    </div>
  );
}
