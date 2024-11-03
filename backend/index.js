// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome To ShutterStock!');
});

const authRoute = require('./routes/Auth');
const adminRoute = require('./routes/Admin');
const clientRoute = require('./routes/Client');
const vendorProductRoute = require('./routes/VendorProduct');
const vendorServiceRoute = require('./routes/VendorService');

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/client', clientRoute);
app.use('/vendor/product', vendorProductRoute);
app.use('/vendor/service', vendorServiceRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
