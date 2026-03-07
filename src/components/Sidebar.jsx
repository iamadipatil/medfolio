import { calculateAge } from '../utils/helpers';
import './Sidebar.css';

export default function Sidebar({
  members,
  consultations,
  selectedMemberId,
  onSelectMember,
  onAddMember,
  onEditMember,
  membersWithUrgentReminders,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6M12 9v6M3 9l2-2m0 0l2-2M5 7l2 2M3 15l2 2m0 0l2 2M5 17l2-2M19 7l-2-2m0 0l-2-2M17 5l-2 2M19 17l-2 2m0 0l-2 2M17 19l-2-2" />
          </svg>
        </div>
        <div className="logo-text">Med<span>Folio</span></div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Family</div>
      </div>

      <div className="member-list">
        {members.map(member => {
          const age = calculateAge(member.dob);
          const count = consultations.filter(c => c.memberId === member.id).length;
          const hasUrgent = membersWithUrgentReminders.has(member.id);

          return (
            <div
              key={member.id}
              className={`member-item ${selectedMemberId === member.id ? 'active' : ''}`}
              onClick={() => onSelectMember(member.id)}
            >
              <div className="member-avatar-wrap">
                <div className="member-avatar" style={{ background: member.color }}>
                  {member.initial}
                </div>
                {hasUrgent && <div className="reminder-dot" />}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-age">{age !== null ? `${age} yrs` : ''}</div>
              </div>
              <div className="member-item-right">
                <button
                  className="member-edit-btn"
                  title="Edit member"
                  onClick={(e) => { e.stopPropagation(); onEditMember(member); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <div className="member-count">{count}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="add-member-btn" onClick={onAddMember}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Add family member
      </button>

      <div className="sidebar-footer">
        <div className="sidebar-privacy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Data stored privately on your device
        </div>
      </div>
    </aside>
  );
}
