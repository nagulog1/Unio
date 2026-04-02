import { NextRequest, NextResponse } from "next/server";
import { doc, increment, runTransaction, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function POST(_request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const eventId = params.eventId;
    const registrationId = `${userId}_${eventId}`;
    const registrationRef = doc(adminDb, "eventRegistrations", registrationId);
    const eventRef = doc(adminDb, "events", eventId);

    await runTransaction(adminDb, async (transaction) => {
      const registrationSnap = await transaction.get(registrationRef);
      if (!registrationSnap.exists()) {
        transaction.set(registrationRef, {
          id: registrationId,
          userId,
          eventId,
          status: "registered",
          createdAt: serverTimestamp(),
        });
        transaction.set(
          eventRef,
          {
            registered: increment(1),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    return NextResponse.json({ success: true, registered: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to register event" }, { status: 500 });
  }
}
