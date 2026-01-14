import express from 'express';
import { getAll, getById, add, update, deleteC } from '../controllers/Payment.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

router.get("/", getAll);
router.get("/:id", getById);

export default router;