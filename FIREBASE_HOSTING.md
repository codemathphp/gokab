# Firebase Hosting Deployment Guide for GoKab MVP

## Prerequisites

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login to Firebase
firebase login
```

## Step 1: Initialize Firebase

```bash
# In project directory
firebase init

# Select options:
# ✔ Hosting
# ✔ Functions (optional)
# ✔ Emulators (optional)
# → Select your Firebase project (gokab-5b404)
# → Public directory: .next/out
# → Configure as SPA: Yes
```

## Step 2: Build Next.js

```bash
# Build for static export
npm run build

# This creates optimized build in .next/out directory
```

## Step 3: Deploy

```bash
# Deploy to Firebase Hosting
firebase deploy

# Or just hosting
firebase deploy --only hosting
```

## Step 4: View Your App

After deployment:
```
https://gokab-5b404.web.app
https://gokab-5b404.firebaseapp.com
```

## Configure Custom Domain

```bash
firebase hosting:domain:create
```

Then follow prompts to add your custom domain.

## Redeploy After Changes

```bash
# Make changes
git add .
git commit -m "Update"

# Rebuild
npm run build

# Redeploy
firebase deploy --only hosting
```

## View Deployment History

```bash
firebase hosting:channel:list
firebase hosting:clone
```

## Monitoring

In Firebase Console:
- Hosting → Deployment history
- Performance metrics
- Request logs
- Error tracking

---

**Setup Time**: ~5 minutes ⚡
