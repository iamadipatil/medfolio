import { useState, useEffect } from 'react';
import { formatDay, formatMonth, formatYear } from '../utils/helpers';
import './LabReportCard.css';
import './ConsultationCard.css';

export default function LabReportCard({ report, animationIndex, onViewImage, onDelete, onUpdateDate }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState(report.date || '');

  const { date, reportName, labName, orderedBy, results, abnormalSummary, imageUrl } = report;

  function handleDateSave() {
    if (dateValue && dateValue !== date) {
      onUpdateDate(report.id, dateValue);
    }
    setEditingDate(false);
  }

  const abnormals = results?.filter(r => r.status === 'high' || r.status === 'low') || [];
  const allNormal = results?.length > 0 && abnormals.length === 0;

  useEffect(() => {
    if (confirmDelete) {
      const t = setTimeout(() => setConfirmDelete(false), 3000);
      return () => clearTimeout(t);
    }
  }, [confirmDelete]);

  function handleDelete() {
    setRemoving(true);
    setTimeout(() => onDelete(report.id), 300);
  }

  return (
    <div
      className={`lab-card ${removing ? 'removing' : ''}`}
      style={{ animationDelay: `${animationIndex * 60}ms` }}
    >
      <div className="lab-card-header" onClick={() => setOpen(o => !o)}>
        {/* Date block — reuses consultation card date styles */}
        <div
          className="card-date-block"
          onClick={e => { if (editingDate) e.stopPropagation(); }}
        >
          {editingDate ? (
            <input
              type="date"
              className="date-input-inline"
              value={dateValue}
              onChange={e => setDateValue(e.target.value)}
              onBlur={handleDateSave}
              onKeyDown={e => {
                if (e.key === 'Enter') handleDateSave();
                if (e.key === 'Escape') setEditingDate(false);
              }}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <>
              <div className="date-day-month">
                {formatDay(date)}
                <span className="date-month">{formatMonth(date)}</span>
              </div>
              <div className="date-year">{formatYear(date)}</div>
              <button
                className="date-edit-btn"
                onClick={e => { e.stopPropagation(); setEditingDate(true); }}
                title="Edit date"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="card-divider" />

        <div className="lab-card-main">
          <div className="lab-report-name">{reportName || 'Lab Report'}</div>
          <div className="lab-report-meta">
            {[labName, orderedBy ? `Ordered by ${orderedBy}` : null].filter(Boolean).join(' · ')}
          </div>
          <div className="lab-card-badges">
            {abnormals.length > 0 ? (
              <span className="badge-abnormal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {abnormals.length} abnormal
              </span>
            ) : allNormal ? (
              <span className="badge-allnormal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                All normal
              </span>
            ) : null}
            {results?.length > 0 && (
              <span className="badge-test-count">{results.length} test{results.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className={`lab-card-chevron ${open ? 'open' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {open && (
        <div className="lab-card-body">
          {results && results.length > 0 && (
            <div>
              <div className="section-label">Test Results</div>
              <div className="results-table-wrap">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Value</th>
                      <th>Normal Range</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td className="td-test-name">{r.testName}</td>
                        <td>
                          <span className={`td-value ${r.status}`}>
                            {r.value}{r.unit ? ` ${r.unit}` : ''}
                          </span>
                        </td>
                        <td className="td-range">{r.normalRange || '—'}</td>
                        <td className="td-status">
                          <span className={`status-pill ${r.status}`}>
                            {r.status === 'high' ? 'HIGH' : r.status === 'low' ? 'LOW' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {abnormalSummary && (
            <div className="abnormal-callout">
              <div className="abnormal-callout-label">Attention needed</div>
              <div className="abnormal-callout-text">{abnormalSummary}</div>
            </div>
          )}

          <div className="lab-card-footer">
            <div className="footer-actions">
              {imageUrl && (
                <button className="btn-view" onClick={() => onViewImage(imageUrl)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  View report
                </button>
              )}
            </div>

            {confirmDelete ? (
              <div className="delete-confirm">
                Sure?
                <button className="confirm-yes" onClick={handleDelete}>Yes, delete</button>
                <button className="confirm-no" onClick={() => setConfirmDelete(false)}>No</button>
              </div>
            ) : (
              <button className="btn-delete" onClick={() => setConfirmDelete(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
