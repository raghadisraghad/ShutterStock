import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { S3Client, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Service from '../models/Service.js';

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

// ---------- Helper Functions ----------
const deleteFile = async (fileKey, userSubPath) => {
  if (!fileKey) return;

  if (STORAGE_TYPE.toLowerCase() === 's3') {
    const params = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: fileKey,
    };
    await s3.send(new DeleteObjectCommand(params));
    console.log('File deleted successfully from Wasabi');
  } else {
    const filePath = path.join('uploads', userSubPath, fileKey);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

const getFileStream = async (fileKey, userSubPath) => {
  if (STORAGE_TYPE.toLowerCase() === 's3') {
    const params = { Bucket: process.env.WASABI_BUCKET_NAME, Key: fileKey };
    const command = new GetObjectCommand(params);
    return s3.send(command); // returns { Body }
  } else {
    const filePath = path.join('uploads', userSubPath, fileKey);
    if (!fs.existsSync(filePath)) throw new Error('File not found');
    return fs.createReadStream(filePath);
  }
};

// ---------- Controllers ----------

const addAvatar = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found!' });

  if (user.avatar) await deleteFile(user.avatar, `Users/Avatars/${user.username}`);

  if (req.file) {
    user.avatar = req.file.filename || req.file.key;
    await user.save();
    res.status(200).json({ imageUrl: user.avatar });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

const addProductImage = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found!' });

  if (req.file) {
    const imageUrl = req.file.filename || req.file.key;
    res.status(200).json({ imageUrl });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

const addProductVideo = addProductImage;
const addProductAudio = addProductImage; // Same logic, only returns file

const addServiceImage = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found!' });

  const service = await Service.findOne({ vendor: userId });
  if (!service) return res.status(404).json({ message: 'Service not found!' });

  if (service.background) await deleteFile(service.background, `Services/Background/${user.username}`);

  if (req.file) {
    service.background = req.file.filename || req.file.key;
    await service.save();
    res.status(200).json({ imageUrl: service.background });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

const addServiceWorkImage = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found!' });

  if (req.files && req.files.length > 0) {
    const workUrls = req.files.map(f => f.filename || f.key);
    res.status(200).json({ workUrls });
  } else {
    res.status(400).json({ message: 'No files uploaded' });
  }
});

// ---------- Get Files ----------
const getFile = (folderPath) => asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const fileKey = req.params.url;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found!' });

  try {
    if (STORAGE_TYPE.toLowerCase() === 's3') {
      const params = { Bucket: process.env.WASABI_BUCKET_NAME, Key: `${folderPath}/${user.username}/${fileKey}` };
      const command = new GetObjectCommand(params);
      const { Body } = await s3.send(command);
      res.attachment(fileKey);
      Body.pipe(res);
    } else {
      const filePath = path.join('uploads', folderPath, user.username, fileKey);
      if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
      res.attachment(fileKey);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error('Error retrieving file:', err);
    return res.status(500).json({ message: 'Error retrieving file', error: err.message });
  }
});

// Reuse getFile for all routes
const getAvatar = getFile('Users/Avatars');
const getProductImage = getFile('Products/Images');
const getProductVideo = getFile('Products/Videos');
const getProductAudio = getFile('Products/Audios');
const getServiceImage = getFile('Services/Background');
const getServiceWorkImage = getFile('Services/Work');

export {
  addAvatar,
  addProductImage,
  addProductVideo,
  addProductAudio,
  addServiceImage,
  addServiceWorkImage,
  getAvatar,
  getProductImage,
  getProductVideo,
  getProductAudio,
  getServiceImage,
  getServiceWorkImage,
};
