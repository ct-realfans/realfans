-- RealFans 真粉 — 初始 schema
-- 需要延伸：pgcrypto (gen_random_uuid)

create extension if not exists "pgcrypto";

-- 商家 / 門店
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  name text not null,
  industry text,
  brand_voice text,
  google_place_id text,
  google_review_link text,
  line_oa_id text,
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'flagship')),
  created_at timestamptz not null default now()
);
create index if not exists stores_owner_idx on stores (owner_user_id);

-- 顧客
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  line_id text,
  tags text[] not null default '{}',
  notes text,
  total_spend_twd integer not null default 0,
  visits integer not null default 0,
  last_visit_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists customers_store_idx on customers (store_id);
create index if not exists customers_last_visit_idx on customers (store_id, last_visit_at desc);

-- 邀評
create type invite_channel as enum ('line', 'sms', 'email');
create type invite_status as enum ('draft', 'scheduled', 'sent', 'opened', 'reviewed', 'declined');
create type review_platform as enum ('google', 'facebook', 'line');

create table if not exists review_invites (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  channel invite_channel not null,
  platform review_platform not null default 'google',
  status invite_status not null default 'draft',
  message text not null,
  ai_model text,
  ai_prompt text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  reviewed_at timestamptz,
  rating smallint check (rating between 1 and 5),
  created_at timestamptz not null default now()
);
create index if not exists invites_store_status_idx on review_invites (store_id, status);
create index if not exists invites_customer_idx on review_invites (customer_id);

-- 留存的真實評論
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  platform review_platform not null,
  author_name text,
  rating smallint not null check (rating between 1 and 5),
  content text,
  invite_id uuid references review_invites(id) on delete set null,
  ai_reply text,
  replied_at timestamptz,
  platform_review_id text,
  created_at timestamptz not null default now(),
  unique (platform, platform_review_id)
);
create index if not exists reviews_store_created_idx on reviews (store_id, created_at desc);

-- 合規 audit log（Google / FTC 查帳時用）
create table if not exists compliance_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  actor text not null,
  kind text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- RLS：每家店只能看自己的資料
alter table stores enable row level security;
alter table customers enable row level security;
alter table review_invites enable row level security;
alter table reviews enable row level security;
alter table compliance_events enable row level security;

create policy stores_owner on stores
  for all using (owner_user_id = auth.uid());

create policy customers_by_store on customers
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );

create policy invites_by_store on review_invites
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );

create policy reviews_by_store on reviews
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );

create policy compliance_by_store on compliance_events
  for all using (
    store_id in (select id from stores where owner_user_id = auth.uid())
  );
