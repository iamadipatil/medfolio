import LabReportCard from './LabReportCard';
import './LabResultsPanel.css';

export default function LabResultsPanel({ reports, onUpload, onViewImage, onDelete, onUpdateDate }) {
  const sorted = [...reports].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="lab-results-panel">
      {/* Upload strip — always visible */}
      <div className="lab-upload-strip">
        <div className="lab-upload-strip-left">
          <div className="lab-strip-icon">
            <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="46">
              <rect x="4" y="4" width="40" height="48" rx="5" stroke="#7C9A7E" strokeWidth="1.8" fill="#EBF1EB"/>
              <line x1="12" y1="16" x2="36" y2="16" stroke="#7C9A7E" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="12" y1="23" x2="36" y2="23" stroke="#7C9A7E" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.6"/>
              <line x1="12" y1="30" x2="28" y2="30" stroke="#7C9A7E" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4"/>
              <rect x="12" y="38" width="10" height="10" rx="2" fill="#7C9A7E" fillOpacity="0.3" stroke="#7C9A7E" strokeWidth="1.2"/>
              <line x1="17" y1="41" x2="17" y2="45" stroke="#7C9A7E" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="15" y1="43" x2="19" y2="43" stroke="#7C9A7E" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="lab-strip-text">
            <div className="lab-strip-title">Upload a lab report</div>
            <div className="lab-strip-subtitle">Claude will extract test names, values, and flag anything outside normal range</div>
          </div>
        </div>
        <button className="lab-strip-btn" onClick={onUpload}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Report
        </button>
      </div>

      {/* Reports list or empty state */}
      {sorted.length === 0 ? (
        <div className="lab-empty-state">
          <div className="lab-empty-illustration">
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Test tube rack */}
              <rect x="20" y="10" width="60" height="8" rx="3" stroke="#7C9A7E" strokeWidth="1.8" fill="#EBF1EB"/>
              {/* Test tube 1 */}
              <rect x="28" y="18" width="12" height="52" rx="6" stroke="#7C9A7E" strokeWidth="1.8" fill="#EBF1EB"/>
              <rect x="29.5" y="54" width="9" height="16" rx="4.5" fill="#7C9A7E" fillOpacity="0.35"/>
              {/* Test tube 2 */}
              <rect x="44" y="18" width="12" height="44" rx="6" stroke="#7C9A7E" strokeWidth="1.8" fill="#EBF1EB"/>
              <rect x="45.5" y="48" width="9" height="14" rx="4.5" fill="#7C9A7E" fillOpacity="0.25"/>
              {/* Test tube 3 */}
              <rect x="60" y="18" width="12" height="56" rx="6" stroke="#7C9A7E" strokeWidth="1.8" fill="#EBF1EB"/>
              <rect x="61.5" y="58" width="9" height="16" rx="4.5" fill="#7C9A7E" fillOpacity="0.45"/>
              {/* Sparkles */}
              <circle cx="82" cy="24" r="2" fill="#7C9A7E" fillOpacity="0.4"/>
              <circle cx="16" cy="36" r="1.5" fill="#7C9A7E" fillOpacity="0.3"/>
              <circle cx="84" cy="48" r="1.5" fill="#7C9A7E" fillOpacity="0.3"/>
              {/* Bottom line */}
              <line x1="10" y1="100" x2="90" y2="100" stroke="#7C9A7E" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3"/>
            </svg>
          </div>
          <h2 className="lab-empty-heading">No lab reports yet</h2>
          <p className="lab-empty-subtext">Upload your first lab report to begin.</p>
          <button className="lab-empty-btn" onClick={onUpload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Lab Report
          </button>
        </div>
      ) : (
        <div className="lab-cards-list">
          {sorted.map((report, index) => (
            <LabReportCard
              key={report.id}
              report={report}
              animationIndex={index}
              onViewImage={onViewImage}
              onDelete={onDelete}
              onUpdateDate={onUpdateDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
