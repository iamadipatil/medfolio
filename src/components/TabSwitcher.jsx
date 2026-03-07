import './TabSwitcher.css';

export default function TabSwitcher({ activeTab, onTabChange, prescriptionCount, labCount }) {
  return (
    <div className="tab-switcher">
      <button
        className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
        onClick={() => onTabChange('prescriptions')}
      >
        Prescriptions
        <span className="tab-count">{prescriptionCount}</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
        onClick={() => onTabChange('lab')}
      >
        Lab Results
        <span className="tab-count">{labCount}</span>
      </button>
    </div>
  );
}
