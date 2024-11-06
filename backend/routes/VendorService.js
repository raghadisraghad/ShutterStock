import express from 'express';
import { getAll, getByUsername, getById } from '../controllers/VendorService.js';

const router = express.Router();

router.get("/", getAll);
router.get("/username/:username", getByUsername);
router.get("/id/:id", getById);

export default router;