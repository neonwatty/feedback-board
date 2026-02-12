-- ============================================
-- Feedback Board - Initial Schema
-- ============================================

-- Boards: a project/product can have multiple boards
create table boards (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now()
);

-- Posts: feedback items / feature requests
create table posts (
  id          uuid primary key default gen_random_uuid(),
  board_id    uuid references boards(id) on delete cascade not null,
  author_id   uuid references auth.users(id),
  title       text not null,
  description text,
  status      text default 'idea' check (status in ('idea','under_review','planned','in_progress','complete','closed')),
  vote_count  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Votes: one per user per post
create table votes (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references posts(id) on delete cascade not null,
  user_id     uuid references auth.users(id) not null,
  created_at  timestamptz default now(),
  unique(post_id, user_id)
);

-- Comments: discussion on posts
create table comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references posts(id) on delete cascade not null,
  author_id   uuid references auth.users(id),
  body        text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================
-- Indexes
-- ============================================
create index idx_posts_board_id on posts(board_id);
create index idx_posts_status on posts(status);
create index idx_posts_vote_count on posts(vote_count desc);
create index idx_posts_created_at on posts(created_at desc);
create index idx_votes_post_id on votes(post_id);
create index idx_votes_user_id on votes(user_id);
create index idx_comments_post_id on comments(post_id);

-- ============================================
-- Vote count trigger
-- ============================================
create or replace function update_post_vote_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update posts set vote_count = vote_count + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update posts set vote_count = vote_count - 1 where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger trigger_update_vote_count
  after insert or delete on votes
  for each row execute function update_post_vote_count();

-- ============================================
-- Updated_at trigger
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

create trigger trigger_comments_updated_at
  before update on comments
  for each row execute function update_updated_at();

-- ============================================
-- Row Level Security
-- ============================================

-- Boards RLS
alter table boards enable row level security;

create policy "Anyone can view boards"
  on boards for select
  using (true);

create policy "Authenticated users can create boards"
  on boards for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Board creator can update their boards"
  on boards for update
  to authenticated
  using (auth.uid() = created_by);

-- Posts RLS
alter table posts enable row level security;

create policy "Anyone can view posts"
  on posts for select
  using (true);

create policy "Authenticated users can create posts"
  on posts for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Authors can update their own posts"
  on posts for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Board admins can update post status"
  on posts for update
  to authenticated
  using (
    exists (
      select 1 from boards
      where boards.id = posts.board_id
      and boards.created_by = auth.uid()
    )
  );

create policy "Authors can delete their own posts"
  on posts for delete
  to authenticated
  using (auth.uid() = author_id);

-- Votes RLS
alter table votes enable row level security;

create policy "Anyone can view votes"
  on votes for select
  using (true);

create policy "Authenticated users can vote"
  on votes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove their own votes"
  on votes for delete
  to authenticated
  using (auth.uid() = user_id);

-- Comments RLS
alter table comments enable row level security;

create policy "Anyone can view comments"
  on comments for select
  using (true);

create policy "Authenticated users can create comments"
  on comments for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Authors can update their own comments"
  on comments for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Authors can delete their own comments"
  on comments for delete
  to authenticated
  using (auth.uid() = author_id);
