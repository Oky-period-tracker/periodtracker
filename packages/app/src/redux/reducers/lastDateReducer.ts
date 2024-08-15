import { Actions } from "../types";

const initialState = {
  lastClickedCardDate: null,
  lastClickedEmojiDate: null,
};

export const lastClickedDateReducer = (
  state = initialState,
  action: Actions
) => {
  switch (action.type) {
    case "UPDATE_LAST_CLICKED_CARD_DATE":
      return {
        ...state,
        lastClickedCardDate: action.payload,
      };

    case "UPDATE_LAST_CLICKED_EMOJI_DATE":
      return {
        ...state,
        lastClickedEmojiDate: action.payload,
      };

    default:
      return state;
  }
};
