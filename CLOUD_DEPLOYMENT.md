# 🚀 GoKab Cloud Deployment Guide

## 📋 Overview

Your GoKab MVP is now ready for cloud deployment! We'll use **Vercel** (recommended - easiest) or **Firebase Hosting**.

---

## 🔧 Step 1: Push to GitHub

### Prerequisites
- GitHub account (https://github.com)
- Git installed on your machine

### Instructions

#### 1a. Create a New Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `gokab-mvp`
3. Description: `Premium Taxi Application MVP`
4. **DO NOT** initialize with README (we have one)
5. Click "Create repository"

#### 1b. Get Your GitHub Remote URL
Copy the HTTPS URL (looks like):
```
https://github.com/YourUsername/gokab-mvp.git
```

#### 1c. Add Remote and Push
```bash
cd C:\Users\Codemathphp\Desktop\goKab
git remote add origin https://github.com/YourUsername/gokab-mvp.git
git branch -M main
git push -u origin main
```

### Verify Push
Visit: `https://github.com/YourUsername/gokab-mvp`

---

## 🟦 Option A: Deploy to Vercel (⭐ RECOMMENDED)

**Why Vercel?** - Fastest, easiest, optimized for Next.js, free tier works great

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- Opens browser
- Login/Signup with GitHub
- Authorize Vercel

### Step 3: Deploy from GitHub
```bash
cd C:\Users\Codemathphp\Desktop\goKab
vercel
```

### Step 4: Configure Deployment
When prompted:
```
? Set up and deploy "goKab"? yes
? Which scope? Your-Name
? Link to existing project? no
? What's your project's name? gokab-mvp
? In which directory? ./
? Want to override? no
```

### Step 5: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

Paste the values from `.env.local`:
- Firebase API Key
- Mapbox Token
- Google Maps Key

### Step 6: Deploy Production
```bash
vercel --prod
```

### ✅ Your App is Live!
URL: `https://gokab-mvp.vercel.app`

---

## 🔥 Option B: Deploy to Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase Project
```bash
firebase init hosting
```

When prompted:
```
? Which project? gokab-5b404 (use existing)
? Public directory? out
? Single page app? Yes
? Automatic builds with GitHub? No (for now)
```

### Step 4: Build for Firebase
```bash
npm run build
```

### Step 5: Deploy
```bash
firebase deploy --only hosting
```

### ✅ Your App is Live!
URL: `https://gokab-5b404.web.app`

---

## 🌐 Option C: GitHub Pages + Custom Domain

### Step 1: Configure for GitHub Pages
Edit `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```

### Step 2: Build & Deploy
```bash
npm run build
git add .
git commit -m "Build for GitHub Pages"
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to repo Settings
2. Pages → Source: GitHub Actions
3. Wait for deployment

---

## 🔗 Custom Domain (All Options)

### For Vercel
1. Domain Dashboard → Add Domain
2. Add DNS records
3. Link to project

### For Firebase
1. Firebase Console → Hosting
2. Add custom domain
3. Follow DNS setup

### For GitHub Pages
1. Settings → Pages → Custom Domain
2. Add DNS CNAME record
3. Verify ownership

---

## ✅ Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Auth flow works (phone + code)
- [ ] Rider can request rides
- [ ] Driver can onboard
- [ ] Admin dashboard accessible
- [ ] Maps render correctly
- [ ] Offline mode works
- [ ] PWA installs on mobile
- [ ] Environment variables set correctly
- [ ] Firebase rules configured

---

## 🧪 Test Your Deployed App

### Test Rider
1. Go to deployed URL
2. Select "Book a Ride"
3. Phone: `+263 77 123 4567`
4. Code will display
5. Request a ride

### Test Driver
1. Select "Become a Driver"
2. Phone: `+263 77 234 5678`
3. Fill vehicle info
4. Submit for approval

### Test Admin
1. Select "Admin Access"
2. Phone: `+263 77 999 9999`
3. Approve drivers

---

## 🔧 Troubleshooting Deployment

### Issue: Build Fails
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment Variables Missing
- Add to deployment platform's dashboard
- Restart deployment after adding

### Issue: Maps Not Working
- Verify Mapbox token is correct
- Check Google Maps API is enabled

### Issue: Database Connection Error
- Verify Firebase API key
- Check Firestore rules allow access

---

## 📊 Monitoring Your App

### Vercel Dashboard
- Deployments → View logs
- Analytics → Performance metrics
- Integrations → GitHub auto-deploy

### Firebase Console
- Hosting → View status
- Cloud Functions → View logs
- Firestore → Monitor database

---

## 🔄 Continuous Deployment

### Auto-Deploy on GitHub Push (Vercel)
1. Vercel Dashboard → Project Settings
2. Git → GitHub auto-deploy enabled (default)
3. Every push to `main` auto-deploys

### Auto-Deploy on GitHub Push (Firebase)
1. Firebase Console → Hosting
2. Connect Repository
3. Set branch to `main`
4. Select build configuration

---

## 🚀 Deployment Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use platform's secrets manager
   - Rotate keys periodically

2. **Performance**
   - Monitor Core Web Vitals
   - Enable caching headers
   - Optimize images

3. **Security**
   - Enable HTTPS (default on Vercel/Firebase)
   - Set CORS headers
   - Validate user input

4. **Monitoring**
   - Set up error logging
   - Monitor performance
   - Track user analytics

---

## 📈 Scaling the App

### When Traffic Grows
- Vercel: Auto-scales (no action needed)
- Firebase: Scales automatically
- Monitor billing to manage costs

### Database Optimization
- Index frequently queried fields
- Archive old data
- Use real-time listeners efficiently

---

## 💰 Estimated Costs

### Vercel (Free Tier Includes)
- 100 GB bandwidth/month
- Unlimited projects
- Unlimited builds
- Zero cold starts

### Firebase (Free Tier Includes)
- 5GB storage
- 50K read operations/day
- 20K write operations/day
- 20K delete operations/day

---

## 📞 Next Steps

1. ✅ Push to GitHub (done)
2. ⬜ Choose deployment platform (Vercel recommended)
3. ⬜ Deploy and test
4. ⬜ Monitor performance
5. ⬜ Set up continuous deployment

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Pages](https://pages.github.com)

---

## ✨ Summary

Your GoKab MVP is **production-ready**!

**Recommended Path:**
1. ✅ Initialize Git (done)
2. Push to GitHub
3. Deploy to Vercel (takes 2 minutes)
4. Monitor and scale

**Your app will be live in < 5 minutes!**

---

**Status**: 🟢 Ready for Cloud Deployment
**Date**: April 21, 2026
**Version**: 1.0.0 MVP
