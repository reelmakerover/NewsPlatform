# IndiaInk — Full-Stack MERN News Platform

A premium, production-ready news and media platform with animated UI, admin panel, video reels, and full SEO optimization.

---

## 🗂 Project Structure

```
newsplatform/
├── server/          ← Node.js + Express + MongoDB backend
├── client/          ← React (Vite) public-facing website
└── admin/           ← React (Vite) admin dashboard
```

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

---

### Step 1 — Clone & Install

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

---

### Step 2 — Configure Environment

Copy and edit the server `.env` file:

```bash
cp server/.env server/.env.local
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/newsplatform
JWT_SECRET=change_this_to_a_long_random_string_in_production

CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Get these free at cloudinary.com → Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **MongoDB Atlas (cloud):** Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://username:password@cluster.mongodb.net/newsplatform`

> **Cloudinary:** Sign up free at cloudinary.com. Find your credentials in the Dashboard.
> Without Cloudinary, image upload won't work — but you can paste image URLs directly.

---

### Step 3 — Seed the Database

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin user: `admin@newsplatform.com` / `Admin@123`
- ✅ 4 categories: Technology, Business, Viral, Law & Policy
- ✅ 15 India-focused articles (fully written)
- ✅ 8 video entries

---

### Step 4 — Run All Three Services

