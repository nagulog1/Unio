import { NextRequest, NextResponse } from "next/server";
import { collection, doc, serverTimestamp, setDoc } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/server/session";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.challengeId || !body?.code) {
      return NextResponse.json({ success: false, error: "Missing challengeId or code" }, { status: 400 });
    }

    const submissionRef = doc(collection(adminDb, "submissions"));
    const submissionId = submissionRef.id;

    await setDoc(submissionRef, {
      id: submissionId,
      userId,
      challengeId: body.challengeId,
      code: body.code,
      language: body.language || "JavaScript",
      status: body.status || "accepted",
      runtime: body.runtime || null,
      memory: body.memory || null,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, submissionId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to save submission" }, { status: 500 });
  }
}
