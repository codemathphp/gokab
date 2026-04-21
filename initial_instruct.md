# GoKab MVP — AI Build Instructions

## 🎯 Goal

Build a **fully user-ready taxi application (production-feel, not placeholder/demo UI)** in ~2 hours using Next.js, Firebase, and map services. The system must be fully functional end-to-end with no fake screens or incomplete flows.
Build a **premium-looking taxi MVP web app (PWA-ready)** in ~2 hours using Next.js, Firebase, and map services. The system must support:

* Rider booking flow
* Driver onboarding + online status
* Admin driver verification
* Ride request dispatch (MVP level)
* Session-based login (NO SMS / NO OTP APIs)

---

# ⚙️ Core Stack

## Frontend

* Next.js (App Router preferred)
* Tailwind CSS for styling
* PWA enabled (offline support)

## Backend

* Firebase (Firestore only for database + realtime updates)
* No Firebase Auth (custom session system)

## Maps

* Mapbox for maps + navigation UI
* Google Maps API only for:

  * Distance calculation
  * Reverse geocoding (lat → address)

---

# 🔐 Authentication Model

## No OTP / No SMS / No WhatsApp

Use:

* Phone number as UNIQUE identifier
* "Account Linking Code" (simulated verification)

### Flow:

1. User enters phone number
2. System generates 6-digit code
3. Code is displayed in UI (NOT sent externally)
4. User enters code
5. Session is created and stored locally

### Session persistence:

* Store session in localStorage or cookies
* Auto-login on app reopen

---

# 👤 User Types

## Riders

* Phone-based onboarding
* Request rides
* View trip status

## Drivers

* Phone-based onboarding
* Manual admin approval required before activation
* Can toggle ONLINE/OFFLINE
* Receive ride requests in real time

## Admin

* Approve/reject drivers
* View all users
* Monitor ride activity

---

# 🚕 Ride System (MVP)

## Flow:

1. Rider requests ride
2. System finds online drivers (basic broadcast model)
3. Drivers receive request
4. First accept wins ride

---

# 🗺️ Map System

## Mapbox usage:

* Show rider location
* Show driver location
* Show route preview

## Google Maps usage:

* Distance calculation (km/time)
* Reverse geocoding (coordinates → address)

---

# 📶 Offline Capability (IMPORTANT)

## Requirements:

* App must still open without internet
* Cache last known session
* Cache last map view
* Show "Reconnecting..." state when offline

## Rules:

* No crashing when offline
* Queue actions locally if needed
* Sync when internet returns

---

# 🎨 UI / Design Rules

## MUST:

* Follow provided screenshots exactly
* Match colors, spacing, and layout style
* Maintain premium taxi-app feel (Uber-like)

## Design principles:

* Large touch targets
* Minimal text clutter
* Smooth transitions
* Card-based layout
* Bottom navigation for mobile feel

---

# 🧠 Account Linking System

## Naming:

DO NOT call it OTP
Use:

* "Account Linking"
* "Session Verification"

## Behavior:

* Code is generated and shown in UI
* User enters code manually
* System validates locally

---

# 🧾 Firebase Structure

## users/

* phone
* role (rider/driver)
* sessionActive
* createdAt

## drivers/

* phone
* status (pending/approved/rejected)
* online
* location
* vehicleId

## vehicles/

* driverId
* brand
* model
* color
* plates
* description

## rides/

* riderId
* driverId
* status
* pickupLocation
* dropoffLocation
* createdAt

## driverApplications/

* driverId
* licenseImageUrl
* carImages[]
* vehicleDetails (brand, model, color, plates)
* status (pending_review/approved/rejected)
* submittedAt

---

# 🚗 Driver Mode Switching & Onboarding Flow

## 🧭 Side Drawer Role Toggle

The app contains a side drawer that allows the user to toggle between:

* Rider Mode
* Driver Mode

---

## 🔁 Mode Switch Logic

### When switching to Driver Mode:

1. System checks if user has `driverApplication.status == approved`
2. If NOT approved → redirect to Driver Onboarding Flow
3. If approved → open Driver Dashboard (online/offline toggle, ride requests)

---

## 🧑‍✈️ Driver Onboarding Flow (MANDATORY)

If user is not an approved driver, they must complete onboarding:

### Step 1 — Personal Verification

* Phone number (pre-filled)
* Full name

### Step 2 — Driver’s License Upload

* Upload clear image of driver’s license

### Step 3 — Vehicle Verification

User must upload:

* Car front photo
* Car rear photo showing visible number plates

---

### Step 4 — Vehicle Details Form

User must enter:

* Brand (e.g. Toyota)
* Model (e.g. Corolla)
* Color
* License plate number
* Vehicle description (optional notes)

---

### Step 5 — Submission

System creates:

* driverApplication record
* status = `pending_review`

---

## 🧠 Admin Approval Requirement

* Admin must manually review all driver applications
* Only APPROVED drivers can:

  * go ONLINE
  * receive ride requests

---

## 🚫 HARD RULES FOR DRIVER SYSTEM

* No driver can access Driver Mode dashboard without approval
* No ride assignment to unapproved drivers
* No bypass of onboarding flow allowed
* All uploads must be stored and linked to driver profile

