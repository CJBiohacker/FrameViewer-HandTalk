import Video from "../types/types-and-interfaces";

// const API_URL = import.meta.env.VITE_API_URL; // Replace with your backend URL

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("video", file);

  const response = await fetch(`/api/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data;
};

export const fetchVideosMetadata = async (): Promise<Video[]> => {
  const response = await fetch(`/api/list`);
  const data = await response.json();

  return data;
};

export const fetchFrames = async (videoId: string): Promise<string[]> => {
  const response = await fetch(`/api/list/frames/${videoId}`);
  const data = await response.json();

  return data;
};
