-- Create translations table for CMS-managed translations
-- Unified table for both accessibility labels and regular UI translations
-- This migration creates the table and populates it with all translations from app translation files

-- Enable uuid-ossp extension for UUID generation (required for PostgreSQL < 13)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table (renamed from accessibility_labels to translations)
CREATE TABLE IF NOT EXISTS "periodtracker"."translations" (
    "id" uuid NOT NULL,
    "key" character varying NOT NULL,
    "label" character varying NOT NULL,
    "type" character varying DEFAULT 'ui',
    "live" boolean NOT NULL,
    "lang" character varying NOT NULL,
    CONSTRAINT "PK_translations" PRIMARY KEY ("id")
) WITH (oids = false);

-- Create indexes on key and lang for faster lookups
CREATE INDEX IF NOT EXISTS "IDX_translations_key" ON "periodtracker"."translations" ("key");
CREATE INDEX IF NOT EXISTS "IDX_translations_lang" ON "periodtracker"."translations" ("lang");
CREATE INDEX IF NOT EXISTS "IDX_translations_lang_live" ON "periodtracker"."translations" ("lang", "live");
CREATE INDEX IF NOT EXISTS "IDX_translations_type" ON "periodtracker"."translations" ("type");
CREATE INDEX IF NOT EXISTS "IDX_translations_lang_type" ON "periodtracker"."translations" ("lang", "type");

-- Add comment to describe the type field
COMMENT ON COLUMN "periodtracker"."translations"."type" IS 'Translation type: "accessibility" for screen reader labels (useAccessibilityLabel hook), "ui" for regular UI text (useTranslate hook). Default: "ui".';

-- Insert translations from existing app translation files
-- This populates the translations table with all translations
-- from the app translation files (en, fr, es, pt, ru)
-- Includes: accessibility labels + all new avatar/theme/customizer translations
-- Note: UUIDs are generated using uuid_generate_v4() from uuid-ossp extension (compatible with PostgreSQL 10+)
-- All translations are set to live=true by default
-- ON CONFLICT DO NOTHING ensures idempotency (safe to run multiple times)

