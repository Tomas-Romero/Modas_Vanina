-- Optional local/dev seed data. Run after 0001_init.sql if you want a few
-- real rows in Supabase instead of relying on the app's built-in sample-data
-- fallback. Replace the placeholder image URLs with real Cloudinary URLs.

insert into public.products (name, category, subcategory, images, description, availability)
values
  ('Vestido Florencia', 'indumentaria', 'Vestidos', '{}', 'Vestido liviano de corte suelto, estampa floral delicada.', 'en_stock'),
  ('Perfume Ámbar Nocturno', 'perfumeria', 'Perfumes', '{}', 'Fragancia amaderada con notas de ámbar y vainilla.', 'en_stock'),
  ('Crema Hidratante Corporal', 'cremas', 'Corporal', '{}', 'Crema de textura liviana con manteca de karité.', 'en_stock'),
  ('Set Tuppers Herméticos x4', 'tuppers', 'Cocina', '{}', 'Juego de 4 tuppers herméticos apilables.', 'en_stock'),
  ('Bolso Tote de Verano', 'varios', 'Bolsos', '{}', 'Bolso amplio de lona resistente.', 'en_stock');
