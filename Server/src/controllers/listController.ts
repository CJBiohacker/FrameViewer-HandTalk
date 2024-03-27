import { Request, Response } from "express";
import { db, storage } from "../database/firebaseConfig";

export const listAllVideos = async (_: Request, res: Response) => {
  try {
    const snapshot = await db.collection("videos").get();
    const videos = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
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
    const framesRef = storage.file(`frame/${videoId}/`);

    console.log("🚀 ~ getFrames ~ framesRef:", JSON.stringify(framesRef));

    const [metadata] = await framesRef.getMetadata();

    if (metadata && metadata.items) {
      console.log("IF DO METADATA");
      const frameUrls = Object.values(metadata.items).map((item: any) => {
        console.log("storage.name => ", storage.name)
        console.log("item.name => ", item.name)
        let baseurl = "https://storage.googleapis.com/"
        baseurl += `${storage.name}/${item.name}`

        console.log("🚀 ~ frameUrls ~ baseurl:", baseurl)

        return baseurl;
      });

      res.status(200).json(frameUrls);
    } else {
      res.status(404).json({ message: "Frames not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};

// {
//   "createdAt": "2024-03-27T00:29:59Z",
//   "fileName": "video.mp4",
//   "frameCount": "60",
//   "id": "lssFZ0zNO8LbBQb9My69"
//   }