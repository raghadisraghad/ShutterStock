import express from 'express';
import { getAllWorks, add, deleteC, getById, getWorkByVendorId, getWorksAnalyses, update, archive } from '../controllers/Work.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.put("/archive/:id", archive);
router.delete("/:id", deleteC);

router.get("/", getAllWorks);
router.get("/:id", getById);
router.get("/vendor/:vendorId", getWorkByVendorId);
router.get("/works/analysis", getWorksAnalyses);

export default router;