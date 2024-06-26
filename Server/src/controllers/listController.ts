import { Request, Response } from "express";
import { db, storage } from "../database/firebaseConfig";

export const listAllVideos = async (_: Request, res: Response) => {
  try {
    const snapshot = await db
      .collection(`${process.env.FIRESTORE_DB_COLLECTION}`)
      .get();
    const videos = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAtToISOFormat = data.createdAt.toDate().toISOString();
      return {
        id: doc.id,
        fileName: data.fileName,
        frameCount: data.frameCount,
        createdAt: createdAtToISOFormat,
      };
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};

export const getFrames = async (req: Request, res: Response) => {
  try {
    const videoId = req.params.id;
    const directoryPath = `${process.env.FIREBASE_STORAGE_FOLDER}/${videoId}/`;
    const [files] = await storage.getFiles({ prefix: directoryPath });

    if (files.length > 0) {
      const urlPromises = files.map(async (file) => {
        const url = await generateSignedUrl(file);
        return url;
      });

      const frameUrls = await Promise.all(urlPromises);
      res.status(200).json(frameUrls);
    } else {
      res.status(404).json({ message: "Frames não foram encontrados." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};

export const generateSignedUrl = async (
  file: any,
  expiresIn: number = 60 * 60 * 1000
) => {
  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + expiresIn,
    };

    const [url] = await file.getSignedUrl(options);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};
