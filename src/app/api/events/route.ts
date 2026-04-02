import { NextRequest, NextResponse } from "next/server";
import { doc, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const event = await request.json();

    if (!event?.id || !event?.title) {
      return NextResponse.json({ success: false, error: "Missing event id or title" }, { status: 400 });
    }

    await setDoc(
      doc(adminDb, "events", event.id),
      {
        ...event,
        createdBy: event.createdBy || userId,
        registered: Number(event.registered || 0),
        featured: Boolean(event.featured),
        updatedAt: serverTimestamp(),
        createdAt: event.createdAt || serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to save event" }, { status: 500 });
  }
}
