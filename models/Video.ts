import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId | string; // Added for frontend/backend compatibility
  title: string;
  desc: string;
  videourl: string;
  thumbnailUrl: string;
  userId: mongoose.Types.ObjectId | string; // Support both object and string
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// ✨ NEW: This is what the frontend form actually sends
// We Omit userId because the server usually gets it from the session
export type VideoformData = Omit<IVideo, "_id" | "userId">;

export type VideoDocument = mongoose.Document & IVideo;

const videoSchema = new Schema<VideoDocument>(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    videourl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    controls: { type: Boolean, default: true },

    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true },
);

const Video =
  (models.Video as mongoose.Model<VideoDocument>) ||
  model<VideoDocument>("Video", videoSchema);

export default Video;
