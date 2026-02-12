# Feedback Board

An open-source feedback board built with **Next.js 14+**, **Supabase**, and **shadcn/ui**. A credible alternative to Canny for collecting feature requests and user feedback.

## Features

- **Multiple boards** per instance
- **Post creation** with title + description
- **One-click upvoting** (one vote per user per post)
- **Comments** on posts
- **Status labels**: Idea, Under Review, Planned, In Progress, Complete, Closed
- **Roadmap view** — Kanban board grouped by status
- **Sort posts** by votes, newest, oldest
- **Auth** via GitHub & Google OAuth (Supabase Auth)
- **Admin panel** — board creators can manage post statuses
- **Dark mode**
- **Responsive** / mobile-ready
- **Row Level Security** — all data access controlled at the database level

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url> feedback-board
cd feedback-board
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:

   ```
   supabase/migrations/001_initial_schema.sql
   ```

   This creates all tables, indexes, RLS policies, and triggers.

3. Go to **Authentication > Providers** and enable:
   - **GitHub** — add your GitHub OAuth app credentials
   - **Google** — add your Google OAuth credentials

4. In **Authentication > URL Configuration**, add your redirect URL:
   ```
   http://localhost:3000/auth/callback
   ```

### 3. Configure environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project under **Settings > API**.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

## Project Structure

```
feedback-board/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home — list all boards
│   ├── login/page.tsx            # Login page (OAuth)
│   ├── auth/callback/route.ts    # OAuth callback handler
│   ├── board/[slug]/             # Board pages
│   │   ├── page.tsx              # Board — list posts
│   │   ├── new/page.tsx          # New post form
│   │   ├── post/[id]/page.tsx    # Post detail + comments
│   │   └── roadmap/page.tsx      # Roadmap (Kanban)
│   └── admin/                    # Admin pages
├── components/                   # React components
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Header, footer, theme toggle
│   ├── auth/                     # Login button, user menu
│   ├── board/                    # Board card, create dialog
│   ├── post/                     # Post card, list, form, vote button
│   ├── comment/                  # Comment list, form
│   ├── roadmap/                  # Kanban board
│   └── status/                   # Status badge
├── lib/
│   ├── supabase/                 # Supabase client utilities
│   ├── actions/                  # Server actions
│   └── types/                    # TypeScript type definitions
├── supabase/migrations/          # SQL migration files
└── middleware.ts                  # Auth session refresh
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Update the Supabase redirect URL to your production domain:
   ```
   https://your-domain.com/auth/callback
   ```

## Tech Stack

- [Next.js](https://nextjs.org) — React framework (App Router)
- [Supabase](https://supabase.com) — Postgres database + Auth
- [shadcn/ui](https://ui.shadcn.com) — UI components
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [TypeScript](https://typescriptlang.org) — Type safety

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT
