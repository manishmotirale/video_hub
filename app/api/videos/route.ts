import { authoptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(videos || []);
  } catch (error) {
    console.error("GET VIDEOS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authoptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body: IVideo = await request.json();

    // 1. Validation Check: Ensure all required fields exist from the frontend
    if (!body.title || !body.desc || !body.videourl || !body.thumbnailUrl) {
      return NextResponse.json(
        {
          error:
            "Missing Required Fields: title, desc, videourl, or thumbnailUrl",
        },
        { status: 400 },
      );
    }

    // 2. Data Preparation: Ensure dimensions match your VIDEO_DIMENSIONS
    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    // 3. Database Insertion
    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
    // 4. Critical Logging: Check your VS Code terminal for this output!
    console.error("POST VIDEO ERROR DETAILS:", error.message);

    return NextResponse.json(
      { error: error.message || "Failed to create video in database" },
      { status: 500 },
    );
  }
}
