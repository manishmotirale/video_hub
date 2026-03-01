import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(videos || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();

    if (!body.title || !body.desc || !body.videourl || !body.thumbnailUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newVideo = await Video.create({
      ...body,
      userId: session.user.id, // 🔐 Attach owner
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Create failed" },
      { status: 500 },
    );
  }
}
