import { generateId } from './helpers';

const KEY = 'medfolio_data';

function createSeedMembers() {
  return [
    { id: generateId(), name: 'Adi', dob: '1991-01-01', color: '#2C3E35', initial: 'A' },
    { id: generateId(), name: 'Preeti', dob: '1985-06-15', color: '#C8853A', initial: 'P' },
    { id: generateId(), name: 'Mudra', dob: '2010-03-20', color: '#7C9A7E', initial: 'M' },
    { id: generateId(), name: 'Mom', dob: '1960-09-10', color: '#5B7EC4', initial: 'Mo' },
  ];
}

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial = {
        members: createSeedMembers(),
        consultations: [],
        dismissedReminders: [],
      };
      saveData(initial);
      return initial;
    }
    const data = JSON.parse(raw);
    if (!data.dismissedReminders) data.dismissedReminders = [];
    if (!data.members) data.members = [];
    if (!data.consultations) data.consultations = [];
    if (!data.labReports) data.labReports = [];
    return data;
  } catch {
    const initial = {
      members: createSeedMembers(),
      consultations: [],
      dismissedReminders: [],
    };
    saveData(initial);
    return initial;
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
