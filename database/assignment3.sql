ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS inv_year  INT,
  ADD COLUMN IF NOT EXISTS inv_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS inv_miles INT,
  ADD COLUMN IF NOT EXISTS inv_color VARCHAR(30);

UPDATE public.inventory SET
  inv_year  = COALESCE(inv_year, 2020),
  inv_price = COALESCE(inv_price, 25000.00),
  inv_miles = COALESCE(inv_miles, 15000),
  inv_color = COALESCE(inv_color, 'Silver');

SELECT column_name
FROM information_schema.columns
WHERE table_schema='public' AND table_name='inventory'
  AND column_name IN ('inv_year','inv_price','inv_miles','inv_color')
ORDER BY column_name;

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS inv_year  INT,
  ADD COLUMN IF NOT EXISTS inv_price NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS inv_miles INT,
  ADD COLUMN IF NOT EXISTS inv_color VARCHAR(30);

INSERT INTO public.classification (classification_name)
VALUES ('Sport'), ('SUV'), ('Truck'), ('Sedan'), ('Custom')
ON CONFLICT (classification_name) DO NOTHING;
SELECT classification_name FROM public.classification ORDER BY 1;

-- Path fix 1 (double 'vehicles')
UPDATE public.inventory
SET inv_image     = REPLACE(inv_image,     '/images/vehicles/vehicles/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/vehicles/vehicles/', '/images/vehicles/');

-- Path fix 2 (normalize /images/ -> /images/vehicles/)
UPDATE public.inventory
SET inv_image = CASE
  WHEN inv_image LIKE '/images/vehicles/%' THEN inv_image
  ELSE REPLACE(inv_image, '/images/', '/images/vehicles/')
END,
    inv_thumbnail = CASE
  WHEN inv_thumbnail LIKE '/images/vehicles/%' THEN inv_thumbnail
  ELSE REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
END;

-- UPDATE existing vehicles to exact filenames/classifications
WITH mapping AS (
  SELECT * FROM (VALUES
    -- Sport
    ('Chevy','Camaro','Sport', 25000.00, 2019, '/images/vehicles/camaro-2019.jpg', '/images/vehicles/camaro-2019-tn.jpg'),
    ('Lamborghini','Adventador','Sport', 417650.00, 2020, '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg'),

    -- SUV
    ('Jeep','Wrangler','SUV', 28045.00, 2020, '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg'),

    -- Truck
    ('Cadillac','Escalade','Truck', 75195.00, 2020, '/images/vehicles/escalade.jpg', '/images/vehicles/escalade-tn.jpg'),
    ('GM','Hummer','Truck', 58800.00, 2020, '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg'),
    ('Spartan','Fire Truck','Truck', 50000.00, 2018, '/images/vehicles/fire-truck.jpg', '/images/vehicles/fire-truck-tn.jpg'),

    -- Sedan
    ('Mechanic','Special','Sedan', 100.00, 2000, '/images/vehicles/mechanic.jpg', '/images/vehicles/mechanic-tn.jpg'),
    ('Ford','Model T','Sedan', 30000.00, 1927, '/images/vehicles/model-t.jpg', '/images/vehicles/model-t-tn.jpg'),
    ('Ford','Crown Victoria','Sedan', 10000.00, 2011, '/images/vehicles/crwn-vic.jpg', '/images/vehicles/crwn-vic-tn.jpg'),

    -- Custom
    ('Batman','Batmobile Custom','Custom', NULL, 0, '/images/vehicles/batmobile.jpg', '/images/vehicles/batmobile-tn.jpg'),
    ('FBI','Surveillance Van','Custom', NULL, 0, '/images/vehicles/survan.jpg', '/images/vehicles/survan-tn.jpg'),
    ('Dumb & Dumber','Dog Car','Custom', NULL, 0, '/images/vehicles/dog-car.jpg', '/images/vehicles/dog-car-tn.jpg')
  ) AS t(inv_make, inv_model, classification_name, inv_price, inv_year, inv_image, inv_thumbnail)
)
UPDATE public.inventory i
SET inv_image         = m.inv_image,
    inv_thumbnail     = m.inv_thumbnail,
    inv_price         = COALESCE(m.inv_price, i.inv_price),
    inv_year          = NULLIF(m.inv_year,0),
    classification_id = c.classification_id
FROM mapping m
JOIN public.classification c
  ON c.classification_name = m.classification_name
WHERE i.inv_make = m.inv_make
  AND i.inv_model = m.inv_model;

