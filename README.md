# 📅 My Planner

A personal daily planner built with **Next.js 14** + **Supabase (Postgres)**.
Works as a PWA — add it to your phone home screen like a native app.
**100% free** — no credit card needed.

---

## ✨ Features

- **Daily Habits** — repeating tasks shown every day with progress bar
- **Today's Tasks** — general todos; undone ones auto carry-forward to tomorrow
- **Custom Lists** — shopping, ideas, cooking, anything (collapsible on dashboard)
- **Calendar View** — see tasks per day, click any day to view/add/edit todos
- **PWA** — add to phone home screen, works like a native app
- **Responsive** — mobile, tablet and desktop layouts

---

## 🚀 Setup (5 minutes)

### 1. Create a Supabase Project (free, no credit card)

1. Go to [supabase.com](https://supabase.com) → **"Start your project"**
2. Sign up with GitHub → **"New project"**
3. Give it a name, set a database password, pick a region → **"Create project"**
4. Wait ~1 minute for it to provision

### 2. Run the Database Schema

1. In your Supabase project → **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase-schema.sql` from this project, paste the entire contents
4. Click **"Run"** — all 5 tables are created instantly

### 3. Get Your API Keys

1. Supabase → **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → `https://abcxyz.supabase.co`
   - **anon / public key** → long string starting with `eyJ...`

### 4. Configure the App

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 5. Install & Run

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deploy Free on Vercel

1. Push to **GitHub**
2. [vercel.com](https://vercel.com) → **New Project** → import repo
3. Add your two `NEXT_PUBLIC_SUPABASE_*` env vars
4. Deploy → free `yourapp.vercel.app` URL, works on all your devices

---

## 📱 Add to Phone Home Screen

**iPhone (Safari):** Share icon → "Add to Home Screen" → Add

**Android (Chrome):** ⋮ menu → "Add to Home screen"

---

## 📁 Project Structure

```
my-planner/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 Dashboard
│   ├── globals.css
│   └── components/
│       ├── HabitsList.tsx
│       ├── TodayTodos.tsx
│       ├── CollapsibleList.tsx
│       ├── CalendarView.tsx
│       ├── DayModal.tsx
│       ├── SectionCard.tsx
│       └── AddListModal.tsx
├── hooks/
│   └── usePlanner.ts
├── lib/
│   ├── supabase.ts              Supabase client
│   └── db.ts                    All CRUD helpers
├── types/index.ts
├── public/manifest.json
├── supabase-schema.sql          ← Run once in Supabase SQL Editor
└── .env.local.example
```

---

## 🗂️ Database Tables

| Table | Purpose |
|---|---|
| `habits` | Daily repeating tasks |
| `habit_done` | Whether each habit was done per date |
| `todos` | Day-specific tasks, carry-forward on miss |
| `lists` | Custom lists (shopping, ideas, etc.) |
| `list_items` | Items inside each list |

---

## 📌 App Icons

Add to `/public/icons/`: `icon-192.png` and `icon-512.png`
Create free at [favicon.io](https://favicon.io).
