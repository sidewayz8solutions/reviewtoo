# ReviewToo 🎓✨

**AI-Powered K-12 Lesson Planning**

An AI-powered education platform that generates comprehensive, engaging lesson plans for K-12 educators in seconds.

## Features

- 🤖 **AI-Powered Generation**: Uses Claude API to create detailed lesson plans
- 📚 **Comprehensive Content**: Includes objectives, materials, activities, assessments, and more
- 📄 **PDF Export**: Download lessons as beautifully formatted PDF documents
- 💾 **Save & Organize**: Personal library to store and manage all your lessons
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 🔐 **User Authentication**: Secure login with Supabase
- 🎯 **Grade-Specific**: Tailored content for Kindergarten through 12th grade

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Claude Sonnet 4 (Anthropic API)
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd learncraft-ai

# Install dependencies
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

#### Create Database Tables

Once your project is ready, go to the SQL Editor and run this SQL:

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

-- Create index for faster queries
CREATE INDEX lessons_user_id_idx ON lessons(user_id);
CREATE INDEX lessons_created_at_idx ON lessons(created_at DESC);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for lessons table
CREATE POLICY "Users can view their own lessons"
  ON lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lessons"
  ON lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lessons"
  ON lessons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lessons"
  ON lessons FOR DELETE
  USING (auth.uid() = user_id);
```

#### Get Your Supabase Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon)
2. Go to "API" section
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Get Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Go to "API Keys"
4. Click "Create Key"
5. Copy your API key

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Claude API (Server-side only)
ANTHROPIC_API_KEY=your-claude-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Replace the placeholder values with your actual credentials!

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your vercel URL)
6. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in Site settings
7. Deploy!

## File Structure

```
learncraft-ai/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/        # Main dashboard
│   ├── create/           # Lesson creation page
│   ├── library/          # Saved lessons
│   ├── api/              # API routes
│   ├── layout.js         # Root layout
│   ├── page.js           # Landing page
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utility functions
│   ├── supabase.js      # Supabase client & helpers
│   └── utils.js         # PDF generation & utilities
├── public/              # Static assets
├── .env.local           # Environment variables (create this!)
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── next.config.js       # Next.js configuration
```

## Supabase Database Schema

### `lessons` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| title | TEXT | Lesson title |
| grade_level | TEXT | Grade level (e.g., "1st Grade") |
| subject | TEXT | Subject (e.g., "Math") |
| prompt | TEXT | Original user prompt |
| content | JSONB | Full lesson plan JSON |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Usage Limits

**Free Tier:**

- 1 lesson total
- K-12 grade levels
- PDF export
- Save to library

**Pro Tier (Coming Soon):**

- Unlimited lessons
- K-12 grade levels
- Advanced customization
- Priority support

## Troubleshooting

### "Failed to generate lesson"
- Check your `ANTHROPIC_API_KEY` is correct
- Ensure you have credits in your Anthropic account
- Check API rate limits

### "Authentication required"
- Verify Supabase credentials in `.env.local`
- Check RLS policies are created correctly
- Make sure the lessons table exists

### "Cannot save lesson"
- Verify database connection
- Check user is authenticated
- Ensure RLS policies allow the operation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes!

## Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ by educators, for educators.

**LearnCraft AI - Where Every Lesson Comes Alive** ✨