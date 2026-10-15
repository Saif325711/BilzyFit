# BliqFit — Gym & Fitness Management ERP

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_12.x-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

**BliqFit** (`fit.bliq.in`) is an enterprise-grade Gym and Fitness Center ERP & SaaS platform engineered to automate gym operations, streamline member lifecycle management, accelerate revenue collection, and provide an integrated digital experience for staff and members.

---

## 🌟 Key Features & Modules

### 🏋️‍♂️ Member Lifecycle Management
- **Centralized Member Directory**: Instant search, status filtering (Active, Expiring, Overdue, Expired, Inactive), and tag-based sorting.
- **Comprehensive Profiles**: Medical notes, emergency contacts, subscription history, fitness goals, and attendance records.
- **Multi-Step Onboarding**: Streamlined form to register members, assign membership packages, apply discounts, and configure payment methods.

### 📱 Self-Service QR Check-In & Attendance
- **Live QR Kiosk (`/attendance/qr`)**: Interactive webcam/camera check-in scanner powered by `jsqr` for contactless front-desk check-in.
- **Digital Member Badge**: Members access dynamic QR codes on their mobile portal for quick entry validation.
- **Footfall & Peak-Hour Analytics**: Daily attendance logs, check-in timestamps, manual override support, and peak-hour heatmaps.

### 💳 POS, Billing & Financial Operations
- **Gym Point of Sale (POS)**: Sell memberships, personal training packages, supplements, and merchandise.
- **GST / Tax Invoices**: Automated printable receipts and invoices with customizable tax breakdown, terms, and branding.
- **Expense & Cash Flow Tracking**: Categorized expense entries (Rent, Utilities, Maintenance, Salaries) and daily cash drawer reconciliation.
- **Financial Analytics**: Real-time revenue charts (MRR, collection rates, overdue dues, cash vs. digital payments) powered by Recharts.

### 📋 Custom Workouts & Nutrition Planning
- **Workout Routine Designer**: Build exercise templates broken down by day, muscle groups, sets, repetitions, and rest intervals.
- **Diet & Nutrition Templates**: Create customized meal plans with target calories, macro breakdowns (Protein, Carbs, Fats), and hydration guidelines.
- **Direct Assignment**: Assign routines and diet schedules directly to member accounts in real time.

### 🎯 Leads & Sales CRM
- **Pipeline Stages**: Visual lead management across stages (New Inquiry → Contacted → Trial Scheduled → Converted → Lost).
- **Follow-up Reminders**: Scheduled notifications and interaction history to maximize prospect conversions.

### 🏢 Staff, Trainers & Multi-Branch Operations
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Gym Owners, Managers, Receptionists, Trainers, and Members.
- **Trainer Allocation**: Assign trainers to personal training clients and monitor assigned rosters.
- **Multi-Branch Operations**: Facility switcher, locker assignments, and gym equipment maintenance logs.

### 💬 Messaging & WhatsApp Automation
- **Direct WhatsApp Messaging**: 1-click WhatsApp messaging for payment reminders, expiry warnings, and welcome notes.
- **Broadcast Announcements**: Send bulk updates, schedule changes, and promotions to all or targeted members.

### 📲 Embedded Member Portal (`/portal`)
- Mobile-first, responsive member portal providing:
  - Digital membership card with dynamic QR pass
  - Real-time attendance history and visit streak
  - Assigned workout routines and daily meal plans
  - Payment records and downloadable receipts
  - Goal progress tracking and metrics

---

## ⚡ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8, React Router v7 |
| **Styling & Design System** | Tailwind CSS v3, PostCSS, Lucide React icons |
| **Data Visualization** | Recharts (Revenue, Attendance, and Member Growth Charts) |
| **QR Code Engine** | `qrcode` (badge generation), `jsqr` (camera scanner) |
| **State & Persistence** | React Context (`AuthContext`, `DataContext`), LocalStorage (offline-first) |
| **Cloud Real-Time Sync** | Firebase Cloud Firestore v12 (multi-collection real-time sync) |
| **Local File Sync** | Vite Dev Middleware Plugin (`workspaceSyncPlugin.js`) syncing `.bilzyfit-sync/` |
| **Linter & Code Quality** | Oxlint |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

Clone the repository and install dependencies:

```bash
cd BliqFit
npm install
```

### Environment Configuration (Optional)

BliqFit runs out-of-the-box in offline-first mode with seed demo data. To enable real-time cloud sync with Firebase Firestore:

