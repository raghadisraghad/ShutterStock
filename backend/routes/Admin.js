import express from 'express';
import { create, readAll, readById, update, deleteC } from '../controllers/Admin.js';

const router = express.Router();

//CRUD
router.post('/create', create);
router.get('/readAll', readAll);
router.get('/read/:id', readById);
router.put('/update/:id', update);
router.delete('/delete/:id', deleteC);

export default router;