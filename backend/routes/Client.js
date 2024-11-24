import express from 'express';
import { upload } from '../middleware/image.js';
import { getAll, getById, add, update, deleteC, getUserRoleAnalyses } from '../controllers/Client.js';

const router = express.Router();

//CRUD
router.get("/", getAll);
router.get("/analysis", getUserRoleAnalyses);
router.get("/:id", getById);
router.post("/", add);
router.put("/:id", upload.single('avatar'), update);
router.delete("/:id", deleteC);

export default router;