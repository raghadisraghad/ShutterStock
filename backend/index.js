import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import protect from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/Category.js';
import Tag from './models/Tag.js';
import authRoute from './routes/Auth.js';
import adminRoute from './routes/Admin.js';
import clientRoute from './routes/Client.js';
import vendorRoute from './routes/Vendor.js';
import vendorProductRoute from './routes/VendorProduct.js';
import vendorServiceRoute from './routes/VendorService.js';
import productRoute from './routes/Products.js';
import orderRoute from './routes/Orders.js';
import serviceRoute from './routes/Service.js';
import workRoute from './routes/Work.js';
import audioRoute from './routes/Audio.js';
import videoRoute from './routes/Video.js';
import tagRoute from './routes/Tags.js';
import categoryRoute from './routes/Categories.js';
import pictureRoute from './routes/Picture.js';
import stripeRoute from './routes/Stripe.js';
import paymentRoute from './routes/Payment.js';

import categories from './categories.js';
import tags from './tags.js';

dotenv.config({ path: './.env' });

const app = express();

await connectDB();

try {
  
  for (const category of categories) {
    const existingCategory = await Category.findOne({ name: category.name });
    
    if (!existingCategory) {
      await Category.create(category);
      console.log(`Category '${category.name}' added successfully!`);
    }
  }
  
  for (const tag of tags) {
    const category = await Category.findOne({ name: tag.category });
    
    if (category) {
      const existingTag = await Tag.findOne({ name: tag.name });
      
      if (!existingTag) {
        await Tag.create({
          name: tag.name,
          category: category._id
        });
        console.log(`Tag '${tag.name}' with category ID '${category._id}' added successfully!`);
      }
    } else {
      console.log(`Category '${tag.category}' not found for tag '${tag.name}'. Skipping...`);
    }
  }
} catch (error) {
  console.error('Error occurred:', error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    `${process.env.FRONT}`,
    "http://localhost:3000"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome To WhenShot..');
});

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/client', clientRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/orders', orderRoute);
app.use('/api/request-payment', paymentRoute);
app.use('/api/vendorProduct', vendorProductRoute);
app.use('/api/vendorService', vendorServiceRoute);
app.use('/api/products', productRoute);
app.use('/api/services', serviceRoute);
app.use('/api/works', workRoute);
app.use('/api/audios', audioRoute);
app.use('/api/videos', videoRoute);
app.use('/api/tags', tagRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/pictures', pictureRoute);
app.use('/api/payment', stripeRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