---

## 🔥 UX REQUIREMENT

* If user switches to Driver Mode without approval:

  * show onboarding screen immediately
  * clearly show progress steps
  * no dead-end screens allowed

## Collections:

### users/

* phone
* role (rider/driver)
* sessionActive

### drivers/

* phone
* status (pending/active/inactive)
* location
* online

### rides/

* riderId
* driverId
* status
* pickupLocation
* dropoffLocation

---

# 🚦 Driver Verification (Admin)

## Process:

* Drivers register
* Status = PENDING
* Admin manually approves in dashboard
* Only APPROVED drivers can go ONLINE

---

# ⚡ Performance Rules

* Avoid heavy renders
* Use realtime listeners only where needed
* Minimize Firebase reads
* Cache session and map data

---

# 📂 Project Structure

/app
/rider
/driver
/admin
/auth
/components
/lib
/services
/utils

---

# 🔥 Build Priority (2 Hour Sprint)

## Phase 1 (0–30 min)

* Setup Next.js project
* Setup Firebase connection
* Setup basic routing

## Phase 2 (30–90 min)

* Rider flow (phone → linking → home)
* Driver flow (pending → dashboard)
* Admin panel (approve drivers)

## Phase 3 (90–120 min)

* Map integration (Mapbox)
* Ride request flow
* Basic realtime updates

---

# 🚫 ZERO-DRIFT HARD RULES (CRITICAL)

The AI MUST strictly follow these rules with no exceptions:

## ❌ FORBIDDEN

* No demo pages
* No placeholder UI
* No fake buttons or non-functional screens
* No incomplete navigation paths
* No hardcoded mock flows that do not connect to state or data
* No “UI-only” screens without logic

## ✅ REQUIRED BEHAVIOR

* Every screen MUST be part of a real user flow (rider, driver, or admin)
* Every button MUST trigger a real state change, navigation, or backend call
* All data displayed MUST come from Firebase or defined local session state
* No dead ends in navigation (every screen must connect forward/back)
* All features MUST be usable in sequence (signup → verify → action)

## 🧠 SYSTEM DISCIPLINE RULE

The AI must prioritize:

1. Functional flow integrity
2. Data consistency
3. User journey completion
4. Minimal but complete implementation

NOT visual completeness without logic.

* DO NOT introduce Firebase Auth SMS
* DO NOT add unnecessary backend complexity
* DO NOT deviate from screenshots
* DO NOT over-engineer features

---

# 🎯 Final Objective

At the end of the build:

* Riders can complete full onboarding → request rides → track status
* Drivers can complete onboarding → get approved → go online → receive rides
* Admin can manage driver approvals in real time
* Ride matching works end-to-end
* App works as a fully functional system (not a UI prototype)
* App feels premium, fast, and cohesive on mobile (PWA-ready)

NO screen should exist without functional purpose in the system flow.

At the end of build:

* Riders can request rides
* Drivers can receive and accept rides
* Admin can approve drivers
* App works on mobile (PWA)
* App feels premium and smooth

---

# 🚀 Vision

This is a **production-feel MVP**, not a full production system.
Speed and clarity > complexity.

---

# 📡 Realtime Tracking System (UPDATED PARAMETERS)

## 🧭 Driver Location Update Logic

Using entity["software","Firebase","Google backend platform"]:

### 🔵 Active Trip Mode (Driver has accepted a ride)

* Location update interval: **every 3 seconds**
* Highest priority tracking mode
* Used for live rider ↔ driver movement on Mapbox

### 🟡 Idle Online Mode (Driver is online but no active trip)

* Location update interval: **every 5–10 seconds (adaptive)**
* Reduces battery and data usage

### 🔴 Offline Mode

* No location updates sent

---

## ⚙️ Smart Adaptive Rules (IMPORTANT)

* If driver is moving → use 3–5 second updates
* If driver is stationary → slow to 10–15 seconds
* If network is weak → reduce update frequency automatically

---

## 📍 Tracking Behavior Rules

* GPS updates MUST be automated (no manual input)
* Driver does NOT interact with tracking system
* App runs background location tracking continuously
* Only send updates when location changes significantly OR timer triggers

---

## 🗺️ Map Rendering Layer

Using Mapbox:

* Smooth marker interpolation (no jumpy movement)
* Route line between driver and rider
* Live ride progress visualization

---

## ☁️ Firebase Role in Tracking

* Stores latest driver coordinates
* Broadcasts updates to rider in real-time
* Acts as single source of truth for all movement data

---

## ⚡ Performance & Cost Rule

* Avoid unnecessary GPS writes
* Do not exceed 3-second updates globally for all drivers
* Prioritize movement-based updates over fixed intervals

---

# 🚀 FINAL SYSTEM BEHAVIOR SUMMARY

The app must behave as:

* Real-time ride system (perceived instant updates)
* Offline-resilient onboarding and session system
* Multi-channel ride intake (App + SMS fallback)
* Fully unified dispatch engine in Firebase

---

# 🧠 CORE PRINCIPLE

> The system must feel real-time to users, but operate efficiently under the hood with adaptive updates and controlled data flow.
