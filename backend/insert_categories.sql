INSERT INTO "asset_categories" (id, name, description) VALUES
(gen_random_uuid(), 'ICT Equipment', 'Computers, printers, and IT devices'),
(gen_random_uuid(), 'Furniture', 'Desks, chairs, and office furniture'),
(gen_random_uuid(), 'Lab Tools', 'Laboratory equipment and tools')
ON CONFLICT (name) DO NOTHING;