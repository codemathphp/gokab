# GoKab MVP - Deployment & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- Mapbox account
- Google Maps API key

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create `.env.local` in root:
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_KEY_HERE
NEXT_PUBLIC_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY_HERE
```

3. **Run Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

4. **Build for Production**
```bash
npm run build
npm start
```

## 📱 Testing the App

### Test Rider Flow
1. Select "Book a Ride"
2. Enter phone: `+263 77 123 4567`
3. Code displayed: auto-verified
4. Navigate to rider home
5. Enter destination and request ride

### Test Driver Flow
1. Select "Become a Driver"
2. Enter phone: `+263 77 234 5678`
3. Fill vehicle details (all required)
4. Submit for approval
5. Redirected to waiting approval page

### Test Admin Flow
1. Select "Admin Access"
2. Enter phone: `+263 77 999 9999`
3. Access admin dashboard
4. Approve/reject pending drivers

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Set environment variables in Vercel dashboard
```

### Option 2: Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Build
npm run build

# Deploy
firebase deploy
```

### Option 3: Traditional Server

```bash
# Build
npm run build

# Run on any Node.js server
npm start
```

## 📊 Firebase Setup

### Collections to Create:
1. **users**
   - Document ID: phone number
   - Fields: phone, role, createdAt, lastLogin

2. **drivers**
   - Document ID: phone number
   - Fields: phone, status, online, location, vehicle

3. **rides**
   - Auto-generated document ID
   - Fields: riderId, driverId, status, pickup, dropoff, createdAt

4. **driverApplications**
   - Document ID: phone number
   - Fields: phone, vehicle data, status, createdAt

## 🗺️ Map Configuration

### Mapbox
- Get token: https://account.mapbox.com/tokens/
- Add URL to CORS whitelist

### Google Maps API
- Enable: Maps JavaScript API, Distance Matrix API, Geocoding API
- Create API key in Google Cloud Console
- Add to `.env.local`

## 🔒 Security Checklist

- [ ] CORS configured for all domains
- [ ] API keys restricted to project domain
- [ ] Firebase rules configured
- [ ] Service worker enabled
- [ ] HTTPS enabled in production
- [ ] Session tokens validated

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: '#FF7A3D',      // Main brand color
  secondary: '#2D2D2D',    // Dark text
  accent: '#00C651',       // Success green
}
```

### Branding
- Logo: `/public/main_logo.png`
- Icon: `/public/app_icon.png`
- Update in manifest.json

## 📱 PWA Installation

### On iOS
1. Open app in Safari
2. Tap Share
3. Select "Add to Home Screen"

### On Android
1. Open app in Chrome
2. Menu > "Install app"

## 🧪 Testing Checklist

- [ ] Auth flow works (phone + code)
- [ ] Rider can request rides
- [ ] Driver can go online/offline
- [ ] Admin can approve drivers
- [ ] Maps render correctly
- [ ] Offline mode works
- [ ] PWA installs on mobile
- [ ] Responsive on all screen sizes

## 🐛 Troubleshooting

### Maps not showing
- Check Mapbox token in `.env.local`
- Verify CORS settings
- Check browser console for errors

### Firebase errors
- Verify API key in `.env.local`
- Check Firebase collection names
- Verify Firestore rules

### Auth issues
- Clear localStorage: `localStorage.clear()`
- Check session storage
- Verify phone format

## 📞 Support

For issues:
1. Check browser console
2. Check network tab
3. Verify Firebase rules
4. Check API keys

## 🚀 Performance Tips

- Enable compression in Next.js
- Optimize images
- Use lazy loading
- Minimize bundle size

---

**Version**: 1.0.0 MVP
**Last Updated**: April 21, 2026
