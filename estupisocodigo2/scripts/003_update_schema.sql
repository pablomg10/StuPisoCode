-- Update schema to match authentication system
-- This script aligns the database with the profiles/propietarios structure

-- Drop old tables if they exist (be careful in production!)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Profiles table (students looking for housing)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Propietarios table (property owners)
CREATE TABLE IF NOT EXISTS propietarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  foto_perfil TEXT,
  verificado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table (connections between students and property owners)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  propietario_id UUID REFERENCES propietarios(id) ON DELETE CASCADE,
  estado TEXT DEFAULT 'pendiente', -- pendiente, aceptado, rechazado
  compatibilidad INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, propietario_id)
);

-- Mensajes table (chat messages between matched users)
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  emisor_id UUID NOT NULL,
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Valoraciones table (ratings and reviews)
CREATE TABLE IF NOT EXISTS valoraciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluador_id UUID NOT NULL,
  evaluado_id UUID NOT NULL,
  puntuacion INTEGER CHECK (puntuacion >= 1 AND puntuacion <= 5),
  comentario TEXT,
  categorias JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(evaluador_id, evaluado_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_zona ON profiles(zona_preferida);
CREATE INDEX IF NOT EXISTS idx_propietarios_email ON propietarios(email);
CREATE INDEX IF NOT EXISTS idx_matches_profile ON matches(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_propietario ON matches(propietario_id);
CREATE INDEX IF NOT EXISTS idx_matches_estado ON matches(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_match ON mensajes(match_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_emisor ON mensajes(emisor_id);
CREATE INDEX IF NOT EXISTS idx_valoraciones_evaluado ON valoraciones(evaluado_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE propietarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for propietarios
CREATE POLICY "Users can view all propietarios"
  ON propietarios FOR SELECT
  USING (true);

CREATE POLICY "Propietarios can update own profile"
  ON propietarios FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Propietarios can insert own profile"
  ON propietarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches"
  ON matches FOR SELECT
  USING (auth.uid() = profile_id OR auth.uid() = propietario_id);

CREATE POLICY "Users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.uid() = profile_id OR auth.uid() = propietario_id);

CREATE POLICY "Users can update their own matches"
  ON matches FOR UPDATE
  USING (auth.uid() = profile_id OR auth.uid() = propietario_id);

-- RLS Policies for mensajes
CREATE POLICY "Users can view messages in their matches"
  ON mensajes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = mensajes.match_id
      AND (matches.profile_id = auth.uid() OR matches.propietario_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches"
  ON mensajes FOR INSERT
  WITH CHECK (
    auth.uid() = emisor_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND (matches.profile_id = auth.uid() OR matches.propietario_id = auth.uid())
    )
  );

-- RLS Policies for valoraciones
CREATE POLICY "Users can view all valoraciones"
  ON valoraciones FOR SELECT
  USING (true);

CREATE POLICY "Users can create valoraciones"
  ON valoraciones FOR INSERT
  WITH CHECK (auth.uid() = evaluador_id);

CREATE POLICY "Users can update their own valoraciones"
  ON valoraciones FOR UPDATE
  USING (auth.uid() = evaluador_id);

-- Enable realtime for mensajes table
ALTER PUBLICATION supabase_realtime ADD TABLE mensajes;
