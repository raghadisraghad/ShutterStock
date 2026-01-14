import express from 'express';
import dotenv from 'dotenv';
import { avatarUpload, productImageUpload, productAudioUpload, productVideoUpload, serviceUpload, serviceWorkUpload } from '../middleware/image.js';
import { addAvatar, addProductImage, getAvatar, getProductImage, addProductAudio, addProductVideo, getProductAudio, getProductVideo, addServiceImage, getServiceImage, addServiceWorkImage, getServiceWorkImage } from '../controllers/Pictures.js';

dotenv.config({ path: './.env' });
const router = express.Router();

router.post("/upload-avatar/:userId", avatarUpload.single('avatar'), addAvatar);
router.post("/upload-product-image/:userId", productImageUpload.single('picture'), addProductImage);
router.post("/upload-product-video/:userId", productVideoUpload.single('video'), addProductVideo);
router.post("/upload-product-audio/:userId", productAudioUpload.single('audio'), addProductAudio);
router.post("/upload-service-image/:userId", serviceUpload.single('background'), addServiceImage);
router.post("/upload-service-work-image/:userId", serviceWorkUpload.array('work'), addServiceWorkImage);

router.get("/avatar/:id/:url", getAvatar);
router.get("/product-images/:id/:url", getProductImage);
router.get("/product-videos/:id/:url", getProductVideo);
router.get("/product-audios/:id/:url", getProductAudio);
router.get("/service-image/:id/:url", getServiceImage);
router.get("/service-work-image/:id/:url", getServiceWorkImage);

export default router;
