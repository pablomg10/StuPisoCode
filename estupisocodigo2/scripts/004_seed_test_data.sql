-- Seed test data for EsTuPiso platform
-- Note: This assumes you have created test users through the authentication system

-- Insert sample propietarios (property owners)
-- You'll need to replace these UUIDs with actual user IDs from your auth.users table
-- For now, this is just a template

-- Example: Insert a test propietario
-- First create the user through Supabase Auth, then insert here
-- INSERT INTO propietarios (id, nombre, email, telefono, verificado) VALUES
-- ('uuid-from-auth-users', 'Carmen López', 'carmen@example.com', '+34 923 123 456', true);

-- Insert sample matches (after creating test users)
-- INSERT INTO matches (profile_id, propietario_id, estado, compatibilidad) VALUES
-- ('student-uuid', 'owner-uuid', 'aceptado', 85);

-- Insert sample messages (after creating matches)
-- INSERT INTO mensajes (match_id, emisor_id, contenido) VALUES
-- ('match-uuid', 'user-uuid', '¡Hola! Me interesa el piso');

-- Insert sample valoraciones
-- INSERT INTO valoraciones (evaluador_id, evaluado_id, puntuacion, comentario, categorias) VALUES
-- ('user1-uuid', 'user2-uuid', 5, 'Excelente compañero de piso', '{"limpieza": 5, "comunicacion": 5, "respeto": 5}'::jsonb);

-- Note: Run this script after you have created test users through the signup flow
-- The UUIDs must match actual users in the auth.users table
