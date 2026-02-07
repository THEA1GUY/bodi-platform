# BODI Platform - Free Deployment Guide for Beta Testing

## 🚀 Quick Deployment Options (Ranked by Speed)

### Option 1: Vercel (Frontend) + Render (Backend) ⭐ **RECOMMENDED**
**Time to deploy: ~10 minutes**
**Cost: FREE**

#### Why This Combo?
- ✅ Zero configuration for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy environment variables
- ✅ GitHub integration with auto-deploys

#### Step-by-Step:

##### A. Deploy Frontend to Vercel

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   cd c:\Users\Asus\OneDrive\Documents\Bodi\bodi-platform
   git init
   git add .
   git commit -m "Initial commit - BODI Platform"
   ```

2. **Push to GitHub**:
   - Go to https://github.com/new
   - Create a new repository called `bodi-platform`
   - Follow the instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Go to https://vercel.com/signup
   - Sign up with GitHub
   - Click "New Project"
   - Import your `bodi-platform` repository
   - **Root Directory**: Set to `frontend`
   - Click "Deploy"
   - Done! Your frontend will be live at `https://your-project.vercel.app`

##### B. Deploy Backend to Render

1. **Go to Render**: https://render.com/
2. **Sign up** with GitHub
3. **Create New Web Service**:
   - Connect your GitHub repository
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
4. **Add Environment Variables**:
   - Click "Environment" tab
   - Add your `.env` variables:
     - `GEMINI_API_KEY`: Your Gemini API key
     - `TAVILY_API_KEY`: Your Tavily API key
5. **Deploy**: Click "Create Web Service"
6. Your backend will be live at `https://your-service.onrender.com`

##### C. Connect Frontend to Backend

1. **Update Frontend Environment**:
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-service.onrender.com`

2. **Update API calls in frontend**:
   - Replace all `http://localhost:8000` with `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'`

3. **Redeploy**: Vercel will auto-deploy on git push

---

### Option 2: Railway (Full Stack) 🚂
**Time to deploy: ~15 minutes**
**Cost: FREE (with $5 monthly credit)**

#### Why Railway?
- ✅ Deploy both frontend and backend together
- ✅ Built-in PostgreSQL database
- ✅ Simple CLI
- ✅ Auto-scaling

#### Steps:

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Deploy Frontend**:
   ```bash
   cd ../frontend
   railway init
   railway up
   ```

5. **Add Environment Variables** in Railway dashboard

---

### Option 3: Netlify (Frontend) + PythonAnywhere (Backend)
**Time to deploy: ~20 minutes**
**Cost: FREE**

#### Frontend (Netlify):
1. Go to https://netlify.com
2. Drag and drop your `frontend` folder
3. Done!

#### Backend (PythonAnywhere):
1. Sign up at https://www.pythonanywhere.com
2. Upload your backend code
3. Configure WSGI file
4. Set up environment variables

---

## 📋 Pre-Deployment Checklist

### 1. Update Environment Variables

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

Ensure `backend/.env` has:
```env
GEMINI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
DATABASE_URL=your_database_url  # If using external DB
```

### 2. Update CORS Settings

In `backend/main.py`, update CORS origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Update API Calls in Frontend

Create `frontend/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
```

Then replace all `fetch('http://localhost:8000/...')` with `apiClient.get('/...')`.

### 4. Database Setup (If Needed)

For production, consider:
- **Neon** (Free PostgreSQL): https://neon.tech
- **Supabase** (Free PostgreSQL + Auth): https://supabase.com
- **MongoDB Atlas** (Free NoSQL): https://www.mongodb.com/cloud/atlas

---

## 🎯 Recommended Setup for Beta Testing

**Frontend**: Vercel  
**Backend**: Render  
**Database**: SQLite (for now) or Neon (free PostgreSQL)

### Why?
1. **Zero cost** for beta testing
2. **Auto-deploys** on git push
3. **HTTPS** by default
4. **Easy to share** - just send the Vercel URL
5. **Scales automatically** if you get traffic

---

## 🔧 Quick Deploy Commands

### If using Vercel + Render:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Deploy Backend** (via Render dashboard or CLI)

---

## 📊 Monitoring & Analytics

### Free Tools for Beta Testing:

1. **Vercel Analytics** (built-in)
2. **Google Analytics** (free)
3. **Hotjar** (free tier for heatmaps)
4. **Sentry** (free error tracking)

---

## 🐛 Common Issues & Fixes

### Issue: "API calls failing in production"
**Fix**: Check CORS settings and ensure `NEXT_PUBLIC_API_URL` is set correctly

### Issue: "Environment variables not working"
**Fix**: Prefix frontend env vars with `NEXT_PUBLIC_` and redeploy

### Issue: "Database connection errors"
**Fix**: Ensure DATABASE_URL is set in backend environment variables

### Issue: "Build fails on Vercel"
**Fix**: Check that all dependencies are in `package.json` and `package-lock.json` is committed

---

## 🚀 Launch Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Database connected (if applicable)
- [ ] Test all major features
- [ ] Share beta link with testers
- [ ] Set up error tracking (Sentry)
- [ ] Monitor performance (Vercel Analytics)

---

## 📱 Sharing with Beta Testers

Once deployed, share:
- **App URL**: `https://your-app.vercel.app`
- **Feedback Form**: Create a Google Form for feedback
- **Known Issues**: List any known bugs
- **Testing Focus**: What features to test

---

## 💡 Pro Tips

1. **Use Vercel Preview Deployments**: Every git branch gets its own URL
2. **Enable Vercel Analytics**: Free insights into user behavior
3. **Set up GitHub Actions**: Auto-run tests before deployment
4. **Use Vercel Edge Functions**: For serverless API routes if needed
5. **Monitor Render Logs**: Check backend logs for errors

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app

---

**Ready to deploy? Start with Option 1 (Vercel + Render) - it's the fastest!**
