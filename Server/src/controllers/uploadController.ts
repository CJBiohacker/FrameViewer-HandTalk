import * as admin from "firebase-admin";
import * as fse from "fs-extra";
import * as path from "path";
import * as os from "os";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { extractFrames } from "../utils/ffmpegUtils";
import { db, storage } from "../database/firebaseConfig";
import { Frame } from "../types/types-and-interfaces";

const multerStorageConfig = multer.memoryStorage();
const upload = multer({ storage: multerStorageConfig }).single("video");

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError)
        return res.status(400).json({ message: err.message });
      else if (err)
        return res.status(500).json({ message: "Erro Interno no Servidor" });

      const file = req.file;
      if (!file)
        return res.status(400).json({ message: "Upload não foi realizado" });

      const videoId = uuidv4().replace(/-/g, "");

      console.time("extractFramesTime");
      const frames = await extractFrames(file.buffer, videoId);
      console.timeEnd("extractFramesTime");

      console.time("uploadFramesTime");
      for (const frame of frames) {
        const destination = `${process.env.FIREBASE_STORAGE_FOLDER}/${videoId}/${frame.name}`;
        await uploadFrameToStorage(frame, destination);
      }
      console.timeEnd("uploadFramesTime");

      deleteTempDirFromOS(videoId);
      await uploadMetadataToDatabase(videoId, file.originalname, frames.length);

      res.status(200).json({ message: "Upload realizado com sucesso" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};

const deleteTempDirFromOS = (videoId: string) => {
  const tempDir = path.join(os.tmpdir(), "temp", videoId);
  if (fse.existsSync(tempDir)) fse.removeSync(tempDir);
};

const uploadFrameToStorage = async (frame: Frame, destination: string) => {
  await storage.upload(frame.path, {
    destination: destination,
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
};

const uploadMetadataToDatabase = async (
  videoId: string,
  fileName: string,
  frameLength: number
) => {
  await db
    .collection(`${process.env.FIRESTORE_DB_COLLECTION}`)
    .doc(videoId)
    .set({
      id: videoId,
      fileName: fileName,
      frameCount: frameLength,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};
