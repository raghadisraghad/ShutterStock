import express from 'express';
import { getAllVideos, getByTag, getVideoByCategory, getVideoByVendorId, getVideosAnalyses, add, archive, deleteC, getById, update } from '../controllers/Video.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);
router.put("/archive/:id", archive);

router.get("/", getAllVideos);
router.get("/:id", getById);
router.get("/vendor/:vendorId", getVideoByVendorId);
router.get("/videos/analysis", getVideosAnalyses);
router.get("/tag/", getByTag);
router.get("/category/", getVideoByCategory);

export default router;