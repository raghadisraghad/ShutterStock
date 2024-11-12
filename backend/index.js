import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/Category.js';
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
const categories = [
  { "name": "Animals" },
  { "name": "Nature" },
  { "name": "Technology" },
  { "name": "Architecture" },
  { "name": "Food & Drink" },
  { "name": "Fashion" },
  { "name": "Sports" },
  { "name": "Music" },
  { "name": "Business" },
  { "name": "Health & Fitness" },
  { "name": "Travel" },
  { "name": "Education" },
  { "name": "Art & Design" },
  { "name": "Science" },
  { "name": "Entertainment" },
  { "name": "History" },
  { "name": "Technology" },
  { "name": "Lifestyle" },
  { "name": "Gaming" },
  { "name": "Movies" },
  { "name": "Photography" },
  { "name": "Social Media" },
  { "name": "Business & Finance" },
  { "name": "Real Estate" },
  { "name": "Automotive" },
  { "name": "Health" },
  { "name": "Sports & Outdoors" },
  { "name": "Home & Garden" },
  { "name": "Pets" },
  { "name": "Crafts" },
  { "name": "Holidays" },
  { "name": "Beauty" },
  { "name": "Parenting" },
  { "name": "Food" },
  { "name": "Music & Audio" },
  { "name": "Books" },
  { "name": "Marketing" },
  { "name": "Interior Design" },
  { "name": "Wedding" },
  { "name": "Events" },
  { "name": "Technology & Gadgets" },
  { "name": "Fitness" },
  { "name": "Food Photography" },
  { "name": "Travel Photography" },
  { "name": "Fashion Photography" },
  { "name": "Nature Photography" },
  { "name": "DIY" },
  { "name": "Fitness & Health" },
  { "name": "Fitness & Exercise" },
  { "name": "Lifestyle & Living" },
  { "name": "Camping" },
  { "name": "Cycling" },
  { "name": "Hiking & Trekking" },
  { "name": "Equestrian" },
  { "name": "Personal Finance" },
  { "name": "Mobile & App Development" },
  { "name": "Artificial Intelligence" },
  { "name": "Space" },
  { "name": "Physics" },
  { "name": "Chemistry" },
  { "name": "Biology" },
  { "name": "Geography" }
];

// MongoDB Connection
connectDB();
try {
  await connectDB();
  for (const category of categories) {
    const existingCategory = await Category.findOne({ name: category.name });
    
    if (!existingCategory) {
      await Category.create(category);
      console.log(`Category '${category.name}' added successfully!`);
    }
  }
} catch (err) {
  console.error('Error adding categories:', err);
}

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
app.use('/api/pictures', pictureRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.VITE_ORIGIN}`);
});
