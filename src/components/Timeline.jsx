import { formatYear } from '../utils/helpers';
import ConsultationCard from './ConsultationCard';
import './Timeline.css';

export default function Timeline({ consultations, onViewImage, onDelete }) {
  // Group by year
  const groups = [];
  let currentYear = null;

  consultations.forEach((c, index) => {
    const year = formatYear(c.date);
    if (year !== currentYear) {
      currentYear = year;
      groups.push({ type: 'year', year, key: `year-${year}` });
    }
    groups.push({ type: 'card', consultation: c, index, key: c.id });
  });

  return (
    <div className="timeline">
      <div className="timeline-line" />
      {groups.map((item) => {
        if (item.type === 'year') {
          return (
            <div className="year-divider" key={item.key}>
              <span className="year-label">{item.year}</span>
              <div className="year-rule" />
            </div>
          );
        }
        return (
          <div className="timeline-item" key={item.key}>
            <div className="timeline-dot" />
            <ConsultationCard
              consultation={item.consultation}
              animationIndex={item.index}
              onViewImage={onViewImage}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </div>
  );
}
