import { computeTrends } from '../utils/trends';
import './TrendsSummary.css';

export default function TrendsSummary({ labReports }) {
  const trends = computeTrends(labReports);

  if (trends.length === 0) return null;

  return (
    <div className="trends-summary">
      <div className="trends-summary-title">
        Health <em>Trends</em>
      </div>
      <div className="trends-summary-list">
        {trends.map((t) => (
          <div className="trend-item" key={t.key}>
            <div className="trend-emoji">{t.emoji}</div>
            <div className="trend-text">
              <div className="trend-headline">{t.headline}</div>
              <div className="trend-detail">{t.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
