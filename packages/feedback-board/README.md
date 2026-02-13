# @neonwatty/feedback-board

Embeddable feedback board for Next.js + Supabase apps. Collect feature requests, let users upvote, and track status on a public roadmap.

[![npm version](https://img.shields.io/npm/v/@neonwatty/feedback-board)](https://www.npmjs.com/package/@neonwatty/feedback-board)
[![license](https://img.shields.io/npm/l/@neonwatty/feedback-board)](./LICENSE)

## Installation

```bash
npm install @neonwatty/feedback-board
```

### Peer dependencies

| Package                 | Version |
| ----------------------- | ------- |
| `react`                 | >= 18   |
| `react-dom`             | >= 18   |
| `next`                  | >= 14   |
| `@supabase/supabase-js` | ^2.0.0  |
| `tailwindcss`           | >= 4    |

## Quick Start

### Step 1: Database

Run the shipped migration in your Supabase SQL Editor:

```sql
-- Copy the contents of:
-- node_modules/@neonwatty/feedback-board/migrations/001_initial_schema.sql
```

Or import it directly:

```ts
import migration from "@neonwatty/feedback-board/migrations/001_initial_schema.sql";
```

This creates:

- **Tables**: `boards`, `posts`, `votes`, `comments`
- **RLS policies**: public read, authenticated write, owner-only update/delete
- **Triggers**: auto-increment `vote_count`, auto-update `updated_at`
- **Indexes**: on `board_id`, `status`, `vote_count`, `created_at`, `post_id`, `user_id`

You also need to enable at least one **OAuth provider** in Supabase Auth (e.g. GitHub, Google) so users can sign in to create posts and vote.

### Step 2: Tailwind CSS

Two config lines are needed:

**In your CSS file** (e.g. `app/globals.css`) add a `@source` directive so Tailwind scans the package's compiled classes:

```css
@import "tailwindcss";
@source "../node_modules/@neonwatty/feedback-board/dist";
```

> The `@source` path is relative to your CSS file. Adjust if your project structure differs.

**In `next.config.ts`** add the package to `transpilePackages`:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@neonwatty/feedback-board"],
};
```

### Step 3: Server Actions

Next.js requires `"use server"` directives to be in files within your app — they cannot be imported from `node_modules`. The solution is to create thin server-action wrappers that call the package's pure functions.

Create `lib/feedback-actions.ts`:

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBoardAction,
  createPostAction,
  toggleVoteAction,
  updatePostStatusAction,
  createCommentAction,
} from "@neonwatty/feedback-board/actions";
import type { PostStatus } from "@neonwatty/feedback-board";

export async function createBoard(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await createBoardAction(supabase, user.id, formData);
  if (!result.error) revalidatePath("/");
  return result;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await createPostAction(supabase, user.id, formData);
  if (result.slug) revalidatePath(`/board/${result.slug}`);
  return result;
}

export async function toggleVote(postId: string, boardSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Must be logged in to vote." };

  const result = await toggleVoteAction(supabase, user.id, postId, boardSlug);
  revalidatePath(`/board/${boardSlug}`);
  return result;
}

export async function updatePostStatus(postId: string, status: PostStatus, boardSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Must be logged in." };

  const result = await updatePostStatusAction(supabase, user.id, postId, status, boardSlug);
  revalidatePath(`/board/${boardSlug}`);
  return result;
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const boardSlug = formData.get("board_slug") as string;
  const postId = formData.get("post_id") as string;

  const result = await createCommentAction(supabase, user.id, formData);
  revalidatePath(`/board/${boardSlug}/post/${postId}`);
  return result;
}
```

> **Key**: import pure functions from `@neonwatty/feedback-board/actions` (not the main entry). The main entry has a `"use client"` banner — importing from it in a server file will fail.

### Step 4: Provider

Create a client-side provider wrapper that passes the server actions to the feedback board:

```tsx
// components/feedback-provider-wrapper.tsx
"use client";

import { FeedbackBoardProvider } from "@neonwatty/feedback-board";
import type { FeedbackUser } from "@neonwatty/feedback-board";
import { createBoard, createPost, toggleVote, updatePostStatus, createComment } from "@/lib/feedback-actions";

const actions = {
  createBoard,
  createPost,
  toggleVote,
  updatePostStatus,
  createComment,
};

export function FeedbackProviderWrapper({ user, children }: { user: FeedbackUser | null; children: React.ReactNode }) {
  return (
    <FeedbackBoardProvider actions={actions} user={user} basePath="/feedback" loginPath="/login">
      {children}
    </FeedbackBoardProvider>
  );
}
```

Then wrap your layout:

```tsx
// app/layout.tsx (or a nested layout)
import { FeedbackProviderWrapper } from "@/components/feedback-provider-wrapper";

export default async function Layout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const feedbackUser = user ? { id: user.id, email: user.email } : null;

  return <FeedbackProviderWrapper user={feedbackUser}>{children}</FeedbackProviderWrapper>;
}
```

## Components

| Component           | Key Props                                                                  | Description                                                        |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `BoardCard`         | `board: BoardWithPostCount`, `className?`                                  | Board summary card with name, description, and post count          |
| `CreateBoardDialog` | `className?`                                                               | Dialog for creating a new board with name and description fields   |
| `PostCard`          | `post: PostWithVoteStatus`, `boardSlug`, `isLoggedIn`, `className?`        | Post card with vote button, title, status badge, and comment count |
| `PostList`          | `posts: PostWithVoteStatus[]`, `boardSlug`, `isLoggedIn`, `className?`     | Sortable list of posts (by votes, newest, oldest)                  |
| `PostForm`          | `boardId`, `className?`                                                    | Form for creating a new post                                       |
| `VoteButton`        | `postId`, `boardSlug`, `voteCount`, `hasVoted`, `isLoggedIn`, `className?` | Upvote button with optimistic updates                              |
| `PostStatusSelect`  | `postId`, `currentStatus: PostStatus`, `boardSlug`, `className?`           | Dropdown to update post status (admin)                             |
| `CommentForm`       | `postId`, `boardSlug`, `className?`                                        | Form for submitting comments                                       |
| `CommentList`       | `comments: CommentWithAuthor[]`, `className?`                              | List of comments with author and timestamp                         |
| `RoadmapBoard`      | `posts: Post[]`, `boardSlug`, `className?`                                 | Kanban board showing posts grouped by status                       |
| `StatusBadge`       | `status: PostStatus`, `className?`, `statusClassNames?`                    | Colored badge displaying post status                               |
| `FeedbackLink`      | `href`, + all Next.js `Link` props                                         | Link that auto-prepends the configured `basePath`                  |

All components also export from the main entry (`@neonwatty/feedback-board`).

## Theming

Every component accepts a `className` prop for custom styling.

`StatusBadge` additionally accepts `statusClassNames` — a partial record mapping each `PostStatus` to a CSS class:

```tsx
<StatusBadge status="planned" statusClassNames={{ planned: "bg-purple-100 text-purple-800" }} />
```

The `defaultStatusConfig` export provides the built-in label and class for each status, useful for building custom status UIs:

```ts
import { defaultStatusConfig } from "@neonwatty/feedback-board";

const config = defaultStatusConfig["in_progress"];
// { label: "In Progress", className: "bg-blue-100 text-blue-800 ..." }
```

## Exports Reference

The package has two entry points and a migrations subpath:

| Import Path                              | Contains                                          | `"use client"`? |
| ---------------------------------------- | ------------------------------------------------- | --------------- |
| `@neonwatty/feedback-board`              | Components, Provider, types, `cn` utility         | Yes             |
| `@neonwatty/feedback-board/actions`      | Pure action functions (`createBoardAction`, etc.) | No              |
| `@neonwatty/feedback-board/migrations/*` | SQL migration files                               | N/A             |

**Why the split?** The main entry has a `"use client"` banner so React components work in Next.js. If server-side code imported from this entry, all exports would be tainted as client-only. The `./actions` subpath has no banner, keeping the pure functions callable from server actions.

## FormData Fields

Actions that accept `FormData` expect these fields:

| Action                | Fields                             |
| --------------------- | ---------------------------------- |
| `createBoardAction`   | `name`, `description`              |
| `createPostAction`    | `board_id`, `title`, `description` |
| `createCommentAction` | `post_id`, `body`                  |

`toggleVoteAction` and `updatePostStatusAction` take positional arguments instead of FormData.

## Testing

See `examples/integration-test-example.tsx` for a complete integration test template covering:

- `renderWithProvider` helper with mock actions and user
- `createMockSupabase` for testing pure action functions
- Component rendering tests
- Action function tests with mocked Supabase

Prerequisites: `vitest`, `@testing-library/react`, `@testing-library/user-event`

## License

MIT
