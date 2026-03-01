"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import VideoCard from "./components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data as IVideo[]);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // ✅ DELETE HANDLER
  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video._id?.toString() !== id));
  };

  // ✅ UPDATE HANDLER (NEW)
  const handleUpdateVideo = (updatedVideo: IVideo) => {
    setVideos((prev) =>
      prev.map((video) =>
        video._id?.toString() === updatedVideo._id?.toString()
          ? updatedVideo
          : video,
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 transition-colors duration-300">
      <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase">
          LATEST <span className="text-blue-600">REELS</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
          {videos.length} videos available in your feed
        </p>
      </div>

      {videos.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {videos.map((video) => (
            <VideoCard
              key={video._id?.toString()}
              video={video}
              onDelete={handleDeleteVideo}
              onUpdate={handleUpdateVideo}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl font-medium">
            No videos found in your feed.
          </p>
          <button
            onClick={() => (window.location.href = "/upload")}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Upload your first video
          </button>
        </div>
      )}
    </main>
  );
}
