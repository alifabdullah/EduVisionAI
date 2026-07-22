-- ─────────────────────────────────────────────────────────────────────────────
-- EduVision AI — Counselling Module Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/gfqxycyrydyrfuuoqqum/sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── counselling_requests ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.counselling_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_dept TEXT,
    student_cgpa NUMERIC,
    student_attendance NUMERIC,
    student_avatar TEXT,
    teacher_id TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    teacher_designation TEXT,
    teacher_dept TEXT,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'Pending',
    teacher_notes TEXT,
    meeting_link TEXT,
    scheduled_date TEXT,
    scheduled_time TEXT,
    rejection_reason TEXT,
    student_weakness TEXT,
    study_plan TEXT,
    assignments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── session_resources ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.counselling_requests(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── student_tasks (roadmap) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.counselling_requests(id) ON DELETE CASCADE,
    week TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deadline TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Not Started',
    student_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── session_history ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.session_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES public.counselling_requests(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    duration TEXT NOT NULL,
    topic TEXT NOT NULL,
    teacher_notes TEXT,
    student_notes TEXT,
    resources_shared JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    assignments_given JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_counselling_student_id ON public.counselling_requests (student_id);
CREATE INDEX IF NOT EXISTS idx_counselling_teacher_id ON public.counselling_requests (teacher_id);
CREATE INDEX IF NOT EXISTS idx_counselling_status ON public.counselling_requests (status);
CREATE INDEX IF NOT EXISTS idx_resources_request_id ON public.session_resources (request_id);
CREATE INDEX IF NOT EXISTS idx_tasks_request_id ON public.student_tasks (request_id);
CREATE INDEX IF NOT EXISTS idx_history_request_id ON public.session_history (request_id);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- (Using permissive anon policies while auth is being built. Tighten when auth is added.)
ALTER TABLE public.counselling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_counselling_requests" ON public.counselling_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_session_resources" ON public.session_resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_student_tasks" ON public.student_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_session_history" ON public.session_history FOR ALL USING (true) WITH CHECK (true);

-- ── Enable Realtime ───────────────────────────────────────────────────────────
-- Run these separately if above already ran:
ALTER PUBLICATION supabase_realtime ADD TABLE public.counselling_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_resources;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_history;

-- ── Storage Bucket ────────────────────────────────────────────────────────────
-- Create this via Dashboard > Storage or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('counselling-attachments', 'counselling-attachments', true);
-- CREATE POLICY "allow_public_uploads" ON storage.objects FOR ALL USING (bucket_id = 'counselling-attachments') WITH CHECK (bucket_id = 'counselling-attachments');
