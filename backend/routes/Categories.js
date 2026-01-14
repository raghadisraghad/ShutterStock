import express from 'express';
import { getAll, getByName, getById, add, update, deleteC } from '../controllers/Categories.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

router.get("/", getAll);
router.get("/name/:name", getByName);
router.get("/id/:id", getById);

export default router;