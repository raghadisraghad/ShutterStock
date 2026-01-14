import express from 'express';
import { avatarUpload } from '../middleware/image.js';
import { getAll, getById, add, update, deleteC, getUserRoleAnalyses } from '../controllers/Client.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

router.get("/", getAll);
router.get("/analysis", getUserRoleAnalyses);
router.get("/:id", getById);

export default router;