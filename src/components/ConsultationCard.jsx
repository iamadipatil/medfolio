import { useState, useEffect } from 'react';
import { formatDay, formatMonth, formatYear, formatDate, daysUntil } from '../utils/helpers';
import './ConsultationCard.css';

const CATEGORY_COLORS = {
  diabetic: '#C8853A',
  antibiotic: '#5B7EC4',
  supplement: '#7C9A7E',
  cardiac: '#C06060',
  other: '#A0748A',
};

export default function ConsultationCard({ consultation, animationIndex, onViewImage, onDelete, onUpdateDate }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState(consultation.date || '');

  const { date, doctorName, hospitalName, medicines, tests, notes, nextVisitDate, imageUrl } = consultation;

  function handleDateSave() {
    if (dateValue && dateValue !== date) {
      onUpdateDate(consultation.id, dateValue);
    }
    setEditingDate(false);
  }

  const daysLeft = nextVisitDate ? daysUntil(nextVisitDate) : null;

  // Auto-reset confirm after 3 seconds
  useEffect(() => {
    if (confirmDelete) {
      const t = setTimeout(() => setConfirmDelete(false), 3000);
      return () => clearTimeout(t);
    }
  }, [confirmDelete]);

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setRemoving(true);
    setTimeout(() => onDelete(consultation.id), 300);
  }

  return (
    <div
      className={`consultation-card ${removing ? 'removing' : ''}`}
      style={{ animationDelay: `${animationIndex * 60}ms` }}
    >
      {/* Header — always visible */}
      <div className="card-header" onClick={() => setOpen(o => !o)}>
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

        <div className="card-main">
          <div className="card-doctor">{doctorName || 'Unknown Doctor'}</div>
          <div className="card-hospital">{hospitalName || ''}</div>
          <div className="card-badges">
            {medicines && medicines.length > 0 && (
              <span className="badge badge-meds">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3" />
                  <circle cx="18" cy="18" r="4" />
                  <path d="M18 14v8M14 18h8" />
                </svg>
                {medicines.length} med{medicines.length !== 1 ? 's' : ''}
              </span>
            )}
            {tests && tests.length > 0 && (
              <span className="badge badge-tests">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />
                  <path d="M8.5 2h8" />
                  <path d="M14.5 16h-8" />
                </svg>
                {tests.length} test{tests.length !== 1 ? 's' : ''}
              </span>
            )}
            {daysLeft !== null && daysLeft >= 0 && (
              <span className="badge badge-next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {formatDate(nextVisitDate)}
              </span>
            )}
          </div>
        </div>

        <div className={`card-chevron ${open ? 'open' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded body */}
      {open && (
        <div className="card-body">
          {/* Medicines */}
          {medicines && medicines.length > 0 && (
            <div>
              <div className="section-label">Medicines Prescribed</div>
              <div className="medicines-list">
                {medicines.map((med, i) => (
                  <div className="medicine-row" key={i}>
                    <div className="medicine-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3" />
                        <circle cx="18" cy="18" r="4" />
                        <path d="M18 14v8M14 18h8" />
                      </svg>
                    </div>
                    <div className="medicine-info">
                      <div className="medicine-name">
                        {med.name}
                        <div
                          className="category-dot"
                          style={{ background: CATEGORY_COLORS[med.category] || CATEGORY_COLORS.other }}
                          title={med.category}
                        />
                      </div>
                      <div className="medicine-freq">{med.frequency}</div>
                    </div>
                    <div className="medicine-tags">
                      {med.dosage && <span className="dosage-tag">{med.dosage}</span>}
                      {med.duration && <span className="duration-tag">{med.duration}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tests */}
          {tests && tests.length > 0 && (
            <div>
              <div className="section-label">Tests Ordered</div>
              <div className="tests-list">
                {tests.map((test, i) => (
                  <span className="test-chip" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {test}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div>
              <div className="section-label">Doctor's Notes</div>
              <div className="notes-callout">
                <div className="notes-text">{notes}</div>
              </div>
            </div>
          )}

          {/* Next visit */}
          {nextVisitDate && daysLeft !== null && daysLeft >= 0 && (
            <div>
              <div className="section-label">Follow-up</div>
              <div className="next-visit-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <div className="next-visit-date">Next visit · {formatDate(nextVisitDate)}</div>
                  <div className="next-visit-meta">
                    {doctorName} · {daysLeft === 0 ? 'Today' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} away`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="card-footer">
            <div className="footer-actions">
              {imageUrl && (
                <button className="btn-view" onClick={() => onViewImage(imageUrl)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View image
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
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
