export default interface Video {
  id: string;
  fileName: string;
  frameCount: number;
  createdAt: string;
}

export interface TabProps {
  tabs: { label: string; path: string }[];
}

export default interface RouteError {
  statusText?: string;
  message?: string;
}
