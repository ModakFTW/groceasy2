const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GrocEasy backend running' });
});

// Public
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Protected
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/orders', verifyToken, orderRoutes);

async function start() {
  try {
    await sequelize.sync({ alter: false });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
