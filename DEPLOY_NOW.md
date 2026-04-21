# 🚀 GoKab Cloud Deployment - QUICK START

## ✅ You're Ready! Follow These Steps

### Step 1️⃣: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `gokab-mvp`
   - **Description**: `Premium Taxi Application MVP`
   - **Public** (select this)
3. **DO NOT** check "Initialize with README"
4. Click **"Create repository"**

**Copy the HTTPS URL** (you'll need it next)

---

### Step 2️⃣: Push Code to GitHub

Run these commands in PowerShell:

```bash
cd C:\Users\Codemathphp\Desktop\goKab

git remote add origin https://github.com/YourUsername/gokab-mvp.git

git branch -M main

git push -u origin main
```

**Replace `YourUsername` with your actual GitHub username**

---

### Step 3️⃣: Deploy to Vercel (EASIEST)

#### A. Install Vercel CLI
```bash
npm install -g vercel
```

#### B. Login to Vercel
```bash
vercel login
```
- Opens browser automatically
- Sign up with GitHub
- Authorize Vercel

#### C. Deploy
```bash
cd C:\Users\Codemathphp\Desktop\goKab
vercel
```

Follow prompts (default settings are fine):
```
? Set up and deploy? (Y/n) → Y
? Which scope? → Select your name
? Link to existing project? (y/N) → N
? What's your project's name? → gokab-mvp
? In which directory? (./  → press Enter
```

#### D. Set Environment Variables
When asked about sensitive variables:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

Paste these values when prompted:
- **Firebase**: `AIzaSyCUHdxSrm1uBu-XC8Pj62JdkKPe8Z34-Eg`
- **Mapbox**: `pk.eyJ1IjoiY29kZW1hdGhwaHAiLCJhIjoiY21uY3h1YmpkMWJpdzJwcjZvczBmcTBpdSJ9.nkhqBvjrrqVBZrLJs0Qavw`
- **Google Maps**: `AIzaSyCUHdxSrm1uBu-XC8Pj62JdkKPe8Z34-Eg`

#### E. Deploy to Production
```bash
vercel --prod
```

---

### ✨ Your App is LIVE! 🎉

You'll see a URL like:
```
https://gokab-mvp.vercel.app
```

---

## 🧪 Test Your Live App

### Open the URL in browser and test:

**As a Rider:**
1. Click "Book a Ride"
2. Enter phone: `+263 77 123 4567`
3. Code appears → Auto-verified
4. Request a ride!

**As a Driver:**
1. Click "Become a Driver"
2. Phone: `+263 77 234 5678`
3. Fill vehicle details
4. Submit

**As Admin:**
1. Click "Admin Access"
2. Phone: `+263 77 999 9999`
3. See driver approvals

---

## 🔄 Auto-Deploy on GitHub Updates

After first deployment, every push to GitHub automatically updates your live app!

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
# 🚀 Vercel auto-deploys!
```

---

## 📊 Monitor Your App

### Vercel Dashboard
- Go to https://vercel.com/dashboard
- Click your project
- View deployments, logs, analytics

### Your App Link
- https://gokab-mvp.vercel.app
- Share this URL with stakeholders!

---

## ❌ Troubleshooting

### "Command not found: vercel"
```bash
# Reinstall
npm install -g vercel
```

### "Build failed"
```bash
# Check locally first
npm install
npm run build
# If it works locally, Vercel should too
```

### "Environment variables missing"
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add the 3 keys manually
- Redeploy

### "Maps not showing"
- Verify Mapbox token is correct
- Check Google Maps API is enabled in Google Cloud

---

## 🎯 Alternative: Firebase Hosting

If you prefer Firebase instead of Vercel:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

Your app: https://gokab-5b404.web.app

---

## 📝 Commands Summary

```bash
# Initial setup (one time)
npm install -g vercel
vercel login
vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
vercel --prod

# After changes
git add .
git commit -m "message"
git push origin main
# Auto-deploys! ✨
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] App deployed to Vercel
- [ ] Environment variables set
- [ ] App is live and accessible
- [ ] Tested all three user roles
- [ ] Shared URL with team

---

## 🎉 You Did It!

Your **production-ready MVP** is now **LIVE ON THE INTERNET**!

**Share your app:**
- URL: https://gokab-mvp.vercel.app
- Email: codemathphp@gmail.com
- Show it to stakeholders, investors, or team!

---

## 📞 Support

- **Vercel Issues**: https://vercel.com/support
- **Firebase Issues**: Firebase Console
- **GitHub Issues**: Your repo's Issues tab

---

**Status**: 🟢 **DEPLOYED & LIVE**
**Date**: April 21, 2026
**Next**: Monitor, gather feedback, and iterate!
