import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Target from '../models/User.js';

dotenv.config({ path: './.env' });

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';

// ---------- S3 Client Setup ----------
const s3 = new S3Client({
  endpoint: `https://s3.${process.env.WASABI_REGION}.wasabisys.com`,
  region: process.env.WASABI_REGION,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
});

// ---------- File Filter ----------
const fileFilter = (req, file, cb) => {
  if (![
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/mpeg',
    'video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/ogg'
  ].includes(file.mimetype)) {
    return cb(new Error('Only image, audio, and video files are allowed'), false);
  }
  cb(null, true);
};

// ---------- Local Storage Helper ----------
const localStorage = (subDirectory) => {
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const userId = req.params.userId;
        if (!userId) return cb(new Error('userId is missing'), false);

        const target = await Target.findById(userId);
        if (!target) return cb(new Error('User not found'), false);

        const dir = path.join('uploads', subDirectory, target.username);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      } catch (error) {
        cb(new Error('Error creating local directory: ' + error.message), false);
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 },
    fileFilter
  });
};

// ---------- Wasabi Storage Helper ----------
const s3Storage = (subDirectory) => multer({
  storage: multerS3({
    s3,
    bucket: process.env.WASABI_BUCKET_NAME,
    acl: 'public-read',
    key: async (req, file, cb) => {
      try {
        const userId = req.params.userId;
        if (!userId) return cb(new Error("userId is missing"), false);

        const target = await Target.findById(userId);
        if (!target) return cb(new Error("User not found"), false);

        const fileName = `${subDirectory}/${target.username}/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      } catch (error) {
        cb(new Error("Error creating file path for Wasabi: " + error.message), false);
      }
    }
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter
});

// ---------- Storage Selector ----------
const uploadToStorage = (subDirectory) => {
  if (STORAGE_TYPE.toLowerCase() === 's3') {
    return s3Storage(subDirectory);
  } else {
    return localStorage(subDirectory);
  }
};

// ---------- Exports ----------
const productImageUpload = uploadToStorage('Products/Images');
const productAudioUpload = uploadToStorage('Products/Audios');
const productVideoUpload = uploadToStorage('Products/Videos');
const serviceUpload = uploadToStorage('Services/Background');
const serviceWorkUpload = uploadToStorage('Services/Work');
const avatarUpload = uploadToStorage('Users/Avatars');

export {
  productImageUpload,
  productVideoUpload,
  productAudioUpload,
  serviceUpload,
  serviceWorkUpload,
  avatarUpload,
};
