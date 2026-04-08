-- Seed Some Default Users
INSERT INTO users (email, password, first_name, last_name, role, provider, provider_id, created_at)
VALUES
('admin@homestay.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUruv.Q4H21C', 'Super', 'Admin', 'ROLE_ADMIN', 'LOCAL', NULL, NOW()),
('host@homestay.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUruv.Q4H21C', 'John', 'Host', 'ROLE_HOST', 'LOCAL', NULL, NOW()),
('guide@homestay.com', '$2a$10$W2neF9.6Agi6kAKVq8q3fec5dHW8KUA.b0VSIGdIZyUruv.Q4H21C', 'Local', 'Guide', 'ROLE_GUIDE', 'LOCAL', NULL, NOW());
-- Password for all is 'password'

-- Seed Some Listings (Host ID is 2)
INSERT INTO listings (host_id, title, description, location, price_per_night, active, created_at)
VALUES
(2, 'Beautiful Beachfront Villa', 'Enjoy your stay at this wonderful villa right on the beach.', 'Goa, India', 5000.00, true, NOW()),
(2, 'Cozy Mountain Cabin', 'A nice cabin in the Himalayas, perfect for winter vacations.', 'Manali, India', 3500.00, true, NOW());

-- Seed Some Recommendations (Guide ID is 3)
INSERT INTO recommendations (guide_id, title, content, location, created_at)
VALUES
(3, 'Best seafood in Goa', 'Make sure to visit Fisherman Wharf for authentic seafood.', 'Goa, India', NOW()),
(3, 'Trekking routes in Manali', 'The Beas Kund trek offers the best views of the mountains.', 'Manali, India', NOW());
