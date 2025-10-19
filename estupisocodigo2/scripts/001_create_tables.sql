-- Create tables for EsTuPiso platform

-- Hero carousel images
CREATE TABLE IF NOT EXISTS hero_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (students)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  university TEXT,
  degree TEXT,
  year_of_study INTEGER,
  budget_min INTEGER,
  budget_max INTEGER,
  preferences JSONB,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties (pisos)
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Salamanca',
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_monthly INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  size_sqm INTEGER,
  available_from DATE,
  images JSONB,
  amenities JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches between users
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id),
  user2_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  compatibility_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Messages between users
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_monthly);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(active);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(sender_id, receiver_id);
