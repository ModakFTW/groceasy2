import express from 'express';
import bcryptjs from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const { data, error } = await supabase.from('users').insert([
      {
        email,
        password_hash: hashedPassword,
        first_name: firstName || '',
        last_name: lastName || '',
        role: 'customer',
      },
    ]).select();

    if (error) {
      if (error.message.includes('duplicate')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw error;
    }

    const user = data[0];
    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcryptjs.compare(password, data.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(data.id, data.email, data.role);

    res.json({
      message: 'Login successful',
      user: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password required' });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    const { error } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('email', email);

    if (error) {
      throw error;
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

export default router;
