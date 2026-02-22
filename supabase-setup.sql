-- =============================================================
-- Supabase Setup Script for mouse-lab
-- Run this in your Supabase Dashboard > SQL Editor
-- Project: https://nsmftvzbrrqjkfudhlns.supabase.co
-- =============================================================

-- -------------------------------------------------------------
-- 1. Create the "photos" table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.photos (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url  text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- -------------------------------------------------------------
-- 2. Create the "notes" table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text,
  content    text,
  created_at timestamptz DEFAULT now()
);

-- -------------------------------------------------------------
-- 3. Enable Row Level Security on both tables
-- -------------------------------------------------------------
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes  ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 4. RLS policies for "photos" table
--    Allow anonymous (anon) users to SELECT and INSERT
-- -------------------------------------------------------------
CREATE POLICY "Allow anonymous select on photos"
  ON public.photos
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert on photos"
  ON public.photos
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- -------------------------------------------------------------
-- 5. RLS policies for "notes" table
--    Allow anonymous (anon) users to SELECT and INSERT
-- -------------------------------------------------------------
CREATE POLICY "Allow anonymous select on notes"
  ON public.notes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert on notes"
  ON public.notes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- -------------------------------------------------------------
-- 6. Create the "photos" storage bucket (public access)
-- -------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------
-- 7. Storage policies for the "photos" bucket
--    Allow anonymous uploads and reads
-- -------------------------------------------------------------

-- Allow anyone to read/download files from the photos bucket
CREATE POLICY "Allow public read on photos bucket"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'photos');

-- Allow anonymous users to upload files to the photos bucket
CREATE POLICY "Allow anonymous upload to photos bucket"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'photos');
