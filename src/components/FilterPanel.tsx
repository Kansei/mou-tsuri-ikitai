import type { FilterOptions, Ship, BookingStatus } from '../types';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  ships: Ship[];
  categories: string[];
}

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'open', label: '空きあり' },
  { value: 'full', label: '満船' },
  { value: 'close', label: '休船' },
  { value: 'undefined', label: '未定' },
];

export function FilterPanel({ filters, onFilterChange, ships, categories }: FilterPanelProps) {
  const handleChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleStatusToggle = (status: BookingStatus) => {
    const newStatusFilter = filters.statusFilter.includes(status)
      ? filters.statusFilter.filter((s) => s !== status)
      : [...filters.statusFilter, status];
    onFilterChange({ ...filters, statusFilter: newStatusFilter });
  };

  // 港リストを取得（重複排除）
  const ports = [...new Set(ships.map((s) => s.departure_port).filter(Boolean))].sort();

  return (
    <div className="filter-panel">
      <div className="filter-row">
        <div className="filter-group">
          <label className="filter-label">期間</label>
          <div className="date-range">
            <input
              type="date"
              className="filter-input"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
            />
            <span className="date-separator">〜</span>
            <input
              type="date"
              className="filter-input"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filter-row">
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
          <label className="filter-label">港</label>
          <select
            className="filter-select"
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
      </div>

      <div className="filter-row">
        <div className="filter-group status-filter-group">
          <label className="filter-label">ステータス</label>
          <div className="status-buttons">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`status-button ${option.value} ${filters.statusFilter.includes(option.value) ? 'active' : ''}`}
                onClick={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
