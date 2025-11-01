import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          quantity,
          price,
          product_id,
          products:product_id(name, image_url)
        )
      `)
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          quantity,
          price,
          product_id,
          products:product_id(name, image_url)
        )
      `)
      .eq('id', req.params.orderId)
      .eq('user_id', req.user.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address required' });
    }

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('product_id, quantity, products:product_id(price)')
      .eq('user_id', req.user.userId);

    if (cartError || !cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
    const tax = subtotal * 0.0975;
    const deliveryFee = 331;
    const total = subtotal + tax + deliveryFee;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: req.user.userId,
          subtotal,
          tax,
          delivery_fee: deliveryFee,
          total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod || 'cash_on_delivery',
          status: 'pending',
        },
      ])
      .select();

    if (orderError) {
      throw orderError;
    }

    const orderId = order[0].id;

    const orderItemsData = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      throw itemsError;
    }

    await supabase.from('cart_items').delete().eq('user_id', req.user.userId);

    res.status(201).json({
      message: 'Order created successfully',
      order: order[0],
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/:orderId/cancel', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', req.params.orderId)
      .eq('user_id', req.user.userId)
      .select();

    if (error || !data.length) {
      throw error;
    }

    res.json({ message: 'Order cancelled', order: data[0] });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
