function parseNumeric(value) {
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

function pctChange(from, to) {
  if (from === 0) return to === 0 ? 0 : Infinity;
  return Math.abs((to - from) / from) * 100;
}

// HbA1c is always shown when present, regardless of ranking — it's the
// headline metric for anyone tracking diabetes risk.
function isHbA1c(testName) {
  const norm = testName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    norm.includes('hba1c') ||
    norm.includes('hb1ac') ||
    norm === 'a1c' ||
    norm.includes('glycatedhemoglobin') ||
    norm.includes('glycosylatedhemoglobin')
  );
}

// Groups every test result across a member's lab reports by test name,
// then looks at the two most recent readings for each test to find
// what changed: a status crossing into/out of "normal", or a meaningful
// numeric shift. Returns up to `limit` of the most notable ones, always
// including HbA1c first if it has trend data available.
export function computeTrends(labReports, limit = 5) {
  const byTest = new Map();

  for (const report of labReports) {
    if (!report.date) continue;
    for (const result of report.results || []) {
      if (!result.testName) continue;
      const key = result.testName.trim().toLowerCase();
      if (!byTest.has(key)) byTest.set(key, []);
      byTest.get(key).push({ ...result, date: report.date });
    }
  }

  const candidates = [];

  for (const entries of byTest.values()) {
    if (entries.length < 2) continue;
    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const curr = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const testName = curr.testName;
    const occurrences = sorted.length;
    const pinned = isHbA1c(testName);

    const currNum = parseNumeric(curr.value);
    const prevNum = parseNumeric(prev.value);
    const numeric = currNum !== null && prevNum !== null;
    const direction = numeric ? (currNum > prevNum ? 'up' : currNum < prevNum ? 'down' : 'flat') : null;
    const change = numeric ? pctChange(prevNum, currNum) : 0;

    const detailNumeric = numeric
      ? `${prev.value} → ${curr.value}${curr.unit ? ` ${curr.unit}` : ''}`
      : null;

    // Pinned metrics (HbA1c) get an infinite priority so they always sort
    // to the top and survive the final slice, regardless of how small the
    // change is.
    const basePriority = pinned ? Infinity : 0;

    if (prev.status !== 'normal' && curr.status === 'normal') {
      candidates.push({
        key: testName, priority: basePriority + 3, emoji: '✅',
        headline: `${testName} back to normal`,
        detail: detailNumeric ? `${detailNumeric} (was ${prev.status})` : `was ${prev.status}`,
      });
    } else if (prev.status === 'normal' && curr.status !== 'normal') {
      candidates.push({
        key: testName, priority: basePriority + 3, emoji: '⚠️',
        headline: `${testName} now ${curr.status}`,
        detail: detailNumeric || `flagged ${curr.status}`,
      });
    } else if (curr.status !== 'normal' && numeric && direction !== 'flat') {
      candidates.push({
        key: testName, priority: basePriority + 2, emoji: direction === 'down' ? '📉' : '📈',
        headline: `${testName} trending ${direction}`,
        detail: occurrences >= 3 ? `${detailNumeric} over ${occurrences} tests` : `${detailNumeric}, still ${curr.status}`,
        change,
      });
    } else if (numeric && direction !== 'flat' && (pinned || change >= 8)) {
      candidates.push({
        key: testName, priority: basePriority + 1, emoji: direction === 'down' ? '📉' : '📈',
        headline: `${testName} trending ${direction}`,
        detail: occurrences >= 3 ? `${detailNumeric} over ${occurrences} tests` : `${detailNumeric}, since last test`,
        change,
      });
    } else if (pinned) {
      // No status change and no meaningful numeric movement — still surface
      // it so HbA1c never silently disappears from the panel.
      candidates.push({
        key: testName, priority: basePriority, emoji: '➡️',
        headline: `${testName} holding steady`,
        detail: detailNumeric ? `${detailNumeric}, still ${curr.status}` : `latest: ${curr.value}${curr.unit ? ` ${curr.unit}` : ''}`,
        change: 0,
      });
    }
  }

  return candidates
    .sort((a, b) => b.priority - a.priority || (b.change || 0) - (a.change || 0))
    .slice(0, limit);
}
