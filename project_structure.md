# Complete Project Structure

This document shows the **exact folder structure** you need to create for LearnCraft AI.

## 📁 Full Directory Tree

```
learncraft-ai/
│
├── app/                                    # Next.js 14 App Directory
│   ├── (auth)/                            # Auth route group
│   │   ├── login/
│   │   │   └── page.js                    # Login page
│   │   └── signup/
│   │       └── page.js                    # Signup page
│   │
│   ├── api/                               # API Routes
│   │   └── generate-lesson/
│   │       └── route.js                   # Lesson generation endpoint
│   │
│   ├── dashboard/                         # Dashboard routes
│   │   ├── layout.js                      # Dashboard layout with navbar
│   │   └── page.js                        # Dashboard home
│   │
│   ├── create/
│   │   └── page.js                        # Lesson creation page
│   │
│   ├── library/
│   │   └── page.js                        # Saved lessons library
│   │
│   ├── layout.js                          # Root layout
│   ├── page.js                            # Landing page
│   └── globals.css                        # Global styles
│
├── components/                            # React Components
│   └── Navbar.js                          # Navigation component
│
├── lib/                                   # Utility Functions
│   ├── supabase.js                        # Supabase client & helpers
│   └── utils.js                           # PDF generation & utilities
│
├── public/                                # Static Assets
│   └── (add your logo/images here)
│
├── .env.local                             # Environment variables (CREATE THIS!)
├── .gitignore                             # Git ignore file
├── next.config.js                         # Next.js configuration
├── package.json                           # Dependencies
├── postcss.config.js                      # PostCSS config
├── tailwind.config.js                     # Tailwind configuration
├── README.md                              # Main documentation
├── QUICKSTART.md                          # Quick start guide
├── SUPABASE_SETUP.md                      # Supabase setup guide
├── DEPLOYMENT.md                          # Deployment guide
└── PROJECT_STRUCTURE.md                   # This file
```

## 📝 Files You Need to Create

### Core Configuration Files (Root Directory)

1. **package.json** - Dependencies and scripts
2. **next.config.js** - Next.js configuration
3. **tailwind.config.js** - Tailwind CSS configuration
4. **postcss.config.js** - PostCSS configuration
5. **.gitignore** - Files to ignore in git
6. **.env.local** - Environment variables (YOU CREATE THIS!)

### App Directory Files

7. **app/layout.js** - Root layout with metadata
8. **app/page.js** - Landing page
9. **app/globals.css** - Global CSS styles

### Authentication Pages

10. **app/(auth)/login/page.js** - Login page
11. **app/(auth)/signup/page.js** - Signup page

### Dashboard Pages

12. **app/dashboard/layout.js** - Dashboard layout with navbar
13. **app/dashboard/page.js** - Dashboard home
14. **app/create/page.js** - Lesson creation page
15. **app/library/page.js** - Lesson library page

### API Routes

16. **app/api/generate-lesson/route.js** - AI lesson generation endpoint

### Components

17. **components/Navbar.js** - Reusable navigation component

### Library/Utilities

18. **lib/supabase.js** - Supabase client and database functions
19. **lib/utils.js** - Utility functions (PDF generation, etc.)

### Documentation

20. **README.md** - Main documentation
21. **QUICKSTART.md** - Quick start guide
22. **SUPABASE_SETUP.md** - Database setup instructions
23. **DEPLOYMENT.md** - Deployment guide
24. **PROJECT_STRUCTURE.md** - This file

## 🎨 File Categories

### Must Create Before Running
- ✅ `.env.local` - **You must create this with your API keys**
- ✅ All files listed above (provided in artifacts)

### Auto-Generated (Don't Create)
- `node_modules/` - Created by `npm install`
- `.next/` - Created by `npm run dev` or `npm run build`
- `package-lock.json` - Created by `npm install`

### Optional
- `public/logo.svg` - Add custom logo
- `public/favicon.ico` - Add custom favicon

## 📦 Installation Order

1. Create project folder: `learncraft-ai`
2. Copy all configuration files to root
3. Create folder structure:
   ```bash
   mkdir -p app/{auth,api/generate-lesson,dashboard,create,library}
   mkdir -p components lib public
   ```
4. Copy all files to their respective locations
5. Create `.env.local` with your credentials
6. Run `npm install`
7. Run `npm run dev`

## 🔍 Key Files Explained

### app/layout.js
- Root layout for entire app
- Loads fonts and global CSS
- Sets metadata

### app/page.js
- Landing page (public)
- Marketing content
- Sign up CTAs

### app/(auth)/login/page.js & signup/page.js
- Authentication pages
- Use Supabase for auth
- Redirect to dashboard after success

### app/dashboard/layout.js
- Protected layout for authenticated users
- Navigation bar
- Sign out functionality

### app/dashboard/page.js
- User dashboard
- Quick actions
- Recent lessons
- Stats

### app/create/page.js
- Main lesson creation interface
- Form for topic/grade/subject
- Displays generated lesson
- Save and download options

### app/library/page.js
- Shows all saved lessons
- Search and filter
- View, download, delete actions

### app/api/generate-lesson/route.js
- Server-side API route
- Calls Claude API
- Returns lesson JSON

### lib/supabase.js
- Supabase client initialization
- Auth helper functions
- Database CRUD operations

### lib/utils.js
- PDF generation with jsPDF
- Date formatting
- Other utilities

### components/Navbar.js
- Reusable navigation component
- Desktop and mobile versions
- Authentication state handling

## 🚀 Quick Command Reference

```bash
# Create all folders at once (Unix/Mac)
mkdir -p app/{auth/login,auth/signup,api/generate-lesson,dashboard,create,library} components lib public

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## ⚠️ Important Notes

1. **Route Groups**: The `(auth)` folder is a route group in Next.js 14. The parentheses mean it doesn't affect the URL structure.

2. **File Naming**: 
   - `page.js` = Route page
   - `layout.js` = Layout wrapper
   - `route.js` = API route

3. **Client Components**: Files with `'use client'` at the top are client components (use hooks, events, etc.)

4. **Server Components**: Files without `'use client'` are server components by default

5. **API Routes**: Must be in `app/api/` and named `route.js`

## 📱 Responsive Breakpoints

The app uses Tailwind's default breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🎨 Color Scheme

Primary colors defined in `tailwind.config.js`:
- Purple: `#a855f7` (primary)
- Pink: `#ec4899` (secondary)
- Blue: Used for accents

## 📊 Data Flow

```
User Input → Create Page
          ↓
     API Route (Claude API)
          ↓
    Generated Lesson
          ↓
  Save to Supabase (optional)
          ↓
    Display/Download
```

---

**Now you have the complete blueprint! 🎉**

Follow the file structure exactly and you'll have a fully functional app!