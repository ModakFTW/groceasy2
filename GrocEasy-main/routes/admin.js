import express from 'express';
import { supabase } from '../config/supabase.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const { data: totalOrders } = await supabase
      .from('orders')
      .select('id', { count: 'exact' });

    const { data: totalRevenue } = await supabase
      .from('orders')
      .select('total');

    const { data: lowStock } = await supabase
      .from('products')
      .select('id, name, stock, min_stock')
      .lt('stock', 'min_stock');

    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id(email, first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const revenue = totalRevenue?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    res.json({
      totalOrders: totalOrders?.length || 0,
      totalRevenue: revenue,
      lowStockItems: lowStock || [],
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/inventory', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id(name)
      `)
      .order('name');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, description, price, categoryId, stock, minStock, imageUrl } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          category_id: categoryId,
          stock: stock || 0,
          min_stock: minStock || 10,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Product created', product: data[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:productId', async (req, res) => {
  try {
    const { name, description, price, stock, minStock, imageUrl } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        stock,
        min_stock: minStock,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.params.productId)
      .select();

    if (error || !data.length) {
      throw error;
    }

    res.json({ message: 'Product updated', product: data[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:productId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.productId);

    if (error) {
      throw error;
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, slug, description, imageUrl } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug required' });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name,
          slug,
          description,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'Category created', category: data[0] });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabase.from('orders').select(`
      *,
      users:user_id(email, first_name, last_name),
      order_items(
        id,
        quantity,
        price,
        product_id,
        products:product_id(name)
      )
    `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({ orders: data, total: count, page, limit });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.orderId)
      .select();

    if (error || !data.length) {
      throw error;
    }

    res.json({ message: 'Order status updated', order: data[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
