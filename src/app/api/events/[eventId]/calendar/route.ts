import { NextRequest, NextResponse } from "next/server";
import { doc, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const eventId = params.eventId;
    const calendarEntryId = `${userId}_${eventId}`;

    await setDoc(doc(adminDb, "calendarEvents", calendarEntryId), {
      id: calendarEntryId,
      userId,
      eventId,
      title: body.title || null,
      date: body.date || null,
      org: body.org || null,
      source: body.source || "event",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, saved: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to save calendar entry" }, { status: 500 });
  }
}
