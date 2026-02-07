# 🚀 BODI Platform - Deploy Now!

## ⚡ Quick Start (15 Minutes to Live)

### Your Platform is Ready:
✅ Frontend running on http://localhost:3000  
✅ Backend running on http://localhost:8000  
✅ Logo integrated across all pages  
✅ Groq API configured  
✅ Tavily API configured  
✅ All features working  

---

## 🎯 Deploy to Render (FREE)

### Step 1: Run Prep Script (2 min)
```powershell
cd c:\Users\Asus\OneDrive\Documents\Bodi\bodi-platform
.\prepare-deploy.ps1
```

### Step 2: Create GitHub Repo (3 min)
1. Go to https://github.com/new
2. Name: `bodi-platform`
3. Make it **Private**
4. Click "Create repository"

### Step 3: Push Code (2 min)
```bash
git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy Backend (4 min)
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your `bodi-platform` repo
4. Configure:
   - **Name**: `bodi-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `GROQ_API_KEY`: [your key]
   - `TAVILY_API_KEY`: `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`
6. Click "Create Web Service"
7. **Copy your backend URL**: `https://bodi-backend-XXXX.onrender.com`

### Step 5: Deploy Frontend (4 min)
1. Click "New +" → "Static Site"
2. Select `bodi-platform` repo
3. Configure:
   - **Name**: `bodi-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.next`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: [your backend URL from Step 4]
5. Click "Create Static Site"

### Step 6: Update CORS (2 min)
1. Edit `backend/main.py` (around line 20)
2. Add your frontend URL:
```python
allow_origins=[
    "http://localhost:3000",
    "https://bodi-frontend-XXXX.onrender.com",  # Your actual URL
    "https://*.onrender.com"
]
```
3. Push update:
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push
```

---

## ✅ You're Live!

**Your URLs:**
- Frontend: `https://bodi-frontend-XXXX.onrender.com`
- Backend: `https://bodi-backend-XXXX.onrender.com`
- API Docs: `https://bodi-backend-XXXX.onrender.com/docs`

**Share with beta testers:** Send them your frontend URL!

---

## 📚 Need More Help?

- **Detailed Guide**: Open `RENDER_DEPLOY.md`
- **Quick Checklist**: Open `DEPLOY_CHECKLIST.md`
- **Complete Summary**: Open `READY_TO_DEPLOY.md`

---

## 🔄 To Update Later

```bash
git add .
git commit -m "Your changes"
git push
```
Render auto-deploys in 2-5 minutes!

---

## 💰 Cost

**FREE** - Render free tier includes:
- 750 hours/month (enough for 24/7)
- Automatic HTTPS
- Auto-deploy on git push
- Perfect for beta testing!

---

**Ready? Run `.\prepare-deploy.ps1` to start!** 🚀
