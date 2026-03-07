import { useState } from 'react';
import { generateId, calculateAge } from '../utils/helpers';
import './AddMemberModal.css';

const COLORS = ['#2C3E35', '#C8853A', '#7C9A7E', '#5B7EC4', '#A0748A', '#C06060'];

export default function AddMemberModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [color, setColor] = useState(COLORS[2]);

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '?';
  const age = dob ? calculateAge(dob) : null;

  function handleSave() {
    if (!name.trim() || !dob) return;
    onSave({
      id: generateId(),
      name: name.trim(),
      dob,
      color,
      initial,
    });
  }

  const valid = name.trim().length > 0 && dob;

  return (
    <div className="modal-overlay add-member-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Add Family Member</div>
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}
