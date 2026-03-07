import { useState, useEffect } from 'react';
import * as db from './lib/db';
import { generateId, daysUntil } from './utils/helpers';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ProfileCard from './components/ProfileCard';
import FilterChips from './components/FilterChips';
import Timeline from './components/Timeline';
import RemindersWidget from './components/RemindersWidget';
import UploadModal from './components/UploadModal';
import AddMemberModal from './components/AddMemberModal';
import EditMemberModal from './components/EditMemberModal';
import ImageOverlay from './components/ImageOverlay';
import EmptyState from './components/EmptyState';
import TabSwitcher from './components/TabSwitcher';
import LabResultsPanel from './components/LabResultsPanel';
import UploadLabModal from './components/UploadLabModal';
import './App.css';

const SEED_MEMBERS = [
  { name: 'Adi',    dob: '1991-01-01', color: '#2C3E35', initial: 'A'  },
  { name: 'Preeti', dob: '1985-06-15', color: '#C8853A', initial: 'P'  },
  { name: 'Mudra',  dob: '2010-03-20', color: '#7C9A7E', initial: 'M'  },
  { name: 'Mom',    dob: '1960-09-10', color: '#5B7EC4', initial: 'Mo' },
];

export default function App() {
  const [members, setMembers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [imageOverlay, setImageOverlay] = useState(null);
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [showUploadLabModal, setShowUploadLabModal] = useState(false);

  // ─── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [fetchedMembers, fetchedConsultations, fetchedLabReports] = await Promise.all([
          db.getMembers(),
          db.getConsultations(),
          db.getLabReports(),
        ]);

        let finalMembers = fetchedMembers;

        // Seed 4 members on first ever load
        if (fetchedMembers.length === 0) {
          const seeded = await Promise.all(
            SEED_MEMBERS.map(m => db.insertMember({ ...m, id: generateId() }))
          );
          finalMembers = seeded;
        }

        setMembers(finalMembers);
        setConsultations(fetchedConsultations);
        setLabReports(fetchedLabReports);
        if (finalMembers.length > 0) setSelectedMemberId(finalMembers[0].id);
      } catch (err) {
        setDbError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ─── Derived state ───────────────────────────────────────────────────────────
  const selectedMember = members.find(m => m.id === selectedMemberId);

  const memberConsultations = consultations
    .filter(c => c.memberId === selectedMemberId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredConsultations = (() => {
    if (filter === 'withtests') return memberConsultations.filter(c => c.tests?.length > 0);
    if (filter === 'byyear' && selectedYear)
      return memberConsultations.filter(c => new Date(c.date + 'T00:00:00').getFullYear() === selectedYear);
    return memberConsultations;
  })();

  const reminders = consultations
    .filter(c => c.nextVisitDate && !c.dismissedReminder)
    .map(c => {
      const member = members.find(m => m.id === c.memberId);
      const daysLeft = daysUntil(c.nextVisitDate);
      return {
        id: c.id,
        memberId: c.memberId,
        memberName: member?.name || 'Unknown',
        memberColor: member?.color || '#7C9A7E',
        doctorName: c.doctorName,
        hospitalName: c.hospitalName,
        nextVisitDate: c.nextVisitDate,
        daysLeft,
      };
    })
    .filter(r => r.daysLeft !== null && r.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const membersWithUrgentReminders = new Set(
    reminders.filter(r => r.daysLeft <= 30).map(r => r.memberId)
  );

  const availableYears = [
    ...new Set(memberConsultations.map(c => new Date(c.date + 'T00:00:00').getFullYear()))
  ].sort((a, b) => b - a);

  const memberLabReports = labReports.filter(r => r.memberId === selectedMemberId);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  function handleSelectMember(id) {
    setSelectedMemberId(id);
    setFilter('all');
    setSelectedYear(null);
    setActiveTab('prescriptions');
  }

  async function handleAddMember(member) {
    setMembers(prev => [...prev, member]);
    setSelectedMemberId(member.id);
    setShowAddMemberModal(false);
    await db.insertMember(member);
  }

  async function handleEditMember(updated) {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMember(null);
    await db.updateMember(updated.id, updated);
  }

  async function handleDeleteMember(id) {
    const remaining = members.filter(m => m.id !== id);
    setMembers(remaining);
    setConsultations(prev => prev.filter(c => c.memberId !== id));
    setLabReports(prev => prev.filter(r => r.memberId !== id));
    setEditingMember(null);
    setSelectedMemberId(remaining.length > 0 ? remaining[0].id : null);
    await db.deleteMember(id);
  }

  async function handleAddConsultation(consultation) {
    setConsultations(prev => [consultation, ...prev]);
    setShowUploadModal(false);
    await db.insertConsultation(consultation);
  }

  async function handleDeleteConsultation(id) {
    setConsultations(prev => prev.filter(c => c.id !== id));
    await db.deleteConsultation(id);
  }

  async function handleDismissReminder(consultationId) {
    setConsultations(prev =>
      prev.map(c => c.id === consultationId ? { ...c, dismissedReminder: true } : c)
    );
    await db.dismissReminder(consultationId);
  }

  async function handleDeleteReminder(consultationId) {
    setConsultations(prev =>
      prev.map(c => c.id === consultationId ? { ...c, nextVisitDate: null } : c)
    );
    await db.clearNextVisit(consultationId);
  }

  async function handleAddLabReport(report) {
    setLabReports(prev => [report, ...prev]);
    setShowUploadLabModal(false);
    await db.insertLabReport(report);
  }

  async function handleDeleteLabReport(id) {
    setLabReports(prev => prev.filter(r => r.id !== id));
    await db.deleteLabReport(id);
  }

  // ─── Loading / error screens ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-logo">
          <div className="logo-icon" style={{ width: 44, height: 44, background: 'var(--sage)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6M12 9v6M3 9l2-2m0 0l2-2M5 7l2 2M3 15l2 2m0 0l2 2M5 17l2-2M19 7l-2-2m0 0l-2-2M17 5l-2 2M19 17l-2 2m0 0l-2 2M17 19l-2-2" />
            </svg>
          </div>
          <span className="app-loading-name">Med<span>Folio</span></span>
        </div>
        <div className="app-loading-spinner" />
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="app-loading">
        <div className="app-error-box">
          <strong>Could not connect to database</strong>
          <p>{dbError}</p>
          <p style={{ marginTop: 8, fontSize: 12 }}>Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env</p>
        </div>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Sidebar
        members={members}
        consultations={consultations}
        selectedMemberId={selectedMemberId}
        onSelectMember={handleSelectMember}
        onAddMember={() => setShowAddMemberModal(true)}
        onEditMember={(member) => setEditingMember(member)}
        membersWithUrgentReminders={membersWithUrgentReminders}
      />

      <div className="main-wrapper">
        <TopBar
          member={selectedMember}
          activeTab={activeTab}
          onUploadPrescription={() => setShowUploadModal(true)}
          onUploadLab={() => setShowUploadLabModal(true)}
        />

        <div className="content-area">
          {selectedMember && (
            <>
              <ProfileCard member={selectedMember} consultations={memberConsultations} />

              <TabSwitcher
                activeTab={activeTab}
                onTabChange={setActiveTab}
                prescriptionCount={memberConsultations.length}
                labCount={memberLabReports.length}
              />

              {activeTab === 'prescriptions' && (
                <>
                  <FilterChips
                    filter={filter}
                    onFilterChange={(f) => { setFilter(f); if (f !== 'byyear') setSelectedYear(null); }}
                    years={availableYears}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    consultations={memberConsultations}
                  />
                  {memberConsultations.length === 0 ? (
                    <EmptyState onUpload={() => setShowUploadModal(true)} />
                  ) : filteredConsultations.length === 0 ? (
                    <div className="no-filter-results">No consultations match this filter.</div>
                  ) : (
                    <Timeline
                      consultations={filteredConsultations}
                      onViewImage={(url) => setImageOverlay(url)}
                      onDelete={handleDeleteConsultation}
                    />
                  )}
                </>
              )}

              {activeTab === 'lab' && (
                <LabResultsPanel
                  reports={memberLabReports}
                  onUpload={() => setShowUploadLabModal(true)}
                  onViewImage={(url) => setImageOverlay(url)}
                  onDelete={handleDeleteLabReport}
                />
              )}
            </>
          )}
        </div>
      </div>

      <RemindersWidget
        reminders={reminders}
        onDismiss={handleDismissReminder}
        onDelete={handleDeleteReminder}
      />

      {showUploadModal && (
        <UploadModal
          member={selectedMember}
          onClose={() => setShowUploadModal(false)}
          onSave={handleAddConsultation}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onSave={handleAddMember}
        />
      )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleEditMember}
          onDelete={handleDeleteMember}
        />
      )}

      {showUploadLabModal && (
        <UploadLabModal
          member={selectedMember}
          onClose={() => setShowUploadLabModal(false)}
          onSave={handleAddLabReport}
        />
      )}

      {imageOverlay && (
        <ImageOverlay src={imageOverlay} onClose={() => setImageOverlay(null)} />
      )}
    </div>
  );
}
