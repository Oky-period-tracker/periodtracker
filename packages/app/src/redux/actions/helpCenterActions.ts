import { HelpCenterItem } from "../../types";
import { createAction } from "../helpers";
import { ActionsUnion } from "../types/types";

export function saveHelpCenter(helpCenter: HelpCenterItem) {
  return createAction("SAVE_HELP_CENTER", helpCenter);
}

export function saveHelpCenterSuccess(helpCenter: HelpCenterItem) {
  return createAction("SAVE_HELP_CENTER_OK", helpCenter);
}

// TODO:
// eslint-disable-next-line
export function saveHelpCenterError(response: any) {
  return createAction("SAVE_HELP_CENTER_ERROR", JSON.stringify(response));
}

export function unsaveHelpCenter(helpCenters: HelpCenterItem[]) {
  return createAction("UNSAVE_HELP_CENTER", helpCenters);
}

const helpCenterActions = {
  saveHelpCenter,
  saveHelpCenterSuccess,
  saveHelpCenterError,
  unsaveHelpCenter,
};

export type HelpCenterActions = ActionsUnion<typeof helpCenterActions>;
