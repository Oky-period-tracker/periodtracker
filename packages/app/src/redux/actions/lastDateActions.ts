import { createAction } from "../helpers";

export const updateLastClickedCardDate = (
  date: string // YYYY-MM-DD
) => {
  return createAction("UPDATE_LAST_CLICKED_CARD_DATE", date);
};

export const updateLastClickedEmojiDate = (
  date: string // YYYY-MM-DD
) => {
  return createAction("UPDATE_LAST_CLICKED_EMOJI_DATE", date);
};
