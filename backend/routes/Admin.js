import express from 'express';
import { create, readAll, readById, update, deleteC } from '../controllers/Admin.js';

const router = express.Router();

//CRUD
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', deleteC);

router.get('/', readAll);
router.get('/:id', readById);

export default router;