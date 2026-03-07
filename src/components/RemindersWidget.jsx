import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/helpers';
import './RemindersWidget.css';

export default function RemindersWidget({ reminders, onDismiss, onDelete }) {
  const [open, setOpen] = useState(false);
  const [doneIds, setDoneIds] = useState(new Set());
  const [removingIds, setRemovingIds] = useState(new Set());
  const panelRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleDone(id) {
    setDoneIds(s => new Set([...s, id]));
    setTimeout(() => {
      setRemovingIds(s => new Set([...s, id]));
      setTimeout(() => {
        onDismiss(id);
        setDoneIds(s => { const n = new Set(s); n.delete(id); return n; });
        setRemovingIds(s => { const n = new Set(s); n.delete(id); return n; });
      }, 350);
    }, 600);
  }

  function handleDelete(id) {
    setRemovingIds(s => new Set([...s, id]));
    setTimeout(() => {
      onDelete(id);
      setRemovingIds(s => { const n = new Set(s); n.delete(id); return n; });
    }, 350);
  }

  const count = reminders.length;

  function getDaysColor(days) {
    if (days <= 14) return 'var(--amber)';
    if (days <= 90) return 'var(--sage)';
    return '#6B7C85';
  }

  return (
    <div className="reminders-widget" ref={panelRef}>
      {open && (
        <div className="reminders-panel">
          <div className="panel-header">
            <div className="panel-title">
              Upcoming <em>visits</em>
            </div>
            <button className="panel-close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="reminders-list">
            {reminders.length === 0 ? (
              <div className="reminders-empty">No upcoming visits</div>
            ) : (
              reminders.map(r => (
                <div
                  key={r.id}
                  className={[
                    'reminder-item',
                    r.daysLeft <= 14 ? 'urgent' : '',
                    doneIds.has(r.id) ? 'done' : '',
                    removingIds.has(r.id) ? 'removing' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="reminder-days" style={{ color: getDaysColor(r.daysLeft) }}>
                    {r.daysLeft}
                    <div style={{ fontSize: '10px', fontFamily: 'Jost, sans-serif', fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center', marginTop: 1 }}>
                      day{r.daysLeft !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="reminder-vdivider" />

                  <div className="reminder-info">
                    <div className="reminder-person">
                      <span
                        className="reminder-person-name"
                        style={{ background: r.memberColor }}
                      >
                        {r.memberName}
                      </span>
                    </div>
                    <div className="reminder-doctor">{r.doctorName || 'Follow-up visit'}</div>
                    <div className="reminder-hospital">{r.hospitalName || formatDate(r.nextVisitDate)}</div>
                  </div>

                  <div className="reminder-actions">
                    <button className="btn-done" title="Mark done" onClick={() => handleDone(r.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button className="btn-dismiss" title="Remove" onClick={() => handleDelete(r.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="panel-footer">
            <div className="panel-footer-text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Extracted automatically from prescriptions
            </div>
          </div>
        </div>
      )}

      <button className="reminders-trigger" onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        Reminders
        {count > 0 && (
          <div className="reminder-count-badge">{count}</div>
        )}
      </button>
    </div>
  );
}
