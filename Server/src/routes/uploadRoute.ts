import express from "express";
import { uploadVideo } from "../controllers/uploadController";
import { authenticate  } from '../middleware/middleware';

const router = express.Router();
router.post("/", authenticate, uploadVideo);

export default router;
