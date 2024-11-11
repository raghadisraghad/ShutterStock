import express from 'express';
import upload from '../middleware/image.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });
const router = express.Router();

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (req.file) {
    const imageUrl = `/Pictures/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

router.get('/avatar/:path/:url', (req, res) => {
  const pictureUrl = req.params.url;
  const picturePath = req.params.path;
  const filePath = path.join(process.env.UPLOAD_DIRECTORY, picturePath, pictureUrl);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

export default router;