ALTER TABLE stockdetails
    DROP COLUMN IF EXISTS id;

ALTER TABLE stockdetails
    DROP CONSTRAINT IF EXISTS id;

ALTER TABLE stockdetails
    DROP CONSTRAINT IF EXISTS stockdetails_pkey;

ALTER TABLE stockdetails
    ADD CONSTRAINT details_id PRIMARY KEY (details_id);
