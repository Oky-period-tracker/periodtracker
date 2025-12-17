# Custom Avatar System - Update Documentation

This document describes the custom avatar unlock system, including database migrations, unlock conditions, lock mechanics, user flow, and implementation details.

---

## Table of Contents

1. [Database Migrations](#database-migrations)
2. [Unlock Conditions](#unlock-conditions)
3. [The Three Locks](#the-three-locks)
4. [User Flow](#user-flow)
5. [Implementation Details](#implementation-details)
6. [General Updates](#general-updates)

---

## Database Migrations

### Migration Order

**IMPORTANT**: Migrations must be run in the following order:

1. **First**: `sql/1750000000000-add-cycles-counter.sql`
2. **Second**: `sql/custom-avatar-update.sql`

### Migration 1: Add Cycles Counter

**File**: `sql/1750000000000-add-cycles-counter.sql`

**Purpose**: Adds the `cyclesNumber` column to track how many menstrual cycles the user has completed.

**What it does**:
- Adds `cyclesNumber` column to `oky_user` table with `DEFAULT 0`
- Initializes all existing users to `cyclesNumber = 0`
- Ensures no NULL values exist

**SQL**:
```sql
ALTER TABLE oky_user ADD COLUMN IF NOT EXISTS "cyclesNumber" integer DEFAULT 0;

UPDATE oky_user 
SET "cyclesNumber" = 0 
WHERE "cyclesNumber" IS NULL;
```

**Why first**: The cycles counter is a prerequisite for the unlock logic. The custom avatar system depends on `cyclesNumber` to determine unlock status.

---

### Migration 2: Custom Avatar Update

**File**: `sql/custom-avatar-update.sql`

**Purpose**: Adds the `avatar` JSON column to store custom avatar configuration and unlock status.

**What it does**:
- Adds `avatar` JSON column to `oky_user` table
- Initializes `customAvatarUnlocked = false` for all existing users
- Sets `smile = null` for all existing avatar records
- Provides default structure for users without avatar data

**SQL**:
```sql
ALTER TABLE oky_user 
ADD COLUMN avatar JSON DEFAULT NULL;

-- Initialize customAvatarUnlocked to false for existing avatar JSON records
UPDATE oky_user
SET avatar = jsonb_set(
    jsonb_set(
        COALESCE(avatar::jsonb, '{}'::jsonb),
        '{customAvatarUnlocked}',
        'false'::jsonb,
        true
    ),
    '{smile}',
    'null'::jsonb,
    true
)
WHERE avatar IS NOT NULL;

-- For users without avatar JSON, set default structure
UPDATE oky_user
SET avatar = jsonb_build_object(
    'customAvatarUnlocked', false,
    'smile', NULL
)
WHERE avatar IS NULL;
```

**Avatar JSON Structure**:
```json
{
  "body": "body-medium",
  "hair": "01",
  "eyes": "00",
  "smile": "smile",
  "clothing": "dress1",
  "devices": ["glasses", "necklace1"],
  "skinColor": "#FFDBAC",
  "hairColor": "#000000",
  "eyeColor": "#000000",
  "customAvatarUnlocked": false,
  "name": "Friend"
}
```

**Note**: `devices` can be a single string (legacy) or an array of strings (new format supporting multiple devices).

---

## Unlock Conditions

### Primary Condition

The custom avatar (friend avatar) is **unlocked** when:

```
cyclesNumber >= 3 AND customAvatarUnlocked === true
```

### Lock Status Logic

The avatar is considered **locked** when:

```typescript
const isLocked = 
  currentUser?.avatar?.customAvatarUnlocked !== true && 
  (currentUser?.cyclesNumber || 0) < 3
```

**Key Points**:
- If `customAvatarUnlocked === true`, the avatar is **permanently unlocked** regardless of `cyclesNumber`
- If `customAvatarUnlocked !== true`, then `cyclesNumber >= 3` is required
- Default `cyclesNumber` is `0` if not set

### How Cycles Are Calculated

**Location**: `app/src/utils/cycleCalculator.ts`

**Algorithm**:
1. Filters period dates where `userVerified === true`
2. Groups consecutive period dates (allowing up to 2-day gaps between dates)
3. Each group represents one cycle
4. Returns `cyclesNumber` = number of cycle groups

**Example**:
- User enters period days: Jan 1-5, Jan 28-Feb 2, Feb 25-Mar 2
- This creates 3 separate cycle groups
- `cyclesNumber = 3`

**When cycles are recalculated**:
- When user marks a day as period day (`userVerified: true`)
- When user unmarks a period day (`userVerified: false`)
- Calculation happens in `MainScreen` and `CalendarScreen` after period date updates

---

## The Three Locks

### Lock Display

The system displays **3 locks** in the progress section to represent the unlock progress:

1. **Lock 1**: Unlocks when `cyclesNumber >= 1`
2. **Lock 2**: Unlocks when `cyclesNumber >= 2`
3. **Lock 3**: Unlocks when `cyclesNumber >= 3`

### Lock Component

**Location**: `app/src/components/AvatarLock.tsx`

**Props**:
- `cyclesNumber`: Current number of cycles completed
- `customAvatarUnlocked`: If `true`, all locks are permanently unlocked
- `showSingleLock`: If `true`, shows only 1 lock (for avatar selection screen)

**Lock Logic**:
```typescript
const isUnlocked = customAvatarUnlocked 
  ? true  // Permanently unlocked
  : showSingleLock 
    ? cyclesNumber >= 3  // Single lock: requires 3 cycles
    : cyclesNumber >= lockNumber  // 3 locks: each unlocks at its number
```

**Display Locations**:
- **Calendar Screen**: Shows 3 locks (one for each cycle milestone)
- **Avatar Selection Screen**: Shows 1 lock (represents overall unlock status)

### Lock States

- **Locked Icon**: `icons.locked` (gray/closed lock)
- **Unlocked Icon**: `icons.unlocked` (colored/open lock)

When `customAvatarUnlocked === true`, all locks show as unlocked regardless of `cyclesNumber`.

---

## User Flow

### Flow Diagram

```
User Enters Period Days
         ↓
Cycles Calculated (cyclesNumber updated)
         ↓
    cyclesNumber >= 3?
         ↓
    ┌────┴────┐
    NO        YES
    ↓          ↓
Show Lock    Show Friend
Messages     Unlock Modal
    ↓          ↓
Continue    User Clicks
Tracking    "Create Friend"
    ↓          ↓
         Set customAvatarUnlocked = true
                ↓
         Navigate to Custom Avatar Screen
                ↓
         User Creates Custom Avatar
                ↓
         Avatar Saved with Configuration
```

### Detailed Flow Steps

#### Step 1: User Enters Period Days

**Where**: Main Screen or Calendar Screen

**Action**: User marks days as period days

**Result**: 
- Period dates saved to `metadata.periodDates`
- `cyclesNumber` recalculated via `calculateCycles()`
- If `cyclesNumber` changed, updated via `httpClient.updateCyclesNumber()`

#### Step 2: Lock Messages (When Locked)

**Location**: `app/src/contexts/AvatarMessageContext.tsx`

**Condition**: `isLocked === true` (i.e., `cyclesNumber < 3`)

**Messages Shown** (in order):
1. `avatar_message_enter_period_days` - "Enter your period days to unlock the new Oky friend feature."
2. `avatar_message_keep_entering_period_days` - "Keep entering your period days to unlock the new Oky friend feature."

**Behavior**:
- Lock messages are shown **first** (prioritized)
- Each message displays for 5 seconds
- After both lock messages, random messages from CMS are shown
- Messages reset when lock status changes

#### Step 3: Unlock Modal (When Unlocked)

**Location**: `app/src/components/FriendUnlockModal.tsx`

**Condition**: 
```typescript
cyclesNumber >= 3 && 
(avatar === null || avatar === undefined || avatar.customAvatarUnlocked === false)
```

**When Shown**:
- When user reaches `cyclesNumber >= 3` for the first time
- When MainScreen opens and conditions are met
- When `cyclesNumber` changes and conditions are met

**Modal Content**:
- Title: "Hooray! All 3 locks are open, you can create your own Oky friend now."
- Celebration GIF: `gifs.friendUnlock`
- Button: "Create your new Oky friend!"

**Action on Button Click**:
1. Sets `customAvatarUnlocked = true` in Redux state
2. Syncs with server via `httpClient.updateAvatar()`
3. Navigates to Custom Avatar Screen (`ProfileStack > CustomAvatar`)
4. Closes modal

#### Step 4: Custom Avatar Creation

**Location**: `app/src/screens/CustomAvatarScreen/index.tsx`

**Features**:
- Body type selection (small, medium, large)
- Skin color selection
- Hair style and color selection
- Eye shape and color selection
- Clothing selection
- Device/accessory selection
- Name input

**On Save**:
- Avatar configuration saved to `avatar` JSON field
- Includes all customization options
- `customAvatarUnlocked` remains `true`

#### Step 5: Avatar Display

**After Creation**:
- Custom avatar appears in avatar selection screen
- Shows as "unlocked and customized"
- User can switch between standard avatars and custom avatar
- User can edit custom avatar anytime

---

## Implementation Details

### Key Components

#### 1. AvatarLock Component

**File**: `app/src/components/AvatarLock.tsx`

**Purpose**: Displays lock icons based on unlock status

**Usage**:
```tsx
<AvatarLock
  cyclesNumber={currentUser?.cyclesNumber || 0}
  customAvatarUnlocked={currentUser?.avatar?.customAvatarUnlocked === true}
  showSingleLock={false} // true for avatar selection, false for calendar
/>
```

#### 2. FriendUnlockModal Component

**File**: `app/src/components/FriendUnlockModal.tsx`

**Purpose**: Celebration modal shown when user unlocks custom avatar

**Props**:
- `visible`: Boolean to control visibility
- `toggleVisible`: Function to close modal
- `onCreateFriend`: Function to navigate to custom avatar screen

#### 3. AvatarMessageContext

**File**: `app/src/contexts/AvatarMessageContext.tsx`

**Purpose**: Manages avatar messages (lock messages and random messages)

**Logic**:
- Prioritizes lock messages when `isLocked === true`
- Shows lock messages first, then random messages
- Resets when lock status changes

#### 4. Cycle Calculator

**File**: `app/src/utils/cycleCalculator.ts`

**Function**: `calculateCycles(metadata: UserMetadata)`

**Returns**: `{ cyclesNumber: number }`

**Algorithm**:
- Groups consecutive period dates (allowing 2-day gaps)
- Returns number of groups as `cyclesNumber`

### Redux State

**User State** (`currentUser`):
```typescript
{
  cyclesNumber?: number,  // Number of completed cycles
  avatar?: {
    customAvatarUnlocked: boolean,
    body?: string,
    hair?: string,
    eyes?: string,
    smile?: string,
    clothing?: string,
    devices?: string | string[],
    skinColor?: string,
    hairColor?: string,
    eyeColor?: string,
    name?: string,
  }
}
```

### API Endpoints

#### Update Cycles Number

**Endpoint**: `httpClient.updateCyclesNumber()`

**Payload**:
```typescript
{
  appToken: string,
  cyclesNumber: number
}
```

**Called When**: `cyclesNumber` changes after period date updates

#### Update Avatar

**Endpoint**: `httpClient.updateAvatar()`

**Payload**:
```typescript
{
  appToken: string,
  avatar: {
    customAvatarUnlocked: true,  // Or full avatar object
    // ... other avatar fields
  }
}
```

**Called When**: 
- User unlocks avatar (sets `customAvatarUnlocked = true`)
- User saves custom avatar configuration

### Validation

**Location**: `app/src/redux/actions/appActions.ts`

**Function**: `setAvatarWithValidation()`

**Logic**:
```typescript
if (avatar === 'friend' && customAvatarUnlocked !== true && cyclesNumber < 3) {
  // Prevent setting friend avatar if not unlocked
  return null
}
```

**Purpose**: Prevents users from selecting friend avatar if not unlocked

---

## General Updates

### Database Schema Changes

1. **Added `cyclesNumber` column**:
   - Type: `integer`
   - Default: `0`
   - Purpose: Track completed menstrual cycles

2. **Added `avatar` JSON column**:
   - Type: `JSON`
   - Default: `NULL`
   - Purpose: Store custom avatar configuration and unlock status

### UI/UX Updates

1. **Lock Icons**:
   - Added locked/unlocked icons to progress section
   - Shows 3 locks on calendar screen
   - Shows 1 lock on avatar selection screen

2. **Unlock Modal**:
   - Celebration modal when user reaches 3 cycles
   - Animated GIF for celebration
   - Direct navigation to custom avatar screen

3. **Avatar Selection Screen**:
   - Shows lock status for friend avatar
   - Different states: locked, unlocked-not-customized, unlocked-customized
   - Different icons for each state

4. **Avatar Messages**:
   - Lock-specific messages when avatar is locked
   - Random messages from CMS when unlocked
   - Message prioritization system

### Code Structure Updates

1. **New Components**:
   - `AvatarLock.tsx` - Lock icon display
   - `FriendUnlockModal.tsx` - Unlock celebration modal

2. **New Contexts**:
   - `AvatarMessageContext.tsx` - Message management

3. **New Utilities**:
   - `cycleCalculator.ts` - Cycle calculation logic

4. **Updated Components**:
   - `MainScreen` - Cycle calculation and unlock modal logic
   - `CalendarScreen` - Cycle calculation
   - `AvatarScreen` - Lock status display
   - `CustomAvatarScreen` - Avatar creation and editing
   - `ProgressSection` - Lock display integration

### Translation Keys Added

**Lock Messages**:
- `avatar_message_enter_period_days`
- `avatar_message_keep_entering_period_days`

**Unlock Modal**:
- `friend_unlock_modal_title`
- `friend_unlock_modal_button`
- `friend_unlock_celebration_image`

**Avatar Selection**:
- `select_avatar_title_unlocked`
- `select_avatar_subtitle_unlocked`
- `select_avatar_reminder_unlocked_not_created`
- `select_avatar_reminder_unlocked_created`

### Analytics Events

1. **CYCLES_NUMBER_UPDATE**:
   - **Location**: `app/src/screens/MainScreen/index.tsx`
   - **Fired when**: `cyclesNumber` changes after period date updates
   - **Includes**: 
     - `userId`: Current user ID
     - `previousCyclesNumber`: Previous cycle count
     - `newCyclesNumber`: New cycle count

2. **CUSTOM_AVATAR_UNLOCK**:
   - **Location**: `app/src/screens/CustomAvatarScreen/index.tsx`
   - **Fired when**: User first visits the custom avatar screen (first time unlock)
   - **Includes**: 
     - `userId`: Current user ID
   - **Note**: Only fires once per user (tracked via AsyncStorage `customizer_has_visited`)

3. **CUSTOM_AVATAR_UPDATED**:
   - **Location**: `app/src/screens/CustomAvatarScreen/index.tsx`
   - **Fired when**: User saves/updates their custom avatar configuration
   - **Includes**: 
     - `userId`: Current user ID
     - `hasBody`: Boolean indicating if body type is set
     - `hasHair`: Boolean indicating if hair style is set
     - `hasEyes`: Boolean indicating if eye shape is set
     - `hasSkinColor`: Boolean indicating if skin color is set
     - `hasHairColor`: Boolean indicating if hair color is set
     - `hasEyeColor`: Boolean indicating if eye color is set
     - `hasClothing`: Boolean indicating if clothing is set
     - `hasDevices`: Boolean indicating if devices are set
     - `hasName`: Boolean indicating if name is set

### Asset Updates

1. **Icons**:
   - `icons.locked` - Locked lock icon
   - `icons.unlocked` - Unlocked lock icon

2. **GIFs**:
   - `gifs.friendUnlock` - Celebration animation

3. **Avatar SVGs**:
   - `friend-locked` - Friend avatar locked state
   - `friend-unlocked-not-customized` - Unlocked but not customized
   - `friend-unlocked-and-customized` - Unlocked and customized

---

## Testing Checklist

### Migration Testing

- [ ] Run `add-cycles-counter.sql` first
- [ ] Verify `cyclesNumber` column exists with default `0`
- [ ] Run `custom-avatar-update.sql` second
- [ ] Verify `avatar` column exists
- [ ] Verify existing users have `customAvatarUnlocked = false`

### Unlock Flow Testing

- [ ] Enter period days and verify `cyclesNumber` updates
- [ ] Verify lock messages show when `cyclesNumber < 3`
- [ ] Verify unlock modal shows when `cyclesNumber >= 3`
- [ ] Verify locks unlock progressively (1, 2, 3)
- [ ] Verify custom avatar can be created after unlock
- [ ] Verify `customAvatarUnlocked = true` persists

### Edge Cases

- [ ] User with `cyclesNumber = 0` cannot access friend avatar
- [ ] User with `cyclesNumber = 2` sees 2 unlocked locks
- [ ] User with `customAvatarUnlocked = true` sees all locks unlocked
- [ ] Unlock modal doesn't show if already unlocked
- [ ] Cycle calculation handles various date formats
- [ ] Cycle calculation handles gaps correctly (up to 2 days)

---

## Troubleshooting

### Common Issues

1. **Locks not unlocking**:
   - Check `cyclesNumber` is being updated correctly
   - Verify `calculateCycles()` is grouping dates correctly
   - Check Redux state is syncing with server

2. **Unlock modal not showing**:
   - Verify `cyclesNumber >= 3`
   - Check `customAvatarUnlocked !== true`
   - Verify modal conditions in `MainScreen`

3. **Lock messages not showing**:
   - Check `isLocked` calculation in `AvatarMessageContext`
   - Verify translation keys exist
   - Check message prioritization logic

4. **Cycles not calculating**:
   - Verify `userVerified === true` for period dates
   - Check date format parsing
   - Verify `calculateCycles()` is being called

---

## Summary

The custom avatar system provides a gamified unlock mechanism that encourages users to track their periods regularly. Users must complete 3 menstrual cycles (by entering period days) to unlock the ability to create a custom avatar. The system uses visual locks to show progress and provides clear messaging to guide users through the unlock process.

**Key Takeaways**:
- Migrations must run in order: cycles counter first, then avatar update
- Unlock requires `cyclesNumber >= 3` AND `customAvatarUnlocked === true`
- Three locks represent progress toward unlock
- Lock messages guide users when locked
- Unlock modal celebrates achievement and guides to creation
- Once unlocked, avatar is permanently available

