import { NextRequest, NextResponse } from "next/server";
import { doc, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function PUT(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await setDoc(
      doc(adminDb, "users", userId),
      {
        id: userId,
        name: body.name || "Anonymous",
        college: body.college || null,
        branch: body.branch || null,
        year: body.year || null,
        bio: body.bio || null,
        skills: Array.isArray(body.skills) ? body.skills : [],
        publicProfile: Boolean(body.publicProfile),
        allowTeamRequests: body.allowTeamRequests !== false,
        showEmail: Boolean(body.showEmail),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to save profile" }, { status: 500 });
  }
}
