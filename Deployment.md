# Deployment Guide for LearnCraft AI

## Prerequisites

Before deploying, make sure you have:

- ✅ Completed Supabase setup (see `SUPABASE_SETUP.md`)
- ✅ Your Claude API key from Anthropic
- ✅ Tested the app locally (`npm run dev`)
- ✅ Pushed your code to GitHub

## Option 1: Deploy to Vercel (Recommended)

Vercel is made by the creators of Next.js and offers the best performance.

### Step 1: Prepare for Deployment

1. Make sure your code is on GitHub
2. Ensure `.env.local` is in your `.gitignore` (it should be by default)
3. Test production build locally:
```bash
npm run build
npm start
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In the deployment screen, add these environment variables:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhb...` | Supabase Settings → API (anon key) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com |
| `NEXT_PUBLIC_APP_URL` | (leave empty for now) | Will add after deployment |

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://learncraft-ai.vercel.app`

### Step 5: Update App URL

1. Copy your deployment URL
2. Go to Vercel → Your Project → Settings → Environment Variables
3. Add or update: `NEXT_PUBLIC_APP_URL` = `https://your-project.vercel.app`
4. Redeploy from the Deployments tab

### Step 6: Configure Custom Domain (Optional)

1. Buy a domain (namecheap.com, godaddy.com, etc.)
2. In Vercel → Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Wait for DNS propagation (can take 24-48 hours)

---

## Option 2: Deploy to Netlify

### Step 1: Prepare Build

1. Install Netlify CLI (optional):
```bash
npm install -g netlify-cli
```

2. Add netlify.toml to project root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Netlify will detect Next.js automatically

### Step 3: Configure Build Settings

Build settings should be:
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: `netlify/functions`

### Step 4: Add Environment Variables

In Site settings → Environment variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### Step 5: Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Get your URL: `https://random-name.netlify.app`

### Step 6: Update App URL & Redeploy

1. Update `NEXT_PUBLIC_APP_URL` with your Netlify URL
2. Trigger a new deploy

---

## Post-Deployment Checklist

### Test Core Features

- [ ] Landing page loads correctly
- [ ] Sign up creates new user
- [ ] Login works with created user
- [ ] Dashboard displays correctly
- [ ] Create lesson generates content
- [ ] Save lesson works
- [ ] Library shows saved lessons
- [ ] PDF download works
- [ ] Sign out works

### Configure Supabase for Production

1. Go to Supabase Dashboard
2. Settings → API → URL Configuration
3. Add your production URL to allowed redirect URLs:
   - `https://your-domain.com/**`
   - `https://your-domain.vercel.app/**`

### Update Authentication URLs

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://your-production-url.com`
- **Redirect URLs**: Add your production domain

### Monitor Your Deployment

#### Vercel Monitoring
- Vercel Dashboard shows:
  - Build logs
  - Function logs
  - Analytics
  - Error tracking

#### Netlify Monitoring
- Netlify Dashboard shows:
  - Deploy logs
  - Function logs
  - Analytics

#### Supabase Monitoring
- Database → Reports: Query performance
- Auth → Users: User signups
- Database → Logs: Error tracking

---

## Troubleshooting Deployment Issues

### Build Fails on Vercel/Netlify

**Error**: `Module not found`
```bash
# Locally, run:
rm -rf node_modules
rm package-lock.json
npm install
npm run build
# Push to GitHub and retry
```

**Error**: `Environment variable not defined`
- Check all env variables are added correctly
- Ensure no spaces in variable values
- Redeploy after adding variables

### API Routes Not Working

**Error**: "API route not found" or 404 errors

**Solution**:
1. Verify file structure: `app/api/generate-lesson/route.js`
2. Check the route is exported as `POST` function
3. Ensure environment variables are set on production
4. Check Vercel/Netlify function logs

### Authentication Not Working

**Error**: "Invalid redirect URL"

**Solution**:
1. Go to Supabase → Authentication → URL Configuration
2. Add your production URL to redirect URLs:
   ```
   https://your-app.vercel.app/**
   ```
3. Clear browser cookies and try again

### Database Connection Issues

**Error**: "Failed to save lesson"

