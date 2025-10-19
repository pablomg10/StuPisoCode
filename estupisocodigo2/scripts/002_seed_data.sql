-- Seed initial data for EsTuPiso

-- Insert hero carousel images
INSERT INTO hero_images (image_url, title, subtitle, display_order, active) VALUES
('https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1600&h=900&fit=crop', 'Encuentra tu hogar perfecto', 'Conecta con compañeros ideales en Salamanca', 1, true),
('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&h=900&fit=crop', 'Vive la experiencia universitaria', 'Comparte momentos inolvidables', 2, true),
('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=900&fit=crop', 'Comunidad verificada', 'Estudiantes de confianza en toda la ciudad', 3, true),
('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&h=900&fit=crop', 'Tu espacio, tu estilo', 'Encuentra el piso que se adapta a ti', 4, true);

-- Insert sample testimonials
INSERT INTO testimonials (name, avatar_url, role, content, rating, featured) VALUES
('María García', 'https://i.pravatar.cc/150?img=1', 'Estudiante de Derecho', 'Encontré a mi compañera de piso ideal en menos de una semana. La plataforma es increíblemente fácil de usar y el sistema de matching realmente funciona.', 5, true),
('Carlos Ruiz', 'https://i.pravatar.cc/150?img=3', 'Estudiante de Ingeniería', 'Gracias a EsTuPiso encontré no solo un piso, sino también grandes amigos. El proceso de verificación me dio mucha confianza.', 5, true),
('Laura Martínez', 'https://i.pravatar.cc/150?img=5', 'Estudiante de Medicina', 'La mejor decisión que tomé fue usar esta plataforma. Ahora vivo con personas que comparten mis horarios y estilo de vida.', 5, true),
('Javier López', 'https://i.pravatar.cc/150?img=7', 'Estudiante de Filología', 'Excelente servicio. El mapa interactivo me ayudó a encontrar pisos cerca de la universidad. Muy recomendable.', 5, true);

-- Insert sample properties
INSERT INTO properties (title, description, address, price_monthly, bedrooms, bathrooms, size_sqm, available_from, images, amenities, active) VALUES
('Piso céntrico cerca de la Universidad', 'Amplio piso de 3 habitaciones en el centro de Salamanca, a 5 minutos andando de la Plaza Mayor.', 'Calle Toro, 15', 350, 3, 2, 85, '2024-09-01', 
'["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"]'::jsonb,
'["WiFi", "Calefacción", "Lavadora", "Cocina equipada"]'::jsonb, true),

('Habitación en piso compartido', 'Habitación individual en piso compartido con otros estudiantes. Ambiente tranquilo y acogedor.', 'Avenida de Mirat, 8', 280, 4, 2, 95, '2024-09-01',
'["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"]'::jsonb,
'["WiFi", "Calefacción", "Terraza", "Ascensor"]'::jsonb, true),

('Estudio moderno zona universitaria', 'Estudio completamente reformado, perfecto para estudiante. Muy luminoso y bien comunicado.', 'Calle Libreros, 22', 450, 1, 1, 40, '2024-10-01',
'["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"]'::jsonb,
'["WiFi", "Aire acondicionado", "Cocina americana", "Amueblado"]'::jsonb, true);
