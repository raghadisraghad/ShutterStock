import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import Target from '../models/User.js';

dotenv.config({ path: '../../.env' });

const uploadDirectory = path.join(process.env.UPLOAD_DIRECTORY, 'Users');
const uploadProductDirectory = path.join(process.env.UPLOAD_DIRECTORY, 'Products');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

if (!fs.existsSync(uploadProductDirectory)) { 
  fs.mkdirSync(uploadProductDirectory, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    return cb(new Error('Only JPEG and JPG and PNG images are allowed'), false);
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter
});

const storage2 = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.params.userId;

    if (!userId) 
      console.error("Target is null or username is missing", target);

    const target = await Target.findById(userId);
    const userDirectory = path.join(uploadProductDirectory, target.username);

    if (!fs.existsSync(userDirectory)) {
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    cb(null, userDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const productImageUpload = multer({
  storage: storage2,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter
});

export {
  upload,
  productImageUpload
}
