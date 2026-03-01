"use client";

import React, { useState } from "react";
import { Image, Video } from "@imagekit/next";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";

interface Props {
  video: IVideo;
  currentUserId: string | null;
  onDelete: (id: string) => void;
  onUpdate: (updatedVideo: IVideo) => void;
}

export default function VideoCard({
  video,
  currentUserId,
  onDelete,
  onUpdate,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoId = video._id?.toString();
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  // 🔐 Owner Check
  const isOwner = currentUserId === video.userId;

  const handleDelete = async () => {
    if (!videoId || !isOwner) return;

    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        setIsLoading(true);
        await apiClient.deleteVideo(videoId);
        onDelete(videoId);
      } catch {
        alert("Delete failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden group shadow-xl border border-zinc-800">
      {/* VIDEO */}
      <div className="relative aspect-square bg-black cursor-pointer">
        {isPlaying ? (
          <Video
            urlEndpoint={urlEndpoint}
            src={video.videourl}
            width={720}
            height={720}
            controls
            transformation={[{ width: 720, height: 720 }]}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="relative w-full h-full"
            onClick={() => setIsPlaying(true)}
          >
            <Image
              urlEndpoint={urlEndpoint}
              src={video.thumbnailUrl}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              transformation={[{ width: 720, height: 720 }]}
              alt={video.title}
              className="object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 flex items-center justify-center bg-blue-600 rounded-full shadow-lg">
                ▶
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-white">{video.title}</h2>

        <p className="text-sm text-gray-400 mt-1">{video.desc}</p>

        {/* 🔐 Only Owner Sees Buttons */}
        {isOwner && (
          <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              DELETE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
