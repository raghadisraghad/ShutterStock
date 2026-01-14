import express from 'express';
import { getAllServices, add, deleteC, getById, getServiceByVendorId, getServicesAnalyses, update } from '../controllers/Service.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

router.get("/", getAllServices);
router.get("/:id", getById);
router.get("/vendor/:vendorId", getServiceByVendorId);
router.get("/service/analysis", getServicesAnalyses);

export default router;