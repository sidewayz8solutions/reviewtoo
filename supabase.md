# Supabase Setup Guide for LearnCraft AI

## Step-by-Step Instructions

### 1. Create Your Supabase Account & Project

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Name**: `learncraft-ai` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 2. Create the Database Table

Once your project is ready:

1. Click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste this ENTIRE SQL script:

```sql
-- Create lessons table
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX lessons_user_id_idx ON lessons(user_id);
CREATE INDEX lessons_created_at_idx ON lessons(created_at DESC);
CREATE INDEX lessons_grade_level_idx ON lessons(grade_level);
CREATE INDEX lessons_subject_idx ON lessons(subject);

-- Enable Row Level Security (RLS)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own lessons

-- Policy: Users can view their own lessons
CREATE POLICY "Users can view their own lessons"
  ON lessons FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own lessons
CREATE POLICY "Users can insert their own lessons"
  ON lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own lessons
CREATE POLICY "Users can update their own lessons"
  ON lessons FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own lessons
CREATE POLICY "Users can delete their own lessons"
  ON lessons FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" or press Ctrl+Enter
5. You should see "Success. No rows returned"

### 3. Configure Authentication

1. Click on "Authentication" in the left sidebar
2. Click on "Providers"
3. Make sure "Email" is enabled (it should be by default)
4. (Optional) Enable other providers if desired (Google, GitHub, etc.)

### 4. Get Your API Credentials

1. Click on "Settings" (gear icon) in the left sidebar
2. Click on "API"
3. You'll see two important values:

#### Project URL
- Copy the URL (looks like: `https://abcdefghijk.supabase.co`)
- This goes in your `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`

#### API Keys
- Find the "anon public" key
- Copy this long string
- This goes in your `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Update Your .env.local File

Create or update `.env.local` in your project root:

```bash
# Replace with YOUR actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Claude API Key (get from console.anthropic.com)
ANTHROPIC_API_KEY=your-claude-api-key-here

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Verify Your Setup

### Test Database Connection

1. Go to "Table Editor" in Supabase
2. You should see the "lessons" table
3. Click on it to see the columns:
   - id
   - user_id
   - title
   - grade_level
   - subject
   - prompt
   - content
   - created_at
   - updated_at

### Test Authentication

1. Run your app: `npm run dev`
2. Go to [http://localhost:3000](http://localhost:3000)
3. Click "Sign Up"
4. Create a test account
5. Check Supabase Dashboard → Authentication → Users
6. You should see your new user!

### Test Full Flow

1. Login to your app
2. Go to "Create Lesson"
3. Generate a lesson
4. Click "Save"
5. Go to Supabase Dashboard → Table Editor → lessons
6. You should see your saved lesson!

## Common Issues & Solutions

### "relation 'lessons' does not exist"
**Solution**: The table wasn't created. Go back to SQL Editor and run the CREATE TABLE script again.

### "new row violates row-level security policy"
**Solution**: RLS policies weren't created. Run the policy creation part of the SQL script again.

### "Authentication required"
**Solution**: 
- Check your `.env.local` has correct values
- Restart your dev server after changing `.env.local`
- Clear browser cache and cookies

### "Invalid API key"
**Solution**: 
- Make sure you copied the "anon public" key, not the "service_role" key
- Ensure no extra spaces in the `.env.local` file
- API key should start with "eyJ..."

## Security Notes

⚠️ **Important Security Information:**

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use the "anon" key** for public client access, NOT the service_role key
3. **Row Level Security (RLS)** ensures users can only access their own data
4. **Keep your database password safe** - You'll need it for direct database access

## Production Deployment

When deploying to Vercel/Netlify:

1. Add the same environment variables in your hosting dashboard
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Consider upgrading to Supabase Pro for better performance

## Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

---

That's it! Your Supabase database is now ready for LearnCraft AI! 🎉