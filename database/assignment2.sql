/* ============================================================================
   Assignment 2 – Tasks 1 & 2 in ONE FILE
   ============================================================================ */

-- ============================================================================
-- A) TASK TWO – DESTROY and REBUILD the DATABASE STRUCTURE
--    (drop existing objects, create enum type, three tables, and seed data)
-- ============================================================================

BEGIN;

-- ---- Destroy (drop in dependency order) ------------------------------------
DROP TABLE IF EXISTS inventory       CASCADE;
DROP TABLE IF EXISTS account         CASCADE;
DROP TABLE IF EXISTS classification  CASCADE;

-- Drop the custom type if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type_enum') THEN
    DROP TYPE account_type_enum;
  END IF;
END$$;

-- ---- Rebuild ---------------------------------------------------------------

-- 1) PostgreSQL TYPE (enum) for account_type (assignment requires a Type)
CREATE TYPE account_type_enum AS ENUM ('User', 'Admin');

-- 2) Tables

-- classification: reference data (seeded)
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) UNIQUE NOT NULL
);

-- account: user accounts
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname  VARCHAR(50) NOT NULL,
  account_email     VARCHAR(100) UNIQUE NOT NULL,
  account_password  VARCHAR(100) NOT NULL,
  account_type      account_type_enum NOT NULL DEFAULT 'User'
);

-- inventory: vehicles
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make        VARCHAR(50) NOT NULL,
  inv_model       VARCHAR(50) NOT NULL,
  inv_description TEXT,
  inv_image       VARCHAR(255),
  inv_thumbnail   VARCHAR(255),
  classification_id INT NOT NULL REFERENCES classification(classification_id)
);

-- 3) Seed data (populate TWO of the tables: classification and inventory)

-- classification seeds (ensure "Sport" exists)
INSERT INTO classification (classification_name) VALUES
  ('Sport'), ('SUV'), ('Truck'), ('Sedan')
ON CONFLICT (classification_name) DO NOTHING;

-- Get ids to keep inserts readable
WITH ids AS (
  SELECT
    MAX(CASE WHEN classification_name = 'Sport' THEN classification_id END) AS sport_id,
    MAX(CASE WHEN classification_name = 'SUV'   THEN classification_id END) AS suv_id,
    MAX(CASE WHEN classification_name = 'Truck' THEN classification_id END) AS truck_id,
    MAX(CASE WHEN classification_name = 'Sedan' THEN classification_id END) AS sedan_id
  FROM classification
)
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
SELECT * FROM (
  VALUES
    -- Ensure at least TWO Sport items (for Task 1 #5 to return two rows)
    ('Porsche','911','Iconic sport coupe with small interiors and superb handling','/images/porsche-911.jpg','/images/porsche-911-tn.jpg', (SELECT sport_id FROM ids)),
    ('Mazda','MX-5','Lightweight roadster with small interiors and joyful dynamics','/images/mazda-mx5.jpg','/images/mazda-mx5-tn.jpg', (SELECT sport_id FROM ids)),

    -- The GM Hummer with phrase "small interiors" (for Task 1 #4 replace)
    ('GM','Hummer','Rugged SUV known for off-road prowess but small interiors in earlier trims','/images/gm-hummer.jpg','/images/gm-hummer-tn.jpg', (SELECT suv_id FROM ids)),

    ('Ford','F-150','Popular truck with versatile configurations','/images/ford-f150.jpg','/images/ford-f150-tn.jpg', (SELECT truck_id FROM ids)),
    ('Toyota','Camry','Reliable mid-size sedan for families','/images/toyota-camry.jpg','/images/toyota-camry-tn.jpg', (SELECT sedan_id FROM ids))
) AS inv(inv_make,inv_model,inv_description,inv_image,inv_thumbnail,classification_id);

COMMIT;

-- ============================================================================
-- B) TASK ONE – SIX QUERIES (each as a single statement)
-- ============================================================================

-- 1) Insert Tony Stark (account_id and account_type are handled by defaults)
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- 2) Update Tony Stark to Admin (single-record WHERE; using email here)
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


-- 3) Delete Tony Stark (single-record WHERE)
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


-- 4) Update GM Hummer description: replace 'small interiors' with 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- 5) INNER JOIN: inventory + classification for the 'Sport' category
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


-- 6) Single UPDATE to add '/vehicles' to both inv_image and inv_thumbnail paths
UPDATE inventory
SET inv_image     = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


-- ========================================================================================
-- C) TASK TWO REQUIREMENT: repeat Task 1 queries #4 and #6 at the END of the rebuild file.
-- ========================================================================================

-- (Copy of Task One #4)
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- (Copy of Task One #6)
UPDATE inventory
SET inv_image     = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
