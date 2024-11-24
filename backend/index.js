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
  { name: "Lion", category: "Animals" }, // Animals
  { name: "Elephant", category: "Animals" }, // Animals
  { name: "Tiger", category: "Animals" }, // Animals
  { name: "Zebra", category: "Animals" }, // Animals
  { name: "Giraffe", category: "Animals" }, // Animals
  { name: "Cat", category: "Animals" }, // Animals
  { name: "Dog", category: "Animals" }, // Animals
  { name: "Koala", category: "Animals" }, // Animals
  { name: "Panda", category: "Animals" }, // Animals
  { name: "Kangaroo", category: "Animals" }, // Animals
  { name: "Forest", category: "Nature" }, // 
  { name: "Mountain", category: "Nature" }, // Nature
  { name: "Ocean", category: "Nature" }, // Nature
  { name: "River", category: "Nature" }, // Nature
  { name: "Desert", category: "Nature" }, // Nature
  { name: "Sunset", category: "Nature" }, // Nature
  { name: "Wildlife", category: "Nature" }, // Nature
  { name: "Rainforest", category: "Nature" }, // Nature
  { name: "Glacier", category: "Nature" }, // Nature
  { name: "Snow", category: "Nature" }, // Nature
  { name: "AI", category: "Technology" }, // 
  { name: "Blockchain", category: "Technology" }, // Technology
  { name: "Machine Learning", category: "Technology" }, // Technology
  { name: "Cloud Computing", category: "Technology" }, // Technology
  { name: "IoT", category: "Technology" }, // Technology
  { name: "Big Data", category: "Technology" }, // Technology
  { name: "Smartphones", category: "Technology" }, // Technology
  { name: "AR/VR", category: "Technology" }, // Technology
  { name: "Quantum Computing", category: "Technology" }, // Technology
  { name: "5G", category: "Technology" }, // Technology
  { name: "Buildings", category: "Architecture" }, // 
  { name: "Skyscrapers", category: "Architecture" }, // Architecture
  { name: "Bridges", category: "Architecture" }, // Architecture
  { name: "Interior Design", category: "Architecture" }, // Architecture
  { name: "Urban Planning", category: "Architecture" }, // Architecture
  { name: "Modern", category: "Architecture" }, // Architecture
  { name: "Historical", category: "Architecture" }, // Architecture
  { name: "Construction", category: "Architecture" }, // Architecture
  { name: "Landmarks", category: "Architecture" }, // Architecture
  { name: "Green Buildings", category: "Architecture" }, // Architecture
  { name: "Pizza", category: "Food & Drink" }, // Food & Drink
  { name: "Pasta", category: "Food & Drink" }, // Food & Drink
  { name: "Burger", category: "Food & Drink" }, // Food & Drink
  { name: "Ice Cream", category: "Food & Drink" }, // Food & Drink
  { name: "Coffee", category: "Food & Drink" }, // Food & Drink
  { name: "Smoothie", category: "Food & Drink" }, // Food & Drink
  { name: "Salad", category: "Food & Drink" }, // Food & Drink
  { name: "Sushi", category: "Food & Drink" }, // Food & Drink
  { name: "Steak", category: "Food & Drink" }, // Food & Drink
  { name: "Tacos", category: "Food & Drink" }, // Food & Drink
  { name: "Jeans", category: "Fashion" }, // Fashion
  { name: "T-shirt", category: "Fashion" }, // Fashion
  { name: "Dress", category: "Fashion" }, // Fashion
  { name: "Shoes", category: "Fashion" }, // Fashion
  { name: "Jacket", category: "Fashion" }, // Fashion
  { name: "Hat", category: "Fashion" }, // Fashion
  { name: "Bags", category: "Fashion" }, // Fashion
  { name: "Sunglasses", category: "Fashion" }, // Fashion
  { name: "Scarf", category: "Fashion" }, // Fashion
  { name: "Watch", category: "Fashion" }, // Fashion
  { name: "Football", category: "Sports" }, // Sports
  { name: "Basketball", category: "Sports" }, // Sports
  { name: "Baseball", category: "Sports" }, // Sports
  { name: "Tennis", category: "Sports" }, // Sports
  { name: "Soccer", category: "Sports" }, // Sports
  { name: "Golf", category: "Sports" }, // Sports
  { name: "Running", category: "Sports" }, // Sports
  { name: "Cycling", category: "Sports" }, // Sports
  { name: "Boxing", category: "Sports" }, // Sports
  { name: "Rugby", category: "Sports" }, // Sports
];

try {
  await connectDB();
  
  // for (const category of categories) {
  //   const existingCategory = await Category.findOne({ name: category.name });
    
  //   if (!existingCategory) {
  //     await Category.create(category);
  //     console.log(`Category '${category.name}' added successfully!`);
  //   }
  // }
  
  // for (const tag of tags) {
  //   const category = await Category.findOne({ name: tag.category });
    
  //   if (category) {
  //     const existingTag = await Tag.findOne({ name: tag.name });
      
  //     if (!existingTag) {
  //       await Tag.create({
  //         name: tag.name,
  //         category: category._id
  //       });
  //       console.log(`Tag '${tag.name}' with category ID '${category._id}' added successfully!`);
  //     }
  //   } else {
  //     console.log(`Category '${tag.category}' not found for tag '${tag.name}'. Skipping...`);
  //   }
  // }
} catch (error) {
  console.error('Error occurred:', error);
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: `${process.env.VITE_FRONTEND_URL}`,
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
  console.log(`Server is running on ${process.env.VITE_ORIGIN}`);
});
