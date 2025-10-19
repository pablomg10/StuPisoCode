-- Ensure profiles table exists with correct schema
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  edad INTEGER,
  carrera TEXT,
  bio TEXT,
  genero TEXT,
  tipo_vivienda_preferida TEXT,
  zona_preferida TEXT,
  presupuesto_max INTEGER,
  fumador BOOLEAN DEFAULT false,
  mascotas BOOLEAN DEFAULT false,
  fiestas BOOLEAN DEFAULT false,
  nivel_limpieza TEXT,
  horario TEXT,
  intereses TEXT[],
  foto_perfil TEXT,
  tipo_usuario TEXT DEFAULT 'estudiante',
  verificado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create RLS policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_tipo_usuario ON profiles(tipo_usuario);
