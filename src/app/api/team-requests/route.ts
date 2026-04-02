import { NextRequest, NextResponse } from "next/server";
import { doc, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function POST(request: NextRequest) {
  try {
    const fromUserId = await requireUserId();
    if (!fromUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.toUserId) {
      return NextResponse.json({ success: false, error: "Missing target user" }, { status: 400 });
    }

    const requestId = `${fromUserId}_${body.toUserId}_${body.eventId || "general"}`;

    await setDoc(doc(adminDb, "teamRequests", requestId), {
      id: requestId,
      fromUserId,
      toUserId: body.toUserId,
      teamId: body.teamId || null,
      eventId: body.eventId || null,
      message: body.message || null,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, requestId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to create team request" }, { status: 500 });
  }
}
