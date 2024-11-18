import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const uploadDirectory = path.join(process.env.UPLOAD_DIRECTORY, 'Users');
const uploadProductDirectory = path.join(process.env.UPLOAD_DIRECTORY, 'Products');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

if (!fs.existsSync(uploadProductDirectory)) { 
  fs.mkdirSync(uploadProductDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.id;

    if (!userId) {
      return cb(new Error('User ID is required'), false);
    }

    const userDirectory = path.join(uploadProductDirectory, userId.toString());
    if (!fs.existsSync(userDirectory)) {
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    cb(null, userDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
    return cb(new Error('Only JPEG and JPG and PNG images are allowed'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter
});

const productImageUpload = multer({
  storage2,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter
});

export {
  upload,
  productImageUpload
}
