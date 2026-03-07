import './FilterChips.css';

export default function FilterChips({
  filter,
  onFilterChange,
  years,
  selectedYear,
  onYearChange,
  consultations,
}) {
  const withTestsCount = consultations.filter(c => c.tests && c.tests.length > 0).length;

  return (
    <div className="filter-chips">
      <button
        className={`chip ${filter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All visits
      </button>

      <button
        className={`chip ${filter === 'byyear' ? 'active' : ''}`}
        onClick={() => onFilterChange('byyear')}
      >
        By year
      </button>

      {filter === 'byyear' && years.length > 0 && (
        <select
          className="year-select"
          value={selectedYear || ''}
          onChange={e => onYearChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      )}

      <button
        className={`chip ${filter === 'withtests' ? 'active' : ''}`}
        onClick={() => onFilterChange('withtests')}
      >
        With tests {withTestsCount > 0 ? `(${withTestsCount})` : ''}
      </button>
    </div>
  );
}
