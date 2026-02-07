# 🚀 Deploy BODI to Render - Quick Guide

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com with GitHub)
- Your Groq API key
- Your Tavily API key

---

## Step 1: Push to GitHub (3 minutes)

### 1.1 Initialize Git (if not already done)
```bash
cd c:\Users\Asus\OneDrive\Documents\Bodi\bodi-platform
git init
git add .
git commit -m "Deploy BODI Platform to Render"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `bodi-platform`
3. Make it **Private** (for beta testing)
4. Click "Create repository"

### 1.3 Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect account"** if needed, then select your GitHub repo: `bodi-platform`

### 2.2 Configure Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `bodi-backend` |
| **Region** | Choose closest to Nigeria (e.g., Frankfurt or Singapore) |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### 2.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these two variables:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `your_actual_groq_api_key` |
| `TAVILY_API_KEY` | `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` |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Once deployed, copy your backend URL: `https://bodi-backend.onrender.com`

---

## Step 3: Deploy Frontend to Render (5 minutes)

### 3.1 Create Static Site
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select your `bodi-platform` repository

### 3.2 Configure Static Site

| Field | Value |
|-------|-------|
| **Name** | `bodi-frontend` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `.next` |

### 3.3 Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://bodi-backend.onrender.com` (your backend URL from Step 2) |

### 3.4 Deploy
1. Click **"Create Static Site"**
2. Wait 3-5 minutes for build
3. Your frontend will be live at: `https://bodi-frontend.onrender.com`

---

## Step 4: Update CORS Settings (2 minutes)

### 4.1 Update backend/main.py
Open `backend/main.py` and find the CORS middleware (around line 20).

Update it to include your Render frontend URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bodi-frontend.onrender.com",  # Add your actual Render URL
        "https://*.onrender.com"  # Allow all Render preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Push Update
```bash
git add backend/main.py
git commit -m "Update CORS for Render deployment"
git push
```

Render will automatically redeploy your backend in 1-2 minutes.

---

## Step 5: Test Your Deployment (5 minutes)

### 5.1 Open Your App
Go to: `https://bodi-frontend.onrender.com`

### 5.2 Test These Features
- [ ] Homepage loads
- [ ] Browse properties page works
- [ ] Click on a property to view details
- [ ] Try chatting with BODI
- [ ] Check landlord dashboard
- [ ] Try the search functionality

### 5.3 Check for Errors
1. Open browser console (F12)
2. Look for any red errors
3. If you see CORS errors, double-check Step 4

---

## 🎯 Your Live URLs

Once deployed, you'll have:

- **Frontend**: `https://bodi-frontend.onrender.com`
- **Backend API**: `https://bodi-backend.onrender.com`
- **API Docs**: `https://bodi-backend.onrender.com/docs`

---

## 📊 Render Free Tier Limits

✅ **What's Included (FREE)**:
- 750 hours/month (enough for 1 service running 24/7)
- Automatic HTTPS
- Auto-deploy on git push
- Custom domains supported

⚠️ **Limitations**:
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Perfect for beta testing!

---

## 🐛 Troubleshooting

### Frontend shows blank page
**Solution**: Check Render build logs for errors

### API calls failing
**Solution**: 
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend environment variables
2. Check backend is running at the URL you specified

### CORS errors in browser console
**Solution**: 
1. Update `allow_origins` in `backend/main.py`
2. Push changes: `git push`
3. Wait for Render to redeploy

### Backend shows "Application failed to respond"
**Solution**: 
1. Check Render logs (click on your backend service → Logs)
2. Verify environment variables are set correctly
3. Ensure `GROQ_API_KEY` and `TAVILY_API_KEY` are correct

### "Module not found" errors
**Solution**: Ensure `requirements.txt` includes all dependencies

---

## 🔄 Updating Your App

To update your deployed app:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push
```

Render will automatically:
1. Detect the push
2. Rebuild your app
3. Deploy the new version

Takes 2-5 minutes!

---

## 📱 Sharing with Beta Testers

Share this URL with your testers:
```
https://bodi-frontend.onrender.com
```

Create a feedback form:
- Google Forms: https://forms.google.com
- Typeform: https://typeform.com

Ask testers to:
1. Browse properties
2. Try chatting with BODI
3. Test the search feature
4. Report any bugs or issues

---

## 💡 Pro Tips

1. **Monitor Logs**: Check Render logs regularly for errors
2. **Keep It Simple**: For beta, the free tier is perfect
3. **Iterate Fast**: Push updates frequently based on feedback
4. **Custom Domain**: You can add a custom domain later (Settings → Custom Domains)

---

## 🎉 You're Live!

Your BODI platform is now deployed and accessible to anyone with the URL!

**Next Steps**:
1. ✅ Test all features yourself
2. ✅ Share with 5-10 beta testers
3. ✅ Collect feedback
4. ✅ Iterate and improve
5. ✅ Push updates with `git push`

---

**Questions? Check Render docs: https://render.com/docs**