1. Create a `.env` file from the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Add your Firebase project credentials from the [Firebase Console](https://console.firebase.google.com/):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

The web dashboard will be available at [http://localhost:5173](http://localhost:5173).

### Production Build & Linting

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run Oxlint
npm run lint
```

---

## 🔐 Demo Credentials

Use any of the following accounts on the Login page (`/login`):

| Role | Email / Name | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Gym Owner** | `owner@gym.com` | `password` | Full unrestricted access to all modules, finance & settings |
| **Manager** | `Priya Sharma` *(or `manager@gym.com`)* | `password` | Dashboard, members, attendance, plans, leads, operations |
| **Trainer** | `Sneha Patel` *(or `trainer@gym.com`)* | `password` | Dashboard, members, workout builder, diet designer |
| **Receptionist** | `Rohan Das` *(or `reception@gym.com`)* | `password` | Front desk, QR check-in, billing, member registrations |
| **Member** | `member@gym.com` | `password` | Member Portal (`/portal`) |

> 💡 **Quick Demo Fill**: The login page contains 1-click quick-fill buttons to test staff logins instantly without manual typing.

---

## 📁 Project Directory Structure

```text
BliqFit/
├── index.html                     # Root HTML entry
├── vite.config.js                 # Vite configuration with sync middleware
├── tailwind.config.js             # Tailwind design tokens & themes
├── package.json                   # Project scripts and dependencies
│
├── public/                        # Static assets, manifests, icons
│   ├── favicon.svg
│   ├── icons.svg
│   └── manifest.json
│
├── server/                        # Vite Dev Server Plugins
│   └── workspaceSyncPlugin.js     # Local JSON workspace persistence middleware
│
├── member-app/                    # Standalone Member Portal Components
│   ├── MemberApp.jsx              # Main member application shell
│   ├── components/                # Bottom navigation, workout view, check-in tile
│   └── hooks/                     # Member session & data hooks
│
└── src/
    ├── main.jsx                   # React entry point
    ├── App.jsx                    # Route definitions & permission guards
    ├── index.css                  # Global styles & Tailwind directives
    ├── assets/                    # Brand logos and banners
    ├── components/
    │   ├── common/                # ErrorBoundary, alerts
    │   ├── feedback/              # Modals, ToastStack, ConfirmDialog
    │   ├── layout/                # MainLayout, Sidebar, TopNav
    │   ├── ui/                    # Button, Input, Modal, Table, Badge, Card
    │   └── charts/                # BarChart, LineChart, DonutChart (Recharts)
    ├── context/
    │   ├── AuthContext.jsx        # RBAC, user sessions, authentication
    │   ├── DataContext.jsx        # Global data provider & cache
    │   └── FeedbackContext.jsx    # Toast notifications & dialog state
    ├── data/
    │   ├── seed.js                # Default demo dataset & sample gym records
    │   ├── services.js            # CRUD data service layer & local sync
    │   └── sync.js                # Workspace export, import & sync adapters
    ├── firebase/
    │   ├── config.js              # Firebase SDK initialization
    │   └── firestoreService.js    # Firestore real-time listeners & cloud sync
    ├── hooks/
    │   └── useLocalStorage.js     # Reactive local storage hook
    └── pages/
        ├── Landing.jsx            # Public marketing & pricing landing page
        ├── Login.jsx              # Multi-role authentication & staff quick login
        ├── Dashboard.jsx          # Executive KPI overview & metrics
        ├── Members.jsx            # Member directory & filtering
        ├── AddMember.jsx          # Multi-step member onboarding form
        ├── MemberProfile.jsx      # Comprehensive member profile & activity
        ├── Attendance.jsx         # Attendance log, daily trends & check-in
        ├── QRCheckIn.jsx          # Self-service QR scanning kiosk
        ├── Memberships.jsx        # Membership plans & pricing tiers
        ├── Finance.jsx            # Invoices, cash flow, expenses & GST POS
        ├── Workouts.jsx           # Workout plan designer
        ├── Diets.jsx              # Diet & nutrition meal planner
        ├── Leads.jsx              # Sales CRM & inquiry management
        ├── Staff.jsx              # Staff directory & role configuration
        ├── Trainers.jsx           # Trainer roster & assigned clients
        ├── Branches.jsx           # Multi-location facility manager
        ├── Operations.jsx         # Equipment maintenance & lockers
        ├── Messaging.jsx          # WhatsApp & SMS communication hub
        ├── Reports.jsx            # Detailed exportable operational reports
        ├── Analytics.jsx          # Advanced business intelligence charts
        ├── Settings.jsx           # Gym profile, tax rules, branding & backup
        └── AdminPanel.jsx         # Platform administration & workspace switcher
```

---

## 🔒 Security & Offline Resilience

- **Zero-Latency Offline Mode**: All core functions operate smoothly without active internet connectivity by persisting directly to local storage.
- **Local File Sync**: When running locally, changes are automatically mirrored to `.bilzyfit-sync/` via Vite middleware for effortless offline backups.
- **Granular RBAC**: Every navigation route and mutating action is verified against user roles to protect financial and sensitive member records.
- **Data Privacy**: Designed for secure handling of member phone numbers, biometric attendance identifiers, and emergency contacts.
