# 🔐 GOOGLE OAUTH ТОХИРГОО

## Алхам 1: Google Cloud Console дээр OAuth Client үүсгэх

1. **Google Cloud Console руу орох**: https://console.cloud.google.com/
2. Project үүсгэх эсвэл сонгох
3. **APIs & Services** → **Credentials** руу орох
4. **Create Credentials** → **OAuth 2.0 Client ID** сонгох
5. **Application type**: Web application
6. **Name**: Кино Сайт (эсвэл хүссэн нэр)
7. **Authorized redirect URIs** нэмэх:
   ```
   https://idjsawxmrfqymhedgkab.supabase.co/auth/v1/callback
   ```
8. **Create** дарах
9. **Client ID** болон **Client Secret** хадгалах

---

## Алхам 2: Supabase дээр Google Provider идэвхжүүлэх

1. **Supabase Dashboard** руу орох: https://supabase.com/dashboard
2. Өөрийн project сонгох
3. **Authentication** → **Providers** руу орох
4. **Google** олох, дараад **Enable** хийх
5. Google Cloud Console-с авсан мэдээллийг оруулах:
   - **Client ID**: [Google Cloud-с авсан Client ID]
   - **Client Secret**: [Google Cloud-с авсан Client Secret]
6. **Save** дарах

---

## Алхам 3: Redirect URL тохируулах (хэрэв development mode бол)

Development mode дээр localhost ашиглаж байгаа бол:

1. Google Cloud Console → Credentials → OAuth 2.0 Client ID засах
2. **Authorized redirect URIs** дээр нэмэх:
   ```
   http://localhost:5173/
   http://localhost:5174/
   ```
3. **Save** дарах

---

## ✅ Шалгах

1. Website дээр `/login` эсвэл `/signup` хуудас руу орох
2. **"Gmail-р нэвтрэх"** товч дарах
3. Google account сонгох
4. Зөвшөөрөл өгөх
5. Автоматаар нүүр хуудас руу буцаж ирэх ёстой

---

## 🔧 Troubleshooting

### Алдаа: "redirect_uri_mismatch"

**Шийдэл**: Google Cloud Console дээр redirect URI-г зөв оруулсан эсэхийг шалгах

### Алдаа: "Invalid client"

**Шийдэл**: Client ID болон Client Secret зөв эсэхийг шалгах

### Gmail нэвтрэлт амжилтгүй

**Шийдэл**:

1. Browser console (F12) дээр алдааг шалгах
2. Supabase logs шалгах: Dashboard → Logs → Auth Logs
3. Google OAuth consent screen approved эсэхийг шалгах

---

## 📝 Тэмдэглэл

- **Production** deployment хийхдээ production URL-г Google Cloud Console дээр нэмэх
- Google OAuth **verification** шаардлагатай байж болно (public app бол)
- Email address автоматаар `users` table-д хадгалагдана
- Default role: `user` (админ эрх гараар өгнө)

---

## 🔗 Холбогдох материал

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup](https://support.google.com/cloud/answer/6158849)
