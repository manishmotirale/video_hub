"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import FileUpload from "../components/FileUpload";
import { useSession } from "next-auth/react"; // Assuming you use next-auth

export default function UploadPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videourl, setVideourl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    video: false,
    image: false,
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    if (!videourl || !thumbnailUrl) {
      alert(
        "Please wait for both the video and thumbnail to finish uploading.",
      );
      return;
    }

    if (!session) {
      alert("You must be logged in to upload videos.");
      return;
    }

    setIsPublishing(true);

    try {
      // 2. API Call
      // We pass the data; if your API gets the user from the session,
      // you don't need to explicitly pass userId here unless your backend requires it.
      await apiClient.createVideo({
        title,
        desc,
        videourl,
        thumbnailUrl,
        controls: true,
      });

      alert("Video published successfully!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message || "Failed to create video"}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm mt-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Upload New Video
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Video Title
          </label>
          <input
            type="text"
            placeholder="Enter a catchy title"
            className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            placeholder="What is this video about?"
            className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition h-32"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border-2 border-dashed rounded-xl border-gray-200 dark:border-zinc-700">
            <label className="block text-sm font-semibold mb-3 text-center">
              Video File
            </label>
            <FileUpload
              fileType="video"
              onProgress={() =>
                setUploadProgress((prev) => ({ ...prev, video: true }))
              }
              onSuccess={(res) => {
                setVideourl(res.url);
                setUploadProgress((prev) => ({ ...prev, video: false }));
              }}
            />
            {videourl && (
              <p className="text-xs text-green-500 mt-2 text-center">
                ✅ Video Ready
              </p>
            )}
          </div>

          <div className="p-4 border-2 border-dashed rounded-xl border-gray-200 dark:border-zinc-700">
            <label className="block text-sm font-semibold mb-3 text-center">
              Thumbnail Image
            </label>
            <FileUpload
              fileType="image"
              onProgress={() =>
                setUploadProgress((prev) => ({ ...prev, image: true }))
              }
              onSuccess={(res) => {
                setThumbnailUrl(res.url);
                setUploadProgress((prev) => ({ ...prev, image: false }));
              }}
            />
            {thumbnailUrl && (
              <p className="text-xs text-green-500 mt-2 text-center">
                ✅ Thumbnail Ready
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPublishing || !videourl || !thumbnailUrl}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
        >
          {isPublishing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Publishing...
            </span>
          ) : (
            "Publish Video"
          )}
        </button>
      </form>
    </div>
  );
}
