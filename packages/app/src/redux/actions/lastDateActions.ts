import { createAction } from '../helpers';


export const UPDATE_LAST_CLICKED_CARD_DATE = 'UPDATE_LAST_CLICKED_CARD_DATE';
export const UPDATE_LAST_CLICKED_EMOJI_DATE = 'UPDATE_LAST_CLICKED_EMOJI_DATE';

//eslint-disable-next-line
export const updateLastClickedCardDate = (date: any) =>
  createAction(UPDATE_LAST_CLICKED_CARD_DATE, date);

//eslint-disable-next-line
export const updateLastClickedEmojiDate = (date: any) =>
  createAction(UPDATE_LAST_CLICKED_EMOJI_DATE, date);
