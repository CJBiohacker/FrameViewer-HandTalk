export default interface Video {
  id: string;
  fileName: string;
  frameCount: number;
  createdAt: string;
}

export default interface Params {
  id: string;
}

export default interface RouteError {
    statusText?: string;
    message?: string;
}