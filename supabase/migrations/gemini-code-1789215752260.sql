create table public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text default 'Guest', 
  property text default 'Bespoke Client',
  category text check (category in ('hotel', 'lodge', 'airbnb')) default 'hotel',
  location text default 'Eswatini',
  rating integer check (rating >= 1 and rating <= 5) default 5,
  text text not null,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.testimonials enable row level security;

-- Allow public read access
create policy "Allow public read" on public.testimonials for select using (true);

-- Allow public insert access
create policy "Allow public insert" on public.testimonials for insert with check (true);