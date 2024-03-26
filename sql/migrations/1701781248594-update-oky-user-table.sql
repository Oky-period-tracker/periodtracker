-- Default existing users NULL
ALTER TABLE oky_user
ADD date_signed_up timestamp DEFAULT NULL,
ADD date_account_saved timestamp DEFAULT NULL;

-- Change default for new users to now
ALTER TABLE oky_user ALTER COLUMN date_account_saved SET DEFAULT now();
