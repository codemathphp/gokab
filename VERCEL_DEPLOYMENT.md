# Vercel Deployment Guide for GoKab MVP

## Step 1: Push to GitHub

```bash
# Make sure you're in the project directory
cd c:\Users\Codemathphp\Desktop\goKab

# Add all files
git add .

# Commit with message
git commit -m "Final GoKab MVP - Production Ready"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/codemathphp/gokab.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel
```

### Option B: Using GitHub + Vercel Web

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose your GitHub repository
4. Set Project Name: `gokab`
5. Click "Import"

## Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY: AIzaSyCUHdxSrm1uBu-XC8Pj62JdkKPe8Z34-Eg
NEXT_PUBLIC_MAPBOX_TOKEN: pk.eyJ1IjoiY29kZW1hdGhwaHAiLCJhIjoiY21uY3h1YmpkMWJpdzJwcjZvczBmcTBpdSJ9.nkhqBvjrrqVBZrLJs0Qavw
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: AIzaSyCUHdxSrm1uBu-XC8Pj62JdkKPe8Z34-Eg
```

3. Click "Save"
4. Trigger redeploy

## Step 4: Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

## Access Your Live App

After deployment, you'll get a URL like:
```
https://gokab.vercel.app
```

Your app is now live! 🎉

## Continuous Deployment

Every time you push to GitHub:
```bash
git add .
git commit -m "Update message"
git push
```

Vercel will automatically rebuild and deploy!

## Monitoring

In Vercel Dashboard:
- View deployment logs
- Check performance metrics
- Monitor analytics
- View error logs

## Troubleshooting

### Build fails
- Check Build & Development Settings
- Verify Environment Variables
- Check package.json scripts

### Env variables not working
- Ensure NEXT_PUBLIC_ prefix
- Check variable names match exactly
- Redeploy after adding vars

### Maps not showing
- Verify Mapbox token is valid
- Check CORS settings in Mapbox
- Verify domain is added to allowlist

## Rollback Deployment

In Vercel Dashboard:
1. Deployments → Select previous deployment
2. Click "Promote to Production"

Your app rolls back instantly!

---

**Next Step**: Push to GitHub and deploy! 🚀
