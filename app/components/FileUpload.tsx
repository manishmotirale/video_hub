"use client";

import { upload } from "@imagekit/next";
import React, { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return false;
      }
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Reset states
    setError(null);
    setFileName(file.name);

    if (!validateFile(file)) return;

    setUploading(true);

    try {
      // 1. Fetch authentication parameters from your API
      // Ensure your folder is exactly: app/api/upload-auth/route.ts
      const authRes = await fetch("/api/upload-auth");

      if (!authRes.ok) {
        throw new Error(`Auth failed: ${authRes.statusText}`);
      }

      const data = await authRes.json();

      // Destructure from the 'authenticationParams' object returned by your route
      const { signature, expire, token } = data.authenticationParams;

      // 2. Perform the upload to ImageKit
      const response = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature,
        expire,
        token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      console.log("Upload successful:", response);
      onSuccess(response);
    } catch (err: any) {
      console.error("Upload Error Details:", err);
      setError(err.message || "Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full min-h-[70px]">
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm">
          <span>Choose File</span>
          <input
            type="file"
            className="hidden"
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        <span className="text-sm text-gray-400 truncate max-w-[200px]">
          {fileName || "No file selected"}
        </span>
      </div>

      {/* Status and Error indicators - Fixed height prevents layout jumping */}
      <div className="h-5">
        {uploading && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-blue-500 font-medium">
              Uploading to ImageKit...
            </span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 font-medium animate-pulse">
            ⚠️ {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
