ALTER TYPE account_type_enum ADD VALUE IF NOT EXISTS 'Employee';
ALTER TYPE account_type_enum ADD VALUE IF NOT EXISTS 'Client';

DO $$
BEGIN
  BEGIN
    ALTER TYPE account_type_enum ADD VALUE 'Employee';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER TYPE account_type_enum ADD VALUE 'Client';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

ALTER TABLE account
  ALTER COLUMN account_type SET DEFAULT 'Client';

UPDATE account
SET account_type = 'Client'
WHERE account_type::text = 'User';