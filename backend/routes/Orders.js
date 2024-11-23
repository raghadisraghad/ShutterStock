import express from 'express';
import { getAll, getById, getClientOrder, getVendorOrder, add, update, deleteC, archive } from '../controllers/Orders.js';

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/client/:id", getClientOrder);
router.get("/vendor/:id", getVendorOrder);
router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);
router.put("/archive/:id", archive);

export default router;