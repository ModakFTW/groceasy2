import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/orders', verifyToken, orderRoutes);
app.use('/api/admin', verifyToken, adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Grocery store API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
