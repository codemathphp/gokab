# Vercel Setup Guide - Account Activation Fix

## Issue
Account activation was failing because environment variables weren't set in Vercel.

## Solution

### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your `gokab` project

### Step 2: Add Environment Variables
1. Go to **Settings → Environment Variables**
2. Add the following 3 variables:

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyCUHdxSrm1uBu-XC8Pj62JdkKPe8Z34-Eg
```

```
Name: NEXT_PUBLIC_MAPBOX_TOKEN
Value: pk.eyJ1IjoiY29kZW1hdGhwaHAiLCJhIjoiY21uY3h1YmpkMWJpdzJwcjZvczBmcTBpdSJ9.nkhqBvjrrqVBZrLJs0Qavw
```

```
Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
Value: AIzaSyCUHdxSrm1uBu-XC8Pj62JdkKPe8Z34-Eg
```

3. Click **Save**

### Step 3: Redeploy
- Vercel will show a "Redeploy" button
- Click it to redeploy with the new environment variables
- Wait for deployment to complete (2-3 minutes)

## Testing Account Activation

After deployment:

1. Open your Vercel app URL
2. Click "Book a Ride" 
3. Select a country
4. Enter any phone number (e.g., 501234567)
5. Click "Continue"
6. You'll see a 6-digit verification code on screen
7. Enter that code
8. Click "Activate Account"
9. You should be redirected to the home page ✅

## Troubleshooting

**If still getting errors:**
- Check browser console (F12 → Console tab) for error messages
- Verify all 3 environment variables are added correctly
- Make sure redeploy is complete (check Deployments tab)
- Try clearing browser cache (Ctrl+Shift+Delete)

**Firebase Features:**
- Account data is saved to Firebase
- If Firebase fails, app still works with localStorage
- Check Firestore quota in Firebase Console: https://console.firebase.google.com/
