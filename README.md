# MedFolio

A family medical records tracker for managing prescriptions and lab reports. Upload a photo or PDF of a prescription or lab report and Claude extracts the details automatically.

![MedFolio](https://img.shields.io/badge/built%20with-React%20%2B%20Vite-61dafb) ![Supabase](https://img.shields.io/badge/database-Supabase-3ecf8e) ![Claude](https://img.shields.io/badge/AI-Claude%20Vision-cc785c)

## Features

- **Multiple family members** — switch between profiles in the sidebar
- **Prescription tracking** — upload an image or PDF; Claude extracts doctor, hospital, medicines (with dosage, frequency, duration), tests ordered, notes, and next visit
- **Lab report tracking** — upload a lab report; Claude extracts each test result, flags abnormal values, and writes a plain-English summary
- **Reminders** — upcoming follow-up appointments surface in a floating widget with urgency highlighting
- **Fully mobile responsive** — works on phones and tablets

## Tech Stack

- **Frontend:** React 18 + Vite, plain CSS (no Tailwind)
- **Database:** Supabase (Postgres + Storage)
- **AI:** Anthropic Claude Vision API (`claude-sonnet-4-5-20250514`)
- **Fonts:** Fraunces, Jost, DM Mono (Google Fonts)
- **Deployment:** Vercel

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/iamadipatil/medfolio.git
cd medfolio
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and run the schema below in the SQL editor:

```sql
create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dob text,
  blood_group text,
  color text,
  created_at timestamptz default now()
);

create table consultations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  date text,
  doctor text,
  hospital text,
  medicines jsonb,
  tests jsonb,
  notes text,
  next_visit text,
  dismissed_reminder boolean default false,
  image_url text,
  created_at timestamptz default now()
);

create table lab_reports (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  date text,
  report_name text,
  lab_name text,
  ordered_by text,
  results jsonb,
  abnormal_summary text,
  image_url text,
  created_at timestamptz default now()
);

-- Enable Row Level Security with public access
alter table members enable row level security;
alter table consultations enable row level security;
alter table lab_reports enable row level security;

create policy "Public access" on members for all using (true) with check (true);
create policy "Public access" on consultations for all using (true) with check (true);
create policy "Public access" on lab_reports for all using (true) with check (true);
```

Also create a public Storage bucket named `medfolio-uploads` and add a policy allowing public reads and uploads.

### 3. Configure environment variables

Create a `.env` file in the project root:

```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

> **Note:** This app calls the Anthropic API directly from the browser using the `anthropic-dangerous-direct-browser-access` header. This is fine for personal use but you should not expose your API key in a public-facing production app.

### 4. Run locally

```bash
npm run dev
```

## Deploying to Vercel

1. Push the repo to GitHub
2. Import it in [Vercel](https://vercel.com) (use the **Vite** preset)
3. Add the three environment variables in Vercel's project settings
4. Deploy

## License

MIT
