-- Default existing users NULL
ALTER TABLE oky_user
ADD date_signed_up timestamp DEFAULT NULL,
ADD date_account_saved timestamp DEFAULT NULL;

-- Change defaults for new sign ups to now
ALTER TABLE oky_user ALTER COLUMN date_signed_up SET DEFAULT now();
ALTER TABLE oky_user ALTER COLUMN date_account_saved SET DEFAULT now();
