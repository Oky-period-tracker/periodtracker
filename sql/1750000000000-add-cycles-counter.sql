-- Add cycles counter to oky_user table
-- This migration adds a cyclesNumber column and creates a function to calculate cycles from period dates

-- Add cyclesNumber column to oky_user table
ALTER TABLE oky_user ADD COLUMN IF NOT EXISTS "cyclesNumber" integer DEFAULT 0;

-- Create function to calculate cycles from period dates
CREATE OR REPLACE FUNCTION calculate_cycles_from_period_dates(period_dates_json json)
RETURNS integer AS $$
DECLARE
    period_date json;
    verified_dates date[];
    curr_date date;
    prev_date date;
    days_diff integer;
    cycle_groups integer := 0;
    current_group_start date;
BEGIN
    -- Check if period_dates_json is valid and is an array
    IF period_dates_json IS NULL OR json_typeof(period_dates_json) != 'array' THEN
        RETURN 0;
    END IF;

    -- Extract and filter verified dates
    verified_dates := ARRAY(
        SELECT 
            CASE 
                WHEN split_part(period_date->>'date', '/', 3) || '-' || 
                     split_part(period_date->>'date', '/', 2) || '-' || 
                     split_part(period_date->>'date', '/', 1) ~ '^\d{4}-\d{2}-\d{2}$' 
                THEN (split_part(period_date->>'date', '/', 3) || '-' || 
                      split_part(period_date->>'date', '/', 2) || '-' || 
                      split_part(period_date->>'date', '/', 1))::date
                ELSE NULL
            END
        FROM json_array_elements(period_dates_json) AS period_date
        WHERE (period_date->>'userVerified')::boolean = true
        AND period_date->>'date' IS NOT NULL
        ORDER BY 
            CASE 
                WHEN split_part(period_date->>'date', '/', 3) || '-' || 
                     split_part(period_date->>'date', '/', 2) || '-' || 
                     split_part(period_date->>'date', '/', 1) ~ '^\d{4}-\d{2}-\d{2}$' 
                THEN (split_part(period_date->>'date', '/', 3) || '-' || 
                      split_part(period_date->>'date', '/', 2) || '-' || 
                      split_part(period_date->>'date', '/', 1))::date
                ELSE NULL
            END
    );

    -- Remove NULL values
    verified_dates := ARRAY(SELECT unnest(verified_dates) WHERE unnest(verified_dates) IS NOT NULL);

    -- If no verified dates, return 0
    IF array_length(verified_dates, 1) IS NULL OR array_length(verified_dates, 1) = 0 THEN
        RETURN 0;
    END IF;

    -- Count cycles by grouping consecutive dates (allowing 2-day gaps)
    cycle_groups := 1;
    current_group_start := verified_dates[1];

    FOR i IN 2..array_length(verified_dates, 1) LOOP
        curr_date := verified_dates[i];
        prev_date := verified_dates[i-1];
        days_diff := curr_date - prev_date;

        IF days_diff > 2 THEN
            -- Gap of 3+ days = new cycle (01-01 to 04-01 = 3 days = new cycle)
            cycle_groups := cycle_groups + 1;
            current_group_start := curr_date;
        END IF;
    END LOOP;

    RETURN cycle_groups;
END;
$$ LANGUAGE plpgsql;

-- Update existing users with calculated cycles
UPDATE oky_user 
SET "cyclesNumber" = COALESCE(
    CASE 
        WHEN metadata IS NOT NULL 
        AND metadata->'periodDates' IS NOT NULL 
        AND json_typeof(metadata->'periodDates') = 'array'
        THEN calculate_cycles_from_period_dates(metadata->'periodDates')
        ELSE 0
    END, 0
);
