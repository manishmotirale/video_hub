import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (video.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Video.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Video deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (video.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updated = await Video.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
