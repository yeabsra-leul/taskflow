
-- Function to create profile for new (auth) users
create or replace function public.handle_new_user() 
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'email');
  return new;
end;
$$ language plpgsql;

-- Trigger to create profile for new (auth) users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Security policy: Users can read their own profile
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = user_id);

-- Security policy: Users can CRUD their own tasks
create policy "Users can CRUD own tasks"
on public.tasks for all
using (auth.uid() = user_id);

-- Enable RLS
alter table public.profiles enable row level security;
