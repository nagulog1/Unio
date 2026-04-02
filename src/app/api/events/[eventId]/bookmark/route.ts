import { NextRequest, NextResponse } from "next/server";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function POST(_request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const eventId = params.eventId;
    const bookmarkId = `${userId}_${eventId}`;
    const bookmarkRef = doc(adminDb, "eventBookmarks", bookmarkId);
    const bookmarkSnap = await getDoc(bookmarkRef);

    if (bookmarkSnap.exists()) {
      await deleteDoc(bookmarkRef);
      return NextResponse.json({ success: true, bookmarked: false });
    }

    await setDoc(bookmarkRef, {
      id: bookmarkId,
      userId,
      eventId,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, bookmarked: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to toggle bookmark" }, { status: 500 });
  }
}
