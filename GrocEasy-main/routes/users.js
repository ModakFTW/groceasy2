import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, address, city, postal_code, role, created_at')
      .eq('id', req.user.userId)
      .single();

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, postalCode } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        city,
        postal_code: postalCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.userId)
      .select();

    if (error) {
      throw error;
    }

    res.json({ message: 'Profile updated successfully', user: data[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
