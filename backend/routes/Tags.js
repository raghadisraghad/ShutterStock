import express from 'express';
import { getAll, getByName, getById, add, update, deleteC, getByCategory } from '../controllers/Tags.js';

const router = express.Router();

router.get("/", getAll);
router.get("/name/:name", getByName);
router.get("/id/:id", getById);
router.get("/category/:category", getByCategory);
router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);

export default router;