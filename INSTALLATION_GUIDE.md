# 🎬 КИНО САЙТ - СУУЛГАХ ЗААВАР

Монгол оюутнуудад зориулсан бүрэн гарын авлага. GitHub-с татаж авсны дараа суулгах, тохируулах, ажиллуулах бүх алхмууд.

---

## 📋 АГУУЛГА

1. [Системийн шаардлага](#системийн-шаардлага)
2. [GitHub-с татаж авах](#github-с-татаж-авах)
3. [Суулгалт хийх](#суулгалт-хийх)
4. [Supabase тохиргоо](#supabase-тохиргоо)
5. [Google (Gmail) OAuth тохиргоо](#google-gmail-oauth-тохиргоо)
6. [Facebook холбох](#facebook-холбох)
7. [MEGA.nz видео тохиргоо](#meganз-видео-тохиргоо)
8. [Админ эрх олгох](#админ-эрх-олгох)
9. [Ажиллуулах](#ажиллуулах)
10. [Deployment (Production)](#deployment-production)

---

## 📦 СИСТЕМИЙН ШААРДЛАГА

Эдгээрийг урьдчилан суулгасан байх ёстой:

- ✅ **Node.js** (v18 эсвэл дээш) - https://nodejs.org/
- ✅ **Git** - https://git-scm.com/
- ✅ **Code Editor** (VS Code зөвлөж байна) - https://code.visualstudio.com/
- ✅ **Supabase бүртгэл** (үнэгүй) - https://supabase.com/
- ✅ **Google Account** (Gmail OAuth-д)
- ✅ **Facebook Account** (Member хүсэлт авахад)

**Шалгах:**

```bash
node --version    # v18.0.0 эсвэл дээш
npm --version     # 9.0.0 эсвэл дээш
git --version     # 2.30.0 эсвэл дээш
```

---

## 🔽 GITHUB-С ТАТАЖ АВАХ

### Алхам 1: Repository clone хийх

```bash
# Terminal/CMD нээгээд энэ командыг ажиллуулах
git clone https://github.com/[GITHUB_USERNAME]/[REPO_NAME].git

# Жишээ:
# git clone https://github.com/bayaraa/movie-site.git
```

### Алхам 2: Folder руу орох

```bash
cd movie-site
# эсвэл өөр нэр байвал түүнийг бич
```

---

## 📦 СУУЛГАЛТ ХИЙХ

### Алхам 1: Package суулгах

```bash
npm install
```

⏱️ **2-5 минут** орчим хугацаа шаардагдана.

### Алхам 2: .env файл үүсгэх

`.env` файл үүсгэж дараах агуулга оруулах:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Жишээ:**

```env
VITE_SUPABASE_URL=https://idjsawxmrfqymhedgkab.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **АНХААРУУЛГА:** Эдгээр key-г олон нийтэд БИТГИЙ түгээ!

---

## 🗄️ SUPABASE ТОХИРГОО

### Алхам 1: Supabase Project үүсгэх

1. https://supabase.com/ руу орж **Start your project** дарах
2. GitHub-аар нэвтрэх
3. **New project** дарах
4. **Organization** сонгох (эсвэл шинэ үүсгэх)
5. Дараах мэдээллийг оруулах:
   - **Name**: Кино Сайт (эсвэл хүссэн нэр)
   - **Database Password**: Хүчтэй нууц үг үүсгэх (хадгал!)
   - **Region**: Japan (Northeast Asia) - хурдан байна
   - **Pricing Plan**: Free
6. **Create new project** дарах

⏱️ **1-2 минут** project бэлэн болно.

### Алхам 2: Supabase URL болон Anon Key авах

1. Project dashboard дээр **Settings** (зүүн доод булан) → **API**
2. Дараах хоёрыг хуулах:
   - **Project URL** → `.env` файлын `VITE_SUPABASE_URL`
   - **anon public** key → `.env` файлын `VITE_SUPABASE_ANON_KEY`

### Алхам 3: Database Tables үүсгэх

1. Supabase dashboard → **SQL Editor** (зүүн цэс)
2. **New query** дарах
3. `COMPLETE_SETUP.sql` файлын агуулгыг хуулж буулгах
4. **RUN** (Ctrl+Enter) дарах

✅ **Амжилттай:** `Setup completed!` гэсэн мессеж гарна

**Юу үүссэн:**

- ✅ `users` table - Хэрэглэгчдийн мэдээлэл
- ✅ `movies` table - Киноны жагсаалт
- ✅ `get_user_role()` function - Role шалгах
- ✅ RLS policies - Security
- ✅ Storage bucket - Зураг хадгалах

---

## 🔐 GOOGLE (GMAIL) OAUTH ТОХИРГОО

Gmail-р нэвтрэх боломжийг идэвхжүүлэх.

### Алхам 1: Google Cloud Console дээр OAuth үүсгэх

1. **Google Cloud Console** руу орох: https://console.cloud.google.com/
2. Project үүсгэх:

   - Дээд хэсгээс **Select a project** → **New Project**
   - **Project name**: Кино Сайт
   - **Create** дарах

3. **OAuth consent screen** тохируулах:

   - Зүүн цэс: **APIs & Services** → **OAuth consent screen**
   - **User Type**: External
   - **Create** дарах
   - **App information**:
     - App name: Кино Сайт
     - User support email: Таны email
     - Developer email: Таны email
   - **Save and Continue** дарах (бусад хэсгийг skip хийх)

4. **Credentials үүсгэх**:
   - Зүүн цэс: **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - **Application type**: Web application
   - **Name**: Кино Сайт Web Client
   - **Authorized redirect URIs** нэмэх:
     ```
     https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
     ```
     Жишээ:
     ```
     https://idjsawxmrfqymhedgkab.supabase.co/auth/v1/callback
     ```
   - **Create** дарах
   - **Client ID** болон **Client Secret** хуулж хадгалах

### Алхам 2: Supabase дээр Google Provider идэвхжүүлэх

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** олж **Enable** хийх
3. Дараах мэдээллийг оруулах:
   - **Enabled**: ✅ checked
   - **Client ID**: Google Cloud-с авсан Client ID
   - **Client Secret**: Google Cloud-с авсан Client Secret
4. **Save** дарах

### Алхам 3: Development дээр тест хийх (localhost)

Google Cloud Console → Credentials → OAuth 2.0 Client засах → **Authorized redirect URIs** нэмэх:

```
http://localhost:5173/
http://localhost:5174/
```

✅ **Тест:** Website дээр `/login` руу орж "Gmail-р нэвтрэх" товч дарж үзэх

---

## 📘 FACEBOOK ХОЛБОХ

Member хүсэлт илгээхэд Facebook хуудас руу холбох.

### Одоогийн тохиргоо:

Код дээр аль хэдийн бэлэн байгаа:

```javascript
// BecomeMember.tsx
window.open("https://www.facebook.com/Ba1jir", "_blank");
```

### Өөрийн Facebook хуудас оруулах:

1. `src/pages/BecomeMember.tsx` файл нээх
2. Дараах мөрийг олж өөрийн Facebook link оруулах:

```javascript
window.open("https://www.facebook.com/[ТАНЫ_FACEBOOK_USERNAME]", "_blank");
```

**Жишээ:**

```javascript
window.open("https://www.facebook.com/monkhbayar", "_blank");
```

✅ **Тест:** Locked кино дарж `/become-member` хуудас руу орж "Facebook холбогдох" товч дарж үзэх

---

## 🎥 MEGA.NZ ВИДЕО ТОХИРГОО

MEGA.nz дээр видео upload хийж сайтандаа оруулах.

### Алхам 1: MEGA.nz дээр видео upload хийх

1. **MEGA.nz** руу орох: https://mega.nz/
2. Бүртгэл үүсгэх (үнэгүй 20GB)
3. **Upload** дарж видео файл оруулах
4. Upload дууссаны дараа видео дээр **right-click** → **Get link**
5. **Embed code** сонгох (эсвэл File link)

### Алхам 2: Link format шалгах

**MEGA.nz link хоёр төрөлтэй байна:**

✅ **Зөв (Embed format):**

```
https://mega.nz/embed/ABC123XY#DEF456ZW
```

❌ **Буруу (File format):**

```
https://mega.nz/file/ABC123XY#DEF456ZW
```

### Алхам 3: Admin панел дээр кино нэмэх

1. **Admin панел** → **Кино нэмэх**
2. **Видео URL** дээр MEGA.nz embed link оруулах
3. Эсвэл iframe tag бүтнээр хуулж буулга:

```html
<iframe src="https://mega.nz/embed/ABC123XY#DEF456ZW"></iframe>
```

**Система автоматаар:** `/file/` → `/embed/` хөрвүүлнэ!

### Бусад дэмжигдсэн платформууд:

- ✅ **YouTube** - Embed link эсвэл iframe
- ✅ **Google Drive** - Share link (автоматаар preview format руу хөрвөнө)
- ✅ **MEGA.nz** - Embed link эсвэл file link

---

## 👑 АДМИН ЭРХ ОЛГОХ

### Алхам 1: Эхний админ бүртгэх

1. Website дээр `/signup` руу орох
2. Дараах мэдээлэл оруулж бүртгүүлэх:
   ```
   Email: admin@test.com
   Password: 123456
   ```

### Алхам 2: Database дээр админ эрх өгөх

1. Supabase Dashboard → **SQL Editor**
2. Дараах query ажиллуулах:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@test.com';
```

3. **RUN** дарах

### Алхам 3: Browser cache цэвэрлэх

1. Browser Console (F12) нээх
2. Console tab дээр дараах кодыг ажиллуулах:

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Алхам 4: Дахин нэвтрэх

1. `/login` руу орох
2. `admin@test.com` / `123456` оруулж нэвтрэх
3. **"Админ"** цэс гарч ирнэ!

---

### Бусад хэрэглэгчид эрх өгөх

**Admin панел** дээр:

1. **Хэрэглэгчид** tab руу орох
2. Хэрэглэгч сонгож **Role** dropdown-с эрх солих:
   - 👤 **Хэрэглэгч** (user) - Үнэгүй кино үзнэ
   - ⭐ **Member** - Бүх кино үзнэ
   - 👑 **Админ** (admin) - Бүх эрх

---

## 🚀 АЖИЛЛУУЛАХ

### Development Mode (хөгжүүлэлт)

```bash
npm run dev
```

Website дараах хаягаар нээгдэнэ:

```
http://localhost:5173/
# эсвэл
http://localhost:5174/
```

### Портыг солих:

`vite.config.ts` файл дээр:

```javascript
export default defineConfig({
  server: {
    port: 3000, // Хүссэн порт
  },
});
```

---

## 🌐 DEPLOYMENT (PRODUCTION)

### Vercel дээр deploy хийх (ШӨНӨГҮЙ, хамгийн хялбар)

1. **GitHub repository** руу код push хийх:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Vercel** руу орох: https://vercel.com/
3. **GitHub-аар нэвтрэх**
4. **Import Project** дарах
5. **Repository сонгох**
6. **Environment Variables** оруулах:
   - `VITE_SUPABASE_URL`: [таны URL]
   - `VITE_SUPABASE_ANON_KEY`: [таны key]
7. **Deploy** дарах

⏱️ **2-3 минут** дүрс deploy болно.

### Google OAuth Production тохиргоо:

1. Google Cloud Console → Credentials → OAuth Client засах
2. **Authorized redirect URIs** нэмэх:

```
https://[таны-vercel-domain].vercel.app/
```

3. Supabase Dashboard → **URL Configuration** → **Site URL**:

```
https://[таны-vercel-domain].vercel.app
```

---

## ❓ ТҮГЭЭМЭЛ АСУУЛТ (FAQ)

### 1. "Module not found" алдаа гарч байна?

```bash
# node_modules устгаад дахин суулга
rm -rf node_modules package-lock.json
npm install
```

### 2. Supabase холболт алдаа?

- `.env` файл зөв байгаа эсэхийг шалгах
- `VITE_` prefix байгаа эсэхийг шалгах
- Server restart хий: `Ctrl+C` → `npm run dev`

### 3. Gmail нэвтрэлт ажиллахгүй байна?

- Google Cloud Console дээр redirect URI зөв эсэхийг шалгах
- Supabase дээр Google Provider идэвхтэй эсэхийг шалгах
- Client ID болон Secret зөв эсэхийг шалгах

### 4. Админ цэс харагдахгүй байна?

- Database дээр role `admin` эсэхийг шалгах
- Browser cache цэвэрлэх
- Дахин нэвтрэх

### 5. MEGA.nz видео тоглохгүй байна?

- Link `/embed/` format эсэхийг шалгах
- Browser дээр iframe support байгаа эсэхийг шалгах
- Chrome эсвэл Firefox ашиглаж үз

### 6. Зураг upload хийхэд алдаа гарч байна?

- Зургийн хэмжээ 5MB-с бага эсэхийг шалгах
- Format: JPG, PNG, WebP, GIF эсэхийг шалгах
- Supabase Storage policies зөв эсэхийг шалгах

---

## 📞 ТУСЛАМЖ ХЭРЭГТЭЙ ЮУ?

- 📧 Email: [таны email]
- 💬 Facebook: [таны facebook]
- 📖 Documentation: `README.md`, `GOOGLE_AUTH_SETUP.md`

---

## 📚 ХОЛБОГДОХ ФАЙЛУУД

- 📄 `README.md` - Ерөнхий мэдээлэл, tech stack
- 🔐 `GOOGLE_AUTH_SETUP.md` - Google OAuth дэлгэрэнгүй заавар
- 🗄️ `COMPLETE_SETUP.sql` - Database setup SQL
- ⚙️ `.env.example` - Environment variables жишээ

---

## ✅ ШАЛГАХ ЖАГСААЛТ

Суулгалт дууссаны дараа шалгах:

- [ ] `npm run dev` командаар server ажиллаж байна
- [ ] Browser дээр сайт нээгдэж байна
- [ ] Бүртгэл үүсгэх ажиллаж байна
- [ ] Нэвтрэх ажиллаж байна
- [ ] Gmail нэвтрэлт ажиллаж байна
- [ ] Админ панел харагдаж байна
- [ ] Кино нэмэх ажиллаж байна
- [ ] Зураг upload ажиллаж байна
- [ ] Видео тоглож байна
- [ ] Member хүсэлт Facebook руу холбогдож байна

---

**🎉 Амжилт хүсье! Асуулт байвал эргэж холбогдоорой.**

---

_Энэхүү заавар нь монгол оюутнуудад зориулан бичигдсэн. 2025 он._
