import express from 'express';
import { listAllVideos, getFrames } from '../controllers/listController';

const router = express.Router();
router.get('/', listAllVideos);
router.get('/frames/:id', getFrames);

export default router;
