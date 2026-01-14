import express from 'express';
import { getAllAudios, getByTag, getAudioByCategory, getAudioByVendorId, getAudiosAnalyses, add, archive, deleteC, getById, update } from '../controllers/Audios.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);
router.put("/archive/:id", archive);

router.get("/", getAllAudios);
router.get("/:id", getById);
router.get("/vendor/:vendorId", getAudioByVendorId);
router.get("/analysis/", getAudiosAnalyses);
router.get("/tag/", getByTag);
router.get("/category/", getAudioByCategory);

export default router;