-- Run this in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/ihlzgwuzqzdhijwnljtu/sql

-- Create the brand-logos storage bucket (public so logos are accessible on the website)
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to read logos (public access for the website)
CREATE POLICY "Public read access for brand logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');

-- Allow the anon key to upload logos (so the Admin panel can upload without service key)
CREATE POLICY "Allow anon uploads to brand logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-logos');

-- Allow the anon key to delete/replace logos
CREATE POLICY "Allow anon delete in brand logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-logos');
