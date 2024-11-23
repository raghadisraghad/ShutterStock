import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js'
import { upload, productImageUpload } from '../middleware/image.js';

dotenv.config({ path: './.env' });
const router = express.Router();
const uploadDirectory = path.join(process.env.UPLOAD_DIRECTORY, '/Users');
const uploadProductDirectory = path.join(process.env.UPLOAD_DIRECTORY, '/Products');

router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  const userId = req.body.userId;

  if (userId) {
    const user = await User.findById(userId);
    const avatarUrl = user.avatar;

    if (fs.existsSync(avatarUrl)) {
      fs.unlink(avatarUrl, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        console.log('File deleted successfully');
      });
    }
  }

  if (req.file) {
    const imageUrl = path.join(uploadDirectory, req.file.filename);
    res.status(200).json({ imageUrl });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

router.get('/avatar/:url', (req, res) => {
  const pictureUrl = req.params.url;
  const imageUrl = path.join(uploadDirectory, pictureUrl);

  res.sendFile(imageUrl, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

router.post('/upload-product-image/:userId', productImageUpload.single('picture'), async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: 'User not found!' });

  if (req.file) {
    const imageUrl = path.join(uploadProductDirectory, user.username, req.file.filename);
    res.status(200).json({ imageUrl });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

router.get('/product-images/:id/:url', async (req, res) => {
  
  const id = req.params.id;
  const pictureUrl = req.params.url;
  const user = await User.findById(id);
  const imageUrl = path.join(uploadProductDirectory, user.username, pictureUrl);

  res.sendFile(imageUrl, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

export default router;