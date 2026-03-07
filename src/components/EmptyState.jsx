import './EmptyState.css';

export default function EmptyState({ onUpload }) {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Prescription pad background */}
          <rect x="15" y="10" width="90" height="120" rx="8" stroke="#7C9A7E" strokeWidth="2" fill="#EBF1EB" />
          {/* Pad top strip */}
          <rect x="15" y="10" width="90" height="22" rx="8" fill="#7C9A7E" />
          <rect x="15" y="24" width="90" height="8" fill="#7C9A7E" />
          {/* Rx symbol */}
          <text x="25" y="28" fontFamily="serif" fontSize="14" fontWeight="bold" fill="white">Rx</text>
          {/* Lines representing text */}
          <line x1="28" y1="48" x2="92" y2="48" stroke="#7C9A7E" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="58" x2="80" y2="58" stroke="#7C9A7E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
          {/* Medicine lines */}
          <rect x="28" y="72" width="64" height="12" rx="4" stroke="#7C9A7E" strokeWidth="1.5" fill="none" strokeOpacity="0.6" />
          <line x1="34" y1="78" x2="56" y2="78" stroke="#7C9A7E" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="28" y="90" width="64" height="12" rx="4" stroke="#7C9A7E" strokeWidth="1.5" fill="none" strokeOpacity="0.4" />
          <line x1="34" y1="96" x2="50" y2="96" stroke="#7C9A7E" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          {/* Signature line */}
          <line x1="28" y1="118" x2="65" y2="118" stroke="#7C9A7E" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
          {/* Small plus */}
          <circle cx="95" cy="35" r="10" fill="white" fillOpacity="0.2" />
          <line x1="95" y1="30" x2="95" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="90" y1="35" x2="100" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="empty-heading">No records yet</h2>
      <p className="empty-subtext">
        Upload your first prescription to begin.
      </p>

      <button className="empty-upload-btn" onClick={onUpload}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload Prescription
      </button>
    </div>
  );
}
