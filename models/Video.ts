import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  [x: string]: string | null;
  _id?: mongoose.Types.ObjectId;
  title: string;
  desc: string;
  videourl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    videourl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true },
);

// FIXED: Changed models?.User to models?.Video
const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
