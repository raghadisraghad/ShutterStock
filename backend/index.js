import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
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
import pictureRoute from './routes/Picture.js';

dotenv.config({ path: './.env' });

const app = express();
await connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: `${process.env.FRONT}`,
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome To ShutterStock!');
});

app.use('/api/auth', authRoute);
app.use('/api/admin', protect, adminRoute);
app.use('/api/client', protect, clientRoute);
app.use('/api/vendor', protect, vendorRoute);
app.use('/api/orders', protect, orderRoute);
app.use('/api/vendorProduct', vendorProductRoute);
app.use('/api/vendorService', vendorServiceRoute);
app.use('/api/products', productRoute);
app.use('/api/tags', tagRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/pictures', pictureRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
