-- Add phone and address columns to users table
ALTER TABLE users ADD COLUMN phone VARCHAR(15) NULL;
ALTER TABLE users ADD COLUMN address TEXT NULL;