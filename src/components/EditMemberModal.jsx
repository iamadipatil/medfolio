import { useState } from 'react';
import { calculateAge } from '../utils/helpers';
// Reuses AddMemberModal styles
import './AddMemberModal.css';
import './EditMemberModal.css';

const COLORS = ['#2C3E35', '#C8853A', '#7C9A7E', '#5B7EC4', '#A0748A', '#C06060'];

export default function EditMemberModal({ member, onClose, onSave, onDelete }) {
  const [name, setName] = useState(member.name);
  const [dob, setDob] = useState(member.dob || '');
  const [color, setColor] = useState(member.color);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '?';
  const age = dob ? calculateAge(dob) : null;
  const valid = name.trim().length > 0 && dob;

  function handleSave() {
    if (!valid) return;
    onSave({
      ...member,
      name: name.trim(),
      dob,
      color,
      initial,
    });
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Edit Member</div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="avatar-preview-row">
            <div className="avatar-preview" style={{ background: color }}>
              {initial}
            </div>
            <div>
              <div className="avatar-preview-name">{name || 'Name'}</div>
              <div className="avatar-preview-age">
                {age !== null ? `${age} years old` : 'Date of birth not set'}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-input"
              value={dob}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setDob(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-swatches">
              {COLORS.map(c => (
                <div
                  key={c}
                  className={`color-swatch ${color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          {confirmDelete ? (
            <div className="delete-member-confirm">
              <p>Remove <strong>{member.name}</strong> and all their records? This cannot be undone.</p>
              <div className="delete-confirm-actions">
                <button className="btn-confirm-delete" onClick={() => onDelete(member.id)}>
                  Yes, remove
                </button>
                <button className="btn-cancel-delete" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-remove-member" onClick={() => setConfirmDelete(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Remove member
            </button>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