-- INSERT any missing vehicles
WITH mapping AS (
  SELECT * FROM (VALUES
    -- Sport
    ('Chevy','Camaro','Sport', 25000.00, 2019, '/images/vehicles/camaro-2019.jpg', '/images/vehicles/camaro-2019-tn.jpg'),
    ('Lamborghini','Adventador','Sport', 417650.00, 2020, '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg'),

    -- SUV
    ('Jeep','Wrangler','SUV', 28045.00, 2020, '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg'),

    -- Truck
    ('Cadillac','Escalade','Truck', 75195.00, 2020, '/images/vehicles/escalade.jpg', '/images/vehicles/escalade-tn.jpg'),
    ('GM','Hummer','Truck', 58800.00, 2020, '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg'),
    ('Spartan','Fire Truck','Truck', 50000.00, 2018, '/images/vehicles/fire-truck.jpg', '/images/vehicles/fire-truck-tn.jpg'),

    -- Sedan
    ('Mechanic','Special','Sedan', 100.00, 2000, '/images/vehicles/mechanic.jpg', '/images/vehicles/mechanic-tn.jpg'),
    ('Ford','Model T','Sedan', 30000.00, 1927, '/images/vehicles/model-t.jpg', '/images/vehicles/model-t-tn.jpg'),
    ('Ford','Crown Victoria','Sedan', 10000.00, 2011, '/images/vehicles/crwn-vic.jpg', '/images/vehicles/crwn-vic-tn.jpg'),

    -- Custom
    ('Batman','Batmobile Custom','Custom', NULL, 0, '/images/vehicles/batmobile.jpg', '/images/vehicles/batmobile-tn.jpg'),
    ('FBI','Surveillance Van','Custom', NULL, 0, '/images/vehicles/survan.jpg', '/images/vehicles/survan-tn.jpg'),
    ('Dumb & Dumber','Dog Car','Custom', NULL, 0, '/images/vehicles/dog-car.jpg', '/images/vehicles/dog-car-tn.jpg')
  ) AS t(inv_make, inv_model, classification_name, inv_price, inv_year, inv_image, inv_thumbnail)
)
INSERT INTO public.inventory
  (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id, inv_price, inv_year, inv_miles, inv_color)
SELECT
  m.inv_make,
  m.inv_model,
  (m.inv_make || ' ' || m.inv_model) AS inv_description,
  m.inv_image,
  m.inv_thumbnail,
  c.classification_id,
  m.inv_price,
  NULLIF(m.inv_year,0),
  0,
  'Silver'
FROM mapping m
JOIN public.classification c
  ON c.classification_name = m.classification_name
LEFT JOIN public.inventory i
  ON i.inv_make = m.inv_make AND i.inv_model = m.inv_model
WHERE i.inv_id IS NULL;

-- Quick delete by make+model
DELETE FROM public.inventory
WHERE (inv_make = 'Ford'   AND inv_model = 'F-150')
   OR (inv_make = 'Toyota' AND inv_model = 'Camry');

-- Fill missing price/year/miles/color/description for known vehicles
WITH fill AS (
  SELECT * FROM (VALUES
    -- inv_make, inv_model, inv_price, inv_year, inv_miles, inv_color, inv_description
    ('Batman','Batmobile Custom',      1500000.00, 2022,  250,  'Black',  'Custom-built crime-fighting vehicle with rocket boost and advanced gadgets'),
    ('Cadillac','Escalade',             75195.00,  2020, 12000, 'Black',  'Full-size luxury SUV with V8 power and premium interior'),
    ('Chevy','Camaro',                  25000.00,  2019, 22000, 'Red',    'Performance coupe with sharp handling and classic muscle car styling'),
    ('Dumb & Dumber','Dog Car',         12000.00,  1994, 88000, 'White',    'Furry Mutt Cutts van replica—fun novelty ride'),
    ('FBI','Surveillance Van',          45000.00,  2018, 54000, 'Brown',  'Upfitted cargo van with surveillance equipment and roomy interior'),
    ('Ford','Crown Victoria',           10000.00,  2011, 90000, 'White', 'Legendary body-on-frame sedan with spacious cabin'),
    ('Ford','Model T',                  30000.00,  1927, 1200,  'Black',  'Antique pioneer of mass-produced automobiles'),
    ('GM','Hummer',                     58800.00,  2020, 15000, 'Silver', 'Rugged SUV known for off-road prowess and huge interior'),
    ('Jeep','Wrangler',                 28045.00,  2020, 18000, 'Yellow',  'Iconic off-roader with removable top and doors'),
    ('Lamborghini','Adventador',       417650.00,  2020,  3000, 'Orange', 'V12 supercar with scissor doors and dramatic styling'),
    ('Mazda','MX-5',                    25000.00,  2020, 15000, 'Blue',   'Lightweight roadster with joyful dynamics'),
    ('Mechanic','Special',                100.00,  2000, 200000,'Rust',   'Project car—needs work, sold as-is'),
    ('Porsche','911',                   25000.00,  2020, 15000, 'Silver', 'Iconic sport coupe with superb handling'),
    ('Spartan','Fire Truck',            50000.00,  2018, 35000, 'Red',    'Heavy-duty emergency response vehicle')
  ) AS t(inv_make, inv_model, inv_price, inv_year, inv_miles, inv_color, inv_description)
)
UPDATE public.inventory i
SET
  inv_price = COALESCE(i.inv_price, f.inv_price),
  inv_year  = COALESCE(i.inv_year,  f.inv_year),
  inv_miles = CASE
                WHEN i.inv_miles IS NULL OR i.inv_miles = 0 THEN f.inv_miles
                ELSE i.inv_miles
              END,
  inv_color = CASE
                WHEN i.inv_color IS NULL OR i.inv_color = '' THEN f.inv_color
                ELSE i.inv_color
              END,
  inv_description = CASE
                      WHEN i.inv_description IS NULL
                           OR i.inv_description = ''
                           OR i.inv_description = (i.inv_make || ' ' || i.inv_model)
                      THEN f.inv_description
                      ELSE i.inv_description
                    END
FROM fill f
WHERE i.inv_make = f.inv_make
  AND i.inv_model = f.inv_model;

-- Quick delete by make+model
DELETE FROM public.inventory
WHERE (inv_make = 'Mazda'   AND inv_model = 'MX-5')
   OR (inv_make = 'Porsche' AND inv_model = '911');
