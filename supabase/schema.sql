-- MedFolio schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run

-- Members
create table if not exists members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  dob         date,
  color       text default '#7C9A7E',
  initial     text,
  created_at  timestamptz default now()
);

-- Consultations
create table if not exists consultations (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid references members(id) on delete cascade not null,
  date                date,
  doctor_name         text,
  hospital_name       text,
  medicines           jsonb default '[]'::jsonb,
  tests               jsonb default '[]'::jsonb,
  notes               text,
  next_visit_date     date,
  image_url           text,
  dismissed_reminder  boolean default false,
  created_at          timestamptz default now()
);

-- Lab reports
create table if not exists lab_reports (
  id                uuid primary key default gen_random_uuid(),
  member_id         uuid references members(id) on delete cascade not null,
  date              date,
  report_name       text,
  lab_name          text,
  ordered_by        text,
  results           jsonb default '[]'::jsonb,
  abnormal_summary  text,
  image_url         text,
  created_at        timestamptz default now()
);

-- Row Level Security (allow full public access — add auth later if needed)
alter table members      enable row level security;
alter table consultations enable row level security;
alter table lab_reports   enable row level security;

create policy "Public full access" on members      for all using (true) with check (true);
create policy "Public full access" on consultations for all using (true) with check (true);
create policy "Public full access" on lab_reports   for all using (true) with check (true);

-- Storage bucket: create manually in Supabase Dashboard → Storage → New bucket
-- Name: medfolio-uploads
-- Public: true (so image URLs work without signed tokens)
-- Then add this storage policy in Dashboard → Storage → Policies:
--   Bucket: medfolio-uploads, Operation: INSERT / SELECT, Role: anon → allow
