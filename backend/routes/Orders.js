import express from 'express';
import { getAll, getById, getClientOrder, getVendorOrder, getOrdersAnalysis, add, update, deleteC, archive } from '../controllers/Orders.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);
router.put("/archive/:id", archive);

router.get("/", getAll);
router.get("/:id", getById);
router.get("/client/:id", getClientOrder);
router.get("/vendor/:id", getVendorOrder);
router.get("/orders/analysis", getOrdersAnalysis);

export default router;