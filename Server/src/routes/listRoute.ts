import express from 'express';
import { listAllVideos, getFrames } from '../controllers/listController';
import { authenticate  } from '../middleware/middleware';

const router = express.Router();
router.get('/', authenticate, listAllVideos);
router.get('/frames/:id', authenticate, getFrames);

export default router;
