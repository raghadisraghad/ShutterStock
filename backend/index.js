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

const tags = [
  { name: "Lion", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Elephant", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Tiger", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Zebra", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Giraffe", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Cat", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Dog", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Koala", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Panda", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Kangaroo", category: "6736211ef0f38c6629677e4a" }, // Animals
  { name: "Forest", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Mountain", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Ocean", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "River", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Desert", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Sunset", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Wildlife", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Rainforest", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Glacier", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "Snow", category: "6736211ff0f38c6629677e4e" }, // Nature
  { name: "AI", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Blockchain", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Machine Learning", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Cloud Computing", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "IoT", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Big Data", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Smartphones", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "AR/VR", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Quantum Computing", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "5G", category: "6736211ff0f38c6629677e51" }, // Technology
  { name: "Buildings", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Skyscrapers", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Bridges", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Interior Design", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Urban Planning", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Modern", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Historical", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Construction", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Landmarks", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Green Buildings", category: "6736211ff0f38c6629677e54" }, // Architecture
  { name: "Pizza", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Pasta", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Burger", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Ice Cream", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Coffee", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Smoothie", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Salad", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Sushi", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Steak", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Tacos", category: "6736211ff0f38c6629677e57" }, // Food & Drink
  { name: "Jeans", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "T-shirt", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Dress", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Shoes", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Jacket", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Hat", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Bags", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Sunglasses", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Scarf", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Watch", category: "6736211ff0f38c6629677e5a" }, // Fashion
  { name: "Football", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Basketball", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Baseball", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Tennis", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Soccer", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Golf", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Running", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Cycling", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Boxing", category: "6736211ff0f38c6629677e5d" }, // Sports
  { name: "Rugby", category: "6736211ff0f38c6629677e5d" }, // Sports
];

// MongoDB Connection
try {
  await connectDB();
  for (const category of categories) {
    const existingCategory = await Category.findOne({ name: category.name });
    
    if (!existingCategory) {
      await Category.create(category);
      console.log(`Category '${category.name}' added successfully!`);
    }
  }
  for (const tag of tags) {
    const existingTag = await Tag.findOne({ name: tag.name });
    
    if (!existingTag) {
      await Tag.create(tag);
      console.log(`Tag '${tag.name}', category ${tag.category} added successfully!`);
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
