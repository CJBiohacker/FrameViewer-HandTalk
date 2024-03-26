import Video from "../types/types-and-interfaces";

const API_URL = 'http://localhost:3001'; // Replace with your backend URL

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
};

export const fetchVideos = async (): Promise<Video[]>  => {
  const response = await fetch(`${API_URL}/videos`);
  const data = await response.json();
  
  return data;
};

export const fetchFrames = async (videoId: string): Promise<string[]> => {
  const response = await fetch(`${API_URL}/videos/${videoId}/frames`);
  const data = await response.json();
  
  return data;
};
