import { calculateAge, formatDate } from '../utils/helpers';
import './ProfileCard.css';

export default function ProfileCard({ member, consultations }) {
  const age = calculateAge(member.dob);

  const totalMeds = consultations.reduce((acc, c) => acc + (c.medicines?.length || 0), 0);
  const totalTests = consultations.reduce((acc, c) => acc + (c.tests?.length || 0), 0);

  const lastVisit = consultations.length > 0
    ? consultations.reduce((latest, c) =>
        new Date(c.date) > new Date(latest.date) ? c : latest
      )
    : null;

  return (
    <div className="profile-card">
      <div className="profile-left">
        <div className="profile-avatar" style={{ background: member.color }}>
          {member.initial}
        </div>
        <div>
          <div className="profile-name">{member.name}</div>
          <div className="profile-meta">
            {age !== null ? `${age} years old` : ''}
            {age !== null && lastVisit ? ' · ' : ''}
            {lastVisit ? `Last visit ${formatDate(lastVisit.date)}` : 'No visits yet'}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-block">
          <div className="stat-number">{consultations.length}</div>
          <div className="stat-label">Visits</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-block">
          <div className="stat-number">{totalMeds}</div>
          <div className="stat-label">Medicines</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-block">
          <div className="stat-number">{totalTests}</div>
          <div className="stat-label">Tests</div>
        </div>
      </div>
    </div>
  );
}
