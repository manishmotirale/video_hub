import { IVideo } from "@/models/Video";

// ✨ Updated: Omit both _id AND userId.
// The frontend shouldn't send the userId; the server gets it from the session.
export type VideoformData = Omit<IVideo, "_id" | "userId">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const url = `/api/${endpoint.replace(/^\//, "")}`;

    const res = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      throw new Error(
        `Server Error: ${res.status}. Could not find route at ${url}.`,
      );
    }

    return res.json();
  }

  async getVideos() {
    return this.fetch<IVideo[]>("videos");
  }

  async updateVideo(id: string, videoData: Partial<VideoformData>) {
    return this.fetch<IVideo>(`videos/${id}`, {
      method: "PUT",
      body: videoData,
    });
  }

  async deleteVideo(id: string) {
    return this.fetch<{ message: string }>(`videos/${id}`, {
      method: "DELETE",
    });
  }

  async createVideo(videoData: VideoformData) {
    return this.fetch<IVideo>("videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
