import express from 'express';
import { addStripe } from '../controllers/Stripe.js'

const router = express.Router();

router.post("/", addStripe);

export default router;