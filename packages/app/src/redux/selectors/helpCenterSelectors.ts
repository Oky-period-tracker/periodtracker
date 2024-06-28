import { ReduxState } from "../reducers";

const s = (state: ReduxState) => state.helpCenters;

export const savedHelpCentersSelector = (state: ReduxState) =>
  s(state).savedHelpCenters;
