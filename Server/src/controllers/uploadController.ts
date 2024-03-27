import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Request, Response } from "express";
import { extractFrames } from "../utils/ffmpegUtils";
import { db, storage } from "../database/firebaseConfig";

const storageConfig = multer.memoryStorage();
const upload = multer({ storage: storageConfig }).single("video");

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

      const videoId = uuidv4();

      // Extract frames using ffmpeg
      const frames = await extractFrames(file.buffer, videoId);

      // Upload frames to Firebase Storage
      for (const frame of frames) {
        const destination = `frames/${videoId}/${frame.name}`;

        await storage.upload(frame.path, {
          destination: destination,
          gzip: true,
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });
      }

      // Save video metadata in Firestore
      await db.collection("videos").doc(videoId).set({
        id: videoId,
        filename: file.originalname,
        frameCount: frames.length,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: "Upload realizado com sucesso" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};
