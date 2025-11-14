-- -- Usage tracking for boards
-- create table public.usage_tracking (
--   user_id uuid references public.profiles(user_id) on delete cascade,
--   year_month text,
--   boards_created integer default 0,
--   primary key (user_id, year_month)
-- );

-- -- Function to increment board count
-- create or replace function increment_board_count() 
-- returns trigger
-- security definer
-- set search_path = public
-- as $$
-- begin
--   insert into public.usage_tracking (user_id, year_month, boards_created)
--   values (NEW.user_id, to_char(NOW(), 'YYYY-MM'), 1)
--   on conflict (user_id, year_month)
--   do update set boards_created = usage_tracking.boards_created + 1;
--   return NEW;
-- end;
-- $$ language plpgsql;

-- -- Trigger to increment board count after board creation
-- create trigger increment_board_count_after_insert
--   after insert on public.boards
--   for each row
--   execute function increment_board_count();

-- -- Security policy: Users can read their own usage tracking
-- create policy "Users can read own usage tracking"
-- on public.usage_tracking for select
-- using (auth.uid() = user_id);

-- -- Enable RLS
-- alter table public.usage_tracking enable row level security;
