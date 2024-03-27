import * as fs from "fs";
import { exec } from "child_process";
import { Frame } from "../types/types-and-interfaces";

export const extractFrames = (
  fileBuffer: Buffer,
  videoId: string
): Promise<Frame[]> => {
  return new Promise((resolve, reject) => {
    const frames: Frame[] = [];
    const tempDir = `./temp/${videoId}`;

    fs.mkdirSync(tempDir, { recursive: true });

    const filePath = `${tempDir}/video.mp4`;

    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        reject(err);
        return;
      }

      exec(
        `ffmpeg -i ${filePath} ${tempDir}/frame-%04d.jpg`,
        async (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }

          const files = await fs.promises.readdir(tempDir);

          let count = 1;
          for (const file of files) {
            if (file.startsWith("frame-")) {
              const framePath = `${tempDir}/${count}.jpg`;

              fs.renameSync(`${tempDir}/${file}`, framePath);

              frames.push({
                path: framePath,
                name: `${count}.jpg`,
              });

              count++;
            }
          }

          resolve(frames);
        }
      );
    });
  });
};
