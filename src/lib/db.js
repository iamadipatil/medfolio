import { supabase } from './supabase';

// ─── Row mappers (snake_case DB → camelCase app) ──────────────────────────────

function memberFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    dob: row.dob,
    color: row.color,
    initial: row.initial,
  };
}

function consultationFromDb(row) {
  return {
    id: row.id,
    memberId: row.member_id,
    date: row.date,
    doctorName: row.doctor_name,
    hospitalName: row.hospital_name,
    medicines: row.medicines || [],
    tests: row.tests || [],
    notes: row.notes,
    nextVisitDate: row.next_visit_date,
    imageUrl: row.image_url,
    dismissedReminder: row.dismissed_reminder || false,
  };
}

function labReportFromDb(row) {
  return {
    id: row.id,
    memberId: row.member_id,
    date: row.date,
    reportName: row.report_name,
    labName: row.lab_name,
    orderedBy: row.ordered_by,
    results: row.results || [],
    abnormalSummary: row.abnormal_summary,
    imageUrl: row.image_url,
  };
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at');
  if (error) throw error;
  return data.map(memberFromDb);
}

export async function insertMember(member) {
  const { data, error } = await supabase
    .from('members')
    .insert({ id: member.id, name: member.name, dob: member.dob || null, color: member.color, initial: member.initial })
    .select()
    .single();
  if (error) throw error;
  return memberFromDb(data);
}

export async function updateMember(id, updates) {
  const { data, error } = await supabase
    .from('members')
    .update({ name: updates.name, dob: updates.dob || null, color: updates.color, initial: updates.initial })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return memberFromDb(data);
}

export async function deleteMember(id) {
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
}

// ─── Consultations ────────────────────────────────────────────────────────────

export async function getConsultations() {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(consultationFromDb);
}

export async function insertConsultation(c) {
  const { data, error } = await supabase
    .from('consultations')
    .insert({
      id: c.id,
      member_id: c.memberId,
      date: c.date || null,
      doctor_name: c.doctorName || null,
      hospital_name: c.hospitalName || null,
      medicines: c.medicines || [],
      tests: c.tests || [],
      notes: c.notes || null,
      next_visit_date: c.nextVisitDate || null,
      image_url: c.imageUrl || null,
      dismissed_reminder: false,
    })
    .select()
    .single();
  if (error) throw error;
  return consultationFromDb(data);
}

export async function updateConsultationDate(id, date) {
  const { error } = await supabase
    .from('consultations')
    .update({ date })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteConsultation(id) {
  const { error } = await supabase.from('consultations').delete().eq('id', id);
  if (error) throw error;
}

export async function dismissReminder(id) {
  const { error } = await supabase
    .from('consultations')
    .update({ dismissed_reminder: true })
    .eq('id', id);
  if (error) throw error;
}

export async function clearNextVisit(id) {
  const { error } = await supabase
    .from('consultations')
    .update({ next_visit_date: null })
    .eq('id', id);
  if (error) throw error;
}

// ─── Lab Reports ──────────────────────────────────────────────────────────────

export async function getLabReports() {
  const { data, error } = await supabase
    .from('lab_reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(labReportFromDb);
}

export async function insertLabReport(r) {
  const { data, error } = await supabase
    .from('lab_reports')
    .insert({
      id: r.id,
      member_id: r.memberId,
      date: r.date || null,
      report_name: r.reportName || null,
      lab_name: r.labName || null,
      ordered_by: r.orderedBy || null,
      results: r.results || [],
      abnormal_summary: r.abnormalSummary || null,
      image_url: r.imageUrl || null,
    })
    .select()
    .single();
  if (error) throw error;
  return labReportFromDb(data);
}

export async function updateLabReportDate(id, date) {
  const { error } = await supabase
    .from('lab_reports')
    .update({ date })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteLabReport(id) {
  const { error } = await supabase.from('lab_reports').delete().eq('id', id);
  if (error) throw error;
}
