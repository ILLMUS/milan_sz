-- Allow anyone (including anonymous visitors) to upload logo artwork to the branding-logos bucket
CREATE POLICY "Anyone can upload branding logos"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'branding-logos');

-- No public read: only the service role (edge functions) can read the artwork
GRANT ALL ON storage.objects TO service_role;