import { UPDATE_LAST_CLICKED_CARD_DATE, UPDATE_LAST_CLICKED_EMOJI_DATE } from '../actions';

const initialState = {
  lastClickedCardDate: null,
  lastClickedEmojiDate: null,
};

// eslint-disable-next-line
const lastClickedDateReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_LAST_CLICKED_CARD_DATE:
      return {
        ...state,
        lastClickedCardDate: action.payload,
      };
    case UPDATE_LAST_CLICKED_EMOJI_DATE:
      return {
        ...state,
        lastClickedEmojiDate: action.payload,
      };
    default:
      return state;
  }
};

export default lastClickedDateReducer;
