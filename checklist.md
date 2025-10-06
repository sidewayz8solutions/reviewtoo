# Setup Checklist for LearnCraft AI

Use this checklist to ensure everything is set up correctly! ✅

## Phase 1: Project Setup

### 1.1 Create Project Folder
- [ ] Created folder `learncraft-ai`
- [ ] Opened folder in VS Code or your editor
- [ ] Opened terminal in project folder

### 1.2 Copy Files
- [ ] Created all files from artifacts (see PROJECT_STRUCTURE.md)
- [ ] Verified folder structure matches the guide
- [ ] All 24 files are in place

### 1.3 Install Dependencies
```bash
npm install
```
- [ ] No errors during installation
- [ ] `node_modules` folder created
- [ ] `package-lock.json` created

## Phase 2: Supabase Setup

### 2.1 Create Supabase Account
- [ ] Signed up at [supabase.com](https://supabase.com)
- [ ] Email verified
- [ ] Logged into dashboard

### 2.2 Create Project
- [ ] Clicked "New Project"
- [ ] Named project: `learncraft-ai` (or your choice)
- [ ] Chose region (closest to you)
- [ ] Created strong database password
- [ ] **SAVED PASSWORD SOMEWHERE SAFE**
- [ ] Waited for project setup (2-3 min)

### 2.3 Create Database Table
- [ ] Opened SQL Editor in Supabase
- [ ] Copied SQL from SUPABASE_SETUP.md
- [ ] Clicked "Run"
- [ ] Saw "Success. No rows returned"
- [ ] Verified table exists in Table Editor

### 2.4 Get API Credentials
- [ ] Went to Settings → API
- [ ] Copied Project URL
- [ ] Copied anon public key (starts with "eyJ...")
- [ ] **DID NOT copy service_role key**

## Phase 3: Claude API Setup

### 3.1 Create Anthropic Account
- [ ] Signed up at [console.anthropic.com](https://console.anthropic.com)
- [ ] Verified email
- [ ] Added payment method (required for API access)

### 3.2 Get API Key
- [ ] Went to API Keys section
- [ ] Created new key
- [ ] Named it: "LearnCraft AI"
- [ ] Copied key (starts with "sk-ant-")
- [ ] **SAVED KEY SOMEWHERE SAFE**

### 3.3 Verify API Access
- [ ] Checked you have credits/active subscription
- [ ] Noted current usage limits

## Phase 4: Environment Configuration

### 4.1 Create .env.local
- [ ] Created file `.env.local` in project root
- [ ] Added all required variables
- [ ] Replaced placeholder values with YOUR credentials
- [ ] No extra spaces or quotes
- [ ] File is NOT committed to git

### 4.2 Verify Environment Variables
Your `.env.local` should look like this (with YOUR values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Check:
- [ ] All 4 variables present
- [ ] No spaces around `=`
- [ ] No quotes around values
- [ ] URLs have `https://`
- [ ] Keys are complete (not truncated)

## Phase 5: Run the Application

### 5.1 Start Development Server
```bash
npm run dev
```

- [ ] Server started without errors
- [ ] Saw "Ready in Xms"
- [ ] Can open http://localhost:3000

### 5.2 Test Landing Page
- [ ] Landing page loads
- [ ] See "LearnCraft AI" logo
- [ ] See "Where Every Lesson Comes Alive"
- [ ] "Get Started" button visible
- [ ] No console errors (F12 → Console)

## Phase 6: Test Core Features

### 6.1 Test Signup
- [ ] Click "Get Started"
- [ ] Fill in signup form
- [ ] Submit form
- [ ] Account created successfully
- [ ] Redirected to dashboard
- [ ] See welcome message with your name

### 6.2 Verify Database
- [ ] Go to Supabase → Authentication → Users
- [ ] See your new user account
- [ ] Email matches what you signed up with

### 6.3 Test Login/Logout
- [ ] Click "Sign Out"
- [ ] Redirected to homepage
- [ ] Click "Log In"
- [ ] Enter credentials
- [ ] Successfully logged in
- [ ] Back on dashboard

### 6.4 Test Lesson Creation
- [ ] Navigate to "Create Lesson"
- [ ] Select grade level (e.g., "1st Grade")
- [ ] Select subject (e.g., "Math")
- [ ] Enter prompt: "Teaching addition with pictures"
- [ ] Click "Generate Lesson Plan"
- [ ] Wait for generation (15-30 seconds)
- [ ] Lesson displays successfully
- [ ] See all sections:
  - [ ] Learning Objectives
  - [ ] Materials
  - [ ] Introduction
  - [ ] Main Content
  - [ ] Activities
  - [ ] Assessment
  - [ ] Closure
  - [ ] Extensions

### 6.5 Test Save Feature
- [ ] Click "Save" button (while viewing lesson)
- [ ] No errors
- [ ] Redirected to library

### 6.6 Test Library
- [ ] See saved lesson in library
- [ ] Click on lesson card
- [ ] Modal opens with full lesson
- [ ] All content visible

### 6.7 Test PDF Download
- [ ] Click "Download PDF" button
- [ ] PDF file downloads
- [ ] Open PDF
- [ ] Content formatted correctly
- [ ] All sections present

### 6.8 Test Delete
- [ ] In library, click trash icon
- [ ] Confirm deletion
- [ ] Lesson removed from list
- [ ] Go to Supabase → Table Editor → lessons
- [ ] Verify lesson deleted from database

## Phase 7: Production Build Test

### 7.1 Build for Production
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No errors
- [ ] See "Compiled successfully"

### 7.2 Test Production Build
```bash
npm start
```
- [ ] Production server starts
- [ ] Can access http://localhost:3000
- [ ] All features work the same

## Troubleshooting Checklist

### If Signup/Login Fails

**Check:**
- [ ] Supabase credentials correct in `.env.local`
- [ ] Restarted dev server after adding `.env.local`
- [ ] No typos in environment variables
- [ ] Using "anon public" key, not "service_role"

**Try:**
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### If Lesson Generation Fails

**Check:**
- [ ] ANTHROPIC_API_KEY is correct
- [ ] Have credits at console.anthropic.com
- [ ] Internet connection working
- [ ] Check browser console for errors (F12)
- [ ] Check terminal for API errors

**Debug:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try generating lesson
4. Look for failed requests
5. Check error messages

### If Save Lesson Fails

**Check:**
- [ ] Logged in successfully
- [ ] Database table exists
- [ ] RLS policies created
- [ ] Supabase credentials correct

**Verify:**
1. Go to Supabase Dashboard
2. Table Editor → lessons
3. Table exists and has correct columns
4. Go to Authentication → Policies
5. See 4 policies for "lessons" table

### If Nothing Works

**Full Reset:**
```bash
# 1. Stop server (Ctrl+C)
# 2. Delete folders
rm -rf node_modules .next
# 3. Reinstall
npm install
# 4. Verify .env.local has correct values
# 5. Restart
npm run dev
```

## Common Errors & Solutions

### Error: "Module not found"
```bash
npm install
```

### Error: "Port 3000 already in use"
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill
# Windows:
netstat -ano | findstr :3000
# Then kill the PID
```

### Error: "fetch failed"
- Check internet connection
- Verify API keys are correct
- Check API service status

### Error: "Invalid API key"
- Verify no spaces in `.env.local`
- Ensure key copied completely
- Regenerate key if needed

### Error: "Row level security policy violation"
- RLS policies not created correctly
- Rerun policy SQL from SUPABASE_SETUP.md
- Check user is authenticated

## Final Verification

### Development Environment
- [ ] ✅ All files created
- [ ] ✅ Dependencies installed
- [ ] ✅ Supabase configured
- [ ] ✅ Claude API working
- [ ] ✅ Environment variables set
- [ ] ✅ App runs locally
- [ ] ✅ All features tested

### Ready for Deployment
- [ ] ✅ Production build works
- [ ] ✅ No console errors
- [ ] ✅ No console warnings
- [ ] ✅ All features functional
- [ ] ✅ Database working
- [ ] ✅ API calls successful

## Next Steps

1. **Customize** - Update branding, colors, content
2. **Deploy** - Follow DEPLOYMENT.md
3. **Test** - Thoroughly test deployed version
4. **Share** - Get feedback from teachers!

---

## Support Resources

- **Full Documentation**: README.md
- **Database Setup**: SUPABASE_SETUP.md
- **Deployment Guide**: DEPLOYMENT.md
- **Quick Start**: QUICKSTART.md
- **Project Structure**: PROJECT_STRUCTURE.md

## Need Help?

If you're stuck:
1. Check error messages carefully
2. Review troubleshooting sections
3. Verify all checkboxes above
4. Check Supabase/Anthropic status pages
5. Review documentation

---

**🎉 Congratulations on setting up LearnCraft AI!**

You now have a fully functional AI-powered education platform!