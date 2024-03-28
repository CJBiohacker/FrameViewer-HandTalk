export default interface Video {
  id: string;
  fileName: string;
  frameCount: number;
  createdAt: string;
}

export interface Tab {
  label: string;
  path: string;
}

export interface TasProps {
  tabs: Tab[];
}

export default interface RouteError {
    statusText?: string;
    message?: string;
}