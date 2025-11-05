-- ═══════════════════════════════════════════════════════════════════
-- 🎬 ШИНЭ КИНО САЙТ - БҮРЭН СУУРИЛУУЛАЛТ
-- Энэ SQL-г Supabase SQL Editor дээр ажиллуулах
-- ═══════════════════════════════════════════════════════════════════

-- ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
-- ┃  АЛХАМ 1: TABLES ҮҮСГЭХ                                        ┃
-- ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (
        role IN ('admin', 'member', 'user')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movies table
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
-- ┃  АЛХАМ 2: RPC FUNCTION (Role авах функц)                       ┃
-- ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
-- ┃  АЛХАМ 3: AUTO USER CREATION TRIGGER                           ┃
-- ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

-- Function: Signup хийхэд автоматаар users table-д нэмэх
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auth хэрэглэгч үүсэхэд ажиллана
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
-- ┃  АЛХАМ 4: RLS ТОХИРГОО (Row Level Security)                    ┃
-- ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

-- Users table: RLS УНТРААХ (infinite recursion-ийг засах)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Movies table: RLS ИДЭВХЖҮҮЛЭХ
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Бүх хуучин policies устгах
DROP POLICY IF EXISTS "movies_select_all" ON public.movies;

DROP POLICY IF EXISTS "movies_insert_admin" ON public.movies;

DROP POLICY IF EXISTS "movies_update_admin" ON public.movies;

DROP POLICY IF EXISTS "movies_delete_admin" ON public.movies;

-- Хэн ч кино унших боломжтой
CREATE POLICY "movies_select_all" ON public.movies FOR
SELECT TO authenticated, anon USING (true);

-- Зөвхөн admin кино нэмэх
CREATE POLICY "movies_insert_admin" ON public.movies FOR
INSERT
    TO authenticated
WITH
    CHECK (
        (
            SELECT role
            FROM public.users
            WHERE
                id = auth.uid ()
        ) = 'admin'
    );

-- Зөвхөн admin кино засах
CREATE POLICY "movies_update_admin" ON public.movies FOR
UPDATE TO authenticated USING (
    (
        SELECT role
        FROM public.users
        WHERE
            id = auth.uid ()
    ) = 'admin'
);

-- Зөвхөн admin кино устгах
CREATE POLICY "movies_delete_admin" ON public.movies FOR DELETE TO authenticated USING (
    (
        SELECT role
        FROM public.users
        WHERE
            id = auth.uid ()
    ) = 'admin'
);

-- ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
-- ┃  АЛХАМ 5: STORAGE ТОХИРГОО (Зураг Upload)                      ┃
-- ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

-- Movie thumbnails хадгалах bucket үүсгэх
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'movie-thumbnails',
  'movie-thumbnails',
  true,
  5242880, -- 5MB хязгаар
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Бүх хуучин storage policies устгах
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload thumbnails" ON storage.objects;

DROP POLICY IF EXISTS "Admins can delete thumbnails" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;

-- Хэн ч зураг үзэх боломжтой (Public read)
CREATE POLICY "Anyone can view thumbnails" ON storage.objects FOR
SELECT USING (
        bucket_id = 'movie-thumbnails'
    );

-- Зөвхөн admin зураг upload хийх
CREATE POLICY "Admins can upload thumbnails" ON storage.objects FOR
INSERT
    TO authenticated
WITH
    CHECK (
        bucket_id = 'movie-thumbnails'
        AND (
            SELECT role
            FROM public.users
            WHERE
                id = auth.uid ()
        ) = 'admin'
    );

-- Зөвхөн admin зураг устгах
CREATE POLICY "Admins can delete thumbnails" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'movie-thumbnails'
    AND (
        SELECT role
        FROM public.users
        WHERE
            id = auth.uid ()
    ) = 'admin'
);

-- ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
-- ┃  ✅ СУУРИЛУУЛАЛТ ДУУССАН!                                      ┃
-- ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

-- Шалгах queries:
SELECT 'Setup completed!' as status;

SELECT table_name
FROM information_schema.tables
WHERE
    table_schema = 'public';

SELECT * FROM storage.buckets WHERE id = 'movie-thumbnails';

-- ═══════════════════════════════════════════════════════════════════
-- 📝 ДАРААГИЙН АЛХМУУД:
-- ═══════════════════════════════════════════════════════════════════
--
-- 1. ✅ Энэ SQL-г Supabase SQL Editor дээр RUN хий
-- 2. 🔐 Website дээр Signup хий: anulkhagvazaya5@test.com / 1234567
-- 3. 📊 Supabase SQL Editor дээр дараах SQL-г ажиллуул:
--
--    UPDATE public.users
--    SET role = 'admin'
--    WHERE email = 'anulkhagvazaya5@test.com';
--
-- 4. 🧹 Browser Console (F12) дээр:
--    localStorage.clear();
--    sessionStorage.clear();
--    location.reload();
-- 5. 🎥 Website дээр дахин Login хий: anulkhagvazaya5@test.com / 1234567   

--      ✔️ Кино нэмэх, засах, устгах боломжтой эсэхийг шалга!       
-- 6. 👑 "Админ" цэс болон "📁 Зураг Upload" товч гарна!
--
-- ═══════════════════════════════════════════════════════════════════