import express from 'express';
import { register, login, logoutUser } from '../controllers/Auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logoutUser);

export default router;