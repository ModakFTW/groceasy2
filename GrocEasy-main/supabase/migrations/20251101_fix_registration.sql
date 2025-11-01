/*
  # Fix User Registration
  
  Allow anonymous users to register (INSERT into users table)
  This is needed because the app uses custom JWT auth instead of Supabase Auth
*/

CREATE POLICY "Allow user registration"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow users to insert order items when creating orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
