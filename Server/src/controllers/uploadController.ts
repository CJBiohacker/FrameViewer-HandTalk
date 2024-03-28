import * as admin from "firebase-admin";
import * as fs from "fs";
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
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(500).json({ message: "Erro Interno no Servidor" });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "Upload não foi realizado" });
      }

      const videoId = uuidv4().replace(/-/g, "");

      console.time("extractFramesTime");
      const frames = await extractFrames(file.buffer, videoId);
      console.timeEnd("extractFramesTime");

      console.time("uploadFramesTime");
      for (const frame of frames) {
        const destination = `${process.env.FIREBASE_STORAGE_FOLDER}/${videoId}/${frame.name}`;
        uploadFrameToStorage(frame, destination);
      }
      console.timeEnd("uploadFramesTime");

      deleteTempDirFromOS(file.path, videoId);
      await uploadMetadataToDatabase(videoId, file.originalname, frames.length);

      res.status(200).json({ message: "Upload realizado com sucesso" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};

const deleteTempDirFromOS = (filePath: string | undefined, videoId: string) => {
  if (filePath) {
    const tempDir = path.join(os.tmpdir(), "temp", videoId);
    fs.unlinkSync(filePath);
    fs.readdirSync(tempDir).forEach((file) => {
      fs.unlinkSync(path.join(tempDir, file));
    });
    fs.rmdirSync(tempDir);
  }
};

const uploadFrameToStorage = async (frame: Frame, destination: string) => {
  await storage.upload(frame.path, {
    destination: destination,
    gzip: true,
    metadata: {
      contentType: "image/jpeg",
    },
  });
};

const uploadMetadataToDatabase = async (
  videoId: string,
  fileName: string,
  frameLength: number
) => {
  await db.collection("videos").doc(videoId).set({
    id: videoId,
    fileName,
    frameCount: frameLength,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};
