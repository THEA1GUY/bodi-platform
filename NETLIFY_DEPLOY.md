# 🚀 Deploy BODI to Netlify + Render

## Quick Overview
- **Frontend**: Netlify (FREE, unlimited bandwidth)
- **Backend**: Render (FREE, 750 hours/month)
- **Total Time**: ~15 minutes
- **Total Cost**: $0

---

## Step 1: Push to GitHub (Already Done! ✅)

Your code is committed. Now push to GitHub:

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `bodi-platform`
3. Make it **Private** (for beta testing)
4. **Do NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 1.2 Push Your Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/bodi-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### 2.2 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select `bodi-platform` repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `bodi-backend` |
| **Region** | Frankfurt (closest to Nigeria) |
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### 2.3 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | Your actual Groq API key |
| `TAVILY_API_KEY` | `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` |

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. **Copy your backend URL**: `https://bodi-backend.onrender.com`

---

## Step 3: Deploy Frontend to Netlify (5 minutes)

### 3.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub

### 3.2 Deploy Frontend

#### Option A: Drag & Drop (Easiest)
1. In Netlify dashboard, click "Add new site" → "Deploy manually"
2. Drag and drop your `frontend` folder
3. Wait for deployment
4. Skip to Step 3.3

#### Option B: GitHub Integration (Recommended)
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select `bodi-platform` repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/.next` |

5. Click "Show advanced" → "New variable"
6. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://bodi-backend.onrender.com` (your backend URL from Step 2)

7. Click "Deploy site"

### 3.3 Get Your Frontend URL
- Netlify will give you a URL like: `https://random-name-123.netlify.app`
- You can customize it: Site settings → Domain management → Change site name
- Suggested: `bodi-platform` → `https://bodi-platform.netlify.app`

---

## Step 4: Update CORS Settings (2 minutes)

### 4.1 Update backend/main.py
Edit `backend/main.py` (around line 20):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bodi-platform.netlify.app",  # Your actual Netlify URL
        "https://*.netlify.app"  # Allow all Netlify preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Push Update
```bash
git add backend/main.py
git commit -m "Update CORS for Netlify deployment"
git push
```

Render will automatically redeploy your backend in 1-2 minutes.

---

## Step 5: Test Your Deployment (5 minutes)

### 5.1 Open Your App
Go to: `https://bodi-platform.netlify.app` (or your custom URL)

### 5.2 Test Features
- [ ] Homepage loads correctly
- [ ] Browse properties page works
- [ ] Click on a property to view details
- [ ] Chat with BODI works
- [ ] Search functionality works
- [ ] No errors in browser console (F12)

### 5.3 Check Backend
- [ ] Visit: `https://bodi-backend.onrender.com/docs`
- [ ] API documentation should load
- [ ] Try a test endpoint

---

## ✅ You're Live!

**Your URLs:**
- **Frontend**: `https://bodi-platform.netlify.app`
- **Backend**: `https://bodi-backend.onrender.com`
- **API Docs**: `https://bodi-backend.onrender.com/docs`

**Share with beta testers:** Send them your Netlify URL!

---

## 🎯 Why Netlify + Render?

### Netlify (Frontend):
✅ **Unlimited bandwidth** (no traffic limits!)  
✅ **Instant cache invalidation**  
✅ **Global CDN** (fast worldwide)  
✅ **Automatic HTTPS**  
✅ **Deploy previews** for every git branch  
✅ **Custom domains** (free)  

### Render (Backend):
✅ **Free tier** (750 hours/month)  
✅ **Auto-deploy** on git push  
✅ **Automatic HTTPS**  
✅ **Easy environment variables**  
✅ **Built-in logging**  

---

## 🔄 Updating Your App

### To Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push
```
Netlify auto-deploys in 1-2 minutes!

### To Update Backend:
```bash
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys in 2-3 minutes!

---

## 🐛 Troubleshooting

### Frontend shows blank page
**Solution**: 
1. Check Netlify build logs
2. Ensure `NEXT_PUBLIC_API_URL` is set correctly
3. Verify build command is `npm run build`

### API calls failing
**Solution**:
1. Check browser console for CORS errors
2. Verify backend URL in Netlify environment variables
3. Ensure CORS is updated in `backend/main.py`

### Backend not responding
**Solution**:
1. Check Render logs (click on service → Logs)
2. Verify environment variables are set
3. Ensure Groq and Tavily API keys are correct

### "Module not found" errors
**Solution**:
1. Check `requirements.txt` has all dependencies
2. Check `package.json` has all dependencies
3. Redeploy from scratch

---

## 💡 Pro Tips

### 1. Custom Domain (Optional)
**Netlify:**
- Buy domain on Namecheap (~$10/year)
- Add to Netlify: Site settings → Domain management
- Follow DNS setup instructions

**Render:**
- Custom domains available on paid plan ($7/mo)

### 2. Deploy Previews
- Every git branch gets its own preview URL on Netlify
- Perfect for testing features before merging

### 3. Environment Variables
- Never commit `.env` files
- Always use platform environment variables
- Prefix frontend vars with `NEXT_PUBLIC_`

### 4. Monitoring
- **Netlify Analytics**: Enable in site settings (free)
- **Render Logs**: Check regularly for backend errors
- **Browser Console**: Monitor for frontend errors

---

## 📊 Free Tier Limits

### Netlify:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Unlimited team members

### Render:
- ✅ 750 hours/month (enough for 1 service 24/7)
- ⚠️ Spins down after 15 min inactivity
- ⚠️ First request takes ~30 seconds to wake up

**Perfect for beta testing!**

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] Environment variables set
- [ ] CORS updated
- [ ] All features tested
- [ ] No errors in console
- [ ] Ready to share with beta testers!

---

## 📱 Share with Beta Testers

**Your live app**: `https://bodi-platform.netlify.app`

**Create feedback form**:
- Google Forms: https://forms.google.com
- Typeform: https://typeform.com

**What to ask testers**:
1. Can you browse properties?
2. Does the chat with BODI work?
3. Is the search helpful?
4. Any bugs or errors?
5. What would you improve?

---

## 🔧 Advanced: Netlify CLI (Optional)

For faster deployments:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from command line
cd frontend
netlify deploy --prod
```

---

## 📞 Resources

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Netlify Support**: https://answers.netlify.com
- **Render Support**: https://render.com/docs/support

---

**Ready to deploy? Follow the steps above and you'll be live in 15 minutes!** 🚀
