import express from "express";
import { uploadVideo } from "../controllers/uploadController";

const router = express.Router();
router.post("/", uploadVideo);

export default router;
