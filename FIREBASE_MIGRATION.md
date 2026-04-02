# Firebase Migration Guide

## Overview
This project has been migrated from Prisma + MongoDB/PostgreSQL to Firebase Firestore. All database operations now use Firebase Realtime Database/Firestore instead of Prisma ORM.

## What Changed

### 1. **Dependencies**
- ✅ Removed: `@prisma/client`, `@next-auth/prisma-adapter`, `prisma`, `ts-node`
- ✅ Added: `firebase` SDK

### 2. **File Structure**
```
src/
├── lib/
│   ├── firebase/
│   │   ├── firebase.ts      # Firebase initialization
│   │   ├── auth.ts          # Authentication helpers
│   │   └── db.ts            # Database CRUD operations
│   ├── db/
│   │   └── prisma.ts        # Deprecated (kept for backward compatibility)
│   └── data/
│       ├── users.ts         # Now fetches from Firebase
│       ├── challenges.ts    # Now fetches from Firebase
│       └── events.ts        # Now fetches from Firebase
```

### 3. **Database Structure (Firestore Collections)**

#### `users` Collection
```typescript
{
  id: string
  email: string
  name: string
  image: string | null
  college: string | null
  branch: string | null
  year: number | null
  bio: string | null
  skills: string[]
  xp: number
  streak: number
  createdAt: string (ISO)
  updatedAt: string (ISO)
}
```

#### `events` Collection
```typescript
{
  id: string
  title: string
  org: string
  banner: string
  date: string
  deadline: string
  mode: "Online" | "Offline" | "Hybrid"
  city: string
  prize: string
  difficulty: "Easy" | "Intermediate" | "Advanced"
  teamSize: string
  category: string
  tags: string[]
  registered: number
  featured: boolean
}
```

#### `challenges` Collection
```typescript
{
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  acceptance: number
  tags: string[]
  solved: boolean
  submissions: string
}
```

#### `accounts` Collection
```typescript
{
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
}
```

#### `submissions` Collection
```typescript
{
  id: string
  userId: string
  challengeId: string
  code: string
  language: string
  status: "accepted" | "wrong_answer" | "time_limit"
  runtime: string | null
  memory: string | null
  createdAt: string (ISO)
}
```

#### `teams` Collection
```typescript
{
  id: string
  name: string
  eventId: string | null
  createdAt: string (ISO)
}
```

#### `teamMembers` Collection
```typescript
{
  id: string
  teamId: string
  userId: string
  role: string
  joinedAt: string (ISO)
}
```

#### `eventBookmarks` Collection
```typescript
{
  id: string
  userId: string
  eventId: string
  createdAt: string (ISO)
}
```

## Setup Instructions

### Step 1: Set Up Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Firestore Database (in "Cloud Firestore" section)
4. Enable Firebase Authentication (GitHub & Google OAuth)
5. Go to Project Settings and copy your web app credentials

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Setup OAuth Providers
1. **GitHub OAuth:**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret to `.env.local`

2. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Set authorized redirect URIs to: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Client Secret to `.env.local`

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Seed Initial Data (Optional)
To populate Firestore with mock data, create a script in `scripts/seed-firebase.ts`:

```typescript
import { db } from "@/lib/firebase/firebase";
import { collection, writeBatch } from "firebase/firestore";
import { MOCK_EVENTS } from "@/lib/data/events-mock";
import { MOCK_CHALLENGES } from "@/lib/data/challenges";
import { MOCK_USERS } from "@/lib/data/users";

async function seedFirebase() {
  const batch = writeBatch(db);
  
  // Seed events
  MOCK_EVENTS.forEach((event) => {
    const docRef = doc(collection(db, "events"), event.id);
    batch.set(docRef, event);
  });

  // Seed challenges
  MOCK_CHALLENGES.forEach((challenge) => {
    const docRef = doc(collection(db, "challenges"), challenge.id);
    batch.set(docRef, challenge);
  });

  // Seed users
  MOCK_USERS.forEach((user) => {
    const docRef = doc(collection(db, "users"), user.id);
    batch.set(docRef, user);
  });

  await batch.commit();
  console.log("Firebase seeded successfully!");
}

seedFirebase().catch(console.error);
```

## API Reference

### Firebase Authentication (`src/lib/firebase/auth.ts`)

```typescript
// Watch auth state changes
onAuthChange((user) => {
  // user is null or User object
});

// Sign out
await firebaseSignOut();

// Update profile
await updateUserProfile(displayName, photoURL);

// Create user document
await createUserDocument(uid, email, name, image);

// Get user document
const user = await getUserDocument(uid);

// Update user document
await updateUserDocument(uid, data);

// Enable persistence
await enablePersistence();
```

### Firebase Database (`src/lib/firebase/db.ts`)

```typescript
// Get single document
const doc = await getDocById<T>("collectionName", "documentId");

// Get all documents
const docs = await getAllDocs<T>("collectionName");

// Query documents
const results = await queryDocs<T>("collectionName", [where("field", "==", value)]);

// Create/update document
await setDocData("collectionName", "documentId", { data });

// Update document
await updateDocData("collectionName", "documentId", { updates });

// Delete document
await deleteDocData("collectionName", "documentId");

// Get documents by field
const docs = await getDocsByField<T>("collectionName", "field", value);
```

## Data Fetching in Components

### Async Data Fetching
```typescript
import { getEvents } from "@/lib/data/events";

export default async function EventsPage() {
  const events = await getEvents();
  return <div>{/* render events */}</div>;
}
```

### Using Mock Data (Backward Compatible)
```typescript
import { EVENTS } from "@/lib/data/events";

export default function EventsComponent() {
  // EVENTS now contains mock data as fallback
  return <div>{/* render EVENTS */}</div>;
}
```

## Authentication Flow

1. User clicks "Sign in with GitHub/Google"
2. NextAuth handles OAuth flow
3. On successful signin:
   - User document is created in Firestore `users` collection
   - OAuth account info stored in `accounts` collection
   - JWT token is issued
4. Subsequent requests include JWT token
5. User data is stored in Firestore and synced via callbacks

## Security Notes

1. **Firestore Security Rules:** Configure rules in Firebase Console to protect data
2. **Authentication:** Use NextAuth callbacks for server-side operations
3. **Environment Variables:** Keep `NEXTAUTH_SECRET` secure, never expose Firebase keys unnecessarily
4. **API Routes:** Always verify session on server-side API routes

## Migration Checklist

- [ ] Set up Firebase project
- [ ] Configure environment variables
- [ ] Set up OAuth providers
- [ ] Run `npm install`
- [ ] Test authentication flow
- [ ] Seed initial data (optional)
- [ ] Update any custom queries to use Firebase utilities
- [ ] Deploy to production

## Troubleshooting

### Firebase Connection Issues
- Verify Firebase credentials in `.env.local`
- Check Firestore Database is enabled in Firebase Console
- Ensure no security rule restrictions are blocking access

### Authentication Issues
- Verify OAuth credentials are correct
- Check callback URLs match Firebase console settings
- Ensure `NEXTAUTH_SECRET` is set

### Data Not Loading
- Check Firestore collections exist and have data
- Verify data structure matches TypeScript interfaces
- Check browser console for errors

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Firestore Web SDK](https://firebase.google.com/docs/firestore/quickstart)
- [NextAuth Callbacks](https://next-auth.js.org/configuration/callbacks)
