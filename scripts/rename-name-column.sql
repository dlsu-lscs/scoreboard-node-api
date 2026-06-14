ALTER TABLE scores ADD COLUMN name VARCHAR(255) AFTER member_id;

UPDATE scores
SET name = TRIM(CONCAT(IFNULL(first_name, ''), ' ', IFNULL(last_name, '')))
WHERE first_name IS NOT NULL OR last_name IS NOT NULL;

ALTER TABLE scores DROP COLUMN first_name;
ALTER TABLE scores DROP COLUMN last_name;
