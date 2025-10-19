-- Create a stored procedure to upsert profiles
-- This bypasses the schema cache issue by using a database function

CREATE OR REPLACE FUNCTION upsert_profile(
  p_id UUID,
  p_nombre TEXT,
  p_email TEXT,
  p_edad INTEGER DEFAULT NULL,
  p_carrera TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_genero TEXT DEFAULT NULL,
  p_tipo_vivienda TEXT DEFAULT NULL,
  p_zona TEXT DEFAULT NULL,
  p_presupuesto INTEGER DEFAULT NULL,
  p_fumador BOOLEAN DEFAULT false,
  p_mascotas BOOLEAN DEFAULT false,
  p_fiestas BOOLEAN DEFAULT false,
  p_limpieza TEXT DEFAULT NULL,
  p_horario TEXT DEFAULT NULL,
  p_intereses TEXT[] DEFAULT NULL,
  p_foto TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (
    id, nombre, email, edad, carrera, bio, genero,
    tipo_vivienda_preferida, zona_preferida, presupuesto_max,
    fumador, mascotas, fiestas, nivel_limpieza, horario,
    intereses, foto_perfil, updated_at
  )
  VALUES (
    p_id, p_nombre, p_email, p_edad, p_carrera, p_bio, p_genero,
    p_tipo_vivienda, p_zona, p_presupuesto,
    p_fumador, p_mascotas, p_fiestas, p_limpieza, p_horario,
    p_intereses, p_foto, NOW()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    nombre = EXCLUDED.nombre,
    email = EXCLUDED.email,
    edad = EXCLUDED.edad,
    carrera = EXCLUDED.carrera,
    bio = EXCLUDED.bio,
    genero = EXCLUDED.genero,
    tipo_vivienda_preferida = EXCLUDED.tipo_vivienda_preferida,
    zona_preferida = EXCLUDED.zona_preferida,
    presupuesto_max = EXCLUDED.presupuesto_max,
    fumador = EXCLUDED.fumador,
    mascotas = EXCLUDED.mascotas,
    fiestas = EXCLUDED.fiestas,
    nivel_limpieza = EXCLUDED.nivel_limpieza,
    horario = EXCLUDED.horario,
    intereses = EXCLUDED.intereses,
    foto_perfil = EXCLUDED.foto_perfil,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upsert_profile TO authenticated;