-- English (en) translations
-- Note: type field - 'accessibility' for screen reader labels, 'ui' for regular UI text
INSERT INTO "periodtracker"."translations" ("id", "key", "label", "type", "live", "lang")
VALUES
  -- Avatar & Theme Selection (Accessibility Labels)
  (uuid_generate_v4(), 'select_avatar_button', 'Select avatar', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'select_theme_button', 'Select theme', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'select_color_button', 'Select color', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'select_option_button', 'Select option', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'select_category_button', 'Select category', 'accessibility', true, 'en'),
  
  -- Navigation & Actions (Accessibility Labels)
  (uuid_generate_v4(), 'previous_page_button', 'Previous page', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'next_page_button', 'Next page', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'arrow_button', 'Arrow button', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'continue', 'continue', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'confirm', 'confirm', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'close', 'Close', 'accessibility', true, 'en'),
  
  -- Customizer (Accessibility Labels)
  (uuid_generate_v4(), 'customizer_exit', 'Exit', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_save_friend', 'Save your Oky friend', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'tutorial_button', 'Tutorial', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'skip_tutorial_button', 'Skip tutorial', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'close_tooltip_button', 'Close tooltip', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_back', 'Back', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_next', 'Next', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_finish', 'Finish', 'ui', true, 'en'),
  
  -- Naming Modal (Accessibility Labels)
  (uuid_generate_v4(), 'name_input', 'Enter your friend''s name', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'skip_name_button', 'Skip naming', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'save_and_continue_button', 'Save and continue', 'accessibility', true, 'en'),
  
  -- Friend Unlock Modal (Accessibility Labels)
  (uuid_generate_v4(), 'friend_unlock_modal_title', 'Hooray! All 3 locks are open, you can create your own Oky friend now.', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'friend_unlock_modal_button', 'Create your new Oky friend!', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'friend_unlock_celebration_image', 'Celebration animation showing unlocked friend avatar feature', 'accessibility', true, 'en'),
  
  -- General UI (Accessibility Labels)
  (uuid_generate_v4(), 'name_info_label', 'The name you will use to sign in to Oky. Minimum 3 characters', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'privacy_policy_link', 'Link to the  Privacy Policy for Oky', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 't_and_c_link', 'Link to the  Privacy Policy for Oky', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'i_agree', 'I agree', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'month_selector', 'month selector', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'search_country', 'search country', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'clear_search', 'Clear search', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'info_button', 'information button', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'accessibility_prompt', 'Double tap to activate', 'accessibility', true, 'en'),
  
  -- Customizer Tutorial Translations (UI Text)
  (uuid_generate_v4(), 'customizer_tutorial_title', 'How to create your Oky friend', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_title', 'Start creating your Oky friend!', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_text', 'Tap the buttons (Body, Hair, Eyes, Clothes and Personal items) to create your own friend.\n\nYou can move between buttons and see changes right away', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_title', 'Select colors', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_text', 'Tap the color buttons to change skin, hair or eye color.\n\nUse the arrows or swipe to see more options. Tap to choose a color.', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_title', 'See more options', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_text', 'To see more options use arrows or swipe for more colors.', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_title', 'Personal items', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_text', 'Add one or more personal items for your Oky friend.', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_title', 'Finished?', 'ui', true, 'en'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_text', 'Tap ''Save your friend'' to save your changes.\nTap ''Exit'' to leave. Your last change will not be saved.\n\nDo not worry, you can always come back and change your Oky friend.', 'ui', true, 'en'),
  
  -- Clothing Item Translations (17 items) - Accessibility Labels (only used in screen readers, not displayed as visible text)
  (uuid_generate_v4(), 'customizer_clothing_dress1', 'Dress 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_dress2', 'Dress 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_dress3', 'Dress 3', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_longdressbelt', 'Long dress with belt', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt1', 'Shorts and shirt 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt2', 'Shorts and shirt 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt3', 'Shorts and shirt 3', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_skirtandshirt', 'Skirt and shirt', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_shirtandpants', 'Shirt and pants', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_blazer1', 'Blazer 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_blazer2', 'Blazer 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_jumper', 'Jumper', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_cape', 'Cape', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_hijab', 'Hijab', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_longuniform', 'Long uniform', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_traditional1', 'Traditional outfit 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_traditional2', 'Traditional outfit 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_traditional3', 'Traditional outfit 3', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_traditional4', 'Traditional outfit 4', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_clothing_traditional5', 'Traditional outfit 5', 'accessibility', true, 'en'),
  
  -- Personal Item (Device) Translations (25 items) - Accessibility Labels (only used in screen readers, not displayed as visible text)
  (uuid_generate_v4(), 'customizer_device_glasses', 'Glasses', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_readingglasses2', 'Reading glasses', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_darkglasses', 'Dark glasses', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_sunglass1', 'Sunglasses 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_sunglass2', 'Sunglasses 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_crown', 'Crown', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_hat', 'Hat', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_beanie', 'Beanie', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_beanie2', 'Beanie 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_buckethat', 'Bucket hat', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_cap', 'Cap', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_sunhat', 'Sun hat', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_headband', 'Headband', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_head', 'Head accessory', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_flowers', 'Flowers', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_bandana', 'Bandana', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_headphones', 'Headphones', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_necklace1', 'Necklace 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_necklace2', 'Necklace 2', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_necklace3', 'Necklace 3', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_earings', 'Earrings', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_purse', 'Purse', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_cane', 'Cane', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_prostetic1', 'Prosthetic 1', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_device_prostetic2', 'Prosthetic 2', 'accessibility', true, 'en'),
  
  -- Skin Color Translations (12 colors) - Accessibility Labels (only used in screen readers, not displayed as visible text)
  (uuid_generate_v4(), 'customizer_skin_color_light_pink', 'Light pink', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_peach', 'Peach', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_beige', 'Beige', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_tan', 'Tan', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_dark_brown', 'Dark brown', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_light_tan', 'Light tan', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_medium_brown', 'Medium brown', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_cream', 'Cream', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_bronze', 'Bronze', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_ivory', 'Ivory', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_sand', 'Sand', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_caramel', 'Caramel', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_skin_color_unknown', 'Unknown skin color', 'accessibility', true, 'en'),
  
  -- Hair Color Translations (11 colors) - Accessibility Labels (only used in screen readers, not displayed as visible text)
  (uuid_generate_v4(), 'customizer_hair_color_black', 'Black', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_brown', 'Brown', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_red', 'Red', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_blonde', 'Blonde', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_green', 'Green', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_pink', 'Pink', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_orange', 'Orange', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_purple', 'Purple', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_dark_brown', 'Dark brown', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_bright_orange', 'Bright orange', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_blue', 'Blue', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_hair_color_unknown', 'Unknown hair color', 'accessibility', true, 'en'),
  
  -- Eye Color Translations (6 colors) - Accessibility Labels (only used in screen readers, not displayed as visible text)
  (uuid_generate_v4(), 'customizer_eye_color_black', 'Black', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_eye_color_brown', 'Brown', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_eye_color_hazel', 'Hazel', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_eye_color_green', 'Green', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_eye_color_blue', 'Blue', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_eye_color_gray', 'Gray', 'accessibility', true, 'en'),
  (uuid_generate_v4(), 'customizer_eye_color_unknown', 'Unknown eye color', 'accessibility', true, 'en')
ON CONFLICT DO NOTHING;

-- French (fr) translations
-- Note: type field - 'accessibility' for screen reader labels, 'ui' for regular UI text
INSERT INTO "periodtracker"."translations" ("id", "key", "label", "type", "live", "lang")
VALUES
  -- Avatar & Theme Selection
  (uuid_generate_v4(), 'select_avatar_button', 'Sélectionner un avatar', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'select_theme_button', 'Sélectionner un thème', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'select_color_button', 'Sélectionner une couleur', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'select_option_button', 'Sélectionner une option', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'select_category_button', 'Sélectionner une catégorie', 'accessibility', true, 'fr'),
  
  -- Navigation & Actions
  (uuid_generate_v4(), 'previous_page_button', 'Page précédente', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'next_page_button', 'Page suivante', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'arrow_button', 'Bouton flèche', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'continue', 'continuer', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'confirm', 'confirmer', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'close', 'Fermer', 'accessibility', true, 'fr'),
  
  -- Customizer
  (uuid_generate_v4(), 'customizer_exit', 'Quitter', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_save_friend', 'Enregistrer votre ami Oky', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'tutorial_button', 'Tutoriel', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'skip_tutorial_button', 'Passer le tutoriel', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'close_tooltip_button', 'Fermer l''info-bulle', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_back', 'Retour', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_next', 'Suivant', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_finish', 'Terminer', 'ui', true, 'fr'),
  
  -- Naming Modal
  (uuid_generate_v4(), 'name_input', 'Entrez le nom de votre ami', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'skip_name_button', 'Passer le nom', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'save_and_continue_button', 'Enregistrer et continuer', 'accessibility', true, 'fr'),
  
  -- Friend Unlock Modal
  (uuid_generate_v4(), 'friend_unlock_modal_title', 'Hourra ! Les 3 cadenas sont ouverts, vous pouvez maintenant créer votre propre ami Oky.', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'friend_unlock_modal_button', 'Créez votre nouvel ami Oky !', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'friend_unlock_celebration_image', 'Animation de célébration montrant la fonctionnalité d''avatar ami débloquée', 'accessibility', true, 'fr'),
  
  -- General UI
  (uuid_generate_v4(), 'name_info_label', 'Bouton d''information pour ton nom d''utilisateur sur Oky. Le nom que tu utiliseras pour te connecter à Oky. 3 caractères minimum', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'privacy_policy_link', 'Lien vers la politique de confidentialité d''Oky', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 't_and_c_link', 'Lien vers la politique de confidentialité d''Oky', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'i_agree', 'J''accepte', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'month_selector', 'sélecteur de mois', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'search_country', 'chercher pays', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'clear_search', 'Effacer la recherche', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'info_button', 'bouton d''information', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'accessibility_prompt', 'Appuyez deux fois pour activer', 'accessibility', true, 'fr'),
  
  -- Customizer Tutorial Translations
  (uuid_generate_v4(), 'customizer_tutorial_title', 'Comment créer votre ami Oky', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_title', 'Commencez à créer votre ami Oky !', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_text', 'Appuyez sur les boutons (Corps, Cheveux, Yeux, Vêtements et Articles personnels) pour créer votre propre ami.\n\nVous pouvez passer d''un bouton à l''autre et voir les changements immédiatement.', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_title', 'Sélectionner les couleurs', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_text', 'Appuyez sur les boutons de couleur pour changer la couleur de la peau, des cheveux ou des yeux.\n\nUtilisez les flèches ou balayez pour voir plus d''options. Appuyez pour choisir une couleur.', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_title', 'Voir plus d''options', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_text', 'Pour voir plus d''options, utilisez les flèches ou balayez pour plus de couleurs.', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_title', 'Articles personnels', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_text', 'Ajoutez un ou plusieurs articles personnels pour votre ami Oky.', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_title', 'Terminé ?', 'ui', true, 'fr'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_text', 'Appuyez sur ''Enregistrer votre ami'' pour enregistrer vos modifications.\nAppuyez sur ''Quitter'' pour partir. Votre dernier changement ne sera pas enregistré.\n\nNe vous inquiétez pas, vous pouvez toujours revenir et modifier votre ami Oky.', 'accessibility', true, 'fr'),
  
  -- Clothing Item Translations (17 items)
  (uuid_generate_v4(), 'customizer_clothing_dress1', 'Robe 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_dress2', 'Robe 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_dress3', 'Robe 3', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_longdressbelt', 'Robe longue avec ceinture', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt1', 'Short et chemise 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt2', 'Short et chemise 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt3', 'Short et chemise 3', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_skirtandshirt', 'Jupe et chemise', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_shirtandpants', 'Chemise et pantalon', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_blazer1', 'Blazer 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_blazer2', 'Blazer 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_jumper', 'Pull', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_cape', 'Cape', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_hijab', 'Hijab', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_longuniform', 'Uniforme long', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_traditional1', 'Tenue traditionnelle 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_traditional2', 'Tenue traditionnelle 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_traditional3', 'Tenue traditionnelle 3', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_traditional4', 'Tenue traditionnelle 4', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_clothing_traditional5', 'Tenue traditionnelle 5', 'accessibility', true, 'fr'),
  
  -- Personal Item (Device) Translations (25 items)
  (uuid_generate_v4(), 'customizer_device_glasses', 'Lunettes', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_readingglasses2', 'Lunettes de lecture', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_darkglasses', 'Lunettes foncées', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_sunglass1', 'Lunettes de soleil 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_sunglass2', 'Lunettes de soleil 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_crown', 'Couronne', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_hat', 'Chapeau', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_beanie', 'Bonnet', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_beanie2', 'Bonnet 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_buckethat', 'Chapeau de paille', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_cap', 'Casquette', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_sunhat', 'Chapeau de soleil', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_headband', 'Bandeau', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_head', 'Accessoire pour la tête', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_flowers', 'Fleurs', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_bandana', 'Bandana', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_headphones', 'Écouteurs', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_necklace1', 'Collier 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_necklace2', 'Collier 2', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_necklace3', 'Collier 3', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_earings', 'Boucles d''oreilles', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_purse', 'Sac à main', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_cane', 'Canne', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_prostetic1', 'Prothèse 1', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_device_prostetic2', 'Prothèse 2', 'accessibility', true, 'fr'),
  
  -- Skin Color Translations (12 colors)
  (uuid_generate_v4(), 'customizer_skin_color_light_pink', 'Rose clair', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_peach', 'Pêche', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_beige', 'Beige', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_tan', 'Bronzé', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_dark_brown', 'Brun foncé', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_light_tan', 'Bronzé clair', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_medium_brown', 'Brun moyen', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_cream', 'Crème', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_bronze', 'Bronze', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_ivory', 'Ivoire', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_sand', 'Sable', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_caramel', 'Caramel', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_skin_color_unknown', 'Couleur de peau inconnue', 'accessibility', true, 'fr'),
  
  -- Hair Color Translations (11 colors)
  (uuid_generate_v4(), 'customizer_hair_color_black', 'Noir', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_brown', 'Brun', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_red', 'Rouge', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_blonde', 'Blond', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_green', 'Vert', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_pink', 'Rose', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_orange', 'Orange', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_purple', 'Violet', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_dark_brown', 'Brun foncé', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_bright_orange', 'Orange vif', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_blue', 'Bleu', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_hair_color_unknown', 'Couleur de cheveux inconnue', 'accessibility', true, 'fr'),
  
  -- Eye Color Translations (6 colors)
  (uuid_generate_v4(), 'customizer_eye_color_black', 'Noir', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_eye_color_brown', 'Brun', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_eye_color_hazel', 'Noisette', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_eye_color_green', 'Vert', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_eye_color_blue', 'Bleu', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_eye_color_gray', 'Gris', 'accessibility', true, 'fr'),
  (uuid_generate_v4(), 'customizer_eye_color_unknown', 'Couleur des yeux inconnue', 'accessibility', true, 'fr')
ON CONFLICT DO NOTHING;

-- Spanish (es) translations
-- Note: type field - 'accessibility' for screen reader labels, 'ui' for regular UI text
INSERT INTO "periodtracker"."translations" ("id", "key", "label", "type", "live", "lang")
VALUES
  -- Avatar & Theme Selection
  (uuid_generate_v4(), 'select_avatar_button', 'Seleccionar avatar', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'select_theme_button', 'Seleccionar tema', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'select_color_button', 'Seleccionar color', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'select_option_button', 'Seleccionar opción', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'select_category_button', 'Seleccionar categoría', 'accessibility', true, 'es'),
  
  -- Navigation & Actions
  (uuid_generate_v4(), 'previous_page_button', 'Página anterior', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'next_page_button', 'Página siguiente', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'arrow_button', 'Pulsador de flecha', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'continue', 'Siguiente', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'confirm', 'confirmar', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'close', 'Cerrar', 'accessibility', true, 'es'),
  
  -- Customizer
  (uuid_generate_v4(), 'customizer_exit', 'Salir', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_save_friend', 'Guardar tu amigo Oky', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'tutorial_button', 'Tutorial', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'skip_tutorial_button', 'Omitir tutorial', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'close_tooltip_button', 'Cerrar información', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_back', 'Atrás', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_next', 'Siguiente', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_finish', 'Finalizar', 'ui', true, 'es'),
  
  -- Naming Modal
  (uuid_generate_v4(), 'name_input', 'Ingrese el nombre de su amigo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'skip_name_button', 'Omitir nombre', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'save_and_continue_button', 'Guardar y continuar', 'accessibility', true, 'es'),
  
  -- Friend Unlock Modal
  (uuid_generate_v4(), 'friend_unlock_modal_title', '¡Hurra! Las 3 cerraduras están abiertas, ahora puedes crear tu propio amigo Oky.', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'friend_unlock_modal_button', '¡Crea tu nuevo amigo Oky!', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'friend_unlock_celebration_image', 'Animación de celebración mostrando la función de avatar amigo desbloqueada', 'accessibility', true, 'es'),
  
  -- General UI
  (uuid_generate_v4(), 'name_info_label', 'El nombre de usuario que usarás para aceder a Oky. Mínimos 3 caracteres.', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'privacy_policy_link', 'Enlace a la política de privacidad de Oky', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 't_and_c_link', 'Enlance a los términos y condiciones de Oky', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'i_agree', 'Estoy de acuerdo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'month_selector', 'selector de mes', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'search_country', 'País de búsqueda', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'clear_search', 'Borrar búsqueda', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'info_button', 'botón de información', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'accessibility_prompt', 'Toca dos veces para activar', 'accessibility', true, 'es'),
  
  -- Customizer Tutorial Translations
  (uuid_generate_v4(), 'customizer_tutorial_title', 'Cómo crear tu amigo Oky', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_title', '¡Comienza a crear tu amigo Oky!', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_text', 'Toca los botones (Cuerpo, Cabello, Ojos, Ropa y Artículos personales) para crear tu propio amigo.\n\nPuedes moverte entre los botones y ver los cambios inmediatamente.', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_title', 'Seleccionar colores', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_text', 'Toca los botones de color para cambiar el color de la piel, cabello o ojos.\n\nUsa las flechas o desliza para ver más opciones. Toca para elegir un color.', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_title', 'Ver más opciones', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_text', 'Para ver más opciones, usa las flechas o desliza para más colores.', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_title', 'Artículos personales', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_text', 'Añade uno o más artículos personales para tu amigo Oky.', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_title', '¿Terminado?', 'ui', true, 'es'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_text', 'Toca ''Guardar tu amigo'' para guardar tus cambios.\nToca ''Salir'' para salir. Tu último cambio no se guardará.\n\nNo te preocupes, siempre puedes volver y cambiar tu amigo Oky.', 'accessibility', true, 'es'),
  
  -- Clothing Item Translations (17 items)
  (uuid_generate_v4(), 'customizer_clothing_dress1', 'Vestido 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_dress2', 'Vestido 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_dress3', 'Vestido 3', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_longdressbelt', 'Vestido largo con cinturón', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt1', 'Pantalones cortos y camisa 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt2', 'Pantalones cortos y camisa 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt3', 'Pantalones cortos y camisa 3', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_skirtandshirt', 'Falda y camisa', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_shirtandpants', 'Camisa y pantalones', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_blazer1', 'Blazer 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_blazer2', 'Blazer 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_jumper', 'Jersey', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_cape', 'Capa', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_hijab', 'Hiyab', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_longuniform', 'Uniforme largo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_traditional1', 'Atuendo tradicional 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_traditional2', 'Atuendo tradicional 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_traditional3', 'Atuendo tradicional 3', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_traditional4', 'Atuendo tradicional 4', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_clothing_traditional5', 'Atuendo tradicional 5', 'accessibility', true, 'es'),
  
  -- Personal Item (Device) Translations (25 items)
  (uuid_generate_v4(), 'customizer_device_glasses', 'Gafas', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_readingglasses2', 'Gafas de lectura', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_darkglasses', 'Gafas oscuras', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_sunglass1', 'Gafas de sol 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_sunglass2', 'Gafas de sol 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_crown', 'Corona', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_hat', 'Sombrero', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_beanie', 'Gorro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_beanie2', 'Gorro 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_buckethat', 'Sombrero de cubo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_cap', 'Gorra', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_sunhat', 'Sombrero de sol', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_headband', 'Banda para la cabeza', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_head', 'Accesorio para la cabeza', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_flowers', 'Flores', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_bandana', 'Pañuelo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_headphones', 'Auriculares', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_necklace1', 'Collar 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_necklace2', 'Collar 2', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_necklace3', 'Collar 3', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_earings', 'Aretes', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_purse', 'Bolso', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_cane', 'Bastón', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_prostetic1', 'Prótesis 1', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_device_prostetic2', 'Prótesis 2', 'accessibility', true, 'es'),
  
  -- Skin Color Translations (12 colors)
  (uuid_generate_v4(), 'customizer_skin_color_light_pink', 'Rosa claro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_peach', 'Melocotón', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_beige', 'Beige', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_tan', 'Bronceado', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_dark_brown', 'Marrón oscuro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_light_tan', 'Bronceado claro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_medium_brown', 'Marrón medio', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_cream', 'Crema', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_bronze', 'Bronce', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_ivory', 'Marfil', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_sand', 'Arena', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_caramel', 'Caramelo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_skin_color_unknown', 'Color de piel desconocido', 'accessibility', true, 'es'),
  
  -- Hair Color Translations (11 colors)
  (uuid_generate_v4(), 'customizer_hair_color_black', 'Negro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_brown', 'Marrón', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_red', 'Rojo', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_blonde', 'Rubio', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_green', 'Verde', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_pink', 'Rosa', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_orange', 'Naranja', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_purple', 'Morado', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_dark_brown', 'Marrón oscuro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_bright_orange', 'Naranja brillante', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_blue', 'Azul', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_hair_color_unknown', 'Color de cabello desconocido', 'accessibility', true, 'es'),
  
  -- Eye Color Translations (6 colors)
  (uuid_generate_v4(), 'customizer_eye_color_black', 'Negro', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_eye_color_brown', 'Marrón', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_eye_color_hazel', 'Avellana', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_eye_color_green', 'Verde', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_eye_color_blue', 'Azul', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_eye_color_gray', 'Gris', 'accessibility', true, 'es'),
  (uuid_generate_v4(), 'customizer_eye_color_unknown', 'Color de ojos desconocido', 'accessibility', true, 'es')
ON CONFLICT DO NOTHING;

-- Portuguese (pt) translations
-- Note: type field - 'accessibility' for screen reader labels, 'ui' for regular UI text
INSERT INTO "periodtracker"."translations" ("id", "key", "label", "type", "live", "lang")
VALUES
  -- Avatar & Theme Selection
  (uuid_generate_v4(), 'select_avatar_button', 'Selecionar avatar', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'select_theme_button', 'Selecionar tema', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'select_color_button', 'Selecionar cor', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'select_option_button', 'Selecionar opção', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'select_category_button', 'Selecionar categoria', 'accessibility', true, 'pt'),
  
  -- Navigation & Actions
  (uuid_generate_v4(), 'previous_page_button', 'Página anterior', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'next_page_button', 'Página seguinte', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'arrow_button', 'Botão de seta', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'continue', 'Continuar', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'confirm', 'confirmar', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'close', 'Fechar', 'accessibility', true, 'pt'),
  
  -- Customizer
  (uuid_generate_v4(), 'customizer_exit', 'Sair', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_save_friend', 'Salvar seu amigo Oky', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'tutorial_button', 'Tutorial', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'skip_tutorial_button', 'Pular tutorial', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'close_tooltip_button', 'Fechar dica', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_back', 'Voltar', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_next', 'Próximo', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_finish', 'Concluir', 'ui', true, 'pt'),
  
  -- Naming Modal
  (uuid_generate_v4(), 'name_input', 'Digite o nome do seu amigo', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'skip_name_button', 'Pular nome', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'save_and_continue_button', 'Salvar e continuar', 'accessibility', true, 'pt'),
  
  -- Friend Unlock Modal
  (uuid_generate_v4(), 'friend_unlock_modal_title', 'Parabéns! Todas as 3 fechaduras estão abertas, agora você pode criar seu próprio amigo Oky.', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'friend_unlock_modal_button', 'Crie seu novo amigo Oky!', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'friend_unlock_celebration_image', 'Animação de celebração mostrando o recurso de avatar amigo desbloqueado', 'accessibility', true, 'pt'),
  
  -- General UI
  (uuid_generate_v4(), 'name_info_label', 'O nome que você usará para fazer login no Oky. Mínimo de 3 caracteres', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'privacy_policy_link', 'Ligação para a Política de Privacidade de Oky', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 't_and_c_link', 'Ligação para os Termos e Condições de Oky', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'i_agree', 'concordo', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'month_selector', 'Selector de mês', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'search_country', 'pesquisar país', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'clear_search', 'Limpar pesquisa', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'info_button', 'botão de informação', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'accessibility_prompt', 'Toque duas vezes para ativar', 'accessibility', true, 'pt'),
  
  -- Customizer Tutorial Translations
  (uuid_generate_v4(), 'customizer_tutorial_title', 'Como criar seu amigo Oky', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_title', 'Comece a criar seu amigo Oky!', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_text', 'Toque nos botões (Corpo, Cabelo, Olhos, Roupas e Itens pessoais) para criar seu próprio amigo.\n\nVocê pode alternar entre os botões e ver as mudanças imediatamente.', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_title', 'Selecionar cores', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_text', 'Toque nos botões de cor para alterar a cor da pele, cabelo ou olhos.\n\nUse as setas ou deslize para ver mais opções. Toque para escolher uma cor.', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_title', 'Ver mais opções', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_text', 'Para ver mais opções, use as setas ou deslize para mais cores.', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_title', 'Itens pessoais', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_text', 'Adicione um ou mais itens pessoais para seu amigo Oky.', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_title', 'Terminado?', 'ui', true, 'pt'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_text', 'Toque em ''Salvar seu amigo'' para salvar suas alterações.\nToque em ''Sair'' para sair. Sua última alteração não será salva.\n\nNão se preocupe, você sempre pode voltar e alterar seu amigo Oky.', 'accessibility', true, 'pt'),
  
  -- Clothing Item Translations (17 items)
  (uuid_generate_v4(), 'customizer_clothing_dress1', 'Vestido 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_dress2', 'Vestido 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_dress3', 'Vestido 3', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_longdressbelt', 'Vestido longo com cinto', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt1', 'Shorts e camisa 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt2', 'Shorts e camisa 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt3', 'Shorts e camisa 3', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_skirtandshirt', 'Saia e camisa', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_shirtandpants', 'Camisa e calça', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_blazer1', 'Blazer 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_blazer2', 'Blazer 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_jumper', 'Pulôver', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_cape', 'Capa', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_hijab', 'Hijab', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_longuniform', 'Uniforme longo', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_traditional1', 'Traje tradicional 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_traditional2', 'Traje tradicional 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_traditional3', 'Traje tradicional 3', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_traditional4', 'Traje tradicional 4', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_clothing_traditional5', 'Traje tradicional 5', 'accessibility', true, 'pt'),
  
  -- Personal Item (Device) Translations (25 items)
  (uuid_generate_v4(), 'customizer_device_glasses', 'Óculos', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_readingglasses2', 'Óculos de leitura', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_darkglasses', 'Óculos escuros', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_sunglass1', 'Óculos de sol 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_sunglass2', 'Óculos de sol 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_crown', 'Coroa', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_hat', 'Chapéu', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_beanie', 'Gorro', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_beanie2', 'Gorro 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_buckethat', 'Chapéu de balde', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_cap', 'Boné', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_sunhat', 'Chapéu de sol', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_headband', 'Faixa de cabeça', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_head', 'Acessório para cabeça', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_flowers', 'Flores', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_bandana', 'Bandana', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_headphones', 'Fones de ouvido', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_necklace1', 'Colar 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_necklace2', 'Colar 2', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_necklace3', 'Colar 3', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_earings', 'Brincos', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_purse', 'Bolsa', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_cane', 'Bengala', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_prostetic1', 'Prótese 1', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_device_prostetic2', 'Prótese 2', 'accessibility', true, 'pt'),
  
  -- Skin Color Translations (12 colors)
  (uuid_generate_v4(), 'customizer_skin_color_light_pink', 'Rosa claro', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_peach', 'Pêssego', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_beige', 'Bege', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_tan', 'Bronzeado', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_dark_brown', 'Marrom escuro', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_light_tan', 'Bronzeado claro', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_medium_brown', 'Marrom médio', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_cream', 'Creme', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_bronze', 'Bronze', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_ivory', 'Marfim', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_sand', 'Areia', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_caramel', 'Caramelo', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_skin_color_unknown', 'Cor de pele desconhecida', 'accessibility', true, 'pt'),
  
  -- Hair Color Translations (11 colors)
  (uuid_generate_v4(), 'customizer_hair_color_black', 'Preto', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_brown', 'Marrom', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_red', 'Vermelho', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_blonde', 'Loiro', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_green', 'Verde', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_pink', 'Rosa', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_orange', 'Laranja', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_purple', 'Roxo', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_dark_brown', 'Marrom escuro', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_bright_orange', 'Laranja brilhante', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_blue', 'Azul', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_hair_color_unknown', 'Cor de cabelo desconhecida', 'accessibility', true, 'pt'),
  
  -- Eye Color Translations (6 colors)
  (uuid_generate_v4(), 'customizer_eye_color_black', 'Preto', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_eye_color_brown', 'Marrom', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_eye_color_hazel', 'Avelã', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_eye_color_green', 'Verde', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_eye_color_blue', 'Azul', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_eye_color_gray', 'Cinza', 'accessibility', true, 'pt'),
  (uuid_generate_v4(), 'customizer_eye_color_unknown', 'Cor dos olhos desconhecida', 'accessibility', true, 'pt')
ON CONFLICT DO NOTHING;

-- Russian (ru) translations
-- Note: type field - 'accessibility' for screen reader labels, 'ui' for regular UI text
INSERT INTO "periodtracker"."translations" ("id", "key", "label", "type", "live", "lang")
VALUES
  -- Avatar & Theme Selection
  (uuid_generate_v4(), 'select_avatar_button', 'Выбрать аватар', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'select_theme_button', 'Выбрать тему', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'select_color_button', 'Выбрать цвет', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'select_option_button', 'Выбрать опцию', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'select_category_button', 'Выбрать категорию', 'accessibility', true, 'ru'),
  
  -- Navigation & Actions
  (uuid_generate_v4(), 'previous_page_button', 'Предыдущая страница', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'next_page_button', 'Следующая страница', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'arrow_button', 'Кнопка-стрелка', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'continue', 'Продолжить', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'confirm', 'Подтвердить', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'close', 'Закрыть', 'accessibility', true, 'ru'),
  
  -- Customizer
  (uuid_generate_v4(), 'customizer_exit', 'Выход', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_save_friend', 'Сохранить вашего друга Oky', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'tutorial_button', 'Учебник', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'skip_tutorial_button', 'Пропустить учебник', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'close_tooltip_button', 'Закрыть подсказку', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_back', 'Назад', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_next', 'Далее', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_finish', 'Готово', 'ui', true, 'ru'),
  
  -- Naming Modal
  (uuid_generate_v4(), 'name_input', 'Введите имя вашего друга', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'skip_name_button', 'Пропустить имя', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'save_and_continue_button', 'Сохранить и продолжить', 'accessibility', true, 'ru'),
  
  -- Friend Unlock Modal
  (uuid_generate_v4(), 'friend_unlock_modal_title', 'Ура! Все 3 замка открыты, теперь вы можете создать своего друга Oky.', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'friend_unlock_modal_button', 'Создайте своего нового друга Oky!', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'friend_unlock_celebration_image', 'Анимация празднования, показывающая разблокированную функцию аватара друга', 'accessibility', true, 'ru'),
  
  -- General UI
  (uuid_generate_v4(), 'name_info_label', 'Имя, которое вы будете использовать для входа в Oky. Минимум 3 символа', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'privacy_policy_link', 'Ссылка на Политику конфиденциальности "Oky"', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 't_and_c_link', 'Ссылка на Положения и условия "Oky"', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'i_agree', 'Согласна (-ен)', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'month_selector', 'Выбор месяца', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'search_country', 'Поиск страны', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'clear_search', 'Очистить поиск', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'info_button', 'кнопка информации', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'accessibility_prompt', 'Нажмите дважды, чтобы активировать', 'accessibility', true, 'ru'),
  
  -- Customizer Tutorial Translations
  (uuid_generate_v4(), 'customizer_tutorial_title', 'Как создать вашего друга Oky', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_title', 'Начните создавать вашего друга Oky!', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step1_text', 'Нажмите на кнопки (Тело, Волосы, Глаза, Одежда и Личные вещи), чтобы создать своего друга.\n\nВы можете переключаться между кнопками и видеть изменения сразу же.', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_title', 'Выберите цвета', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step2_text', 'Нажмите на цветные кнопки, чтобы изменить цвет кожи, волос или глаз.\n\nИспользуйте стрелки или проведите пальцем, чтобы увидеть больше вариантов. Нажмите, чтобы выбрать цвет.', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_title', 'Посмотреть больше вариантов', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step3_text', 'Чтобы увидеть больше вариантов, используйте стрелки или проведите пальцем для большего количества цветов.', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_title', 'Личные вещи', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step4_text', 'Добавьте один или несколько личных предметов для вашего друга Oky.', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_title', 'Готово?', 'ui', true, 'ru'),
  (uuid_generate_v4(), 'customizer_tutorial_step5_text', 'Нажмите ''Сохранить вашего друга'', чтобы сохранить ваши изменения.\nНажмите ''Выход'', чтобы выйти. Ваше последнее изменение не будет сохранено.\n\nНе волнуйтесь, вы всегда можете вернуться и изменить вашего друга Oky.', 'accessibility', true, 'ru'),
  
  -- Clothing Item Translations (17 items)
  (uuid_generate_v4(), 'customizer_clothing_dress1', 'Платье 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_dress2', 'Платье 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_dress3', 'Платье 3', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_longdressbelt', 'Длинное платье с поясом', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt1', 'Шорты и рубашка 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt2', 'Шорты и рубашка 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_shortandshirt3', 'Шорты и рубашка 3', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_skirtandshirt', 'Юбка и рубашка', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_shirtandpants', 'Рубашка и брюки', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_blazer1', 'Пиджак 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_blazer2', 'Пиджак 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_jumper', 'Джемпер', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_cape', 'Плащ', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_hijab', 'Хиджаб', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_longuniform', 'Длинная форма', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_traditional1', 'Традиционный наряд 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_traditional2', 'Традиционный наряд 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_traditional3', 'Традиционный наряд 3', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_traditional4', 'Традиционный наряд 4', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_clothing_traditional5', 'Традиционный наряд 5', 'accessibility', true, 'ru'),
  
  -- Personal Item (Device) Translations (25 items)
  (uuid_generate_v4(), 'customizer_device_glasses', 'Очки', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_readingglasses2', 'Очки для чтения', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_darkglasses', 'Темные очки', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_sunglass1', 'Солнечные очки 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_sunglass2', 'Солнечные очки 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_crown', 'Корона', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_hat', 'Шляпа', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_beanie', 'Шапка', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_beanie2', 'Шапка 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_buckethat', 'Ведро-шляпа', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_cap', 'Кепка', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_sunhat', 'Солнечная шляпа', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_headband', 'Повязка на голову', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_head', 'Аксессуар для головы', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_flowers', 'Цветы', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_bandana', 'Бандана', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_headphones', 'Наушники', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_necklace1', 'Ожерелье 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_necklace2', 'Ожерелье 2', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_necklace3', 'Ожерелье 3', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_earings', 'Серьги', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_purse', 'Сумка', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_cane', 'Трость', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_prostetic1', 'Протез 1', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_device_prostetic2', 'Протез 2', 'accessibility', true, 'ru'),
  
  -- Skin Color Translations (12 colors)
  (uuid_generate_v4(), 'customizer_skin_color_light_pink', 'Светло-розовый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_peach', 'Персиковый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_beige', 'Бежевый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_tan', 'Загорелый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_dark_brown', 'Темно-коричневый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_light_tan', 'Светло-загорелый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_medium_brown', 'Средне-коричневый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_cream', 'Кремовый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_bronze', 'Бронзовый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_ivory', 'Слоновая кость', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_sand', 'Песочный', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_caramel', 'Карамельный', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_skin_color_unknown', 'Неизвестный цвет кожи', 'accessibility', true, 'ru'),
  
  -- Hair Color Translations (11 colors)
  (uuid_generate_v4(), 'customizer_hair_color_black', 'Черный', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_brown', 'Коричневый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_red', 'Красный', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_blonde', 'Блонд', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_green', 'Зеленый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_pink', 'Розовый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_orange', 'Оранжевый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_purple', 'Фиолетовый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_dark_brown', 'Темно-коричневый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_bright_orange', 'Ярко-оранжевый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_blue', 'Синий', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_hair_color_unknown', 'Неизвестный цвет волос', 'accessibility', true, 'ru'),
  
  -- Eye Color Translations (6 colors)
  (uuid_generate_v4(), 'customizer_eye_color_black', 'Черный', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_eye_color_brown', 'Коричневый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_eye_color_hazel', 'Ореховый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_eye_color_green', 'Зеленый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_eye_color_blue', 'Синий', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_eye_color_gray', 'Серый', 'accessibility', true, 'ru'),
  (uuid_generate_v4(), 'customizer_eye_color_unknown', 'Неизвестный цвет глаз', 'accessibility', true, 'ru')
ON CONFLICT DO NOTHING;
