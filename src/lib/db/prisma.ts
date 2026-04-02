// Firebase is now used instead of Prisma
// All database operations should use Firebase utilities from src/lib/firebase/

import { db, auth, storage } from "../firebase/firebase";
import * as dbUtils from "../firebase/db";
import * as authUtils from "../firebase/auth";

// Re-export Firebase utilities for backward compatibility
export { db, auth, storage, dbUtils, authUtils };

// This file is kept for backward compatibility but all new code should use Firebase directly
console.warn(
  "Warning: src/lib/db/prisma.ts is deprecated. Use Firebase utilities from src/lib/firebase/ instead."
);