**Solution**:
1. Verify Supabase credentials in production env variables
2. Check RLS policies are active:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT * FROM pg_policies WHERE tablename = 'lessons';
   ```
3. Test with Supabase Logs: Database → Logs

### Claude API Not Responding

**Error**: "Failed to generate lesson"

**Solution**:
1. Verify `ANTHROPIC_API_KEY` is set correctly
2. Check API key is valid at console.anthropic.com
3. Ensure you have credits/active subscription
4. Check rate limits aren't exceeded
5. View errors in Vercel/Netlify function logs

---

## Scaling for Production

### Database Optimization

When you get more users:

1. **Add database indexes** (already done in setup):
```sql
CREATE INDEX IF NOT EXISTS lessons_user_id_idx ON lessons(user_id);
CREATE INDEX IF NOT EXISTS lessons_created_at_idx ON lessons(created_at DESC);
```

2. **Monitor query performance**:
   - Supabase Dashboard → Database → Query Performance

3. **Upgrade Supabase plan** when needed:
   - Free: 500MB database, 50K monthly active users
   - Pro: 8GB database, 100K MAU
   - Scale: Custom

### API Rate Limiting

Add rate limiting to protect your API:

```javascript
// lib/rateLimit.js
import { supabase } from './supabase'

export async function checkRateLimit(userId) {
  const { count } = await supabase
    .from('lessons')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30*24*60*60*1000).toISOString())
  
  return count < 5 // 5 lessons per month on free tier
}
```

### CDN & Caching

Both Vercel and Netlify provide:
- Automatic CDN for static assets
- Edge caching for API routes
- Automatic image optimization

### Monitoring & Analytics

**Add Vercel Analytics** (if using Vercel):
```bash
npm install @vercel/analytics
```

Add to `app/layout.js`:
```javascript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    
      
        {children}
        
      
    
  )
}
```

---

## Cost Estimates

### Free Tier (Perfect for Starting)

- **Vercel/Netlify**: Free
  - Includes: Hosting, CDN, SSL
  - Limits: 100GB bandwidth/month

- **Supabase**: Free
  - Includes: 500MB database, Auth, Storage
  - Limits: 50K MAU

- **Anthropic (Claude)**: ~$15 of free credits
  - After that: ~$0.003 per lesson generated

### Paid (When You Grow)

- **Vercel Pro**: $20/month
  - 1TB bandwidth, better support

- **Supabase Pro**: $25/month
  - 8GB database, better performance

- **Anthropic**: Pay-as-you-go
  - ~$0.003-0.015 per lesson

**Estimated monthly cost for 1,000 users**:
- Hosting: $20-45/month
- AI API: ~$150/month (assuming 5 lessons per user)
- **Total**: ~$170-200/month

---

## Security Checklist

Before going live:

- [ ] All API keys in environment variables (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase RLS policies enabled
- [ ] Authentication required for protected routes
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] CORS configured correctly
- [ ] Rate limiting implemented (optional for MVP)
- [ ] Error messages don't expose sensitive info

---

## Getting Your First Users

1. **Soft Launch**: Share with teacher friends for feedback
2. **Social Media**: Post on Twitter/LinkedIn with demo video
3. **Teacher Communities**: Share on Reddit (r/Teachers), Facebook groups
4. **Product Hunt**: Launch when you have good traction
5. **Email Marketing**: Collect emails with waitlist

---

## Support & Maintenance

### Monitor These Metrics

1. **User Signups**: Supabase → Auth → Users
2. **Lesson Generation**: Check API logs
3. **Errors**: Vercel/Netlify function logs
4. **Performance**: Page load times
5. **Database Size**: Supabase → Database → Usage

### Regular Maintenance

- Weekly: Check error logs
- Monthly: Review database performance
- Quarterly: Update dependencies
  ```bash
  npm outdated
  npm update
  ```

---

## Next Steps After Deployment

1. Set up error tracking (Sentry)
2. Add analytics (Google Analytics, Plausible)
3. Implement user feedback system
4. Create social media presence
5. Build email list
6. Add more features based on user feedback

---

**Congratulations on deploying LearnCraft AI! 🎉**

You now have a production-ready AI education platform!

For questions or issues, check:
- Vercel/Netlify support docs
- Supabase documentation
- Create an issue on GitHub