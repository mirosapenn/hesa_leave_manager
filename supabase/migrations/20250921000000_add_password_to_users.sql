-- Add password column to users table
ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS password text NOT NULL DEFAULT '';

-- Add comment for the password column
COMMENT ON COLUMN users.password IS 'Stores the plain text password for the user';

-- Update RLS policies to include password
CREATE POLICY "Users can update their own password" 
  ON users 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for superadmin to manage all passwords
CREATE POLICY "Superadmin can manage all passwords" 
  ON users 
  FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'superadmin'
  ));