import express from 'express';
import { add, update, deleteC } from '../controllers/Vendor.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

export default router;