# Accessibility Labels Documentation

This document contains all accessibility labels added for screen readers across the avatar/theme selection screens, custom avatar page, tutorial modal, naming modal, celebration modal, and profile page updates.

## Table of Contents
1. [Avatar Selection Screen](#avatar-selection-screen)
2. [Theme Selection Screen](#theme-selection-screen)
3. [Custom Avatar Page (Customizer)](#custom-avatar-page-customizer)
4. [Tutorial Modal](#tutorial-modal)
5. [Naming Modal](#naming-modal)
6. [Celebration Modal (Friend Unlock)](#celebration-modal-friend-unlock)
7. [Profile Page](#profile-page)
8. [Translation Keys Reference](#translation-keys-reference)

---

## Avatar Selection Screen

### Elements with Accessibility Labels

1. **Avatar Selection Buttons**
   - **Label**: `select_avatar_button: {translatedAvatarName}, {status}`
   - **Status values**:
     - `{translatedAvatarName} locked` - When friend avatar is locked
     - `{translatedAvatarName}, tap to customize` - When friend avatar is unlocked and can be customized
     - `{translatedAvatarName}, selected` - When avatar is currently selected
     - `{translatedAvatarName}, tap to select` - When avatar is not selected
   - **Implementation**: Uses translated avatar names via `translate(avatar)` which includes `themeTranslations`
   - **Example**: "Select avatar: Аяна, selected" (for Russian) or "Select avatar: ari, selected" (for English)
   - **Translation Key**: `select_avatar_button`
   - **✅ Status**: Avatar names are now translated using the existing `themeTranslations` system. Note: Some languages (like Russian) have translated names (e.g., "Аяна" for "ari"), while others use the technical names.

2. **Continue Button** (Initial Selection)
   - **Label**: `continue_button`
   - **Translation Key**: `continue_button`
   - **English**: "Continue"

3. **Confirm Button** (Non-Initial Selection)
   - **Label**: `confirm_button`
   - **Translation Key**: `confirm_button`
   - **English**: "Confirm"

4. **Go Back Button** (When available)
   - **Label**: `go_back_button`
   - **Translation Key**: `go_back_button`
   - **English**: "Go back"

---

## Theme Selection Screen

### Elements with Accessibility Labels

1. **Theme Selection Buttons**
   - **Label**: `select_theme_button: {translatedThemeName}, {status}`
   - **Status values**:
     - `{translatedThemeName}, selected` - When theme is currently selected
     - `{translatedThemeName}, tap to select` - When theme is not selected
   - **Implementation**: Uses translated theme names via `translate(theme)` which includes `themeTranslations`
   - **Example**: "Select theme: Collines, selected" (for French) or "Select theme: hills, selected" (for English)
   - **Translation Key**: `select_theme_button`
   - **✅ Status**: Theme names are now translated using the existing `themeTranslations` system. All languages have translated theme names (e.g., "Collines" for "hills" in French, "Холмы" for "hills" in Russian, "Montanhas" for "hills" in Portuguese, "Montañas" for "hills" in Spanish).

2. **Continue Button** (Initial Selection)
   - **Label**: `continue_button`
   - **Translation Key**: `continue_button`
   - **English**: "Continue"

3. **Confirm Button** (Non-Initial Selection)
   - **Label**: `confirm_button`
   - **Translation Key**: `confirm_button`
   - **English**: "Confirm"

4. **Go Back Button** (When available)
   - **Label**: `go_back_button`
   - **Translation Key**: `go_back_button`
   - **English**: "Go back"

5. **Arrow Button** (Header back button)
   - **Label**: `arrow_button`
   - **Translation Key**: `arrow_button`
   - **English**: "Arrow button"

---

## Custom Avatar Page (Customizer)

### Category Tabs

1. **Category Selection Buttons**
   - **Label**: `select_category_button: {categoryName}, {status}`
   - **Status values**:
     - `selected` - When category is currently selected
     - `tap to select` - When category is not selected
   - **Example**: "Select category: Skin, selected"
   - **Translation Key**: `select_category_button`

### Skin Color Section

1. **Previous Page Button**
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

2. **Next Page Button**
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

3. **Color Swatch Buttons**
   - **Label**: `select_color_button: skin color {colorName}, {status}`
   - **Status values**:
     - `selected` - When color is currently selected
     - `tap to select` - When color is not selected
   - **Implementation**: Uses translated color names via `translate('customizer_skin_color_*')`
   - **Example**: "Select color: skin color Light pink, selected"
   - **Translation Key**: `select_color_button`
   - **✅ Status**: Color names are now translated. Available skin colors: Light pink, Peach, Beige, Tan, Dark brown, Light tan, Medium brown, Cream, Bronze, Ivory, Sand, Caramel

### Body Type Section

1. **Body Type Selection Buttons**
   - **Label**: `select_option_button: body type {bodyType}, {status}`
   - **Status values**:
     - `selected` - When body type is currently selected
     - `tap to select` - When body type is not selected
   - **Example**: "Select option: body type body-medium, selected"
   - **Translation Key**: `select_option_button`

### Hair Section

1. **Previous Page Button** (Hair Color)
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

2. **Next Page Button** (Hair Color)
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

3. **Hair Color Swatch Buttons**
   - **Label**: `select_color_button: hair color {colorName}, {status}`
   - **Status values**:
     - `selected` - When color is currently selected
     - `tap to select` - When color is not selected
   - **Implementation**: Uses translated color names via `translate('customizer_hair_color_*')`
   - **Example**: "Select color: hair color Black, selected"
   - **Translation Key**: `select_color_button`
   - **✅ Status**: Color names are now translated. Available hair colors: Black, Brown, Red, Blonde, Green, Pink, Orange, Purple, Dark brown, Bright orange, Blue

4. **Previous Page Button** (Hair Style)
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

5. **Next Page Button** (Hair Style)
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

6. **Hair Style Selection Buttons**
   - **Label**: `select_option_button: hairstyle {hairStyle}, {status}`
   - **Status values**:
     - `selected` - When hair style is currently selected
     - `tap to select` - When hair style is not selected
   - **Example**: "Select option: hairstyle short, selected"
   - **Translation Key**: `select_option_button`

### Eyes Section

1. **Previous Page Button** (Eye Color)
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

2. **Next Page Button** (Eye Color)
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

3. **Eye Color Swatch Buttons**
   - **Label**: `select_color_button: eye color {colorName}, {status}`
   - **Status values**:
     - `selected` - When color is currently selected
     - `tap to select` - When color is not selected
   - **Implementation**: Uses translated color names via `translate('customizer_eye_color_*')`
   - **Example**: "Select color: eye color Brown, selected"
   - **Translation Key**: `select_color_button`
   - **✅ Status**: Color names are now translated. Available eye colors: Black, Brown, Hazel, Green, Blue, Gray

4. **Previous Page Button** (Eye Shape)
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

5. **Next Page Button** (Eye Shape)
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

6. **Eye Shape Selection Buttons**
   - **Label**: `select_option_button: eye shape {eyeShape}, {status}`
   - **Status values**:
     - `selected` - When eye shape is currently selected
     - `tap to select` - When eye shape is not selected
   - **Example**: "Select option: eye shape round, selected"
   - **Translation Key**: `select_option_button`

### Clothing Section

1. **Previous Page Button**
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

2. **Next Page Button**
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

3. **Clothing Selection Buttons**
   - **Label**: `select_option_button: clothing {translatedClothingItem}, {status}`
   - **Status values**:
     - `selected` - When clothing item is currently selected
     - `tap to select` - When clothing item is not selected
   - **Implementation**: Uses translated names via `translate('customizer_clothing_{item}')`
   - **Example**: "Select option: clothing Dress 1, selected"
   - **Translation Key**: `select_option_button`
   - **✅ Status**: Individual clothing item names are now translated using translation keys.
   - **Available Clothing Items** (with translation keys):
     - `customizer_clothing_dress1`: "Dress 1"
     - `customizer_clothing_dress2`: "Dress 2"
     - `customizer_clothing_dress3`: "Dress 3"
     - `customizer_clothing_longdressbelt`: "Long dress with belt"
     - `customizer_clothing_shortandshirt1`: "Shorts and shirt 1"
     - `customizer_clothing_shortandshirt2`: "Shorts and shirt 2"
     - `customizer_clothing_shortandshirt3`: "Shorts and shirt 3"
     - `customizer_clothing_skirtandshirt`: "Skirt and shirt"
     - `customizer_clothing_shirtandpants`: "Shirt and pants"
     - `customizer_clothing_blazer1`: "Blazer 1"
     - `customizer_clothing_blazer2`: "Blazer 2"
     - `customizer_clothing_jumper`: "Jumper"
     - `customizer_clothing_cape`: "Cape"
     - `customizer_clothing_hijab`: "Hijab"
     - `customizer_clothing_longuniform`: "Long uniform"
     - `customizer_clothing_traditional1`: "Traditional outfit 1"
     - `customizer_clothing_traditional2`: "Traditional outfit 2"
     - `customizer_clothing_traditional3`: "Traditional outfit 3"
     - `customizer_clothing_traditional4`: "Traditional outfit 4"
     - `customizer_clothing_traditional5`: "Traditional outfit 5"

### Personal Items Section

1. **Previous Page Button**
   - **Label**: `previous_page_button`
   - **Translation Key**: `previous_page_button`
   - **English**: "Previous page"

2. **Next Page Button**
   - **Label**: `next_page_button`
   - **Translation Key**: `next_page_button`
   - **English**: "Next page"

3. **Personal Item Selection Buttons**
   - **Label**: `select_option_button: personal item {translatedItemName}, {status}`
   - **Status values**:
     - `selected` - When personal item is currently selected
     - `tap to select` - When personal item is not selected
   - **Implementation**: Uses translated names via `translate('customizer_device_{item}')`
   - **Example**: "Select option: personal item Glasses, selected"
   - **Translation Key**: `select_option_button`
   - **✅ Status**: Individual personal item names are now translated using translation keys.
   - **Available Personal Items** (with translation keys):
     - `customizer_device_glasses`: "Glasses"
     - `customizer_device_readingglasses2`: "Reading glasses"
     - `customizer_device_darkglasses`: "Dark glasses"
     - `customizer_device_sunglass1`: "Sunglasses 1"
     - `customizer_device_sunglass2`: "Sunglasses 2"
     - `customizer_device_crown`: "Crown"
     - `customizer_device_hat`: "Hat"
     - `customizer_device_beanie`: "Beanie"
     - `customizer_device_beanie2`: "Beanie 2"
     - `customizer_device_buckethat`: "Bucket hat"
     - `customizer_device_cap`: "Cap"
     - `customizer_device_sunhat`: "Sun hat"
     - `customizer_device_headband`: "Headband"
     - `customizer_device_head`: "Head accessory"
     - `customizer_device_flowers`: "Flowers"
     - `customizer_device_bandana`: "Bandana"
     - `customizer_device_headphones`: "Headphones"
     - `customizer_device_necklace1`: "Necklace 1"
     - `customizer_device_necklace2`: "Necklace 2"
     - `customizer_device_necklace3`: "Necklace 3"
     - `customizer_device_earings`: "Earrings"
     - `customizer_device_purse`: "Purse"
     - `customizer_device_cane`: "Cane"
     - `customizer_device_prostetic1`: "Prosthetic 1"
     - `customizer_device_prostetic2`: "Prosthetic 2"

### Bottom Action Buttons

1. **Tutorial Button**
   - **Label**: `tutorial_button`
   - **Translation Key**: `tutorial_button`
   - **English**: "Tutorial"

2. **Close Tooltip Button**
   - **Label**: `close_tooltip_button`
   - **Translation Key**: `close_tooltip_button`
   - **English**: "Close tooltip"

3. **Exit Button**
   - **Label**: `customizer_exit`
   - **Translation Key**: `customizer_exit`
   - **English**: "Exit"

4. **Save Friend Button**
   - **Label**: `customizer_save_friend`
   - **Translation Key**: `customizer_save_friend`
   - **English**: "Save your Oky friend"

---

## Tutorial Modal

### Elements with Accessibility Labels

1. **Back Arrow Button** (Header)
   - **Label**: `arrow_button`
   - **Translation Key**: `arrow_button`
   - **English**: "Arrow button"

2. **Tutorial Step Titles**
   - **Label**: Dynamic based on step content
   - **Translation Keys**:
     - Step 1: `customizer_tutorial_step1_title` - "Start creating your Oky friend!"
     - Step 2: `customizer_tutorial_step2_title` - "Select colors"
     - Step 3: `customizer_tutorial_step3_title` - "Look at more options"
     - Step 4: `customizer_tutorial_step4_title` - "Personal items"
     - Step 5: `customizer_tutorial_step5_title` - "Done?"

3. **Tutorial Step Text**
   - **Label**: Dynamic based on step content
   - **Translation Keys**:
     - Step 1: `customizer_tutorial_step1_text`
     - Step 2: `customizer_tutorial_step2_text`
     - Step 3: `customizer_tutorial_step3_text`
     - Step 4: `customizer_tutorial_step4_text`
     - Step 5: `customizer_tutorial_step5_text`

4. **Back Button** (Navigation)
   - **Label**: `customizer_tutorial_back`
   - **Translation Key**: `customizer_tutorial_back`
   - **English**: "Back"

5. **Next/Finish Button** (Navigation)
   - **Label**: 
     - `customizer_tutorial_next` (for steps 1-4)
     - `customizer_tutorial_finish` (for step 5)
   - **Translation Keys**:
     - `customizer_tutorial_next` - "Next"
     - `customizer_tutorial_finish` - "Finish"

6. **Skip Tutorial Button**
   - **Label**: `skip_tutorial_button`
   - **Translation Key**: `skip_tutorial_button`
   - **English**: "Skip tutorial"

---

## Naming Modal

### Elements with Accessibility Labels

1. **Name Input Field**
   - **Label**: `name_input`
   - **Translation Key**: `name_input`
   - **English**: "Enter your friend's name"
   - **Role**: `text`

2. **Character Count Text**
   - **Label**: Dynamic - Shows character count (e.g., "5/08 characters")
   - **Note**: This is displayed as text, not a separate accessibility label

3. **Hint Text**
   - **Label**: "Remember you can change this later."
   - **Note**: This is displayed as text, not a separate accessibility label

4. **Skip Button**
   - **Label**: `skip_name_button`
   - **Translation Key**: `skip_name_button`
   - **English**: "Skip naming"

5. **Save and Continue Button**
   - **Label**: `save_and_continue_button`
   - **Translation Key**: `save_and_continue_button`
   - **English**: "Save and continue"

6. **Modal Close Button** (via Modal component)
   - **Label**: `close`
   - **Translation Key**: `close`
   - **English**: "Close"

---

## Celebration Modal (Friend Unlock)

### Elements with Accessibility Labels

1. **Modal Title**
   - **Label**: `friend_unlock_modal_title`
   - **Translation Key**: `friend_unlock_modal_title`
   - **English**: "Hooray! All 3 locks are open, you can create your own Oky friend now."

2. **Celebration Image**
   - **Label**: `friend_unlock_celebration_image`
   - **Translation Key**: `friend_unlock_celebration_image`
   - **English**: "Celebration animation showing unlocked friend avatar feature"
   - **Role**: `image`

3. **Create Friend Button**
   - **Label**: `friend_unlock_modal_button`
   - **Translation Key**: `friend_unlock_modal_button`
   - **English**: "Create your new Oky friend!"
   - **Role**: `button`

4. **Modal Close Button** (via Modal component)
   - **Label**: `close`
   - **Translation Key**: `close`
   - **English**: "Close"

---

## Profile Page

### Elements with Accessibility Labels

**Note**: The Profile Page sections (Change your Oky friend, Change the name, Change the background) currently use standard TouchableOpacity components. These sections may benefit from explicit accessibility labels in future updates.

---

## Translation Keys Reference

### English Translations (en.ts)

| Translation Key | English Value |
|----------------|---------------|
| `select_avatar_button` | "Select avatar" |
| `select_theme_button` | "Select theme" |
| `select_color_button` | "Select color" |
| `select_option_button` | "Select option" |
| `select_category_button` | "Select category" |
| `previous_page_button` | "Previous page" |
| `next_page_button` | "Next page" |
| `close_tooltip_button` | "Close tooltip" |
| `tutorial_button` | "Tutorial" |
| `skip_tutorial_button` | "Skip tutorial" |
| `name_input` | "Enter your friend's name" |
| `skip_name_button` | "Skip naming" |
| `save_and_continue_button` | "Save and continue" |
| `arrow_button` | "Arrow button" |
| `continue_button` | "Continue" |
| `confirm_button` | "Confirm" |
| `go_back_button` | "Go back" |
| `close` | "Close" |
| `customizer_exit` | "Exit" |
| `customizer_save_friend` | "Save your Oky friend" |
| `customizer_tutorial_back` | "Back" |
| `customizer_tutorial_next` | "Next" |
| `customizer_tutorial_finish` | "Finish" |
| `customizer_tutorial_title` | "How to create your Oky friend" |
| `customizer_tutorial_step1_title` | "Start creating your Oky friend!" |
| `customizer_tutorial_step1_text` | "Tap the buttons (Body, Hair, Eyes, Clothes and Personal items) to create your own friend.\n\nYou can move between buttons and see changes right away" |
| `customizer_tutorial_step2_title` | "Select colors" |
| `customizer_tutorial_step2_text` | "Tap the color buttons to change the skin, hair or eye color.\n\nUse the arrows or swipe to see more options. Tap to choose a color." |
| `customizer_tutorial_step3_title` | "Look at more options" |
| `customizer_tutorial_step3_text` | "To see more options, use the arrows or swipe for more colors." |
| `customizer_tutorial_step4_title` | "Personal items" |
| `customizer_tutorial_step4_text` | "Add one or more personal items for your Oky friend." |
| `customizer_tutorial_step5_title` | "Done?" |
| `customizer_tutorial_step5_text` | "Tap 'Save your friend' to save your changes.\nTap 'Exit' to exit. Your last change will not be saved.\n\nDon't worry, you can always come back and change your Oky friend." |
| `friend_unlock_modal_title` | "Hooray! All 3 locks are open, you can create your own Oky friend now." |
| `friend_unlock_modal_button` | "Create your new Oky friend!" |
| `friend_unlock_celebration_image` | "Celebration animation showing unlocked friend avatar feature" |
| `change_oky_friend` | "Change your Oky friend" |
| `change_the_name` | "Change the name" |
| `change_background` | "Change the background" |
| **Clothing Item Translations** | |
| `customizer_clothing_dress1` | "Dress 1" |
| `customizer_clothing_dress2` | "Dress 2" |
| `customizer_clothing_dress3` | "Dress 3" |
| `customizer_clothing_longdressbelt` | "Long dress with belt" |
| `customizer_clothing_shortandshirt1` | "Shorts and shirt 1" |
| `customizer_clothing_shortandshirt2` | "Shorts and shirt 2" |
| `customizer_clothing_shortandshirt3` | "Shorts and shirt 3" |
| `customizer_clothing_skirtandshirt` | "Skirt and shirt" |
| `customizer_clothing_shirtandpants` | "Shirt and pants" |
| `customizer_clothing_blazer1` | "Blazer 1" |
| `customizer_clothing_blazer2` | "Blazer 2" |
| `customizer_clothing_jumper` | "Jumper" |
| `customizer_clothing_cape` | "Cape" |
| `customizer_clothing_hijab` | "Hijab" |
| `customizer_clothing_longuniform` | "Long uniform" |
| `customizer_clothing_traditional1` | "Traditional outfit 1" |
| `customizer_clothing_traditional2` | "Traditional outfit 2" |
| `customizer_clothing_traditional3` | "Traditional outfit 3" |
| `customizer_clothing_traditional4` | "Traditional outfit 4" |
| `customizer_clothing_traditional5` | "Traditional outfit 5" |
| **Personal Item (Device) Translations** | |
| `customizer_device_glasses` | "Glasses" |
| `customizer_device_readingglasses2` | "Reading glasses" |
| `customizer_device_darkglasses` | "Dark glasses" |
| `customizer_device_sunglass1` | "Sunglasses 1" |
| `customizer_device_sunglass2` | "Sunglasses 2" |
| `customizer_device_crown` | "Crown" |
| `customizer_device_hat` | "Hat" |
| `customizer_device_beanie` | "Beanie" |
| `customizer_device_beanie2` | "Beanie 2" |
| `customizer_device_buckethat` | "Bucket hat" |
| `customizer_device_cap` | "Cap" |
| `customizer_device_sunhat` | "Sun hat" |
| `customizer_device_headband` | "Headband" |
| `customizer_device_head` | "Head accessory" |
| `customizer_device_flowers` | "Flowers" |
| `customizer_device_bandana` | "Bandana" |
| `customizer_device_headphones` | "Headphones" |
| `customizer_device_necklace1` | "Necklace 1" |
| `customizer_device_necklace2` | "Necklace 2" |
| `customizer_device_necklace3` | "Necklace 3" |
| `customizer_device_earings` | "Earrings" |
| `customizer_device_purse` | "Purse" |
| `customizer_device_cane` | "Cane" |
| `customizer_device_prostetic1` | "Prosthetic 1" |
| `customizer_device_prostetic2` | "Prosthetic 2" |
| **Skin Color Translations** | |
| `customizer_skin_color_light_pink` | "Light pink" |
| `customizer_skin_color_peach` | "Peach" |
| `customizer_skin_color_beige` | "Beige" |
| `customizer_skin_color_tan` | "Tan" |
| `customizer_skin_color_dark_brown` | "Dark brown" |
| `customizer_skin_color_light_tan` | "Light tan" |
| `customizer_skin_color_medium_brown` | "Medium brown" |
| `customizer_skin_color_cream` | "Cream" |
| `customizer_skin_color_bronze` | "Bronze" |
| `customizer_skin_color_ivory` | "Ivory" |
| `customizer_skin_color_sand` | "Sand" |
| `customizer_skin_color_caramel` | "Caramel" |
| `customizer_skin_color_unknown` | "Unknown skin color" |
| **Hair Color Translations** | |
| `customizer_hair_color_black` | "Black" |
| `customizer_hair_color_brown` | "Brown" |
| `customizer_hair_color_red` | "Red" |
| `customizer_hair_color_blonde` | "Blonde" |
| `customizer_hair_color_green` | "Green" |
| `customizer_hair_color_pink` | "Pink" |
| `customizer_hair_color_orange` | "Orange" |
| `customizer_hair_color_purple` | "Purple" |
| `customizer_hair_color_dark_brown` | "Dark brown" |
| `customizer_hair_color_bright_orange` | "Bright orange" |
| `customizer_hair_color_blue` | "Blue" |
| `customizer_hair_color_unknown` | "Unknown hair color" |
| **Eye Color Translations** | |
| `customizer_eye_color_black` | "Black" |
| `customizer_eye_color_brown` | "Brown" |
| `customizer_eye_color_hazel` | "Hazel" |
| `customizer_eye_color_green` | "Green" |
| `customizer_eye_color_blue` | "Blue" |
| `customizer_eye_color_gray` | "Gray" |
| `customizer_eye_color_unknown` | "Unknown eye color" |

### iOS-Specific Behavior

On iOS, all accessibility labels are automatically appended with the accessibility prompt:
- Format: `{label}. {accessibility_prompt}`
- Example: "Select avatar: friend, tap to customize. Double tap to activate."

The `accessibility_prompt` translation key should be defined in all language files.

---

## Implementation Notes

1. **Dynamic Labels**: Many labels are constructed dynamically by concatenating translation keys with status information (e.g., "selected", "tap to select").

2. **Platform Differences**: iOS automatically appends an accessibility prompt to all labels, while Android does not.

3. **Role Attributes**: Interactive elements use `accessibilityRole` prop:
   - `button` - For all buttons and touchable elements
   - `text` - For text input fields

4. **Status Information**: Labels include contextual information about the current state:
   - Selection status (selected/not selected)
   - Color names (for skin, hair, and eye colors - now using descriptive names instead of numbers)
   - Item names (for avatars, themes, options)

5. **Translation Coverage**: All accessibility labels are translated in:
   - English (en.ts)
   - French (fr.ts)
   - Spanish (es.ts)
   - Portuguese (pt.ts)
   - Russian (ru.ts)

---

## Testing Checklist

- [ ] All interactive elements have accessibility labels
- [ ] Labels are descriptive and provide context
- [ ] Labels work correctly with screen readers (VoiceOver on iOS, TalkBack on Android)
- [ ] Dynamic labels correctly reflect current state
- [ ] All translations are present in all language files
- [ ] iOS accessibility prompts are working correctly
- [ ] Navigation between elements is logical with screen readers

---

**Document Version**: 1.2  
**Last Updated**: Updated to reflect implementation of color name translations for skin, hair, and eye colors  
**Maintained By**: Development Team

## Implementation Status

- ✅ **Clothing Item Translations**: Implemented - All 17 clothing items now use translated names
- ✅ **Personal Item Translations**: Implemented - All 25 personal items now use translated names
- ✅ **Color Name Translations**: Implemented - All skin, hair, and eye colors now use descriptive translated names instead of numbers
  - **Skin Colors**: 12 colors (Light pink, Peach, Beige, Tan, Dark brown, Light tan, Medium brown, Cream, Bronze, Ivory, Sand, Caramel)
  - **Hair Colors**: 11 colors (Black, Brown, Red, Blonde, Green, Pink, Orange, Purple, Dark brown, Bright orange, Blue)
  - **Eye Colors**: 6 colors (Black, Brown, Hazel, Green, Blue, Gray)
- ✅ **Translation Coverage**: All items translated in 5 languages (English, French, Spanish, Portuguese, Russian)

