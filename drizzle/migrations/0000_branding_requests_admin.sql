CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE TABLE public.branding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  property_name text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  quantities text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  logo_path text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  admin_notes text NOT NULL DEFAULT ''
);
GRANT SELECT, UPDATE ON public.branding_requests TO authenticated;
GRANT ALL ON public.branding_requests TO service_role;
ALTER TABLE public.branding_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read branding requests" ON public.branding_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update branding requests" ON public.branding_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read branding logos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'branding-logos' AND public.has_role(auth.uid(), 'admin'));