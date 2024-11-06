import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/Auth.js';
import productRoute from './routes/Products.js';
import orderRoute from './routes/Orders.js';
import tagRoute from './routes/Tags.js';
import categoryRoute from './routes/Categories.js';
import adminRoute from './routes/Admin.js';
import clientRoute from './routes/Client.js';
import vendorRoute from './routes/Vendor.js';
import vendorProductRoute from './routes/VendorProduct.js';
import vendorServiceRoute from './routes/VendorService.js';

dotenv.config({ path: '../.env' });

const app = express();

// MongoDB Connection
connectDB();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the 'Bearer' scheme

  if (!token) return res.status(401).json({ message: 'Access Denied' }); // check if the token exists

  // verify the token hasn't expired
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.userId = decoded.userId; // Add user'id to request object for further use
    next();
  });
};

// Basic route for the server
app.get('/', (req, res) => {
  res.send('Welcome To ShutterStock!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/api/auth', authRoute);
app.use('/api/admin', verifyToken, adminRoute);
app.use('/api/client', clientRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/vendorProduct', vendorProductRoute);
app.use('/api/vendorService', vendorServiceRoute);
app.use('/api/products', productRoute);
app.use('/api/tags', tagRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/orders', orderRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.DOMAIN}${process.env.PORT}`);
});
