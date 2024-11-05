const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const authRoute = require('./routes/Auth');
const productRoute = require('./routes/Products');
const orderRoute = require('./routes/Orders');
const tagRoute = require('./routes/Tags');
const categoryRoute = require('./routes/Categories');
const adminRoute = require('./routes/Admin');
const clientRoute = require('./routes/Client');
const vendorRoute = require('./routes/Vendor');
const vendorProductRoute = require('./routes/VendorProduct');
const vendorServiceRoute = require('./routes/VendorService');
require('dotenv').config({ path: '../.env' });

// Load your SSL certificate and key
// const options = {
//   key: fs.readFileSync('../server.key'),
//   cert: fs.readFileSync('../server.cert')
// };

// Middleware
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];// Get the token from the 'Bearer' scheme

  if (!token) return res.status(401).json({ message: 'Access Denied' });// check if the token exists

  // verify the token hasn't expired
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.userId = decoded.userId;// Add user'id to request object for further use
      next();
  });
};

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Basic route for the server
app.get('/', (req, res) => {
  res.send('Welcome To ShutterStock!');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoute);
app.use('/admin', verifyToken, adminRoute);
app.use('/client', verifyToken, clientRoute);
app.use('/vendor', verifyToken, vendorRoute);
app.use('/vendor/product', vendorProductRoute);
app.use('/vendor/service', vendorServiceRoute);
//products
app.get('/products', productRoute.getAllProducts);
app.get('/services', productRoute.getAllServices);
app.get('/product/:id', productRoute.getById);
app.get('/product/tag/:search', productRoute.getByTag);
app.get('/product/category/:search', productRoute.getByCategory);
//tags
app.get('/tags', tagRoute.getAll);
app.get('/tag/:name', tagRoute.getByName);
//categories
app.get('/categories', categoryRoute.getAll);
app.get('/category/:name', categoryRoute.getByName);
// orders
app.use('/orders', verifyToken, orderRoute);

// Start the server
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server running on ${process.env.DOMAIN}${process.env.PORT}`);
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.DOMAIN}${process.env.PORT}`);
});
