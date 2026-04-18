-- Run this SQL in your new Supabase project's SQL Editor to create the necessary tables.

-- 1. Create the products table with the new catalogue format
CREATE TABLE products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  part_number text,
  quantity_in_stock numeric default 0,
  brand text,
  sub_brand text,
  category text,
  price numeric default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the brands table (keeping existing functionality)
CREATE TABLE brands (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create the site_settings table (keeping existing functionality)
CREATE TABLE site_settings (
  id uuid default gen_random_uuid() primary key,
  about_text text,
  goal text,
  enquiry_email text default 'mfurniturewala2007@gmail.com',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: The schema is set up without Row Level Security to start with, 
-- which is fine since you have a master password on your admin page. 
-- However, if you want public users to only be able to READ data but not write:
-- 
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" on products for select using (true);
-- (Repeat for other tables)

-- 4. Create the customers table (for user registration)
CREATE TABLE customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone_number text not null,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