Open **3 terminal windows**:

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
# ✅ Runs on http://localhost:5000
```

**Terminal 2 — Public Website:**
```bash
cd client
npm run dev
# ✅ Runs on http://localhost:5173
```

**Terminal 3 — Admin Panel:**
```bash
cd admin
npm run dev
# ✅ Runs on http://localhost:5174
```

---

## 🔐 Admin Login

| Field    | Value                       |
|----------|-----------------------------|
| URL      | http://localhost:5174       |
| Email    | admin@newsplatform.com      |
| Password | Admin@123                   |

**Change this password** after first login via MongoDB Compass or by adding a change-password API route.

---

## 🌐 Website Pages

| URL                          | Page              |
|------------------------------|-------------------|
| `/`                          | Home              |
| `/article/:slug`             | Article detail    |
| `/category/technology`       | Category filter   |
| `/category/business`         | Category filter   |
| `/category/viral`            | Category filter   |
| `/category/law`              | Category filter   |
| `/videos`                    | Vertical reels    |
| `/search?q=query`            | Search results    |
| `/about`                     | About page        |
| `/contact`                   | Contact page      |
| `/sitemap.xml`               | Auto-generated    |
| `/robots.txt`                | Auto-generated    |

---

## 🔧 Admin Panel Features

| Section    | Features                                              |
|------------|-------------------------------------------------------|
| Dashboard  | Stats overview, quick actions, recent articles         |
| Articles   | List, create, edit, delete, publish/draft toggle       |
| Videos     | List, add embed links, edit, delete                    |
| Categories | Create, edit, delete, color/icon customization         |

### Article Editor Features
- TipTap rich text editor (bold, italic, headings, blockquotes, lists, links, images)
- Thumbnail upload (Cloudinary) or URL paste
- YouTube video embedding
- SEO fields: meta title, description, keywords
- Live Google preview of SEO settings
- Featured / Trending toggles
- Draft → Publish workflow
- Auto word count and read-time estimate

---

## 📡 API Endpoints

### Public
```
GET  /api/articles               List published articles (pagination, filters)
GET  /api/articles/trending      Top articles by views
GET  /api/articles/:slug         Single article (increments view count)
GET  /api/categories             All categories with article counts
GET  /api/categories/:slug       Single category
GET  /api/videos                 Published videos
GET  /api/videos/:slug           Single video
GET  /api/search?q=query         Full-text search
GET  /api/search/suggestions?q=  Live search suggestions
GET  /sitemap.xml                Generated sitemap
GET  /robots.txt                 Robots file
```

### Protected (requires JWT Bearer token)
```
POST   /api/auth/login            Login
GET    /api/auth/me               Get current user
GET    /api/articles/admin        Admin article list (all statuses)
POST   /api/articles              Create article
PUT    /api/articles/:id          Update article
DELETE /api/articles/:id          Delete article (admin only)
POST   /api/articles/upload/thumbnail  Upload image to Cloudinary
POST   /api/videos                Create video
PUT    /api/videos/:id            Update video
DELETE /api/videos/:id            Delete video
GET    /api/videos/admin/all      Admin video list
POST   /api/categories            Create category (admin only)
PUT    /api/categories/:id        Update category (admin only)
DELETE /api/categories/:id        Delete category (admin only)
```

---

## 🚀 Production Deployment

### Backend (Railway / Render / Fly.io)

1. Push `server/` to GitHub
2. Connect to Railway/Render
3. Set environment variables in dashboard
4. Deploy — it auto-detects `npm start`

### Frontend (Vercel / Netlify)

**Client:**
```bash
cd client
npm run build
# Deploy /dist folder
# Set VITE_API_URL env var if backend is on separate domain
```

**Admin:**
```bash
cd admin
npm run build
# Deploy /dist folder to separate subdomain e.g. admin.yourdomain.com
```

### Update API base URL for production

In `client/src/utils/api.js` and `admin/src/utils/api.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // ...
})
```

Add to `.env` (client and admin):
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### MongoDB Atlas (Production)
1. Create free cluster at mongodb.com/atlas
2. Add IP whitelist: `0.0.0.0/0` (or your server IP)
3. Create database user
4. Copy connection string to `MONGODB_URI`

---

## 💰 Google AdSense Integration

Add to `client/index.html` in `<head>`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

Add ad units in `ArticlePage.jsx` — between content sections:
```jsx
<ins className="adsbygoogle" style={{display:'block'}}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto" />
```

---

## 📦 Tech Stack Summary

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, Framer Motion |
| Admin       | React 18, Vite, Tailwind CSS, TipTap |
| Backend     | Node.js, Express 4                  |
| Database    | MongoDB, Mongoose                   |
| Auth        | JWT (jsonwebtoken + bcryptjs)        |
| Images      | Cloudinary                          |
| SEO         | React Helmet Async, sitemap.xml      |
| Security    | Helmet, express-rate-limit, CORS     |

---

## 🎨 UI Features

- **Glassmorphism** nav and cards
- **Framer Motion** page transitions and scroll animations
- **Reading progress bar** on article pages
- **Infinite scroll** on home and category pages
- **Vertical reel scroll** on videos page (Instagram-style)
- **Breaking news ticker** in header
- **Auto-rotating hero** carousel
- **Skeleton loaders** on all data-fetching pages
- **Bookmark articles** (persisted in localStorage)
- **Share buttons** (Web Share API + clipboard fallback)
- **Live search suggestions** with debounce
- **SEO Google Preview** in admin editor
- **Responsive** mobile-first design

---

## 🛠 Customization

### Change branding
- `client/index.html` — page title
- `client/src/components/common/Layout.jsx` — logo text (search "IndiaInk")
- `admin/index.html` — admin title
- Colors: edit `tailwind.config.js` in both client and admin

### Add new categories
1. Go to Admin → Categories → New Category
2. Set name, color, and emoji icon
3. Articles will appear automatically

### Change admin password
Use MongoDB Compass or run:
```js
// In mongo shell
use newsplatform
db.users.updateOne({email:"admin@newsplatform.com"}, {$set:{password: await bcrypt.hash("newpassword", 12)}})
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `MongoDB connection error` | Check MONGODB_URI, ensure MongoDB is running locally |
| `Image upload fails` | Check Cloudinary credentials in .env |
| `CORS error` | Ensure CLIENT_URL and ADMIN_URL match your dev ports |
| `JWT invalid` | Clear localStorage in browser, re-login |
| `Seed fails` | Ensure MongoDB is running, check connection string |

---

## 📞 Support

Built for production use. MIT Licensed.

Default admin credentials: **admin@newsplatform.com / Admin@123**
Please change the password before deploying to production.
