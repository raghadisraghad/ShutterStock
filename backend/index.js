import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/Auth.js';
import adminRoute from './routes/Admin.js';
import clientRoute from './routes/Client.js';
import vendorRoute from './routes/Vendor.js';
import vendorProductRoute from './routes/VendorProduct.js';
import vendorServiceRoute from './routes/VendorService.js';
import productRoute from './routes/Products.js';
import orderRoute from './routes/Orders.js';
import tagRoute from './routes/Tags.js';
import categoryRoute from './routes/Categories.js';
import protect from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
import upload from './middleware/image.js';
import path from 'path';

dotenv.config({ path: './.env' });

const app = express();

// MongoDB Connection
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: `${process.env.VITE_FRONTEND_URL}`,
  credentials: true,
}));

// Basic route for the server
app.get('/', (req, res) => {
  res.send('Welcome To ShutterStock!');
});

app.use('/api/auth', authRoute);
app.use('/api/admin', protect, adminRoute);
app.use('/api/client', protect, clientRoute);
app.use('/api/vendor', protect, vendorRoute);
app.use('/api/vendorProduct', vendorProductRoute);
app.use('/api/vendorService', vendorServiceRoute);
app.use('/api/products', productRoute);
app.use('/api/tags', tagRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/orders', protect, orderRoute);

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  if (req.file) {
    const imageUrl = `/Pictures/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});
app.use('/Pictures', express.static(path.join(process.env.UPLOAD_DIRECTORY)));

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.VITE_ORIGIN}`);
});
