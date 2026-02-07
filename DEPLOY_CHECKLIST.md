# ✅ Render Deployment Checklist

## Before You Start
- [ ] You have a GitHub account
- [ ] You have a Render account (https://render.com)
- [ ] You have your GROQ_API_KEY
- [ ] You have your TAVILY_API_KEY

---

## Deployment Steps

### 1. Push to GitHub
```bash
cd c:\Users\Asus\OneDrive\Documents\Bodi\bodi-platform
git init
git add .
git commit -m "Deploy BODI Platform"
git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend (Render)
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo: `bodi-platform`
4. Settings:
   - Name: `bodi-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - `GROQ_API_KEY`: [your key]
   - `TAVILY_API_KEY`: [your key]
6. Click "Create Web Service"
7. **Copy your backend URL**: `https://bodi-backend-XXXX.onrender.com`

### 3. Deploy Frontend (Render)
1. Click "New +" → "Static Site"
2. Select `bodi-platform` repo
3. Settings:
   - Name: `bodi-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`
4. Environment Variable:
   - `NEXT_PUBLIC_API_URL`: [your backend URL from step 2]
5. Click "Create Static Site"

### 4. Update CORS
1. Edit `backend/main.py` line ~20
2. Add your frontend URL to `allow_origins`:
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
   git commit -m "Update CORS"
   git push
   ```

### 5. Test
- [ ] Visit your frontend URL
- [ ] Browse properties
- [ ] Chat with BODI
- [ ] Check browser console for errors

---

## Your Live URLs
- Frontend: `https://bodi-frontend-XXXX.onrender.com`
- Backend: `https://bodi-backend-XXXX.onrender.com`
- API Docs: `https://bodi-backend-XXXX.onrender.com/docs`

---

## Share with Testers
Send them: `https://bodi-frontend-XXXX.onrender.com`

---

## Update Your App
```bash
git add .
git commit -m "Update message"
git push
```
Render auto-deploys in 2-5 minutes!

---

**Total Time: ~15 minutes**
**Cost: FREE**
