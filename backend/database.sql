CREATE TABLE IF NOT EXISTS cat_breeds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  origin VARCHAR(100) NOT NULL,
  temperament VARCHAR(255) DEFAULT '',
  description TEXT,
  image_url TEXT,
  lifespan VARCHAR(50) DEFAULT '',
  popularity INT NOT NULL DEFAULT 0,
  search_count INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed data (skip if the table already has rows)
-- Photos are Wikimedia Commons 960px thumbnails (stable, hotlinkable, no API key).
-- popularity / search_count power the "Most Popular" / "Most Searched" filters.
INSERT INTO cat_breeds (name, origin, temperament, description, image_url, lifespan, popularity, search_count) VALUES
('Persian', 'Iran (Persia)', 'Gentle, Quiet, Affectionate', 'Famous for its long, luxurious coat and sweet, calm personality. An ideal lap cat.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Chocolate_Persian.jpg/960px-Chocolate_Persian.jpg', '12-17 years', 82, 64),
('Maine Coon', 'United States (Maine)', 'Playful, Friendly, Social', 'One of the largest domesticated breeds, known for its tufted ears and dog-like loyalty.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Maine_Coon_male_NO_Sigdalskauen_Balder.jpg/960px-Maine_Coon_male_NO_Sigdalskauen_Balder.jpg', '12-15 years', 95, 88),
('Siamese', 'Thailand', 'Affectionate, Vocal, Social', 'The original talker - sleek, point-colored, and endlessly chatty with its humans.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Siamese_cat%2C_female.jpg/960px-Siamese_cat%2C_female.jpg', '15-20 years', 90, 91),
('Bengal', 'United States', 'Active, Energetic, Playful', 'A wild-looking domestic with leopard rosettes that loves climbing, water, and play.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Bengal_-_18.jpg/960px-Bengal_-_18.jpg', '12-16 years', 88, 74),
('Ragdoll', 'United States', 'Gentle, Relaxed, Docile', 'Goes limp when held - famously floppy, affectionate, and stunningly blue-eyed.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Seal_Point_mitted_Ragdoll_BreedingCat.jpg/960px-Seal_Point_mitted_Ragdoll_BreedingCat.jpg', '12-17 years', 86, 81),
('Scottish Fold', 'United Kingdom', 'Sweet, Loyal, Adaptable', 'Distinctive folded ears frame a round, owl-like face full of charm.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Scottish_Fold_cat_%28blue%29.jpg/960px-Scottish_Fold_cat_%28blue%29.jpg', '11-15 years', 78, 69),
('British Shorthair', 'United Kingdom', 'Easygoing, Calm, Affectionate', 'A plush teddy-bear classic with chubby cheeks and a famously chill mood.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gray_British_Shorthair_with_closed_eyes_in_Dubai.jpg/960px-Gray_British_Shorthair_with_closed_eyes_in_Dubai.jpg', '12-20 years', 93, 86),
('Sphynx', 'Canada', 'Energetic, Curious, Friendly', 'Hairless, wrinkled, and impossibly outgoing - a warm little gremlin that craves attention.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/20170604_Sphynx_cat_7984.jpg/960px-20170604_Sphynx_cat_7984.jpg', '13-15 years', 74, 58);