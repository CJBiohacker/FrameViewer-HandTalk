interface Frame {
  path: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export { Frame };
