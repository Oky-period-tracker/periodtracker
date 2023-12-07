-- Default existing users to 1970 sign up date
ALTER TABLE oky_user
ADD date_signed_up timestamp DEFAULT '2023-01-01 00:00:00.000000',
ADD date_account_saved timestamp DEFAULT '2023-01-01 00:00:00.000000';

-- Change defaults for new sign ups to now
ALTER TABLE oky_user ALTER COLUMN date_signed_up SET DEFAULT now();
ALTER TABLE oky_user ALTER COLUMN date_account_saved SET DEFAULT now();
