import './TopBar.css';

export default function TopBar({ member, activeTab, onUploadPrescription, onUploadLab }) {
  if (!member) return <div className="topbar" />;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-avatar" style={{ background: member.color }}>
          {member.initial}
        </div>
        <div className="topbar-title">
          {member.name}'s <em>Records</em>
        </div>
      </div>

      {activeTab === 'lab' ? (
        <button className="upload-btn upload-btn-secondary" onClick={onUploadLab}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Lab Report
        </button>
      ) : (
        <button className="upload-btn" onClick={onUploadPrescription}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Prescription
        </button>
      )}
    </header>
  );
}
