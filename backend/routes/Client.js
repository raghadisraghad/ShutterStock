import express from 'express';
import { getAll, getById, add, update, deleteC } from '../controllers/Client.js';

const router = express.Router();

//CRUD
router.get("/", getAll);
router.get("/:id",getById);
router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

export default router;